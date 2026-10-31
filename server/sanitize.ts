import { toE164, type Lead } from '../src/shared/leadSchema';

/**
 * Removes HTML tags and control characters, and trims. A lone "<" ("love you <3") stays: emails escape it. Line
 * breaks are kept, as gift messages may have them.
 */
export const cleanText = (value: string) =>
  value
    .replace(/<\/?[a-z!][^>]*>/gi, '')
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();

function cleanDeep<T>(value: T): T {
  if (typeof value === 'string') return cleanText(value) as T;
  if (Array.isArray(value)) return value.map(cleanDeep) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cleanDeep(entry)])) as T;
  return value;
}

/** The lead as stored and emailed: text cleaned, phones as "+91XXXXXXXXXX", the honeypot dropped. */
export function sanitizeLead(lead: Lead): Lead {
  const { company_website, ...rest } = cleanDeep(lead);
  const out = { ...rest, phone: toE164(rest.phone) } as Lead;
  if (out.type === 'gift' && out.gift.recipientPhone) out.gift.recipientPhone = toE164(out.gift.recipientPhone);
  return out;
}
