// POST /api/leads/gift-membership, independent of any web framework: server/app.ts wraps it for Express, and the
// same function can back a Vercel or Netlify function later.
//
// Pipeline: honeypot (silent 200) → too fast (rejected) → rate limit per IP → validate → rate limit per phone →
// sanitise → lead ID → save → emails in parallel → { ok, leadId, whatsappUrl }.
import { internal, salonByKey, type GmSalon } from '../src/data/giftMembership';
import { makeLeadId, whatsappText } from '../src/shared/leadMessages';
import { fieldErrors, isHoneypotHit, isTooFast, leadSchema } from '../src/shared/leadSchema';
import type { LeadRecord, LeadStore } from './adapters/leadStore';
import type { MailProvider } from './adapters/mail';
import type { PaymentProvider } from './adapters/payment';
import type { WhatsAppProvider } from './adapters/whatsapp';
import { customerEmail, staffEmail } from './emails';
import { log, maskEmail, maskPhone } from './log';
import type { RateLimiter } from './rateLimit';
import { sanitizeLead } from './sanitize';

export interface LeadDeps {
  store: LeadStore;
  mail: MailProvider;
  whatsapp: WhatsAppProvider;
  payments: PaymentProvider;
  ipLimiter: RateLimiter;
  phoneLimiter: RateLimiter;
  /** Xing's central inbox. */
  xingEmail: string;
  /** A salon's inbox and WhatsApp number (digits with country code), after env overrides. */
  route: (salon: GmSalon) => { email: string; whatsapp: string };
  now?: () => Date;
}

export type LeadResponse =
  | { status: 200; body: { ok: true; leadId: string; whatsappUrl: string } }
  | { status: 400 | 422 | 429 | 500; body: { ok: false; code: string; errors?: Record<string, string> } };

const fail = (status: 400 | 422 | 429 | 500, code: string, errors?: Record<string, string>): LeadResponse => ({ status, body: { ok: false, code, ...(errors && { errors }) } });

export async function handleLead(body: unknown, ip: string, deps: LeadDeps): Promise<LeadResponse> {
  const now = deps.now?.() ?? new Date();
  if (!body || typeof body !== 'object') return fail(400, 'bad_request');
  const raw = body as Record<string, unknown>;

  // Bots get a normal-looking success and nothing is sent.
  if (typeof raw.company_website === 'string' && isHoneypotHit({ company_website: raw.company_website })) {
    log('info', 'lead_honeypot', { ip });
    return { status: 200, body: { ok: true, leadId: makeLeadId(now), whatsappUrl: '' } };
  }
  if (typeof raw.formStartedAt !== 'number' || isTooFast(raw.formStartedAt, now.getTime())) {
    log('info', 'lead_too_fast', { ip });
    return fail(422, 'too_fast');
  }
  if (!deps.ipLimiter.hit(`ip:${ip}`, now.getTime())) {
    log('warn', 'lead_rate_limited', { ip, by: 'ip' });
    return fail(429, 'rate_limited');
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return fail(400, 'invalid', fieldErrors(parsed.error));
  const input = parsed.data;

  if (!deps.phoneLimiter.hit(`phone:${input.phone}`, now.getTime())) {
    log('warn', 'lead_rate_limited', { ip, by: 'phone', phone: maskPhone(input.phone) });
    return fail(429, 'rate_limited');
  }
  if (input.payment === 'online' && !deps.payments.enabled) return fail(400, 'invalid', { payment: 'Online payment is launching soon. Please choose another option.' });

  const salon = salonByKey(input.salon)!;
  const route = deps.route(salon);
  const leadId = makeLeadId(now);
  const record: LeadRecord = { leadId, createdAt: now.toISOString(), lead: sanitizeLead(input) };
  const { lead } = record;
  const text = whatsappText(lead as typeof input, leadId);
  const whatsappUrl = deps.whatsapp.clickToChatUrl(route.whatsapp, text);
  log('info', 'lead_received', { leadId, type: lead.type, product: lead.product, salon: salon.key, phone: maskPhone(lead.phone), ...(lead.email && { email: maskEmail(lead.email) }) });

  let saved = true;
  try {
    await deps.store.save(record);
  } catch (error) {
    saved = false;
    log('error', 'lead_store_failed', { leadId, error: (error as Error).message });
  }

  const minLoad = lead.type === 'membership' ? internal.tierMinLoadINR[lead.product as keyof typeof internal.tierMinLoadINR] : null;
  const staff = staffEmail(record, salon, minLoad);
  const staffTo = [...new Set([deps.xingEmail, route.email].filter(Boolean))];
  const sends = [
    ...staffTo.map((to) => deps.mail.send({ to, ...staff, ...(lead.email && { replyTo: lead.email }) })),
    ...(lead.email ? [deps.mail.send({ to: lead.email, ...customerEmail(record, salon), replyTo: route.email || deps.xingEmail })] : []),
    deps.whatsapp.notify({ leadId, salonNumber: route.whatsapp, customerPhone: lead.phone, text }),
  ];
  const results = await Promise.allSettled(sends);
  const staffDelivered = results.slice(0, staffTo.length).some((result) => result.status === 'fulfilled');
  results.forEach((result, i) => {
    if (result.status === 'rejected') log('error', 'lead_send_failed', { leadId, step: i < staffTo.length ? 'staff_email' : i === results.length - 1 ? 'whatsapp' : 'customer_email', error: String(result.reason?.message ?? result.reason) });
  });

  // Nowhere to find the lead later: tell the client, whose screen then offers the WhatsApp send instead.
  if (!saved && !staffDelivered) return fail(500, 'not_delivered');
  log('info', 'lead_done', { leadId, saved, staffDelivered });
  return { status: 200, body: { ok: true, leadId, whatsappUrl } };
}
