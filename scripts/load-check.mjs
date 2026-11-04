// Page-load check. Loads five pages at a phone and a desktop width under a throttled CPU (4x) and network
// (slow 4G), screenshots 50/200/500/1000/2000 ms in, and fails on any of:
//   unstyled   a frame with default link colours, Times New Roman body text or bullets on the salon bar,
//              or the salon bar visible below 1024px
//   blank      first paint later than 1.0 s (dev: the skeleton later than 300 ms), or a painted frame without
//              the page's H1 and primary button on screen
//   hydration  any React hydration error or warning in the console, or the prerendered H1 replaced
//   cls        layout shift over 0.05
//   bar        (desktop) a salon name not linking to its page, Copy not copying, a tel: link on screen
// Each page loads three times: first paint is the median. Screenshots (of the first load) go to
// reports/load/<date>/. Exits 1 on any failure.
//   node scripts/load-check.mjs              the build (dist/), served as a host would
//   node scripts/load-check.mjs --dev=URL    a running dev server (npm run dev), network unthrottled
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const DEV = process.argv.find((a) => a.startsWith('--dev='))?.slice(6);
// /offers and the offer pages are the copies of xingsalons.com in public/: plain HTML, with the site's header from
// /embed/site-header.js, which only the build has. The dev check is of the app's own skeleton, so it skips them.
const COPIED = ['/offers', '/hsrhaircoloroffers'];
const PAGES = ['/', ...(DEV ? [] : COPIED), '/salons/hsr-layout', '/services/balayage'];
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];
const SHOTS = [50, 200, 500, 1000, 2000];
const RUNS = 3;
const FIRST_PAINT_MAX = DEV ? 300 : 1000;
const CLS_MAX = 0.05;
// Slow 4G as Lighthouse throttles it.
const SLOW_4G = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const PHONES = { 'sarjapur-road': '+91 89700 07440', 'hsr-layout': '+91 93808 12348', brookfield: '+91 79966 66012' };
const OUT = join('reports', 'load', new Date().toISOString().slice(0, 10) + (DEV ? '-dev' : ''));
const DIST = resolve('dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };

let server;
let base = DEV;
if (!DEV) {
  server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
    const file = extname(path) ? join(DIST, path) : path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
    if (!resolve(file).startsWith(DIST + sep) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    // Compressed like the site's server (compression() in server/app.ts), which matters on slow 4G.
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    const body = readFileSync(file);
    if (/text|javascript|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip' }).end(gzipSync(body));
    else res.writeHead(200, { 'Content-Type': type }).end(body);
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  base = `http://127.0.0.1:${server.address().port}`;
}
mkdirSync(OUT, { recursive: true });

// Runs in the page before anything else: layout shifts, and the H1 the HTML arrived with.
const INIT = () => {
  window.__cls = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') window.__h1 = document.querySelector('#first-paint h1, #root h1');
  });
};

/** What one frame shows: unstyled signs, and whether the H1 and the primary button are on screen. */
const FRAME = () => {
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && s.visibility !== 'hidden' && Number(s.opacity) > 0.1;
  };
  // The salon bar is in the page, or in the site header's shadow root on the copied pages.
  const host = document.querySelector('[data-site-header]')?.shadowRoot;
  const bar = document.querySelector('[data-utility-bar]') ?? host?.querySelector('[data-utility-bar]');
  const scope = [...document.querySelectorAll('body *'), ...(host ? host.querySelectorAll('*') : [])];
  const unstyled = [];
  const links = scope.filter((el) => el.tagName === 'A' && visible(el));
  const blue = links.find((a) => ['rgb(0, 0, 238)', 'rgb(85, 26, 139)'].includes(getComputedStyle(a).color));
  if (blue) unstyled.push(`default link colour on "${blue.textContent.trim().slice(0, 30)}"`);
  if (/^"?Times New Roman/.test(getComputedStyle(document.body).fontFamily)) unstyled.push('Times New Roman body');
  if (bar && [...bar.querySelectorAll('li')].some((li) => getComputedStyle(li).listStyleType !== 'none' && getComputedStyle(li.parentElement).listStyleType !== 'none'))
    unstyled.push('bullets on the salon bar');
  if (bar && innerWidth < 1024 && visible(bar)) unstyled.push('salon bar visible below 1024px');
  const h1 = document.querySelector('h1');
  const cta = scope.find((el) => (el.tagName === 'A' || el.tagName === 'BUTTON') && !el.closest('header,[data-utility-bar],nav,footer') && /book|whatsapp|call|claim|enquire|offer/i.test(el.textContent) && visible(el));
  const skeleton = !!document.querySelector('[data-skeleton]') && visible(document.querySelector('[data-skeleton]'));
  return { unstyled, h1: visible(h1), cta: !!cta, skeleton };
};

const browser = await chromium.launch();
const results = [];

/** One load of one page at one size: what failed, and its first paint and layout shift. */
async function load(path, viewport, shots) {
    const failures = [];
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const console_ = [];
    page.on('console', (msg) => ['error', 'warning'].includes(msg.type()) && console_.push(msg.text()));
    page.on('pageerror', (error) => console_.push(error.message));
    await page.addInitScript(INIT);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    if (!DEV) {
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
    }

    const name = `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '_')}-${viewport.width}`;
    const start = Date.now();
    // Images on the copied offer pages take a minute on slow 4G: the first screen is what is checked.
    const loaded = page.goto(base + path, { waitUntil: 'commit', timeout: 60_000 });
    const frames = [];
    for (const at of SHOTS) {
      const wait = start + at - Date.now();
      if (wait > 0) await new Promise((done) => setTimeout(done, wait));
      try {
        if (shots) await page.screenshot({ path: join(OUT, `${name}-${at}ms.png`), timeout: 5_000 });
        frames.push({ at, ...(await page.evaluate(FRAME)) });
      } catch {
        frames.push({ at, pending: true });
      }
    }
    await loaded;
    await page.waitForLoadState('domcontentloaded', { timeout: 60_000 }).catch(() => {});
    await page.waitForTimeout(3000);

    const firstPaint = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? Infinity);
    for (const frame of frames) {
      if (frame.pending) continue;
      if (frame.unstyled.length) failures.push(`unstyled @${frame.at}ms: ${frame.unstyled.join(', ')}`);
      if (frame.at >= firstPaint && !frame.skeleton && (!frame.h1 || !frame.cta)) failures.push(`blank @${frame.at}ms: ${frame.h1 ? '' : 'no H1 '}${frame.cta ? '' : 'no primary button'}`.trim());
      if (DEV && frame.at >= 300 && frame.at >= firstPaint && !frame.skeleton && !frame.h1) failures.push(`blank @${frame.at}ms: no skeleton or page`);
    }

    const hydration = console_.filter((text) => /hydrat|did not match|server rendered HTML|error #(418|419|421|422|423|425)/i.test(text));
    if (hydration.length) failures.push(`hydration: ${hydration[0].slice(0, 120)}`);
    const sameH1 = await page.evaluate(() => !window.__h1 || (window.__h1.isConnected && window.__h1 === document.querySelector('#first-paint h1, #root h1')));
    if (!DEV && !sameH1) failures.push('hydration: the prerendered H1 was replaced');

    const cls = await page.evaluate(() => window.__cls);

    if (viewport.width >= 1024) {
      const bar = page.locator('[data-utility-bar]');
      // On the copied offer pages the bar comes with the site's header, once /embed/site-header.js has run.
      if (!(await bar.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true, () => false))) failures.push('bar: not visible');
      else {
        for (const [id, phone] of Object.entries(PHONES)) {
          const href = await bar.locator(`a[href="/salons/${id}"]`).count();
          if (!href) failures.push(`bar: no link to /salons/${id}`);
        }
        if (await bar.locator('a[href^="tel:"]:visible').count()) failures.push('bar: tel: link on screen');
        await bar.locator('button[aria-label*="HSR"]').click();
        const copied = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
        if (copied !== PHONES['hsr-layout']) failures.push(`bar: Copy gave "${copied}"`);
      }
    }

    await context.close();
    return { firstPaint, cls, failures, other: console_.filter((t) => !hydration.includes(t)) };
}

// First paint on a throttled CPU varies by a few hundred ms from one load to the next: each page loads RUNS times
// and is judged on its median first paint and its worst layout shift; every other check must hold on every load.
for (const path of PAGES) {
  for (const viewport of VIEWPORTS) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await load(path, viewport, i === 0));
    const firstPaint = runs.map((run) => run.firstPaint).sort((a, b) => a - b)[Math.floor(RUNS / 2)];
    const cls = Math.max(...runs.map((run) => run.cls));
    const failures = [...new Set(runs.flatMap((run) => run.failures))];
    if (firstPaint > FIRST_PAINT_MAX) failures.unshift(`blank: first paint ${Math.round(firstPaint)} ms > ${FIRST_PAINT_MAX} ms`);
    if (cls > CLS_MAX) failures.push(`cls ${cls.toFixed(3)} > ${CLS_MAX}`);
    results.push({ path, width: viewport.width, firstPaint: Math.round(firstPaint), runs: runs.map((run) => Math.round(run.firstPaint)), cls: Number(cls.toFixed(3)), failures, other: [...new Set(runs.flatMap((run) => run.other))] });
  }
}

await browser.close();
server?.close();

for (const r of results) {
  console.log(`${r.failures.length ? 'FAIL' : 'PASS'}  ${r.path.padEnd(22)} ${String(r.width).padStart(4)}px  first paint ${String(r.firstPaint).padStart(5)} ms (${r.runs.join('/')})  CLS ${r.cls}`);
  for (const f of r.failures) console.log(`      ${f}`);
  for (const t of r.other) console.log(`      console: ${t.slice(0, 140)}`);
}
console.log(`Screenshots: ${OUT}`);
process.exit(results.some((r) => r.failures.length) ? 1 : 0);
