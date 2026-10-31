// Reads the built site in dist/ and prints one line per SEO problem: ERROR|WARN  <url>  <check>  <detail>, then a
// summary. Exits 1 on any ERROR. No network calls: external links are only listed, in seo-external-links.txt.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://www.xingsalons.com';
const problems = [];
const report = (level, url, check, detail = '') => problems.push({ level, url, check, detail: String(detail).replace(/\s+/g, ' ').slice(0, 160) });
const error = (...args) => report('ERROR', ...args);
const warn = (...args) => report('WARN', ...args);

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk(DIST);
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
const metaTag = (html, key, value) => html.match(new RegExp(`<meta\\s[^>]*${key}="${value}"[^>]*>`, 'i'))?.[0];
const metaContent = (html, key, value) => { const tag = metaTag(html, key, value); return tag ? attr(tag, 'content') : undefined; };
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');
const inDist = (href) => existsSync(join(DIST, decodeURI(href.split(/[?#]/)[0]).replace(/^\//, '')));

/** The page body: the first-paint shell plus the app root. */
function bodyOf(html) {
  const start = html.search(/<div id="(first-paint|root)"/);
  if (start === -1) return '';
  return html.slice(start, html.lastIndexOf('</body>')).replace(/<script[\s\S]*?<\/script>/gi, '');
}
const textOf = (html) => decode(html.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// ---------- what exists
const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.log('ERROR  /  build  dist/sitemap.xml is missing: run npm run build first');
  process.exit(1);
}
const sitemap = [...(readFileSync(join(DIST, 'sitemap-pages.xml'), 'utf8') + readFileSync(join(DIST, 'sitemap-blog.xml'), 'utf8')).matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(sitemap.map((loc) => loc.replace(SITE, '') || '/'));
const redirects = new Map(
  existsSync(join(DIST, '_redirects'))
    ? readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').filter((line) => / 301!?$/.test(line.trim()) && line.startsWith('/') && !/[*:]/.test(line)).map((line) => line.trim().split(/\s+/).slice(0, 2))
    : [],
);

const fileFor = (path) => (path === '/' ? join(DIST, 'index.html') : [join(DIST, path, 'index.html'), join(DIST, `${path}.html`)].find(existsSync));
const pages = new Map();
for (const path of sitemapPaths) {
  const file = fileFor(path);
  if (!file) {
    error(path, 'indexing', 'in the sitemap but has no HTML file');
    continue;
  }
  pages.set(path, { path, html: readFileSync(file, 'utf8') });
}
const notFound = fileFor('/404') ? readFileSync(fileFor('/404'), 'utf8') : '';

// ---------- each indexable page
const titles = new Map();
const descriptions = new Map();
const incoming = new Map([...pages.keys()].map((path) => [path, new Set()]));
const external = new Map();

for (const { path, html } of pages.values()) {
  const url = path === '/' ? SITE : `${SITE}${path}`;
  const head = html.slice(0, html.indexOf('</head>'));
  const body = bodyOf(html);

  // Indexing
  const robots = metaContent(head, 'name', 'robots');
  if (!/^index,\s*follow/.test(robots ?? '')) error(path, 'indexing', `robots is "${robots}"`);
  if (/http-equiv="refresh"/i.test(head)) error(path, 'indexing', 'sitemap URL is a redirect stub');
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) error(path, 'canonical', 'missing');
  else if (canonical.replace(/\/$/, '') !== url || (path !== '/' && canonical.endsWith('/')) || canonical.includes('?')) error(path, 'canonical', `${canonical} is not ${url}`);

  // Meta
  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const description = decode(metaContent(head, 'name', 'description') ?? '');
  if (title.length < 30 || title.length > 60) error(path, 'title', `${title.length} chars: ${title}`);
  if (description.length < 70 || description.length > 155) error(path, 'description', `${description.length} chars: ${description}`);
  (titles.get(title) ?? titles.set(title, []).get(title)).push(path);
  (descriptions.get(description) ?? descriptions.set(description, []).get(description)).push(path);
  for (const name of ['og:title', 'og:description', 'og:image', 'og:url']) if (!metaContent(head, 'property', name)) error(path, 'og', `${name} missing`);
  const ogImage = metaContent(head, 'property', 'og:image') ?? '';
  if (!ogImage.startsWith(`${SITE}/`)) error(path, 'og', `og:image is not absolute: ${ogImage}`);
  else if (!inDist(ogImage.replace(SITE, ''))) error(path, 'og', `og:image file missing: ${ogImage}`);
  if (canonical && metaContent(head, 'property', 'og:url') !== canonical) error(path, 'og', 'og:url differs from canonical');
  if (!metaContent(head, 'name', 'twitter:card')) error(path, 'twitter', 'twitter:card missing');
  if (!/<html[^>]*\slang="en-IN"/i.test(html)) error(path, 'lang', 'html lang is not en-IN');
  const viewport = metaContent(head, 'name', 'viewport') ?? '';
  if (!viewport.replace(/\s/g, '').startsWith('width=device-width,initial-scale=1') || /maximum-scale|user-scalable=no/.test(viewport)) error(path, 'viewport', viewport || 'missing');

  // Content
  const headings = [...body.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  const h1s = headings.filter((level) => level === 1).length;
  if (h1s !== 1) error(path, 'h1', `${h1s} h1 tags`);
  headings.forEach((level, i) => {
    if (i > 0 && level > headings[i - 1] + 1) error(path, 'headings', `h${headings[i - 1]} then h${level}`);
  });
  const words = textOf(body).split(' ').filter(Boolean).length;
  if (words < 150) error(path, 'content', `${words} words of visible text`);

  // Images
  const images = [...body.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);
  const preloaded = head.match(/<link rel="preload" as="image" href="([^"]+)"/)?.[1];
  let contentImages = 0;
  let lcpFound = false;
  for (const tag of images) {
    const src = attr(tag, 'src') ?? '';
    const alt = attr(tag, 'alt');
    const brand = src.startsWith('/brand/');
    if (!brand) contentImages += 1;
    if (alt === undefined) error(path, 'img', `no alt: ${src}`);
    else if (alt === '' && !/aria-hidden="true"|role="presentation"/.test(tag)) warn(path, 'img', `empty alt without aria-hidden: ${src}`);
    if (alt && alt.length > 125) warn(path, 'img', `alt ${alt.length} chars: ${src}`);
    if (alt && /image of|photo of/i.test(alt)) warn(path, 'img', `alt says "image of": ${alt}`);
    if (!attr(tag, 'width') || !attr(tag, 'height')) error(path, 'img', `no width/height: ${src}`);
    if (src.startsWith('/') && !inDist(src)) error(path, 'img', `file missing: ${src}`);
    // The first use of the preloaded file is the hero; the same photo further down the page may be lazy.
    const isLcp = !lcpFound && preloaded && (src === preloaded || attr(tag, 'srcset')?.includes(preloaded));
    if (isLcp) lcpFound = true;
    if (isLcp && /loading="lazy"/.test(tag)) error(path, 'img', `hero image is lazy: ${src}`);
    if (isLcp && !/fetchpriority="high"/i.test(tag)) error(path, 'img', `hero image has no fetchpriority=high: ${src}`);
    if (!isLcp && !brand && contentImages > 4 && !/loading="lazy"/.test(tag)) warn(path, 'img', `not lazy: ${src}`);
  }

  // Links
  const ids = new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const outgoing = new Set();
  for (const match of body.matchAll(/<a\s[^>]*?href="([^"]*)"/gi)) {
    const href = decode(match[1]);
    if (href === '' || href === '#' || /^javascript:/i.test(href)) {
      error(path, 'link', `bad href "${href}"`);
      continue;
    }
    if (/^(tel:|mailto:|sms:)/.test(href)) continue;
    if (/^http:\/\/(www\.)?xingsalons\.com|^https:\/\/xingsalons\.com/.test(href)) {
      error(path, 'link', `not the canonical host: ${href}`);
      continue;
    }
    if (/^https?:/.test(href) && !href.startsWith(SITE)) {
      if (!external.has(href)) external.set(href, path);
      continue;
    }
    const local = href.replace(SITE, '') || '/';
    if (local.startsWith('#')) {
      if (local.length > 1 && !ids.has(decodeURIComponent(local.slice(1).split('?')[0]))) error(path, 'link', `no element for ${local}`);
      continue;
    }
    const [target, hash] = local.split('#');
    const clean = target.split('?')[0] || '/';
    if (redirects.has(clean)) {
      error(path, 'link', `links to a redirect: ${clean} → ${redirects.get(clean)}`);
      continue;
    }
    if (clean !== '/' && clean.endsWith('/')) error(path, 'link', `trailing slash: ${clean}`);
    if (pages.has(clean)) {
      if (clean !== path) {
        incoming.get(clean).add(path);
        outgoing.add(clean);
      }
      if (hash) {
        const other = bodyOf(pages.get(clean).html);
        const id = decodeURIComponent(hash.split('?')[0]);
        // Sections that only exist after a tap (offer sheets) are opened by their own hash.
        if (!other.includes(`id="${id}"`) && !/^(hydra-facial|keratin|hair-colour|tuesday|nov-)/.test(id)) error(path, 'link', `${clean} has no #${id}`);
      }
    } else if (!inDist(clean)) error(path, 'link', `broken: ${href}`);
  }
  pages.get(path).outgoing = outgoing;

  // Schema
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodes = [];
  const collect = (value) => {
    if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') {
      if (value['@type']) nodes.push(value);
      Object.values(value).forEach(collect);
    }
  };
  for (const block of blocks) {
    try {
      collect(JSON.parse(block[1]));
    } catch (e) {
      error(path, 'schema', `does not parse: ${e.message}`);
    }
  }
  const types = (name) => nodes.filter((node) => [node['@type']].flat().includes(name));
  if (path !== '/' && !types('BreadcrumbList').length) error(path, 'schema', 'no BreadcrumbList');
  const about = path === '/' || path === '/about' || path.startsWith('/salons');
  if (!about && (types('AggregateRating').length || types('Review').length)) error(path, 'schema', 'rating or review on a page not about the salon');
  const visible = textOf(body).toLowerCase();
  for (const faq of types('FAQPage')) {
    for (const item of faq.mainEntity ?? []) {
      const question = decode(item.name).replace(/\s+/g, ' ').toLowerCase();
      const answer = decode(item.acceptedAnswer?.text ?? '').replace(/\s+/g, ' ').toLowerCase();
      if (!visible.includes(question)) error(path, 'schema', `FAQ question not on the page: ${item.name}`);
      else if (!visible.includes(answer)) warn(path, 'schema', `FAQ answer not in the HTML: ${item.name}`);
    }
  }
  for (const salon of [...types('HairSalon'), ...types('BeautySalon')].filter((node) => node.address)) {
    for (const field of ['address', 'telephone', 'openingHoursSpecification']) if (!salon[field]) error(path, 'schema', `${salon['@id'] ?? salon.name} has no ${field}`);
    if (!salon.geo) warn(path, 'schema', `${salon['@id'] ?? salon.name} has no geo`);
  }
  if (path.startsWith('/blog/') && !path.startsWith('/blog/category')) {
    const post = types('BlogPosting')[0];
    if (!post) error(path, 'schema', 'no BlogPosting');
    else for (const field of ['datePublished', 'dateModified', 'author', 'image']) if (!post[field]) error(path, 'schema', `BlogPosting has no ${field}`);
  }

  // Weight
  const kb = Buffer.byteLength(html) / 1024;
  if (kb > 150) warn(path, 'weight', `HTML ${Math.round(kb)} KB`);
  for (const match of head.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"/g)) if (!inDist(match[1])) error(path, 'weight', `preloads a missing file: ${match[1]}`);
}

// ---------- across pages
for (const [title, paths] of titles) if (paths.length > 1) error(paths.join(' '), 'title', `duplicate: ${title}`);
for (const [description, paths] of descriptions) if (paths.length > 1) error(paths.join(' '), 'description', `duplicate: ${description.slice(0, 80)}`);
for (const [path, from] of incoming) if (path !== '/' && from.size < 3) warn(path, 'internal-links', `${from.size} incoming`);
for (const page of pages.values()) if ((page.outgoing?.size ?? 0) < 3) warn(page.path, 'internal-links', `${page.outgoing?.size ?? 0} outgoing`);

if (notFound && !/name="robots" content="noindex/.test(notFound)) error('/404', 'indexing', 'not noindex');
if (sitemapPaths.has('/404')) error('/404', 'indexing', 'in the sitemap');

// Every other HTML file: a redirect stub (noindex) or the same page's other address.
for (const file of files.filter((name) => name.endsWith('.html'))) {
  const rel = `/${relative(DIST, file).split(sep).join('/')}`;
  const path = rel.replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
  if (pages.has(path) || path === '/404') continue;
  const html = readFileSync(file, 'utf8');
  if (!/http-equiv="refresh"/i.test(html)) error(path, 'indexing', 'HTML page missing from the sitemap');
  else if (!/name="robots" content="noindex/.test(html)) warn(path, 'indexing', 'redirect stub without noindex');
}
for (const page of pages.keys()) if (page !== '/' && existsSync(join(DIST, page, 'index.html')) && existsSync(join(DIST, `${page}.html`))) warn(page, 'duplicate-file', 'written as both x.html and x/index.html');

for (const file of files) {
  const kb = statSync(file).size / 1024;
  if (/\.(webp|jpe?g|png|avif)$/i.test(file) && kb > 200) warn(`/${relative(DIST, file).split(sep).join('/')}`, 'weight', `image ${Math.round(kb)} KB`);
}

const robotsFile = join(DIST, 'robots.txt');
const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8') : '';
if (!/Disallow:\s*\/api\//.test(robots)) error('/robots.txt', 'robots', 'does not disallow /api/');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) error('/robots.txt', 'robots', 'no Sitemap line');
if (/Disallow:\s*\/(assets|images)/.test(robots)) error('/robots.txt', 'robots', 'blocks assets or images');

// ---------- output
mkdirSync('reports', { recursive: true });
writeFileSync('reports/seo-external-links.txt', [...external].sort().map(([href, from]) => `${href}  (e.g. ${from})`).join('\n') + '\n');
problems.sort((a, b) => a.level.localeCompare(b.level) || a.check.localeCompare(b.check) || a.url.localeCompare(b.url));
for (const { level, url, check, detail } of problems) console.log(`${level.padEnd(5)}  ${url}  ${check}  ${detail}`);
const count = (level) => problems.filter((problem) => problem.level === level).length;
const byCheck = {};
for (const { level, check } of problems) byCheck[`${level} ${check}`] = (byCheck[`${level} ${check}`] ?? 0) + 1;
console.log(`\n${pages.size} indexable pages · ${count('ERROR')} errors · ${count('WARN')} warnings · ${external.size} external links (reports/seo-external-links.txt)`);
for (const [key, value] of Object.entries(byCheck).sort()) console.log(`  ${String(value).padStart(5)}  ${key}`);
process.exit(count('ERROR') ? 1 : 0);
