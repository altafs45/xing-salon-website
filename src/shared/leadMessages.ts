// Text built from a lead: its ID, product name, and the WhatsApp message the client sends to the salon.
// Shared by the server (ClickToChatProvider, emails) and the form's offline fallback, so both send the same text.
import { DELIVERY_METHODS, occasionBySlug, salonByKey, tierByKey } from '../data/giftMembership';
import { normalisePhone, type Lead } from './leadSchema';

/** "+91 98765 43210", from any of the forms normalisePhone accepts. */
export function displayPhone(phone: string) {
  const digits = normalisePhone(phone);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

const ID_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** "XG-261024-7K3Q": the date in IST, then four characters that are hard to misread. */
export function makeLeadId(now = new Date(), random: () => number = Math.random) {
  const ist = new Date(now.getTime() + 5.5 * 3600_000).toISOString();
  const date = `${ist.slice(2, 4)}${ist.slice(5, 7)}${ist.slice(8, 10)}`;
  const tail = Array.from({ length: 4 }, () => ID_ALPHABET[Math.floor(random() * ID_ALPHABET.length)]).join('');
  return `XG-${date}-${tail}`;
}

export const LEAD_ID_PATTERN = /^XG-\d{6}-[2-9A-HJ-NP-Z]{4}$/;

/** "XING Gold Membership" or "Birthday Glow Ritual gift card". */
export function productLabel(lead: Pick<Lead, 'type' | 'product'>) {
  if (lead.type === 'membership') return `${tierByKey(lead.product)?.name ?? lead.product} Membership`;
  const occasion = occasionBySlug(lead.product)?.title ?? lead.product;
  return lead.type === 'corporate' ? `${occasion} (corporate)` : `${occasion} gift card`;
}

export const typeLabel = (type: Lead['type']) => (type === 'gift' ? 'Gift Card' : type === 'membership' ? 'Membership' : 'Corporate Gift Card');

export const deliveryLabel = (key: string) => DELIVERY_METHODS.find((method) => method.key === key)?.label ?? key;

export const paymentLabel = (key: Lead['payment']) => (key === 'online' ? 'Pay online' : key === 'salon' ? 'Pay at salon' : 'Please call me');

/** "24 Oct 2026" from "2026-10-24". */
export const longDate = (day: string) =>
  new Date(`${day}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** The prefilled WhatsApp message to the salon (template in the brief, §5). */
export function whatsappText(lead: Lead, leadId: string) {
  const salon = salonByKey(lead.salon)?.name ?? '';
  const want = lead.type === 'membership' ? 'get a Membership' : lead.type === 'corporate' ? 'order corporate Gift Cards' : 'buy a Gift Card';
  const lines = [
    `Hi XING ${salon}! 💖`,
    `I'd like to ${want}.`,
    `Request ID: ${leadId}`,
    `Plan: ${productLabel(lead)}`,
    `Name: ${lead.name}`,
    `Phone: ${displayPhone(lead.phone)}`,
  ];
  if (lead.type === 'gift') {
    const { gift } = lead;
    lines.push(`For: ${gift.recipientName} · ${occasionBySlug(gift.occasion)?.cardLabel ?? gift.occasion} · Deliver on ${longDate(gift.deliveryDate)} via ${deliveryLabel(gift.deliveryMethod)}`);
    if (gift.message) lines.push(`Message: "${gift.message}"`);
  }
  if (lead.type === 'membership') {
    const names = lead.membership.familyNames.filter(Boolean);
    lines.push(`Users: ${lead.membership.users === 'family' && names.length ? `Me + family: ${names.join(', ')}` : 'Just me'}`);
  }
  if (lead.type === 'corporate') {
    const { corporate } = lead;
    lines.push(`Company: ${corporate.company} · ${corporate.cards} cards${corporate.logo ? ' · logo on e-card' : ''}`);
  }
  lines.push(`Payment: ${paymentLabel(lead.payment)}`, 'Please confirm the details. Thank you!');
  return lines.join('\n');
}

/** wa.me link with the message; `number` is digits with country code. */
export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
