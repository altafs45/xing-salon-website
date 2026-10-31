// Email templates: one for staff (XING + the chosen salon) and one for the client. Each has HTML and plain text.
// Only the staff email carries internal data (the tier's minimum load); the client's never does.
import { site } from '../src/data/content';
import { membershipPath, occasionBySlug, type GmSalon } from '../src/data/giftMembership';
import { deliveryLabel, longDate, paymentLabel, productLabel, typeLabel } from '../src/shared/leadMessages';
import type { LeadRecord } from './adapters/leadStore';

const BERRY = '#A8325E';
const INK = '#27151C';
const BLUSH = '#FCE4EA';
const CREAM = '#FFF9F8';

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Row = [label: string, value: string, html?: string];

/** "24 Oct 2026, 3:05 pm IST". */
const istTime = (iso: string) =>
  `${new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })} IST`;

function table(rows: Row[]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">${rows
    .map(
      ([label, value, html]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid ${BLUSH};color:#6B5B5E;font-weight:500;width:38%;vertical-align:top">${esc(label)}</th><td style="padding:8px 12px;border-bottom:1px solid ${BLUSH};color:${INK}">${html ?? esc(value).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')}</table>`;
}

function layout(title: string, body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:${CREAM};font-family:Arial,Helvetica,sans-serif;color:${INK}"><div style="max-width:600px;margin:0 auto;padding:24px 16px"><div style="background:${BERRY};color:${CREAM};padding:18px 20px;border-radius:14px 14px 0 0"><div style="font-size:13px;letter-spacing:.2em">XING PREMIUM UNISEX SALON</div><div style="font-size:20px;margin-top:6px">${esc(title)}</div></div><div style="background:#fff;padding:8px 8px 16px;border-radius:0 0 14px 14px">${body}</div><p style="font-size:13px;color:#6B5B5E;text-align:center;margin-top:16px">${footer}</p></div></body></html>`;
}

const text = (title: string, rows: Row[], footer: string) => [title, '', ...rows.map(([label, value]) => `${label}: ${value}`), '', footer].join('\n');

function detailRows(lead: LeadRecord['lead']): Row[] {
  if (lead.type === 'gift') {
    const { gift } = lead;
    return [
      ['Recipient', gift.recipientName],
      ...(gift.recipientPhone ? [['Recipient phone', gift.recipientPhone] as Row] : []),
      ['Occasion', occasionBySlug(gift.occasion)?.cardLabel ?? gift.occasion],
      ['Message', gift.message || '—'],
      ['Delivery', `${longDate(gift.deliveryDate)} · ${deliveryLabel(gift.deliveryMethod)}`],
    ];
  }
  if (lead.type === 'membership') {
    const { membership } = lead;
    const names = membership.familyNames.filter(Boolean);
    return [
      ['Who will use it', membership.users === 'family' && names.length ? `Me + family: ${names.join(', ')}` : 'Just me'],
      ['Preferred services', membership.services.join(', ') || '—'],
      ['Preferred start', membership.startDate ? longDate(membership.startDate) : '—'],
    ];
  }
  const { corporate } = lead;
  return [
    ['Company', corporate.company],
    ['Number of cards', String(corporate.cards)],
    ['Logo on e-card', corporate.logo ? 'Yes' : 'No'],
    ['GSTIN', corporate.gstin ?? '—'],
  ];
}

export function staffEmail(record: LeadRecord, salon: GmSalon, minLoadINR: number | null) {
  const { lead, leadId } = record;
  const product = productLabel(lead);
  const subject = `New ${typeLabel(lead.type)} Request · ${product} · ${salon.name} · ${leadId}`;
  const digits = lead.phone.replace(/\D/g, '');
  const utm = Object.entries(lead.meta?.utm ?? {}).map(([key, value]) => `${key}=${value}`).join(', ');
  const rows: Row[] = [
    ['Lead ID', leadId],
    ['Received', istTime(record.createdAt)],
    ['Type', typeLabel(lead.type)],
    ['Product', product],
    ...(lead.type === 'membership'
      ? [['Tier minimum load (internal)', minLoadINR == null ? 'To be confirmed (set in giftMembership.ts)' : `₹${minLoadINR.toLocaleString('en-IN')}`] as Row]
      : []),
    ['Name', lead.name],
    [
      'Phone',
      lead.phone,
      `${esc(lead.phone)} · <a href="tel:${esc(lead.phone)}" style="color:${BERRY}">Call</a> · <a href="https://wa.me/${digits}" style="color:${BERRY}">WhatsApp</a>`,
    ],
    ['Email', lead.email ?? '—'],
    ['Salon', salon.fullName],
    ['Payment', paymentLabel(lead.payment)],
    ...detailRows(lead),
    ['Source', utm || 'Direct / unknown'],
    ['Page', lead.meta?.pageUrl ?? '—'],
    ['Device', lead.meta?.device ?? '—'],
  ];
  const footer = 'Reply to the client on WhatsApp within 30 minutes.';
  return { subject, html: layout(subject, table(rows), esc(footer)), text: text(subject, rows, footer) };
}

export function customerEmail(record: LeadRecord, salon: GmSalon) {
  const { lead, leadId } = record;
  const kind = lead.type === 'membership' ? 'Membership' : 'Gift Card';
  const subject = `Your XING ${kind} request is received 💖`;
  const first = lead.name.split(/\s+/)[0];
  const termsUrl = `${site.url}${membershipPath}#terms`;
  const rows: Row[] = [['Request ID', leadId], ['Plan', productLabel(lead)], ['Salon', salon.fullName], ...detailRows(lead).filter(([label]) => label !== 'GSTIN')];
  const intro = `Thank you, ${first}! Our ${salon.name} team will confirm on WhatsApp shortly.`;
  const visit: Row[] = [
    ['Address', salon.address, `${esc(salon.address)}<br><a href="${esc(salon.mapsUrl)}" style="color:${BERRY}">Open in Google Maps</a>`],
    ['Phone', salon.phone, `<a href="${salon.tel}" style="color:${BERRY}">${esc(salon.phone)}</a>`],
  ];
  const html = layout(
    subject,
    `<p style="padding:8px 12px;font-size:16px;line-height:1.5">${esc(intro)}</p>${table(rows)}<p style="padding:16px 12px 4px;font-weight:bold">XING ${esc(salon.name)}</p>${table(visit)}`,
    `<a href="${termsUrl}" style="color:${BERRY}">Gift card &amp; membership terms</a>`,
  );
  return { subject, html, text: text(`${subject}\n\n${intro}`, [...rows, ...visit], `Terms: ${termsUrl}`) };
}
