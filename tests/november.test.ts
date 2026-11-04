import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { booking } from '../src/data/content';
import { locations } from '../src/data/branches';
import { novemberOffersPage } from '../src/data/novemberOffersPage';
import {
  campaignCountdown,
  campaignLines,
  campaignState,
  daysLeft,
  isCampaignLive,
  maxSavingRupees,
  novemberCampaign,
  savingLabel,
  savingPercent,
  sheetOfferById,
  streakRange,
  withCampaignFaq,
} from '../src/data/offers';
import { novemberOffersMeta, offersMeta } from '../src/data/seo';
import { claimText } from '../src/lib/offers';

const ist = (time: string) => new Date(`${time}:00+05:30`);

describe('honest claims', () => {
  const texts = JSON.stringify([novemberCampaign, novemberOffersPage, novemberOffersMeta, offersMeta]);

  it('never repeats the percentages the posters cannot support', () => {
    expect(texts).not.toMatch(/\b50\s?%/);
    expect(texts).not.toMatch(/\b40\s?%/);
    expect(texts).not.toMatch(/stunning you/i);
  });

  it('shows savings worked out from the prices', () => {
    expect(maxSavingRupees()).toBe(2500);
    for (const line of campaignLines()) expect(savingLabel(line)).toContain(`${savingPercent(line)} off`);
    expect(campaignLines().map((line) => savingPercent(line))).toEqual(['33%', '20%', '37%', '31%']);
  });

  it('gives the whole bill for highlights', () => {
    expect(streakRange()).toBe('₹3,192–₹3,990');
  });

  it('has no rating in the page schema, and the same FAQ in schema and page', () => {
    const schema = JSON.stringify(novemberOffersMeta.jsonLd);
    expect(schema).not.toContain('AggregateRating');
    for (const item of novemberOffersPage.faqs) expect(schema).toContain(JSON.stringify(item.a));
  });

  it('keeps titles and FAQ answers to length', () => {
    expect(novemberOffersPage.seo.title.length).toBeLessThanOrEqual(60);
    expect(novemberOffersPage.seo.description.length).toBeLessThanOrEqual(155);
    for (const item of novemberOffersPage.faqs) {
      const words = item.a.split(/\s+/).length;
      expect(words, item.q).toBeLessThanOrEqual(45);
    }
  });
});

describe('campaign dates, in salon time', () => {
  it.each([
    ['2026-10-31T23:59', 'upcoming', false],
    ['2026-11-01T00:00', 'live', true],
    ['2026-11-30T23:59', 'live', true],
    ['2026-12-01T00:00', 'ended', false],
  ])('%s is %s', (time, state, live) => {
    expect(campaignState(ist(time))).toBe(state);
    expect(isCampaignLive(ist(time))).toBe(live);
  });

  it('counts the days left, including today', () => {
    expect(daysLeft(ist('2026-11-01T00:00'))).toBe(30);
    expect(daysLeft(ist('2026-11-30T23:59'))).toBe(1);
    expect(daysLeft(ist('2026-12-01T00:00'))).toBe(0);
  });

  it('words the countdown for each stage', () => {
    expect(campaignCountdown(ist('2026-10-31T23:59'))).toBe('Starts 1 Nov · valid till 30 Nov');
    expect(campaignCountdown(ist('2026-11-20T10:00'))).toBe('Valid till 30 Nov · 11 days left');
    expect(campaignCountdown(ist('2026-11-30T10:00'))).toBe('Last day · valid till 30 Nov');
    expect(campaignCountdown(ist('2026-12-01T00:00'))).toBe('');
  });

  it('drops the November sentence from salon FAQs once ended', () => {
    const faqs = [{ q: 'Which offers?', a: 'Tuesdays.', campaign: true }];
    expect(withCampaignFaq(faqs, ist('2026-11-20T10:00'))[0].a).toContain('₹3,999');
    expect(withCampaignFaq(faqs, ist('2026-12-01T00:00'))[0].a).toBe('Tuesdays.');
  });
});

describe('claiming', () => {
  it('names the offer, price and salon and survives encoding', () => {
    const text = claimText(sheetOfferById('nov-global-colour')!, locations[0], 'Today');
    expect(text).toContain('*Global Hair Colour* November offer');
    expect(text).toContain('₹3,999, any length');
    expect(text).toContain(locations[0].name);
    const url = `${locations[0].whatsappHref}?text=${encodeURIComponent(text)}`;
    expect(new URL(url).searchParams.get('text')).toBe(text);
  });
});

describe('links', () => {
  it('points at real posts, booking services and images', () => {
    const slugs = new Set(novemberCampaign.offers.flatMap((offer) => offer.relatedBlog));
    expect(slugs.size).toBeGreaterThanOrEqual(4);
    for (const offer of novemberCampaign.offers) {
      expect(booking.services).toContain(offer.bookingService);
      for (const width of [480, 800]) expect(existsSync(join('public', offer.poster.src.replace('-800', `-${width}`)))).toBe(true);
    }
    for (const slug of slugs) expect(readFileSync(join('content/blog', `${slug}.md`), 'utf8').length).toBeGreaterThan(0);
  });
});
