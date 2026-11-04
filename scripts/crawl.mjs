// Final crawl of the build: every sitemap URL at 393 and 1440px (status, console errors, failed requests, mixed
// content), every old URL through its one redirect, and 393px screenshots of the key pages in reports/launch/<date>/.
//   node scripts/crawl.mjs   (after npm run build)
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve('dist');
const SITE = 'https://www.xingsalons.com';
const OUT = join('reports', 'launch', new Date().toISOString().slice(0, 10));
const SHOTS = ['/', '/offers', '/offers/hair-colour', '/offers/hair-treatment', '/offers/skin-care', '/salons/sarjapur-road', '/salons/hsr-layout', '/salons/brookfield', '/services/balayage'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };
// The host's redirects (dist/_redirects), answered the way Netlify and Cloudflare Pages do.
const redirects = new Map(readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((line) => line.startsWith('/') && !line.includes('*')).map((line) => line.trim().split(/\s+/).slice(0, 2)));

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
  if (redirects.has(path)) return res.writeHead(301, { Location: redirects.get(path) }).end();
  const file = extname(path) ? join(DIST, path) : path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  if (!resolve(file).startsWith(DIST + sep) || !existsSync(file) || !statSync(file).isFile()) return res.writeHead(404).end(readFileSync(join(DIST, '404.html')));
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
mkdirSync(OUT, { recursive: true });

const sitemap = [...(readFileSync(join(DIST, 'sitemap-pages.xml'), 'utf8') + readFileSync(join(DIST, 'sitemap-blog.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/');
const problems = [];
const browser = await chromium.launch();
for (const width of [393, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width < 1024 ? 852 : 900 } });
  await context.route(/googletagmanager|clarity|google\.com\/maps|maps\.google/, (route) => route.abort());
  const page = await context.newPage();
  for (const path of sitemap) {
    const errors = [];
    const onConsole = (msg) => msg.type() === 'error' && errors.push(msg.text());
    const onFail = (req) => !/googletagmanager|clarity|google\.com|\.mp4/.test(req.url()) && errors.push(`failed ${req.url()}`);
    page.on('console', onConsole);
    page.on('requestfailed', onFail);
    const response = await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const mixed = await page.evaluate(() => [...document.querySelectorAll('[src^="http:"],link[href^="http:"]')].length);
    if (response.status() !== 200) problems.push(`${width} ${path}: status ${response.status()}`);
    if (mixed) problems.push(`${width} ${path}: ${mixed} mixed-content resources`);
    for (const error of errors) problems.push(`${width} ${path}: ${error.slice(0, 120)}`);
    if (width === 393 && SHOTS.includes(path)) await page.screenshot({ path: join(OUT, `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '_')}-393.png`), fullPage: true });
    page.off('console', onConsole);
    page.off('requestfailed', onFail);
  }
  await context.close();
}
// Old addresses: one 301, then a 200.
let oldChecked = 0;
for (const [from, to] of redirects) {
  if (to.startsWith('http')) continue;
  oldChecked++;
  const first = await fetch(base + from, { redirect: 'manual' });
  const second = await fetch(base + (first.headers.get('location') ?? ''), { redirect: 'manual' });
  if (first.status !== 301 || second.status !== 200) problems.push(`old ${from}: ${first.status} → ${second.status}`);
}
await browser.close();
server.close();
for (const line of problems) console.log(line);
console.log(`${sitemap.length} sitemap URLs × 2 widths, ${oldChecked} old URLs · ${problems.length} problems · screenshots in ${OUT}`);
process.exit(problems.length ? 1 : 0);
