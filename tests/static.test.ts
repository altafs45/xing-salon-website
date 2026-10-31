import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MemoryStore } from '../server/adapters/leadStore';
import { ConsoleMailProvider } from '../server/adapters/mail';
import { NotConfiguredProvider } from '../server/adapters/payment';
import { ClickToChatProvider } from '../server/adapters/whatsapp';
import { createApp } from '../server/app';
import { RateLimiter } from '../server/rateLimit';
import { canonicalRedirect } from '../server/canonical';
import { redirects } from '../src/data/services';

let server: Server;
let base: string;

beforeAll(async () => {
  // A tiny built site, laid out the way vite.config.ts writes it.
  const dist = mkdtempSync(join(tmpdir(), 'xing-dist-'));
  writeFileSync(join(dist, 'index.html'), 'home');
  writeFileSync(join(dist, 'membership-gift-cards.html'), 'membership');
  writeFileSync(join(dist, '404.html'), 'not found');
  mkdirSync(join(dist, 'assets'));
  writeFileSync(join(dist, 'assets', 'app-abc123.js'), 'code');
  mkdirSync(join(dist, 'images'));
  writeFileSync(join(dist, 'images', 'photo.webp'), 'image');
  writeFileSync(join(dist, 'robots.txt'), 'robots');
  const deps = {
    store: new MemoryStore(),
    mail: new ConsoleMailProvider(),
    whatsapp: new ClickToChatProvider(),
    payments: new NotConfiguredProvider(),
    ipLimiter: new RateLimiter(5, 60_000),
    phoneLimiter: new RateLimiter(5, 60_000),
    xingEmail: '',
    route: () => ({ email: '', whatsapp: '919380812348' }),
  };
  server = createApp(deps, dist).listen(0);
  await new Promise((done) => server.once('listening', done));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise((done) => server.close(done)));

const get = (path: string) => fetch(`${base}${path}`, { redirect: 'manual' }).then(async (res) => ({ status: res.status, body: await res.text() }));

describe('static site serving', () => {
  it('serves a page at its canonical address without redirecting', async () => {
    expect(await get('/membership-gift-cards')).toEqual({ status: 200, body: 'membership' });
    expect(await get('/')).toEqual({ status: 200, body: 'home' });
  });

  it('answers unknown pages and path tricks with the 404 page', async () => {
    expect(await get('/nope')).toEqual({ status: 404, body: 'not found' });
    expect((await get('/..%2f..%2fpackage.json')).status).toBe(404);
  });

  it('answers every retired address with a 301 to its replacement, keeping the query', async () => {
    for (const [from, to] of Object.entries(redirects)) {
      const res = await fetch(`${base}${from}`, { redirect: 'manual' });
      expect(res.status, from).toBe(301);
      expect(res.headers.get('location'), from).toBe(to);
    }
    const withQuery = await fetch(`${base}/services/hair-color/?utm_source=ig`, { redirect: 'manual' });
    expect(withQuery.headers.get('location')).toBe('/services/global-hair-color?utm_source=ig');
  });

  it('has one address per page: no trailing slash, no .html, no /index.html', async () => {
    const location = async (path: string) => {
      const res = await fetch(`${base}${path}`, { redirect: 'manual' });
      return [res.status, res.headers.get('location')];
    };
    expect(await location('/membership-gift-cards/?a=1')).toEqual([301, '/membership-gift-cards?a=1']);
    expect(await location('/membership-gift-cards.html')).toEqual([301, '/membership-gift-cards']);
    expect(await location('/index.html')).toEqual([301, '/']);
  });

  it('sends the live domain to https://www in one hop', () => {
    const go = (host: string, proto: string, url: string) => canonicalRedirect({ host, proto, url }, redirects);
    expect(go('www.xingsalons.com', 'https', '/offers')).toBeUndefined();
    expect(go('xingsalons.com', 'https', '/offers')).toBe('https://www.xingsalons.com/offers');
    expect(go('www.xingsalons.com', 'http', '/offers?a=1')).toBe('https://www.xingsalons.com/offers?a=1');
    expect(go('xingsalons.com', 'http', '/offers/')).toBe('https://www.xingsalons.com/offers');
    expect(go('localhost', 'http', '/offers')).toBeUndefined();
    const [from, to] = Object.entries(redirects)[0];
    expect(go('xingsalons.com', 'http', `${from}/`)).toBe(`https://www.xingsalons.com${to}`);
  });

  it('sets the security and cache headers', async () => {
    const headers = async (path: string) => (await fetch(`${base}${path}`)).headers;
    const page = await headers('/membership-gift-cards');
    expect(page.get('strict-transport-security')).toBe('max-age=31536000; includeSubDomains');
    expect(page.get('x-content-type-options')).toBe('nosniff');
    expect(page.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(page.get('cache-control')).toBe('no-cache');
    expect((await headers('/assets/app-abc123.js')).get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect((await headers('/images/photo.webp')).get('cache-control')).toBe('public, max-age=604800');
    expect((await headers('/robots.txt')).get('cache-control')).toBe('no-cache');
  });

  it('only accepts POST on the lead endpoint', async () => {
    expect((await get('/api/leads/gift-membership')).status).toBe(405);
  });
});
