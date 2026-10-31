import { describe, expect, it } from 'vitest';
import { servicePages } from '../src/data/pages';
import { categories, redirects, services, servicesIn } from '../src/data/services';

const PRICE = /₹|\bINR\b|\bRs\.?\s?\d/;

describe('service catalogue', () => {
  it('has the four categories in order, with Hair Care in four groups', () => {
    expect(categories.map((category) => category.title)).toEqual(['Hair Care', 'Skin & Body', 'Nail Care', 'Tattoo']);
    const hair = categories[0];
    expect(hair.groups.map((group) => group.title)).toEqual(['Haircuts & Styling', 'Hair Colour', 'Smoothing & Straightening', 'Hair Treatments']);
    expect(hair.groups[1].services.map((service) => service.slug)).toEqual(['global-hair-color', 'highlights', 'balayage', 'fashion-color']);
    expect(hair.groups[2].services.map((service) => service.slug)).toEqual(['keratin-treatment', 'hair-smoothening', 'hair-straightening']);
    expect(hair.groups[3].services.map((service) => service.slug)).toContain('hair-botox');
    expect(servicesIn(categories[2])).toHaveLength(7);
  });

  it('lists every service exactly once, each with a published page', () => {
    const listed = categories.flatMap(servicesIn).map((service) => service.slug);
    expect(new Set(listed).size).toBe(listed.length);
    expect([...listed].sort()).toEqual(Object.keys(services).sort());
    for (const slug of listed) expect(servicePages[slug], slug).toBeDefined();
  });

  it('keeps search copy within limits and free of prices', () => {
    for (const service of Object.values(services)) {
      expect(service.blurb.length, service.slug).toBeLessThanOrEqual(70);
      if (service.metaTitle) expect(service.metaTitle.length, service.slug).toBeLessThanOrEqual(60);
      if (service.metaDesc) expect(service.metaDesc.length, service.slug).toBeLessThanOrEqual(155);
      expect(`${service.blurb} ${service.metaTitle ?? ''} ${service.metaDesc ?? ''}`, service.slug).not.toMatch(PRICE);
    }
    for (const category of categories) {
      expect(category.metaDesc.length, category.key).toBeLessThanOrEqual(155);
      expect(category.intro.split(/\s+/).length, category.key).toBeLessThanOrEqual(40);
    }
  });

  it('derives each H1 from the meta title', () => {
    expect(services.balayage.h1).toBe('Balayage Hair Colour in Bangalore');
    expect(services['quick-nail-care'].h1).toBe('Quick Nail Care in Bangalore');
  });

  it('links only to live pages from related services, and redirects only to live addresses', () => {
    for (const page of Object.values(servicePages)) for (const item of page.related.items) expect(servicePages[item.slug], `${page.slug} → ${item.slug}`).toBeDefined();
    const live = new Set(['/services/hair-care', '/services/nail-care', '/services/skin-body', ...Object.keys(servicePages).map((slug) => `/services/${slug}`)]);
    for (const [from, to] of Object.entries(redirects)) {
      expect(live.has(to), `${from} → ${to}`).toBe(true);
      expect(live.has(from), `${from} is still live`).toBe(false);
    }
  });

  it('gives each new page 4 FAQs of 40–55 words and an intro of 120–160 words', () => {
    const fresh = ['global-hair-color', 'highlights', 'balayage', 'fashion-color', 'keratin-treatment', 'hair-smoothening', 'hair-straightening', 'hair-botox', 'nanoplastia-cysteine', 'manicure', 'pedicure', 'nail-cutting-filing', 'nail-polish', 'quick-nail-care'];
    const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
    for (const slug of fresh) {
      const page = servicePages[slug];
      expect(page.faqs, slug).toHaveLength(4);
      for (const faq of page.faqs) expect(words(faq.a), `${slug}: ${faq.q}`).toBeGreaterThanOrEqual(40);
      for (const faq of page.faqs) expect(words(faq.a), `${slug}: ${faq.q}`).toBeLessThanOrEqual(55);
      const intro = words(page.intro.paragraphs.join(' '));
      expect(intro, slug).toBeGreaterThanOrEqual(120);
      expect(intro, slug).toBeLessThanOrEqual(160);
      expect(page.audience?.items, slug).toHaveLength(3);
      expect(page.process?.steps.length, slug).toBeGreaterThanOrEqual(3);
      expect(page.process?.steps.length, slug).toBeLessThanOrEqual(4);
      expect(JSON.stringify(page), slug).not.toMatch(PRICE);
    }
  });
});
