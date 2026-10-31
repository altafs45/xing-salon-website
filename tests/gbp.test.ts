import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bookingSlots, locations, overallRating, ratingLabel, reviewsLabel, salonById, statusAt, totalReviews, totalReviewsLabel } from '../src/data/branches';
import { site } from '../src/data/content';
import { GBP } from './fixtures';

const at = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};
const open = (id: string, time: string) => ['open', 'closing'].includes(statusAt(salonById(id)!, at(time)).state);

describe('salon facts match the Google Business Profiles', () => {
  for (const loc of locations) {
    const gbp = GBP[loc.id as keyof typeof GBP];
    it(loc.id, () => {
      expect(loc.gbpName).toBe(gbp.gbpName);
      expect(loc.fullName).toBe(gbp.gbpName);
      expect(loc.addressLine).toBe(gbp.addressLine);
      expect(loc.phone).toBe(gbp.phone);
      expect(loc.phoneHref).toBe(gbp.tel);
      expect(loc.whatsappHref).toBe(gbp.whatsapp);
      expect([loc.hours.opens, loc.hours.closes]).toEqual([gbp.opens, gbp.closes]);
      expect([loc.lat, loc.lng]).toEqual([gbp.lat, gbp.lng]);
      expect(loc.plusCode).toBe(gbp.plusCode);
      expect(loc.mapsUrl).toBe(gbp.mapsUrl);
      expect(loc.directionsUrl).toContain(encodeURIComponent(`${gbp.lat},${gbp.lng}`));
    });
  }

  it('calculates the ratings', () => {
    expect(totalReviews).toBe(2590);
    expect(totalReviewsLabel).toBe('2,550+');
    expect(overallRating).toBe(4.8);
    expect(site.rating).toBe(4.8);
    expect(site.reviewCount).toBe('2,550+');
    expect(locations.map((loc) => reviewsLabel(loc.rating.count))).toEqual(['450+', '490+', '1,600+']);
    expect(ratingLabel(salonById('hsr-layout')!.rating)).toBe('4.9 ★ · 490+ Google reviews');
  });

  it('knows each salon is open on its own hours', () => {
    expect(open('hsr-layout', '21:45')).toBe(true);
    expect(open('sarjapur-road', '21:45')).toBe(false);
    expect(open('brookfield', '21:45')).toBe(false);
    expect(open('brookfield', '09:30')).toBe(true);
    expect(open('hsr-layout', '09:30')).toBe(false);
    expect(open('sarjapur-road', '09:30')).toBe(false);
  });

  it('offers booking slots inside each salon\'s hours', () => {
    expect(bookingSlots(salonById('brookfield')!)[0]).toBe('9 AM');
    expect(bookingSlots(salonById('sarjapur-road')!)[0]).toBe('10 AM');
    expect(bookingSlots(salonById('hsr-layout')!).at(-1)).toBe('9 PM');
  });
});

const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : path.endsWith('.html') ? [path] : [];
});

describe.skipIf(!existsSync('dist/index.html'))('the built site', () => {
  const pages = walk('dist').map((file) => ({ file, html: readFileSync(file, 'utf8') }));
  const salons = pages.filter(({ file }) => /salons[\\/](sarjapur-road|hsr-layout|brookfield)\.html$/.test(file));
  const allowed = new Set(['918970007440', '919380812348', '917996666012', '917004708826']);

  it('calls only the profiles\' numbers', () => {
    for (const { file, html } of pages) {
      for (const match of html.matchAll(/href="tel:\+(\d+)"/g)) {
        if (/services[\\/]tattoo|fitness/.test(file)) continue;
        expect(allowed.has(match[1]) || !/^91(81471|79966|89700|93808)/.test(match[1]), match[1]).toBe(true);
      }
      expect(html.includes('tel:+918147111344'), file).toBe(false);
    }
  });

  it('has no old figures, and no review markup', () => {
    for (const { file, html } of pages) {
      for (const old of ['2,264', '1,552', '393 Google', '319 Google', 'aggregateRating']) expect(html.includes(old), `${old} in ${file}`).toBe(false);
    }
  });

  it('says Sarjapura Road only inside the exact profile name', () => {
    for (const { file, html } of pages) expect(html.replaceAll(GBP['sarjapur-road'].gbpName, '').includes('Sarjapura Road'), file).toBe(false);
  });

  it('sends each salon\'s facts in its schema', () => {
    expect(salons).toHaveLength(3);
    for (const { html } of salons) {
      for (const [id, gbp] of Object.entries(GBP)) {
        const block = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
        if (!block.includes(`/salons/${id}#salon`)) continue;
        const nodes: Array<Record<string, any>> = [];
        const collect = (value: unknown) => {
          if (Array.isArray(value)) value.forEach(collect);
          else if (value && typeof value === 'object') {
            if ((value as { '@id'?: string })['@id']?.endsWith(`/salons/${id}#salon`) && (value as { name?: string }).name) nodes.push(value as Record<string, any>);
            Object.values(value).forEach(collect);
          }
        };
        collect(JSON.parse(block));
        expect(nodes.length).toBeGreaterThan(0);
        for (const node of nodes) {
          expect(node.name).toBe(gbp.gbpName);
          expect(node.telephone).toBe(gbp.phone.replace(/ /g, '-'));
          expect(node.geo.latitude).toBe(gbp.lat);
          expect(node.openingHoursSpecification.closes).toBe(gbp.closes);
          expect(`${node.address.streetAddress}, Bengaluru, Karnataka ${node.address.postalCode}`).toBe(gbp.addressLine);
        }
      }
    }
  });
});
