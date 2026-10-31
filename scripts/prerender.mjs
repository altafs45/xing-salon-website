// Post-build prerender. Opens every page in a headless browser and writes what it renders into that page's HTML,
// inside <div id="root">, so the content is there without JavaScript. Nothing else in the file changes: the <head>
// the SEO plugin wrote stays byte for byte. Fails the build if a page renders no <h1>.
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve('dist');
const SITE = 'https://www.xingsalons.com';
const EMPTY_ROOT = '<div id="root"></div>';
const WORKERS = 4;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };

const pageFiles = (path) => (path === '/' ? [join(DIST, 'index.html')] : [join(DIST, `${path}.html`), join(DIST, path, 'index.html')].filter(existsSync));

/** The built files as a host would serve them, read fresh so one page's snapshot can't leak into another. */
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
  const file = extname(path) ? join(DIST, path) : pageFiles(path)[0];
  if (!file || !resolve(file).startsWith(DIST + sep) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;

const paths = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/');
paths.push('/404');

const browser = await chromium.launch();
const failures = [];
let next = 0;

async function worker() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (let i = next++; i < paths.length; i = next++) {
    const path = paths[i];
    try {
      await page.goto(`${base}${path}?prerender=1`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('h1'), null, { timeout: 15_000 });
      const html = await page.evaluate(() => {
        // Anything still waiting for its entrance animation would be saved as hidden.
        for (const el of document.querySelectorAll('#root [style]')) {
          if (el.style.opacity === '0' && getComputedStyle(el).position !== 'absolute') {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
        }
        return document.querySelector('#root').innerHTML;
      });
      for (const file of pageFiles(path)) {
        const source = readFileSync(file, 'utf8');
        if (!source.includes(EMPTY_ROOT)) throw new Error(`no empty root in ${file}`);
        writeFileSync(file, source.replace(EMPTY_ROOT, () => `<div id="root">${html}</div>`));
      }
    } catch (error) {
      failures.push(`${path}: ${error.message.split('\n')[0]}`);
    }
  }
  await context.close();
}

await Promise.all(Array.from({ length: WORKERS }, worker));
await browser.close();
server.close();

if (failures.length) {
  console.error(`Prerender failed on ${failures.length} of ${paths.length} pages:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Prerendered ${paths.length} pages.`);
