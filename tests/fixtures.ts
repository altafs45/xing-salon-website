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
