// The Offers section's structure: one URL scheme under /offers/, every old address redirected, every salon equal.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { canonicalRedirect } from '../server/canonical';
import { locations, overallRating } from '../src/data/branches';
import { offersMenu } from '../src/data/navMenus';
import { formatPrice, lineSaving, offerCatalog, offerCategories, offersIn } from '../src/data/offerCatalog';
import { streakCost, STREAK_CHOICES, STREAKS_RECOMMENDED } from '../src/data/offers';
import { offerCategoryMetas, offersMeta } from '../src/data/seo';
import { redirects } from '../src/data/services';

const OFFER_ROUTES = ['/offers', '/offers/hair-colour', '/offers/hair-treatment', '/offers/skin-care'];

/** Every old offer address, and where it must land. */
const MOVED: Array<[string, string]> = [
  ['/offers/november', '/offers/hair-colour'],
  ['/hsrhaircoloroffers', '/offers/hair-colour?salon=hsr-layout'],
  ['/hsrhairtreatmentoffers', '/offers/hair-treatment?salon=hsr-layout'],
  ['/hsrskincareoffers', '/offers/skin-care?salon=hsr-layout'],
  ['/sarjapaurahaircoloroffers', '/offers/hair-colour?salon=sarjapur-road'],
  ['/sarjapurahaircoloroffers', '/offers/hair-colour?salon=sarjapur-road'],
  ['/sarjapurahairtreatmentoffers', '/offers/hair-treatment?salon=sarjapur-road'],
  ['/sarjapuraskincareoffers', '/offers/skin-care?salon=sarjapur-road'],
  ['/hair-color-offer', '/offers/hair-colour'],
  ['/hair-treatment-offer', '/offers/hair-treatment'],
];
const OLD_SLUG = /hsr(haircolor|hairtreatment|skincare)offers|sarjapa?u?ra(haircolor|hairtreatment|skincare)offers|\/offers\/november|xingsalon\.com/;

describe('routes and redirects', () => {
  it('has the four offer pages, each with its own meta', () => {
    expect([offersMeta, ...offerCategoryMetas].map((meta) => meta.path)).toEqual(OFFER_ROUTES);
    expect(offerCategories.map((category) => category.path)).toEqual(OFFER_ROUTES.slice(1));
  });

  it.each(MOVED)('sends %s to %s with a 301, in the server and the redirects file', (from, to) => {
    expect(redirects[from]).toBe(to);
    expect(canonicalRedirect({ host: 'www.xingsalons.com', proto: 'https', url: from }, redirects)).toBe(to);
    expect(canonicalRedirect({ host: 'www.xingsalons.com', proto: 'https', url: `${from}.html` }, redirects)).toBe(to);
  });

  it('keeps a Google Ads click’s query next to the salon', () => {
    expect(canonicalRedirect({ host: 'www.xingsalons.com', proto: 'https', url: '/hsrhaircoloroffers?gclid=abc' }, redirects)).toBe('/offers/hair-colour?salon=hsr-layout&gclid=abc');
    expect(canonicalRedirect({ host: 'www.xingsalons.com', proto: 'https', url: '/offers/november?utm_source=ads' }, redirects)).toBe('/offers/hair-colour?utm_source=ads');
  });

  it('keeps the old anchors on the new page', () => {
    const aliases = offerCatalog.flatMap((offer) => offer.aliases ?? []);
    expect(aliases).toEqual(expect.arrayContaining(['nov-global-colour', 'nov-highlights', 'nov-colour-menu']));
  });

  it('has no old offer pages left in public/', () => {
    expect(readdirSync('public').filter((file) => file.endsWith('.html'))).toEqual([]);
    expect(existsSync('public/offer-pages')).toBe(false);
    expect(existsSync('src/data/staticOfferPages.ts')).toBe(false);
  });
});

describe('every salon, equally', () => {
  const store = globalThis as { localStorage?: unknown };
  afterEach(() => delete store.localStorage);

  it('gives every visitor the same Offers menu, with no salon in it', () => {
    const menuFor = (id: string | null) => {
      store.localStorage = { getItem: () => id, setItem: () => undefined, removeItem: () => undefined };
      return JSON.stringify(offersMenu());
    };
    const menus = [null, ...locations.map((loc) => loc.id)].map(menuFor);
    expect(new Set(menus).size).toBe(1);
    for (const loc of locations) expect(menus[0]).not.toContain(loc.name);
    expect(offersMenu().viewAll.href).toBe('/offers');
    expect(offersMenu().items.slice(0, 3).map((item) => item.href)).toEqual(OFFER_ROUTES.slice(1));
  });

  it('honours every offer at all three salons, in order', () => {
    for (const offer of offerCatalog) expect(offer.branches, offer.id).toEqual(locations.map((loc) => loc.id));
  });

  it('shows the Google rating as it is: 4.8 overall', () => {
    expect(overallRating).toBe(4.8);
  });
});

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.html') ? [path] : [];
  });

describe.skipIf(!existsSync('dist/index.html'))('the built site', () => {
  // Redirect stubs (a refresh to the new address) are the only pages allowed to name an old address.
  const pages = walk('dist')
    .map((file) => ({ file, html: readFileSync(file, 'utf8') }))
    .filter(({ html }) => !html.includes('http-equiv="refresh"'));
  const page = (route: string) => readFileSync(join('dist', `${route}.html`), 'utf8');

  it('prerenders the offer pages and lists them in the sitemap', () => {
    const sitemap = readFileSync('dist/sitemap-pages.xml', 'utf8');
    for (const route of OFFER_ROUTES) {
      expect(sitemap, route).toContain(`<loc>https://www.xingsalons.com${route}</loc>`);
      expect(page(route), route).toMatch(/<div id="root">\s*<[a-z]/);
    }
  });

  it('writes every old address into the redirects file', () => {
    const file = readFileSync('dist/_redirects', 'utf8');
    for (const [from, to] of MOVED) {
      expect(file, from).toContain(`${from} ${to} 301!`);
      expect(file, from).toContain(`${from}.html ${to} 301!`);
    }
  });

  it('has no href="#", and no link to an old offer address or the old domain', () => {
    for (const { file, html } of pages) {
      expect(html.includes('href="#"'), file).toBe(false);
      for (const match of html.matchAll(/href="([^"]+)"/g)) expect(OLD_SLUG.test(match[1]), `${file}: ${match[1]}`).toBe(false);
    }
  });

  it('lists all three salons, in order, on every offer page', () => {
    for (const route of OFFER_ROUTES) {
      const html = page(route);
      const at = locations.map((loc) => html.indexOf(`Xing ${loc.name}`));
      expect(at.every((index) => index > 0), route).toBe(true);
      expect([...at].sort((a, b) => a - b), route).toEqual(at);
    }
  });

  it('shows only the catalogue’s prices on the offer pages', () => {
    const allowed = new Set(
      [
        ...offerCatalog.flatMap((offer) => offer.lines.flatMap((line) => [line.now, line.was ?? 0, lineSaving(line)])),
        ...STREAK_CHOICES.map(streakCost),
        streakCost(STREAKS_RECOMMENDED.min),
        streakCost(STREAKS_RECOMMENDED.max),
      ].map(formatPrice),
    );
    for (const route of OFFER_ROUTES) {
      const text = page(route).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
      for (const [price] of text.matchAll(/₹\d[\d,]*\d|₹\d/g)) expect(allowed.has(price), `${route}: ${price}`).toBe(true);
    }
  });

  it('shows each category’s four offers on its page', () => {
    for (const category of offerCategories) {
      const html = page(category.path);
      for (const offer of offersIn(category.id)) expect(html, `${category.path} #${offer.id}`).toContain(`id="${offer.id}"`);
    }
  });
});
