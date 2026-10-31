import { describe, expect, it } from 'vitest';
import { fieldErrors, isHoneypotHit, isTooFast, leadSchema, MIN_FILL_MS, normalisePhone, toE164 } from '../src/shared/leadSchema';
import { giftLead, membershipLead } from './fixtures';

describe('leadSchema', () => {
  it('accepts a valid gift lead and normalises the phone', () => {
    const result = leadSchema.safeParse(giftLead());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBe('9876543210');
  });

  it('accepts a valid membership lead with one family member on Gold', () => {
    expect(leadSchema.safeParse(membershipLead()).success).toBe(true);
  });

  it('accepts a corporate lead of 10+ cards and rejects fewer', () => {
    const corporate = (cards: number) =>
      giftLead({ type: 'corporate', product: 'diwali-corporate', gift: undefined, corporate: { company: 'Acme Pvt Ltd', cards, logo: true } });
    expect(leadSchema.safeParse(corporate(25)).success).toBe(true);
    const few = leadSchema.safeParse(corporate(5));
    expect(few.success).toBe(false);
    if (!few.success) expect(fieldErrors(few.error)['corporate.cards']).toMatch(/10 cards/);
  });

  it.each(['12345', '5876543210', '98765432101', 'abcdefghij', ''])('rejects the invalid phone %j', (phone) => {
    const result = leadSchema.safeParse(giftLead({ phone }));
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).phone).toBeDefined();
  });

  it('rejects a lead without consent', () => {
    expect(leadSchema.safeParse(giftLead({ consent: false })).success).toBe(false);
  });

  it('rejects a message over 200 characters and a past delivery date', () => {
    const long = leadSchema.safeParse(giftLead({ gift: { ...giftLead().gift, message: 'x'.repeat(201) } }));
    expect(long.success).toBe(false);
    const past = leadSchema.safeParse(giftLead({ gift: { ...giftLead().gift, deliveryDate: '2020-01-01' } }));
    expect(past.success).toBe(false);
  });

  it('limits family sharing to the tier: none on Glow, two on Privé', () => {
    expect(leadSchema.safeParse(membershipLead({ product: 'glow' })).success).toBe(false);
    const prive = membershipLead({ product: 'prive', membership: { users: 'family', familyNames: ['A Verma', 'B Verma'], services: [] } });
    expect(leadSchema.safeParse(prive).success).toBe(true);
    const gold = membershipLead({ membership: { users: 'family', familyNames: ['A Verma', 'B Verma'], services: [] } });
    expect(leadSchema.safeParse(gold).success).toBe(false);
  });

  it('rejects a tier key on a gift lead', () => {
    expect(leadSchema.safeParse(giftLead({ product: 'gold' })).success).toBe(false);
  });
});

describe('spam checks', () => {
  it('flags a filled honeypot only', () => {
    expect(isHoneypotHit({ company_website: 'http://spam.example' })).toBe(true);
    expect(isHoneypotHit({ company_website: '  ' })).toBe(false);
    expect(isHoneypotHit({})).toBe(false);
  });

  it('flags a form sent in under 3 seconds', () => {
    const now = 1_000_000;
    expect(isTooFast(now - 1000, now)).toBe(true);
    expect(isTooFast(now - MIN_FILL_MS + 1, now)).toBe(true);
    expect(isTooFast(now - MIN_FILL_MS, now)).toBe(false);
  });
});

describe('phones', () => {
  it('normalises Indian numbers to 10 digits and to +91', () => {
    expect(normalisePhone('+91 98765-43210')).toBe('9876543210');
    expect(normalisePhone('09876543210')).toBe('9876543210');
    expect(toE164('919876543210')).toBe('+919876543210');
  });
});

describe('cleanText', () => {
  it('strips tags but keeps hearts, ampersands and line breaks', async () => {
    const { cleanText } = await import('../server/sanitize');
    expect(cleanText('  <b>Happy</b> birthday <script>alert(1)</script>!\nLove you <3 & more  ')).toBe('Happy birthday alert(1)!\nLove you <3 & more');
  });
});
