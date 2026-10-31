// The 20-point SEO / AEO / GEO checklist. Reads dist/ and prints PASS|FAIL|MANUAL <#> <item> <evidence>.
// Exits 1 on any FAIL. Item 17 and 18 read the latest reports; run mobile:audit and perf:budget first.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

const SITE = 'https://www.xingsalons.com';
const load = async (entry) => {
  mkdirSync('node_modules/.cache', { recursive: true });
  const outfile = join('node_modules/.cache', `${entry.replace(/\W+/g, '-')}.mjs`);
  buildSync({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'silent' });
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
};
const { locations } = await load('src/data/branches.ts');
const { ENTITY_DESCRIPTION } = await load('src/data/style.ts');

const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');
const textOf = (html) => decode(html.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const fileFor = (path) => (path === '/' ? 'dist/index.html' : `dist${path}.html`);
const locs = (name) => [...read(`dist/sitemap-${name}.xml`).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/');
const pagesList = locs('pages');
const blogList = locs('blog');
const all = [...pagesList, ...blogList];
const html = new Map(all.map((path) => [path, read(fileFor(path))]));
const bodyOf = (page) => page.slice(Math.max(0, page.search(/<div id="(first-paint|root)"/)));
const ldOf = (page) => {
  const nodes = [];
  const walk = (value) => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') {
      if (value['@type']) nodes.push(value);
      Object.values(value).forEach(walk);
    }
  };
  for (const m of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) walk(JSON.parse(m[1]));
  return nodes;
};
const typeIs = (node, name) => [node['@type']].flat().includes(name);
const rows = [];
const add = (num, item, misses, evidence = '') => rows.push({ status: misses.length ? 'FAIL' : 'PASS', num, item, detail: misses.length ? `${misses.length}: ${misses.slice(0, 4).join(' · ').slice(0, 170)}` : evidence });
const manual = (num, item, detail) => rows.push({ status: 'MANUAL', num, item, detail });

// 1 Blogs
{
  const posts = blogList.filter((path) => !path.startsWith('/blog/category') && path !== '/blog');
  const misses = [];
  const written = readdirSync('content/blog').filter((file) => file.endsWith('.md')).length;
  if (written < 40) misses.push(`${written} posts written, 40 needed`);
  if (posts.length < 40) manual(1, 'Blogs live', `${posts.length} live now, ${written - posts.length} scheduled through Jan 2027; they publish on rebuilds`);
  for (const path of posts) {
    const page = html.get(path);
    const body = bodyOf(page);
    const text = textOf(body);
    const need = [];
    if (!/Key takeaways/i.test(text)) need.push('takeaways');
    if ([...body.matchAll(/<h2[\s\S]*?<\/h2>/gi)].filter((m) => textOf(m[0]).includes('?')).length < 3) need.push('3 question H2s');
    if (!ldOf(page).some((n) => typeIs(n, 'FAQPage'))) need.push('FAQ');
    const post = ldOf(page).find((n) => typeIs(n, 'BlogPosting'));
    if (!post?.publisher || !post?.author || !post?.datePublished || !post?.dateModified || !post?.image) need.push('BlogPosting fields');
    const article = body.match(/<article[\s\S]*<\/article>/i)?.[0] ?? body;
    if (new Set([...article.matchAll(/href="\/services\/([a-z-]+)/g)].map((m) => m[1])).size < 2) need.push('2 service links');
    if (new Set([...article.matchAll(/href="\/blog\/([a-z-]+)/g)].map((m) => m[1])).size < 2) need.push('2 post links');
    if (!/Bangalore/.test(text) || !/Sarjapur|HSR|Brookfield/.test(text)) need.push('local paragraph');
    if (need.length) misses.push(`${path.slice(6)}: ${need.join(', ')}`);
  }
  add(1, 'SEO / AEO / GEO blogs', misses, `${posts.length} posts`);
}
// 2 Local schema
{
  const misses = [];
  for (const path of ['/', '/salons', ...locations.map((l) => l.path), '/about']) {
    const nodes = ldOf(html.get(path) ?? '');
    for (const loc of locations) {
      const node = nodes.find((n) => n['@id'] === `${SITE}/salons/${loc.id}#salon` && n.name);
      if (!node) { misses.push(`${path} lacks ${loc.id}`); continue; }
      if (node.name !== loc.fullName || !node.telephone || !node.geo || !node.openingHoursSpecification || !node.parentOrganization) misses.push(`${path} ${loc.id} fields`);
    }
    if (nodes.some((n) => typeIs(n, 'AggregateRating') || typeIs(n, 'Review'))) misses.push(`${path} rating markup`);
  }
  add(2, 'Local schema', misses, '3 salons on 6 pages');
}
// 3 Map
{
  const home = bodyOf(html.get('/'));
  const misses = [];
  if (!/id="map"/.test(home)) misses.push('no #map section');
  if (/<iframe/i.test(home)) misses.push('iframe in first HTML');
  add(3, 'Google Map on the main page', misses, 'facade, no iframe in HTML');
}
// 4–6 Tags: the code paths, gated by env
{
  const tags = read('src/lib/tags.ts') + read('vite.config.ts');
  add(4, 'Microsoft Clarity', [!/VITE_CLARITY_ID/.test(tags) && 'no loader', !/consentv2/.test(tags) && 'no consent call'].filter(Boolean), 'gated by VITE_CLARITY_ID, after consent');
  add(5, 'Google Tag Manager', [!/VITE_GTM_ID/.test(tags) && 'no loader', !/googletagmanager\.com\/ns\.html/.test(tags) && 'no noscript', !/'consent', 'default'/.test(tags) && 'no consent defaults'].filter(Boolean), 'gated by VITE_GTM_ID, consent first');
  add(6, 'Google Analytics 4', [!/VITE_GA4_ID/.test(tags) && 'no direct gtag', !/generate_lead/.test(read('src/lib/analytics.ts')) && 'no GA4 events'].filter(Boolean), 'through GTM, or gtag if no GTM');
}
// 7 Sitemap
{
  const index = read('dist/sitemap.xml');
  const misses = [];
  if (!index.includes('<sitemapindex')) misses.push('not an index');
  for (const name of ['pages', 'blog', 'images']) if (!index.includes(`sitemap-${name}.xml`) || !existsSync(`dist/sitemap-${name}.xml`)) misses.push(name);
  add(7, 'XML sitemap', misses, `${all.length} URLs`);
  manual(7, 'Search Console', 'domain verification and submitting the sitemap');
}
// 8 Indexing
{
  const misses = [];
  for (const [path, page] of html) {
    const head = page.slice(0, page.indexOf('</head>'));
    if (!/name="robots" content="index,follow"/.test(head)) misses.push(`${path} robots`);
    if (/http-equiv="refresh"/.test(head)) misses.push(`${path} redirect`);
    if ((bodyOf(page).match(/<h1[\s>]/g) ?? []).length !== 1) misses.push(`${path} h1`);
    if (textOf(bodyOf(page)).split(' ').length < 150) misses.push(`${path} thin`);
  }
  add(8, 'Indexing', misses, `${html.size} pages`);
  manual(8, 'Request indexing', 'URL Inspection in Search Console');
}
// 9 robots
{
  const robots = read('dist/robots.txt');
  const misses = ['Allow: /', 'Disallow: /api/', `Sitemap: ${SITE}/sitemap.xml`, 'llms.txt', 'User-agent: ClaudeBot', 'User-agent: OAI-SearchBot'].filter((line) => !robots.includes(line));
  if (/Disallow: \/(assets|images)/.test(robots)) misses.push('blocks assets');
  add(9, 'robots.txt', misses, 'AI crawlers, API blocked');
}
// 10 llms
{
  const llms = read('dist/llms.txt');
  const misses = [];
  if (!existsSync('dist/llms-full.txt')) misses.push('no llms-full');
  if (!llms.includes(ENTITY_DESCRIPTION)) misses.push('no entity description');
  if (!/Last updated/.test(llms)) misses.push('no date');
  for (const loc of locations) for (const value of [loc.fullName, loc.phone, loc.hours.label, loc.mapsUrl]) if (!llms.includes(value)) misses.push(value);
  add(10, 'llms.txt', misses, 'generated from data');
}
// 11 Site-wide JSON-LD
{
  const misses = [];
  for (const [path, page] of html) {
    const head = page.slice(0, page.indexOf('</head>'));
    const nodes = ldOf(head);
    if (!/application\/ld\+json/.test(head)) misses.push(`${path} none`);
    for (const need of ['Organization', 'WebSite', 'WebPage']) if (!nodes.some((n) => typeIs(n, need) && n['@id'])) misses.push(`${path} ${need}`);
    if (path !== '/' && !nodes.some((n) => typeIs(n, 'BreadcrumbList'))) misses.push(`${path} breadcrumb`);
    const org = nodes.find((n) => typeIs(n, 'Organization') && n['@id'] === `${SITE}/#organization` && n.name);
    if (org && (!org.foundingDate || org.description !== ENTITY_DESCRIPTION || !org.sameAs?.length)) misses.push(`${path} organization fields`);
  }
  add(11, 'Site-wide JSON-LD', misses, 'every page');
}
// 12 NAP
{
  const misses = [];
  for (const [path, page] of html) {
    const footer = page.match(/<footer[\s\S]*<\/footer>/i)?.[0] ?? '';
    const text = textOf(footer);
    for (const loc of locations) if (!text.includes(loc.fullName) || !text.includes(loc.address) || !text.includes(loc.phone)) misses.push(`${path} footer ${loc.id}`);
  }
  if (!/data-utility-bar/.test(html.get('/'))) misses.push('no desktop utility bar');
  add(12, 'NAP in header and footer', misses, 'footer on every page');
}
// 13 FAQ on core pages
{
  const core = pagesList.filter((path) => !['/salons', '/privacy'].includes(path) && !path.startsWith('/blog'));
  const misses = [];
  for (const path of core) {
    const page = html.get(path);
    const faq = ldOf(page).filter((n) => typeIs(n, 'FAQPage'));
    if (faq.length !== 1) { misses.push(`${path} has ${faq.length} FAQPage`); continue; }
    const text = textOf(bodyOf(page)).toLowerCase();
    for (const q of faq[0].mainEntity ?? []) if (!text.includes(decode(q.name).toLowerCase())) misses.push(`${path}: ${q.name}`);
  }
  add(13, 'FAQ on core pages', misses, `${core.length} pages`);
}
// 14 H1
{
  const misses = [];
  for (const [path, page] of html) {
    if (path.startsWith('/blog')) continue;
    const h1 = textOf(page.match(/<h1[\s\S]*?<\/h1>/i)?.[0] ?? '');
    if (!/Bangalore|HSR|Sarjapur|Brookfield/.test(h1)) misses.push(`${path}: ${h1}`);
  }
  add(14, 'Keyword and place in the H1', misses, 'all core pages');
}
// 15 CTAs
{
  const misses = [];
  for (const [path, page] of html) if (!/data-cta="/.test(bodyOf(page))) misses.push(path);
  add(15, 'Clear CTAs', misses, 'data-cta on every page; size and fold in mobile:audit');
}
// 16 Conversational copy
{
  const misses = [];
  for (const path of pagesList.filter((p) => /^\/services\/./.test(p) && !/hair-care|skin-body|nail-care/.test(p)).concat(locations.map((l) => l.path))) {
    const body = bodyOf(html.get(path));
    if (!/Quick answers/.test(body)) misses.push(`${path} quick answers`);
    if ([...body.matchAll(/<(h2|h3|dt)[\s\S]*?<\/\1>/gi)].filter((m) => textOf(m[0]).includes('?')).length < 3) misses.push(`${path} questions`);
  }
  add(16, 'Conversational copy', misses, 'Quick answers on service and salon pages');
}
// 17–18 Reports
const latest = (dir) => {
  if (!existsSync(dir)) return '';
  const files = readdirSync(dir).map((name) => join(dir, name)).filter((file) => statSync(file).isFile()).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return files[0] ? read(files[0]) : '';
};
{
  const mobile = latest('reports/mobile-audit');
  const m = mobile.match(/· (\d+) errors/);
  add(17, 'Mobile-first responsive', !m ? ['no report: run mobile:audit --out=reports/mobile-audit/latest.txt'] : m[1] === '0' ? [] : [`${m[1]} errors`], '0 errors');
  const perf = latest('reports/perf-budget');
  const p = perf.match(/(\d+) breaches/);
  add(18, 'Fast Core Web Vitals', !p ? ['no report: run perf:budget --out=reports/perf-budget/latest.txt'] : p[1] === '0' ? [] : [`${p[1]} budget breaches`], 'budget passes');
}
// 19 HTTPS
{
  const misses = [];
  if (!/Strict-Transport-Security/.test(read('dist/_headers'))) misses.push('no HSTS in _headers');
  if (!/^http:\/\/xingsalons\.com/m.test(read('dist/_redirects'))) misses.push('no http redirect');
  for (const [path, page] of html) if (/(href|src)="http:\/\/(www\.)?xingsalons/.test(page)) misses.push(path);
  add(19, 'HTTPS', misses, 'HSTS and redirects');
  manual(19, 'Certificate', 'issued by the host');
}
// 20 Canonical
{
  const misses = [];
  for (const [path, page] of html) {
    const url = path === '/' ? SITE : `${SITE}${path}`;
    const canonical = page.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.replace(/\/$/, '');
    if (canonical !== url) misses.push(`${path}: ${canonical}`);
  }
  add(20, 'Canonical', misses, 'self-canonical everywhere');
}

rows.sort((a, b) => a.num - b.num);
const out = rows.map((row) => `${row.status.padEnd(6)} ${String(row.num).padStart(2)} ${row.item}  ${row.detail}`);
const count = (status) => rows.filter((row) => row.status === status).length;
out.push('', `${count('PASS')} pass · ${count('FAIL')} fail · ${count('MANUAL')} manual`);
const target = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1];
if (target) {
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, `${out.join('\n')}\n`);
}
console.log(out.join('\n'));
process.exit(count('FAIL') ? 1 : 0);
