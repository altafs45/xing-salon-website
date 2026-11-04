import { describe, expect, it } from 'vitest';
import { leadSchema, type Lead } from '../src/shared/leadSchema';
import { LEAD_ID_PATTERN, makeLeadId, whatsappText, whatsappUrl } from '../src/shared/leadMessages';
import { giftLead, membershipLead } from './fixtures';

const parse = (input: object) => leadSchema.parse(input) as Lead;

describe('whatsappUrl', () => {
  it('encodes emojis, line breaks, & and # so the message arrives intact', () => {
    const text = 'Hi Xing HSR Layout! 💖\nHair & nails #1\nThanks?';
    const url = whatsappUrl('+91 93808 12348', text);
    expect(url.startsWith('https://wa.me/919380812348?text=')).toBe(true);
    const query = url.split('?text=')[1];
    // Nothing that would end or split the query is left raw.
    expect(query).not.toMatch(/[\s&#?💖]/u);
    expect(query).toContain('%0A');
    expect(query).toContain('%26');
    expect(query).toContain('%23');
    expect(query).toContain('%F0%9F%92%96');
    expect(decodeURIComponent(query)).toBe(text);
    expect(new URL(url).searchParams.get('text')).toBe(text);
  });
});

describe('whatsappText', () => {
  it('follows the template for a gift', () => {
    const text = whatsappText(parse(giftLead({ gift: { ...giftLead().gift, message: 'Love & hugs #bestie\nSee you!' } })), 'XG-261024-AB2C');
    const lines = text.split('\n');
    expect(lines[0]).toBe('Hi Xing HSR Layout! 💖');
    expect(lines[1]).toBe("I'd like to buy a Gift Card.");
    expect(text).toContain('Request ID: XG-261024-AB2C');
    expect(text).toContain('Plan: Birthday Glow Ritual gift card');
    expect(text).toContain('Phone: +91 98765 43210');
    expect(text).toMatch(/For: Ananya · Birthday · Deliver on .+ via WhatsApp e-card/);
    expect(text).toContain('Message: "Love & hugs #bestie\nSee you!"');
    expect(text).toContain('Payment: Pay at salon');
    expect(text.endsWith('Please confirm the details. Thank you!')).toBe(true);
    // The whole message survives a round trip through the link.
    expect(new URL(whatsappUrl('919380812348', text)).searchParams.get('text')).toBe(text);
  });

  it('lists family members for a membership and never mentions an amount', () => {
    const text = whatsappText(parse(membershipLead()), 'XG-261024-AB2C');
    expect(text).toContain("I'd like to get a Membership.");
    expect(text).toContain('Plan: Xing Gold Membership');
    expect(text).toContain('Users: Me + family: Meera Verma');
    expect(text).toContain('Payment: Please call me');
    expect(text).not.toMatch(/₹|INR|Rs\.?\s?\d/);
  });
});

describe('makeLeadId', () => {
  it('uses the IST date and four unambiguous characters', () => {
    // 20:00 UTC on 23 Oct is 01:30 on 24 Oct in India.
    const id = makeLeadId(new Date('2026-10-23T20:00:00Z'), () => 0);
    expect(id).toBe('XG-261024-2222');
    expect(LEAD_ID_PATTERN.test(makeLeadId())).toBe(true);
  });
});
