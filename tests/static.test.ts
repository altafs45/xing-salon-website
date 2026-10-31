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
import { redirects } from '../src/data/services';

let server: Server;
let base: string;

beforeAll(async () => {
  // A tiny built site, laid out the way vite.config.ts writes it.
  const dist = mkdtempSync(join(tmpdir(), 'xing-dist-'));
  writeFileSync(join(dist, 'index.html'), 'home');
  writeFileSync(join(dist, 'membership-gift-cards.html'), 'membership');
  mkdirSync(join(dist, 'membership-gift-cards'));
  writeFileSync(join(dist, 'membership-gift-cards', 'index.html'), 'membership');
  mkdirSync(join(dist, '404'));
  writeFileSync(join(dist, '404', 'index.html'), 'not found');
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
    expect((await get('/membership-gift-cards/')).status).toBe(200);
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

  it('only accepts POST on the lead endpoint', async () => {
    expect((await get('/api/leads/gift-membership')).status).toBe(405);
  });
});
