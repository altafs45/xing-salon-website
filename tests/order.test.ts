import { describe, expect, it } from 'vitest';
import { bySalonOrder, locations, SALON_ORDER } from '../src/data/branches';
import { salons, SALON_KEYS } from '../src/data/giftMembership';
import { allFaqs, faqGroups, faqPage } from '../src/data/faqPage';
import { giftsMenu, offersMenu, salonsMenu } from '../src/data/navMenus';
import { ALL_BRANCHES, promoHref } from '../src/data/offers';
import { faqPageMeta } from '../src/data/seo';

const ist = (time: string) => new Date(`${time}:00+05:30`);

describe('salon order', () => {
  it('has one order everywhere', () => {
    expect(locations.map((salon) => salon.id)).toEqual([...SALON_ORDER]);
    expect(ALL_BRANCHES).toEqual([...SALON_ORDER]);
    expect(salons.map((salon) => salon.locationId)).toEqual([...SALON_ORDER]);
    expect(SALON_KEYS).toEqual(salons.map((salon) => salon.key));
    expect(salonsMenu.items.map((item) => item.href.split('/').pop())).toEqual([...SALON_ORDER]);
  });

  it('sorts salons from any other source', () => {
    expect([{ id: 'brookfield' }, { id: 'sarjapur-road' }, { id: 'hsr-layout' }].sort(bySalonOrder).map((salon) => salon.id)).toEqual([...SALON_ORDER]);
  });
});

describe('nav menus', () => {
  it('builds Offers from the offers, without the gift items', () => {
    const items = offersMenu().items.map((item) => item.href);
    expect(items).toContain('/offers');
    expect(items).not.toContain(promoHref('membership'));
    expect(items).not.toContain(promoHref('gift-card'));
  });

  it('points Gifts at sections of the membership page', () => {
    expect(giftsMenu.items.map((item) => item.href.split('#')[1])).toEqual(['gift-cards', 'membership', 'compare']);
  });
});

describe('/faq', () => {
  const items = allFaqs(faqGroups());
  const schema = faqPageMeta.jsonLd.find((node) => (node as { '@type'?: string })['@type'] === 'FAQPage') as { mainEntity: Array<{ name: string }> };

  it('sends one FAQPage holding every question', () => {
    expect(faqPageMeta.jsonLd.filter((node) => (node as { '@type'?: string })['@type'] === 'FAQPage')).toHaveLength(1);
    expect(schema.mainEntity).toHaveLength(items.length);
    expect(items.length).toBeGreaterThan(40);
  });

  it('asks each question once', () => {
    expect(new Set(items.map((item) => item.q)).size).toBe(items.length);
  });

  it('keeps salons in order and drops November questions after the campaign', () => {
    const salonsGroup = faqGroups().find((group) => group.id === 'salons')!;
    expect(salonsGroup.blocks.map((block) => block.title)).toEqual(locations.map((salon) => `Xing ${salon.name}`));
    const offers = (now: Date) => faqGroups(now).find((group) => group.id === 'offers')!.blocks[0].items;
    expect(offers(ist('2026-11-15T10:00')).some((item) => item.a.includes('₹3,999'))).toBe(true);
    expect(offers(ist('2026-12-01T00:00')).some((item) => item.a.includes('₹3,999'))).toBe(false);
  });

  it('keeps its title and description to length', () => {
    expect(faqPage.seo.title.length).toBeLessThanOrEqual(60);
    expect(faqPage.seo.description.length).toBeLessThanOrEqual(155);
  });
});
