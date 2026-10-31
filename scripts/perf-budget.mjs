// Per-route weight budget. Reads each built page and what it asks for up front, and fails on any breach.
//   node scripts/perf-budget.mjs [--out=perf-budget.md]
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KB = 1024;
const BUDGET = { html: 40, homeHtml: 55, js: 110, entry: 70, css: 18, images: 30, homeImages: 40, fonts: 3, fontKb: 90 };
const DIST = 'dist';
const SITE = 'https://www.xingsalons.com';
const gz = (buffer) => gzipSync(buffer, { level: 9 }).length;
const br = (buffer) => brotliCompressSync(buffer).length;
const file = (href) => readFileSync(join(DIST, href.replace(/^\//, '').split(/[?#]/)[0]));
const cached = new Map();
const size = (href) => {
  if (!cached.has(href)) cached.set(href, existsSync(join(DIST, href.replace(/^\//, ''))) ? gz(file(href)) : 0);
  return cached.get(href);
};
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const paths = [...new Set(walk(DIST).filter((f) => f.endsWith('sitemap-pages.xml') || f.endsWith('sitemap-blog.xml')).flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])))]
  .filter((loc) => !loc.endsWith('.xml'))
  .map((loc) => loc.replace(SITE, '') || '/');

const rows = [];
const breaches = [];
for (const path of paths) {
  const html = readFileSync(path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`));
  const text = html.toString();
  const entry = text.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1];
  const preloads = [...text.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const css = [...text.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const inline = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce((sum, m) => sum + gz(Buffer.from(m[1])), 0);
  const fonts = [...text.matchAll(/<link rel="preload" as="font"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const row = {
    path,
    html: gz(html) / KB,
    htmlBr: br(html) / KB,
    entry: (entry ? size(entry) : 0) / KB,
    js: ([entry, ...preloads].filter(Boolean).reduce((sum, href) => sum + size(href), 0)) / KB,
    preloads: preloads.length,
    // Render-blocking CSS: anything loaded with media="print" onload isn't.
    css: (css.reduce((sum, href) => sum + (new RegExp(`href="${href}"[^>]*media="print"|media="print"[^>]*href="${href}"`).test(text) ? 0 : size(href)), 0) + inline) / KB,
    images: (text.match(/<img\s/g) ?? []).length,
    fonts: fonts.length,
    fontKb: fonts.reduce((sum, href) => sum + file(href).length, 0) / KB,
  };
  rows.push(row);
  const home = path === '/';
  const over = (name, value, limit) => value > limit && breaches.push(`ERROR ${path} ${name} ${value.toFixed(1)} over ${limit}`);
  over('html-gzip', row.html, home ? BUDGET.homeHtml : BUDGET.html);
  over('js-gzip', row.js, BUDGET.js);
  over('entry-gzip', row.entry, BUDGET.entry);
  over('css-gzip', row.css, BUDGET.css);
  over('images', row.images, home ? BUDGET.homeImages : BUDGET.images);
  over('fonts', row.fonts, BUDGET.fonts);
  over('font-kb', row.fontKb, BUDGET.fontKb);
}

rows.sort((a, b) => b.html - a.html);
const f = (n) => n.toFixed(1);
const table = ['| Route | HTML gz | HTML br | JS gz (entry) | Preloads | CSS gz | `<img>` | Fonts (KB) |', '| --- | --- | --- | --- | --- | --- | --- | --- |', ...rows.map((r) => `| \`${r.path}\` | ${f(r.html)} | ${f(r.htmlBr)} | ${f(r.js)} (${f(r.entry)}) | ${r.preloads} | ${f(r.css)} | ${r.images} | ${r.fonts} (${f(r.fontKb)}) |`)];
const byName = {};
for (const breach of breaches) byName[breach.split(' ')[2]] = (byName[breach.split(' ')[2]] ?? 0) + 1;
console.log(breaches.slice(0, 60).join('\n'));
console.log(`\n${rows.length} routes · ${breaches.length} breaches · ${JSON.stringify(byName)}`);
console.log(table.slice(0, 8).join('\n'));
const target = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1];
if (target) writeFileSync(target, `${table.join('\n')}\n`);
process.exit(breaches.length ? 1 : 0);
