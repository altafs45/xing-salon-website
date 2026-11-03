import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { locations, salonById } from '../src/data/branches';
import { booking } from '../src/data/content';
import { offerCatalog, offersIn } from '../src/data/offerCatalog';
import { offerCategoryPages, offersHubPage, pageClaimMessage } from '../src/data/offerPages';
import {
  campaignCountdown,
  campaignCta,
  campaignLines,
  campaignPill,
  campaignState,
  daysLeft,
  heroPoster,
  isCampaignLive,
  isCampaignOpen,
  maxSavingRupees,
  novemberCampaign,
  savingLabel,
  savingPercent,
  sheetOfferById,
  streakCost,
  streakRange,
  withCampaignFaq,
} from '../src/data/offers';
import { offerCategoryMetas, offersMeta } from '../src/data/seo';
import { claimText } from '../src/lib/offers';

const ist = (time: string) => new Date(`${time}:00+05:30`);
const words = (text: string) => text.split(/\s+/).length;

describe('campaign states, in salon time', () => {
  it.each([
    ['2026-10-31T23:59', 'upcoming', true, false],
    ['2026-11-01T00:00', 'live', true, true],
    ['2026-11-30T23:59', 'live', true, true],
    ['2026-12-01T00:00', 'ended', false, false],
  ])('%s is %s', (time, state, open, live) => {
    expect(campaignState(ist(time))).toBe(state);
    expect(isCampaignOpen(ist(time))).toBe(open);
    expect(isCampaignLive(ist(time))).toBe(live);
  });

  it('counts the days left, including today', () => {
    expect(daysLeft(ist('2026-11-01T00:00'))).toBe(30);
    expect(daysLeft(ist('2026-11-30T23:59'))).toBe(1);
    expect(daysLeft(ist('2026-12-01T00:00'))).toBe(0);
  });

  it('words each stage honestly', () => {
    expect(campaignCountdown(ist('2026-10-31T23:59'))).toBe('Starts 1 Nov · valid till 30 Nov');
    expect(campaignCountdown(ist('2026-11-20T10:00'))).toBe('Valid till 30 Nov · 11 days left');
    expect(campaignCountdown(ist('2026-11-30T10:00'))).toBe('Last day · valid till 30 Nov');
    expect(campaignCountdown(ist('2026-12-01T00:00'))).toBe('');
    expect(campaignCta(ist('2026-10-31T23:59')).label).toBe('Reserve a November Slot');
    expect(campaignCta(ist('2026-11-20T10:00')).label).toBe('Claim on WhatsApp');
    expect(campaignPill(ist('2026-11-30T10:00'))).toBe('Last day');
    expect(campaignPill(ist('2026-12-01T00:00'))).toBe('');
  });

  it('drops the November sentence from salon FAQs once ended', () => {
    const faqs = [{ q: 'Which offers?', a: 'Tuesdays.', campaign: true }];
    expect(withCampaignFaq(faqs, ist('2026-11-20T10:00'))[0].a).toContain('₹3,999');
    expect(withCampaignFaq(faqs, ist('2026-12-01T00:00'))[0].a).toBe('Tuesdays.');
  });

  it('is the catalogue’s hair colour offers, at every salon', () => {
    expect(novemberCampaign.path).toBe('/offers/hair-colour');
    expect(novemberCampaign.offers).toEqual(offersIn('hair-colour'));
    expect(novemberCampaign.branches).toEqual(['sarjapur-road', 'hsr-layout', 'brookfield']);
  });
});

describe('honest numbers', () => {
  const texts = JSON.stringify([offerCatalog, offerCategoryPages, offersHubPage, offersMeta, offerCategoryMetas]);

  it('never prints what the posters cannot support', () => {
    expect(texts).not.toMatch(/\b50\s?%|-?\b40\s?%|stunning you/i);
    expect(texts).not.toMatch(/unbelievable|crazy deal|hurry/i);
  });

  it('works out every saving from the prices', () => {
    expect(maxSavingRupees()).toBe(2500);
    for (const line of campaignLines()) expect(savingLabel(line)).toContain(`${savingPercent(line)} off`);
    expect(campaignLines().map((line) => savingPercent(line))).toEqual(['33%', '20%', '31%', '37%']);
  });

  it('adds up streaks', () => {
    expect([6, 8, 10].map(streakCost)).toEqual([2394, 3192, 3990]);
    expect(streakRange()).toBe('₹3,192–₹3,990');
  });

  it('keeps FAQ answers short, and the schema’s FAQ the same as the page’s', () => {
    const pages = [{ faqs: offersHubPage.faqs, meta: offersMeta }, ...offerCategoryMetas.map((meta, i) => ({ faqs: Object.values(offerCategoryPages)[i].faqs, meta }))];
    for (const { faqs, meta } of pages) {
      const schema = JSON.stringify(meta.jsonLd);
      expect(schema).not.toContain('AggregateRating');
      for (const item of faqs) {
        expect(words(item.a), item.q).toBeLessThanOrEqual(45);
        if (!('campaign' in item) || isCampaignOpen()) expect(schema).toContain(JSON.stringify(item.a));
      }
    }
  });

  it('gives every card at most 3 short bullets', () => {
    for (const offer of offerCatalog) {
      expect(offer.includes.length, offer.id).toBeLessThanOrEqual(3);
      for (const bullet of offer.includes) expect(words(bullet), bullet).toBeLessThanOrEqual(5);
    }
  });
});

describe('claiming', () => {
  it('puts the offer, price and salon in the message, and survives encoding', () => {
    const salon = salonById('hsr-layout')!;
    const text = claimText(sheetOfferById('highlights')!, salon, 'Today');
    expect(text).toContain('*Hair Highlights*');
    expect(text).toContain('₹399 per streak');
    expect(text).toContain('HSR Layout');
    const url = `${salon.whatsappHref}?text=${encodeURIComponent(text)}`;
    expect(new URL(url).searchParams.get('text')).toBe(text);
  });

  it('still opens old anchors (#nov-global-colour)', () => {
    expect(sheetOfferById('nov-global-colour')!.title).toBe('Global Hair Colour');
    expect(sheetOfferById('nov-highlights')!.title).toBe('Hair Highlights');
  });

  it('keeps the location marker for the picker', () => {
    expect(pageClaimMessage('Hello.')).toContain('___ (location)');
  });
});

describe('links and images', () => {
  it('points at real posts, booking services and images', () => {
    for (const offer of offerCatalog) {
      expect(booking.services, offer.id).toContain(offer.bookingService);
      for (const slug of offer.relatedBlog) expect(readFileSync(join('content/blog', `${slug}.md`), 'utf8').length).toBeGreaterThan(0);
      for (const entry of [offer.image.srcSet, offer.image.avifSrcSet]) {
        for (const file of entry!.split(', ').map((part) => part.split(' ')[0])) expect(existsSync(join('public', file)), file).toBe(true);
      }
    }
  });

  it('uses photos on the cards (no text on them), and only the accurate poster', () => {
    for (const offer of offerCatalog) expect(offer.image.src, offer.id).toMatch(/^\/images\/offer-(hair-colour|hair-treatment|skin-care)-/);
    expect(heroPoster.src).toBe('/images/offer-nov-global-colour-800.webp');
    expect(offerCatalog.filter((offer) => offer.poster).map((offer) => offer.id)).toEqual(['global-colour']);
  });

  it('keeps salons in order', () => {
    expect(locations.map((loc) => loc.name)).toEqual(['Sarjapur Road', 'HSR Layout', 'Brookfield']);
    for (const offer of offerCatalog) expect(offer.branches, offer.id).toEqual(['sarjapur-road', 'hsr-layout', 'brookfield']);
  });
});
