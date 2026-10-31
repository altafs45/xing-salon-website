import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { locations, salonById } from '../src/data/branches';
import { novemberOffersPage, pageClaimMessage } from '../src/data/novemberOffersPage';
import { offersHref } from '../src/data/navMenus';
import {
  campaignCountdown,
  campaignCta,
  campaignLines,
  campaignPill,
  campaignState,
  isCampaignOpen,
  menuPricesImage,
  novemberCampaign,
  savingLabel,
  savingPercent,
  sheetOfferById,
  streakCost,
} from '../src/data/offers';
import { claimText } from '../src/lib/offers';

const ist = (time: string) => new Date(`${time}:00+05:30`);

describe('campaign states, in salon time', () => {
  it.each([
    ['2026-10-31T23:59', 'upcoming', true],
    ['2026-11-01T00:00', 'live', true],
    ['2026-11-30T23:59', 'live', true],
    ['2026-12-01T00:00', 'ended', false],
  ])('%s is %s', (time, state, open) => {
    expect(campaignState(ist(time))).toBe(state);
    expect(isCampaignOpen(ist(time))).toBe(open);
  });

  it('words each stage honestly', () => {
    expect(campaignCountdown(ist('2026-10-31T23:59'))).toBe('Starts 1 Nov · valid till 30 Nov');
    expect(campaignCountdown(ist('2026-11-20T10:00'))).toBe('Valid till 30 Nov · 11 days left');
    expect(campaignCta(ist('2026-10-31T23:59')).label).toBe('Reserve a November slot');
    expect(campaignCta(ist('2026-10-31T23:59')).text).toContain('I’d like to book for November');
    expect(campaignCta(ist('2026-11-20T10:00')).label).toBe('Claim on WhatsApp');
    expect(campaignPill(ist('2026-11-30T10:00'))).toBe('Last day');
    expect(campaignPill(ist('2026-12-01T00:00'))).toBe('');
  });
});

describe('honest numbers', () => {
  it('never prints what the posters cannot support', () => {
    const copy = JSON.stringify([novemberCampaign, novemberOffersPage]);
    expect(copy).not.toMatch(/\b50\s?%|\b40\s?%|stunning you/i);
    expect(copy).not.toMatch(/unbelievable|crazy deal|hurry/i);
  });

  it('calculates every percentage', () => {
    for (const line of campaignLines()) expect(savingLabel(line)).toContain(`${savingPercent(line)} off`);
  });

  it('adds up streaks', () => {
    expect([6, 8, 10].map(streakCost)).toEqual([2394, 3192, 3990]);
  });

  it('keeps FAQ answers short', () => {
    expect(novemberOffersPage.faqs).toHaveLength(11);
    for (const item of novemberOffersPage.faqs) expect(item.a.split(/\s+/).length, item.q).toBeLessThanOrEqual(45);
  });

  it('gives every card exactly 3 short bullets', () => {
    for (const offer of novemberCampaign.offers) {
      expect(offer.bullets).toHaveLength(3);
      for (const bullet of offer.bullets) expect(bullet.split(/\s+/).length).toBeLessThanOrEqual(5);
    }
  });
});

describe('images', () => {
  it('shows only the accurate poster whole', () => {
    const [global, highlights, menu] = novemberCampaign.offers;
    expect(global.wholePoster).toBe(true);
    expect(global.poster.src).toContain('offer-nov-global-colour-800');
    expect(highlights.poster.src).toContain('offer-nov-highlights-photo');
    expect(menu.poster.src).toContain('offer-nov-menu-photo');
    expect(menuPricesImage.src).toContain('offer-nov-menu-prices');
  });
});

describe('claiming', () => {
  it('puts the offer, price and salon in the message', () => {
    const salon = salonById('hsr-layout')!;
    const text = claimText(sheetOfferById('nov-highlights')!, salon, 'Today');
    expect(text).toContain('*Hair Highlights*');
    expect(text).toContain('₹399 per streak');
    expect(text).toContain('HSR Layout');
  });

  it('keeps the location marker for the picker', () => {
    expect(pageClaimMessage('Hello.')).toContain('___ (location)');
  });

  it('keeps salons in order on the strip', () => {
    expect(locations.map((loc) => loc.name)).toEqual(['Sarjapur Road', 'HSR Layout', 'Brookfield']);
    expect(novemberCampaign.branches).toEqual(['sarjapur-road', 'hsr-layout', 'brookfield']);
  });
});

describe('nav', () => {
  it('sends Offers to the campaign page while it is open', () => {
    expect(['/offers', '/offers/november']).toContain(offersHref());
    expect(readFileSync('src/components/Header.tsx', 'utf8')).toContain('offersHref()');
  });
});
