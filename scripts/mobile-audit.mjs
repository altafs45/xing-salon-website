// Mobile audit of the built site. Loads every page at phone widths and prints one line per problem:
// ERROR|WARN <url> <width> <check> <detail>, then a table per page. Exits 1 on any ERROR.
//   node scripts/mobile-audit.mjs [--today=2026-11-10] [--widths=360,375,390,412] [--only=/offers/november] [--out=file] [--shots]
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const TODAY = arg('today', '2026-11-10');
const WIDTHS = arg('widths', '360,375,390,412').split(',').map(Number);
const ONLY = arg('only', '');
const SHOTS = process.argv.includes('--shots');
const OUT = arg('out', '');
const HEIGHT = { 360: 780, 375: 812, 390: 844, 412: 915 };
const SITE = 'https://www.xingsalons.com';
const OFFERS_PAGE = '/offers/november';
const DIST = resolve('dist');
const WORKERS = 4;
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
  const file = extname(path) ? join(DIST, path) : path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  if (!resolve(file).startsWith(DIST + sep) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;

const sitemap = [...(readFileSync(join(DIST, 'sitemap-pages.xml'), 'utf8') + readFileSync(join(DIST, 'sitemap-blog.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/');
const paths = ONLY ? ONLY.split(',') : [...new Set([...sitemap, OFFERS_PAGE])];

const lines = [];
const table = new Map();
const report = (level, url, width, check, detail = '') => lines.push(`${level.padEnd(5)} ${url} ${width} ${check} ${String(detail).replace(/\s+/g, ' ').slice(0, 110)}`);

/** Runs in the page: every measurement that needs layout. */
const measure = () => {
  const main = document.querySelector('main');
  const H = window.innerHeight;
  const W = window.innerWidth;
  const bar = [...document.querySelectorAll('nav[aria-label="Quick actions"]')].find((el) => el.getBoundingClientRect().height > 0 && getComputedStyle(el).display !== 'none');
  const foldBottom = bar ? Math.min(H, bar.getBoundingClientRect().top) : H;
  const visible = (el) => {
    const box = el.getBoundingClientRect();
    if (box.width <= 1 || box.height <= 1) return false;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      // Opacity is left out on purpose: scroll-in content starts at 0, and it still has to meet the limits.
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (node.tagName === 'DETAILS' && !node.open && !el.closest('summary')) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
      if (node.classList.contains('sr-only')) return false;
    }
    return true;
  };
  const words = (el) => (el?.innerText ?? '').split(/\s+/).filter(Boolean).length;
  const roots = [document.querySelector('#first-paint'), main].filter(Boolean);
  const scope = roots.flatMap((root) => [root, ...root.querySelectorAll('*')]);
  const out = { problems: [], over: document.documentElement.scrollWidth - W, H };
  const add = (level, check, detail) => out.problems.push([level, check, detail]);

  // Text size, in the page and the footer
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const small = new Set();
  const under14 = new Set();
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim();
    const el = walker.currentNode.parentElement;
    if (!text || !el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName) || !visible(el)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 12) small.add(`${size}px ${text.slice(0, 40)}`);
    else if (size < 14 && el.closest('p') && text.split(/\s+/).length > 12) under14.add(`${size}px ${text.slice(0, 40)}`);
  }
  small.forEach((item) => add('ERROR', 'text-size', item));
  [...under14].slice(0, 3).forEach((item) => add('WARN', 'text-size', item));

  // Tap targets
  const targets = [...document.querySelectorAll('a[href],button,[role=radio],[role=tab],summary,input:not([type=hidden]),select')].filter(visible);
  for (const el of targets) {
    const box = el.getBoundingClientRect();
    const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p,li,td,figcaption');
    if (!inline && (box.width < 44 || box.height < 44)) add('ERROR', 'tap-target', `${Math.round(box.width)}x${Math.round(box.height)} ${(el.getAttribute('aria-label') || el.innerText || el.tagName).trim().slice(0, 40)}`);
  }

  // First screen
  const h1 = document.querySelector('h1');
  if (!h1) add('ERROR', 'first-screen', 'no h1');
  else if (h1.getBoundingClientRect().top > foldBottom) add('ERROR', 'first-screen', 'h1 below the fold');
  const CTA = /book|claim|whatsapp|reserve|call|get started|explore|view|see|find|choose|buy|gift|join|read/i;
  const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
  const above = [...roots.flatMap((root) => [...root.querySelectorAll('a[href],button')])].filter(visible).filter((el) => {
    const box = el.getBoundingClientRect();
    return box.top >= header - 1 && box.bottom <= foldBottom + 1 && box.height >= 40 && CTA.test(el.innerText);
  });
  out.ctas = above.length;
  if (!above.length) add('ERROR', 'first-screen', 'no primary CTA above the fold');
  if (location.pathname === '/offers/november') {
    const fold = (sel) => [...document.querySelectorAll(sel)].some((el) => visible(el) && el.getBoundingClientRect().bottom <= foldBottom);
    // After the end date the page has no prices to show.
    if (document.querySelector('[data-nov-price]') && (!fold('[data-nov-price]') || !fold('[data-nov-saving]'))) add('ERROR', 'offers-first-screen', 'price and saving not both above the fold');
  }

  // Paragraphs
  const LINE = (el) => parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.5;
  for (const p of scope.filter((el) => el.tagName === 'P' && visible(el) && !el.closest('[data-article]'))) {
    const count = Math.round(p.getBoundingClientRect().height / LINE(p));
    if (count > 5) add('ERROR', 'paragraph', `${count} lines: ${p.innerText.slice(0, 50)}`);
    else if (count > 3) add('WARN', 'paragraph', `${count} lines: ${p.innerText.slice(0, 50)}`);
  }

  // Sections
  const sections = [...(main?.querySelectorAll('section') ?? [])].filter((el) => visible(el) && !el.parentElement.closest('section'));
  out.sections = sections.length;
  for (const section of sections) {
    const label = section.id || section.querySelector('h2,h1')?.innerText?.slice(0, 30) || 'section';
    const exempt = section.hasAttribute('data-gallery') || section.closest('[data-article]') || section.querySelector('[data-swipe]') || section.querySelector('details,[aria-expanded]') || section.id === 'offers' || section.id === 'faq';
    const screens = section.getBoundingClientRect().height / H;
    if (!exempt && screens > 1.5) add('ERROR', 'section-length', `${label} ${screens.toFixed(1)} screens`);
    else if (!exempt && screens > 1.2) add('WARN', 'section-length', `${label} ${screens.toFixed(1)} screens`);
    const count = words(section);
    if (!exempt && count > 120) add('ERROR', 'section-words', `${label} ${count} words`);
    else if (!exempt && count > 80) add('WARN', 'section-words', `${label} ${count} words`);
  }

  // Page length
  out.words = roots.reduce((sum, root) => sum + words(root), 0);
  out.screens = Number((roots.reduce((sum, root) => sum + root.getBoundingClientRect().height, 0) / H).toFixed(1));

  // Images
  for (const img of document.images) {
    if (!visible(img)) continue;
    if (img.complete && img.naturalWidth === 0 && img.loading !== 'lazy') add('ERROR', 'image', `broken: ${img.src.slice(-50)}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) add('ERROR', 'image', `no size: ${img.src.slice(-50)}`);
    const box = img.getBoundingClientRect();
    if (img.loading === 'lazy' && !img.closest('footer') && box.bottom < H && box.top >= 0 && box.left < W && box.right > 0) add('ERROR', 'image', `lazy above the fold: ${img.src.slice(-50)}`);
  }
  return out;
};

const endOfPage = () => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  return new Promise((done) => setTimeout(done, 350)).then(() => {
    const bar = [...document.querySelectorAll('nav[aria-label="Quick actions"]')].find((el) => el.getBoundingClientRect().height > 0 && getComputedStyle(el).display !== 'none');
    const fixed = [...document.querySelectorAll('body *')].filter((el) => {
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return style.position === 'fixed' && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && box.width > 30 && box.height > 30 && box.bottom > 0 && !el.closest('header') && !el.closest('nav[aria-label="Quick actions"]');
    });
    const problems = [];
    if (bar) {
      const top = bar.getBoundingClientRect().top;
      const last = [...document.querySelectorAll('footer a, footer p')].filter((el) => el.getBoundingClientRect().height > 0).pop();
      if (last && last.getBoundingClientRect().bottom > top + 1) problems.push(['ERROR', 'fixed-bar', 'covers the footer at the end of the page']);
      for (const el of fixed) {
        const box = el.getBoundingClientRect();
        if (box.bottom > top + 1 && box.top < window.innerHeight && el.getAttribute('role') !== 'dialog') problems.push(['ERROR', 'overlap', `${el.tagName} ${String(el.className).slice(0, 40)} overlaps the bar`]);
      }
    }
    return problems;
  });
};

const jobs = paths.flatMap((path) => WIDTHS.map((width) => ({ path, width })));
let next = 0;
const browser = await chromium.launch();

async function worker() {
  const contexts = new Map();
  for (let i = next++; i < jobs.length; i = next++) {
    const { path, width } = jobs[i];
    if (!contexts.has(width)) contexts.set(width, await browser.newContext({ viewport: { width, height: HEIGHT[width] ?? 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: UA }));
    const page = await contexts.get(width).newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.__cls = 0;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Not every browser reports layout shifts.
      }
    });
    try {
      await page.goto(`${base}${path}?today=${TODAY}`, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const result = await page.evaluate(measure);
      const end = await page.evaluate(endOfPage);
      await page.waitForTimeout(500);
      const cls = await page.evaluate(() => window.__cls);
      if (result.over > 0) report('ERROR', path, width, 'sideways-scroll', `+${result.over}px`);
      for (const [level, check, detail] of [...result.problems, ...end]) report(level, path, width, check, detail);
      if (cls > 0.1) report('ERROR', path, width, 'cls', cls.toFixed(3));
      else if (cls > 0.05) report('WARN', path, width, 'cls', cls.toFixed(3));
      for (const message of errors) report('ERROR', path, width, 'console', message);
      if (path === OFFERS_PAGE && (result.screens > 12 || result.words > 750)) report('ERROR', path, width, 'page-length', `${result.screens} screens, ${result.words} words`);
      if (path === '/' && result.screens > 18) report('WARN', path, width, 'page-length', `${result.screens} screens`);
      if (width === (WIDTHS.includes(375) ? 375 : WIDTHS[0])) table.set(path, result);
      if (SHOTS && width === 390) {
        mkdirSync('screenshots/mobile', { recursive: true });
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `screenshots/mobile/${path.replace(/^\/$/, 'home').replace(/^\//, '').replace(/\//g, '-')}.png`, fullPage: true });
      }
    } catch (error) {
      report('ERROR', path, width, 'load', error.message.split('\n')[0]);
    }
    await page.close();
  }
  for (const context of contexts.values()) await context.close();
}

await Promise.all(Array.from({ length: WORKERS }, worker));
await browser.close();
server.close();

// One line per problem, the same problem at several widths folded together.
const folded = new Map();
for (const line of lines) {
  const [level, url, width, check, ...rest] = line.split(/\s+/);
  const key = `${level} ${url} ${check} ${rest.join(' ')}`;
  (folded.get(key) ?? folded.set(key, []).get(key)).push(width);
}
const output = [...folded].sort().map(([key, widths]) => {
  const [level, url, check, ...rest] = key.split(' ');
  return `${level.padEnd(5)} ${url} ${widths.sort().join('/')} ${check} ${rest.join(' ')}`;
});
const count = (level) => output.filter((line) => line.startsWith(level)).length;
const byCheck = {};
for (const line of output) {
  const parts = line.split(/\s+/);
  byCheck[`${parts[0]} ${parts[3]}`] = (byCheck[`${parts[0]} ${parts[3]}`] ?? 0) + 1;
}
const summary = ['', `today=${TODAY} · ${paths.length} pages · ${count('ERROR')} errors · ${count('WARN')} warnings`, ...Object.entries(byCheck).sort().map(([key, value]) => `  ${String(value).padStart(5)}  ${key}`), '', 'page | words | screens | sections | CTAs above fold', ...[...table].sort().map(([path, r]) => `${path} | ${r.words} | ${r.screens} | ${r.sections} | ${r.ctas}`)];
const text = [...output, ...summary].join('\n');
console.log(text);
if (OUT) writeFileSync(OUT, `${text}\n`);
process.exit(count('ERROR') ? 1 : 0);
