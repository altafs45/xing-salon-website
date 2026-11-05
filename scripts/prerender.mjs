// Post-build prerender. Opens every page in a headless browser and writes what it renders into that page's HTML,
// inside <div id="root">, so the content is there without JavaScript. Nothing else in the file changes: the <head>
// the SEO plugin wrote stays byte for byte. Fails the build if a page renders no <h1>.
import { createServer } from 'node:http';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve('dist');
const SITE = 'https://www.xingsalons.com';
// The page's root: empty, or holding the dev skeleton (index.html), which the snapshot replaces.
const ROOT = /<div id="root">(?:<!--skeleton-->[\s\S]*?<!--\/skeleton-->)?\s*<\/div>/;
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

// Pages without the app's root (the old offer pages from public/) are complete as they are and are left alone.
const paths = [...(readFileSync(join(DIST, 'sitemap-pages.xml'), 'utf8') + readFileSync(join(DIST, 'sitemap-blog.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(SITE, '') || '/')
  .filter((path) => pageFiles(path).some((file) => readFileSync(file, 'utf8').includes('<div id="root">')));
paths.push('/404');

const snapshot = new Date().toISOString();
const browser = await chromium.launch();
const failures = [];
let next = 0;

async function worker() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (let i = next++; i < paths.length; i = next++) {
    const path = paths[i];
    try {
      await page.goto(`${base}${path}?prerender=${snapshot}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('h1'), null, { timeout: 15_000 });
      const html = await page.evaluate(() => {
        // Anything still waiting for its entrance animation would be saved as hidden.
        for (const el of document.querySelectorAll('#root [style]')) {
          if (el.style.opacity === '0' && getComputedStyle(el).position !== 'absolute') {
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
          }
        }
        // React renders "{count} reviews" as two text nodes, which the HTML would merge into one: hydration needs
        // them apart, so they are marked as React's own server render marks them.
        const walker = document.createTreeWalker(document.querySelector('#root'), NodeFilter.SHOW_TEXT);
        const joined = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.previousSibling?.nodeType === Node.TEXT_NODE) joined.push(node);
        for (const node of joined) node.before(document.createComment(' '));
        // Inline styles as React writes them ("a:b;c:d"), so hydration finds what it expects.
        for (const el of document.querySelectorAll('#root [style]')) {
          const style = [...el.style].map((name) => `${name}:${el.style.getPropertyValue(name)}`).join(';');
          if (style) el.setAttribute('style', style);
          else el.removeAttribute('style');
        }
        // And each Suspense boundary's <!--$--> … <!--/$--> (src/components/ui/Boundary.tsx).
        for (const mark of document.querySelectorAll('#root template[data-boundary]')) mark.replaceWith(document.createComment(mark.dataset.boundary === 'start' ? '$' : '/$'));
        return document.querySelector('#root').innerHTML;
      });
      for (const file of pageFiles(path)) {
        const source = readFileSync(file, 'utf8');
        if (!ROOT.test(source)) throw new Error(`no empty root in ${file}`);
        // The time it was taken, so hydration renders the same countdowns and day as the HTML (src/lib/hydration.ts).
        writeFileSync(file, source.replace(ROOT, () => `<div id="root" data-snapshot="${snapshot}">${html}</div>`));
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

// Static hosts such as Hostinger do not apply Vercel's cleanUrls behaviour.
// Mirror each generated foo.html page as foo/index.html so /foo and /foo/
// work without any server rewrite configuration.
for (const path of paths) {
  if (path === '/') continue;
  const source = join(DIST, `${path}.html`);
  const destination = join(DIST, path, 'index.html');
  if (existsSync(source)) {
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(source, destination);
  }
}

console.log(`Prerendered ${paths.length} pages.`);
