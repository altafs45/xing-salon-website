// The gift card / membership lead, as one schema shared by the form (src/components/gift) and the server
// (server/). Both sides validate with it, so the rules can never drift apart.
import { z } from 'zod';
import { OCCASION_SLUGS, SALON_KEYS, SERVICE_CHOICES, TIER_KEYS, tierByKey } from '../data/giftMembership';

export const LEAD_TYPES = ['gift', 'membership', 'corporate'] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

/** A submission sooner than this after the form opened is treated as a bot. */
export const MIN_FILL_MS = 3000;
export const MESSAGE_MAX = 200;
export const CORPORATE_MIN_CARDS = 10;

/** Today in the salons' time zone, as YYYY-MM-DD. */
export const todayIST = (now = new Date()) => new Date(now.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);

/** "+91 98765 43210", "09876543210", "919876543210" → "9876543210". Anything else is returned unchanged. */
export function normalisePhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

/** "9876543210" → "+919876543210". */
export const toE164 = (phone: string) => `+91${normalisePhone(phone)}`;

const PHONE = /^[6-9]\d{9}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const phone = z.preprocess((value) => (typeof value === 'string' ? normalisePhone(value) : value), z.string().regex(PHONE, 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.'));
const optionalPhone = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() ? normalisePhone(value) : undefined),
  z.string().regex(PHONE, 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.').optional(),
);
const optionalText = (max: number) =>
  z.preprocess((value) => (typeof value === 'string' && value.trim() ? value : undefined), z.string().trim().max(max).optional());
const day = (message: string) => z.string().regex(DAY, message);

/** Not in the past (a day of slack for visitors west of India). */
const notPast = (value: string) => value >= todayIST(new Date(Date.now() - 86_400_000));

const base = {
  name: z.string().trim().min(2, 'Please enter your full name.').max(60, 'Please keep your name under 60 characters.'),
  phone,
  email: z.preprocess((value) => (typeof value === 'string' && value.trim() ? value.trim() : undefined), z.email('Enter a valid email address.').max(120).optional()),
  salon: z.enum(SALON_KEYS, 'Please choose a salon.'),
  payment: z.enum(['online', 'salon', 'call'], 'Please choose how you’d like to pay.'),
  consent: z.literal(true, 'Please tick to agree so we can contact you.'),
  /** Honeypot: hidden from people, filled by bots. */
  company_website: z.string().max(200).optional(),
  /** When the form was opened (ms since epoch). */
  formStartedAt: z.number().int().nonnegative(),
  meta: z
    .object({
      utm: z.record(z.string().max(40), z.string().max(120)).optional(),
      pageUrl: z.string().max(500).optional(),
      device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
    })
    .optional(),
};

export const giftDetails = z.object({
  recipientName: z.string().trim().min(2, 'Please enter the recipient’s name.').max(60),
  recipientPhone: optionalPhone,
  occasion: z.enum(OCCASION_SLUGS as [string, ...string[]], 'Please choose an occasion.'),
  message: optionalText(MESSAGE_MAX),
  deliveryDate: day('Please choose a delivery date.').refine(notPast, 'Please choose today or a later date.'),
  deliveryMethod: z.enum(['whatsapp', 'email', 'printed'], 'Please choose how to deliver it.'),
});

export const membershipDetails = z.object({
  users: z.enum(['me', 'family']),
  familyNames: z.array(z.string().trim().max(60)).max(2).default([]),
  services: z.array(z.enum(SERVICE_CHOICES)).max(SERVICE_CHOICES.length).default([]),
  startDate: z.preprocess((value) => (value ? value : undefined), day('Please choose a start date.').refine(notPast, 'Please choose today or a later date.').optional()),
});

export const corporateDetails = z.object({
  company: z.string().trim().min(2, 'Please enter your company name.').max(100),
  cards: z.coerce.number().int('Enter a whole number.').min(CORPORATE_MIN_CARDS, `Corporate orders start at ${CORPORATE_MIN_CARDS} cards.`).max(10000),
  logo: z.boolean(),
  gstin: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : undefined),
    z.string().regex(/^[0-9A-Z]{15}$/, 'A GSTIN has 15 letters and numbers.').optional(),
  ),
});

export const leadSchema = z
  .discriminatedUnion('type', [
    z.object({ type: z.literal('gift'), product: z.enum(OCCASION_SLUGS as [string, ...string[]]), ...base, gift: giftDetails }),
    z.object({ type: z.literal('membership'), product: z.enum(TIER_KEYS), ...base, membership: membershipDetails }),
    z.object({ type: z.literal('corporate'), product: z.enum(OCCASION_SLUGS as [string, ...string[]]), ...base, corporate: corporateDetails }),
  ])
  .superRefine((lead, ctx) => {
    if (lead.type !== 'membership' || lead.membership.users !== 'family') return;
    const seats = tierByKey(lead.product)?.familySeats ?? 0;
    const names = lead.membership.familyNames.filter(Boolean);
    if (seats === 0) ctx.addIssue({ code: 'custom', path: ['membership', 'users'], message: 'Glow is for one person. Choose Gold or Privé to share.' });
    else if (names.length === 0 || names.some((entry) => entry.length < 2))
      ctx.addIssue({ code: 'custom', path: ['membership', 'familyNames'], message: 'Please enter the family member’s name.' });
    else if (names.length > seats) ctx.addIssue({ code: 'custom', path: ['membership', 'familyNames'], message: `This tier covers ${seats} family member${seats > 1 ? 's' : ''}.` });
  });

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** True when the hidden honeypot field was filled in. */
export const isHoneypotHit = (lead: { company_website?: string }) => !!lead.company_website?.trim();

/** True when the form was sent faster than a person could fill it in. */
export const isTooFast = (formStartedAt: number, now = Date.now()) => now - formStartedAt < MIN_FILL_MS;

/** Field errors as { "gift.recipientName": "…" }, the first message per field. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
