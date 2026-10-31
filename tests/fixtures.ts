import { todayIST } from '../src/shared/leadSchema';

/** Opened 10 seconds ago: comfortably past the too-fast check. */
export const startedAt = (now = Date.now()) => now - 10_000;

export const giftLead = (overrides: Record<string, unknown> = {}) => ({
  type: 'gift',
  product: 'birthday',
  name: 'Priya Sharma',
  phone: '98765 43210',
  email: 'priya@example.com',
  salon: 'hsr',
  payment: 'salon',
  consent: true,
  company_website: '',
  formStartedAt: startedAt(),
  meta: { utm: { utm_source: 'instagram' }, pageUrl: 'https://www.xingsalons.com/membership-gift-cards', device: 'mobile' },
  gift: {
    recipientName: 'Ananya',
    occasion: 'birthday',
    message: 'Happy birthday! Go treat yourself — you deserve it.',
    deliveryDate: todayIST(),
    deliveryMethod: 'whatsapp',
  },
  ...overrides,
});

export const membershipLead = (overrides: Record<string, unknown> = {}) => ({
  type: 'membership',
  product: 'gold',
  name: 'Rahul Verma',
  phone: '+91 9123456780',
  salon: 'brookfield',
  payment: 'call',
  consent: true,
  formStartedAt: startedAt(),
  membership: { users: 'family', familyNames: ['Meera Verma'], services: ['Hair', 'Skin'] },
  ...overrides,
});

// Copied from each Google Business Profile on 2026-10-31. Update this and src/data/branches.ts together.
export const GBP = {
  'sarjapur-road': {
    gbpName: 'Xing Premium Unisex Salon, Sarjapura Road',
    addressLine: '1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli, Bengaluru, Karnataka 560035',
    phone: '+91 89700 07440',
    tel: 'tel:+918970007440',
    whatsapp: 'https://wa.me/918970007440',
    opens: '10:00',
    closes: '21:30',
    lat: 12.9133092,
    lng: 77.6789381,
    plusCode: 'WM7H+8H',
    mapsUrl: 'https://www.google.com/maps?cid=2447554241101026298',
  },
  'hsr-layout': {
    gbpName: 'Xing Premium Unisex Salon - HSR Layout',
    addressLine: '1st Floor, 150/3, GSR Arcade, 9th Cross, 24th Main Rd, Bengaluru, Karnataka 560102',
    phone: '+91 93808 12348',
    tel: 'tel:+919380812348',
    whatsapp: 'https://wa.me/919380812348',
    opens: '10:00',
    closes: '22:00',
    lat: 12.9186529,
    lng: 77.6492076,
    plusCode: 'WJ9X+FM',
    mapsUrl: 'https://www.google.com/maps?cid=17729263556490350929',
  },
  brookfield: {
    gbpName: 'Xing Premium Unisex Salon - Brookfield, Whitefield',
    // The profile says "Brookefield": a typo the owner is correcting, so the site writes "Brookfield".
    addressLine: '1st floor, Number 267, SV Plaza 60 Feet Road AECS Layout, Whitefield, Brookfield, Bengaluru, Karnataka 560037',
    phone: '+91 79966 66012',
    tel: 'tel:+917996666012',
    whatsapp: 'https://wa.me/918147111344',
    opens: '09:00',
    closes: '21:30',
    lat: 12.9636011,
    lng: 77.7093299,
    plusCode: 'XP75+CP',
    mapsUrl: 'https://www.google.com/maps?cid=3366119781327561907',
  },
};
