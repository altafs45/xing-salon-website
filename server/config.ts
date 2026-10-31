// Builds the lead pipeline's providers from environment variables (see .env.example).
import { resolve } from 'node:path';
import type { GmSalon } from '../src/data/giftMembership';
import { JsonFileStore } from './adapters/leadStore';
import { ConsoleMailProvider, SmtpMailProvider } from './adapters/mail';
import { NotConfiguredProvider, RazorpayProvider } from './adapters/payment';
import { ClickToChatProvider, WhatsAppCloudApiProvider } from './adapters/whatsapp';
import type { LeadDeps } from './handler';
import { log } from './log';
import { RateLimiter } from './rateLimit';

const RATE_LIMIT_MAX = 5;

const flag = (value: string | undefined) => value?.trim().toLowerCase() === 'true';

export function depsFromEnv(env: NodeJS.ProcessEnv = process.env): LeadDeps {
  const windowMs = (Number(env.RATE_LIMIT_WINDOW_MIN) || 10) * 60_000;

  const mail = env.SMTP_HOST
    ? new SmtpMailProvider({ host: env.SMTP_HOST, port: Number(env.SMTP_PORT) || 587, user: env.SMTP_USER, pass: env.SMTP_PASS, from: env.MAIL_FROM || env.SMTP_USER || '' })
    : new ConsoleMailProvider();
  if (!env.SMTP_HOST) log('warn', 'smtp_not_configured', { note: 'Leads are saved but no email is sent until SMTP_HOST is set.' });

  const whatsapp =
    flag(env.WHATSAPP_API_ENABLED) && env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID
      ? new WhatsAppCloudApiProvider({
          token: env.WHATSAPP_TOKEN,
          phoneId: env.WHATSAPP_PHONE_ID,
          salonTemplate: env.WHATSAPP_TEMPLATE_SALON || 'xing_new_lead',
          customerTemplate: env.WHATSAPP_TEMPLATE_CUSTOMER || 'xing_lead_received',
        })
      : new ClickToChatProvider();

  const payments =
    flag(env.PAYMENTS_ENABLED) && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET ? new RazorpayProvider(env.RAZORPAY_KEY_ID, env.RAZORPAY_KEY_SECRET) : new NotConfiguredProvider();

  return {
    store: new JsonFileStore(resolve(env.LEADS_FILE || 'data/leads.json')),
    mail,
    whatsapp,
    payments,
    ipLimiter: new RateLimiter(RATE_LIMIT_MAX, windowMs),
    phoneLimiter: new RateLimiter(RATE_LIMIT_MAX, windowMs),
    xingEmail: env.XING_EMAIL ?? '',
    route: (salon: GmSalon) => ({
      email: env[salon.emailEnv] || salon.defaultEmail,
      whatsapp: (env[salon.waEnv] || salon.defaultWa).replace(/\D/g, ''),
    }),
  };
}
