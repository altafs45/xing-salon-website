// Checks the site says everything one way. Scans the source and the built pages' visible text and prints
// ERROR|WARN <file or url> <check> <detail>, then counts. Exits 1 on any ERROR. The rules live in src/data/style.ts.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

/** Loads a TypeScript data file. */
async function load(entry) {
  mkdirSync('node_modules/.cache', { recursive: true });
  const outfile = join('node_modules/.cache', `${entry.replace(/\W+/g, '-')}.mjs`);
  buildSync({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'silent' });
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}
const style = await load('src/data/style.ts');
const data = await load('src/data/branches.ts');
const offers = await load('src/data/offers.ts');

const walk = (dir, test) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path, test) : test(path) ? [path] : [];
});
const problems = [];
const report = (level, where, check, detail = '') => problems.push({ level, where, check, detail: String(detail).replace(/\s+/g, ' ').slice(0, 130) });

const decode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');
const bodyOf = (html) => {
  const start = html.search(/<div id="(first-paint|root)"/);
  return html.slice(start, html.lastIndexOf('</body>')).replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
};
const textOf = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const pages = walk('dist', (file) => file.endsWith('.html'))
  .map((file) => ({ url: `/${relative('dist', file).split(sep).join('/')}`.replace(/\.html$/, '').replace(/\/index$/, '') || '/', html: readFileSync(file, 'utf8') }))
  .filter(({ html }) => !/http-equiv="refresh"/.test(html));
const indexable = pages.filter(({ html }) => /name="robots" content="index/.test(html));

// What may legitimately carry a wrong-looking form.
const allowed = (text) => {
  let out = text;
  for (const loc of data.locations) out = out.split(loc.fullName).join(' ').split(loc.address).join(' ');
  return out.replace(/[^.;|]*\bBengaluru,? Karnataka[^.;|]*/g, ' ').replace(/Xing Premium Tattoo Studio|xingsalons?\.[a-z]+|© 2026[^.]*\./gi, ' ');
};

// ---------- Vocabulary in the built text
const rules = style.VOCABULARY.map((rule) => ({ ...rule, re: new RegExp(rule.wrong, `g${rule.flags ?? ''}`) }));
for (const { url, html } of pages) {
  const text = allowed(textOf(bodyOf(html)));
  const head = html.slice(0, html.indexOf('</head>'));
  const meta = decode(`${head.match(/<title>([^<]*)/)?.[1] ?? ''} ${head.match(/name="description" content="([^"]*)/)?.[1] ?? ''}`);
  for (const rule of rules) {
    const found = new Set([...`${text} ${meta}`.matchAll(rule.re)].map((m) => m[0]));
    for (const form of found) report('ERROR', url, `vocabulary-${rule.check}`, `"${form}" → ${rule.use}`);
  }
}

// ---------- Vocabulary in the source: copy strings only, so code and class names stay out of it.
const sources = [...walk('src/data', (f) => f.endsWith('.ts') && !f.endsWith('style.ts')), ...walk('content/blog', (f) => f.endsWith('.md'))];
for (const file of sources) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*|import )/.test(line)) return;
    const copy = file.endsWith('.md') ? line : [...line.matchAll(/(['`"])((?:(?!\1).)*[a-z] [a-z](?:(?!\1).)*)\1/g)].map((m) => m[2]).join(' ');
    const clean = allowed(copy).replace(/https?:\S+|\/[a-z-]+\/[a-z-/]+|\/services\/\S+|\/images\/\S+|\btext-\S+|\bbg-\S+|[\w-]+-(color|center)\b[\w-]*/g, ' ');
    for (const rule of rules) for (const m of clean.matchAll(rule.re)) report('ERROR', `${file.split(sep).join('/')}:${i + 1}`, `source-${rule.check}`, `"${m[0]}" → ${rule.use}`);
  });
}

// ---------- Button labels
const wrongCta = new Set(style.WRONG_CTA);
for (const { url, html } of pages) {
  const seen = new Set();
  for (const m of bodyOf(html).matchAll(/<(a|button)\s[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const label = textOf(m[2].replace(/<span class="sr-only">[\s\S]*?<\/span>/g, ''));
    if (wrongCta.has(label) && !seen.has(label)) {
      seen.add(label);
      report('ERROR', url, 'cta', `"${label}"`);
    }
  }
}

// ---------- Facts
const phones = new Set(data.locations.flatMap((loc) => [loc.phone.replace(/\D/g, ''), loc.whatsappHref.replace(/\D/g, '')]));
phones.add('917004708826');
for (const file of ['src/data/fitness.ts', 'src/data/pages/tattoo.ts']) for (const m of readFileSync(file, 'utf8').matchAll(/(\d{5}) ?(\d{5})/g)) phones.add(`91${m[1]}${m[2]}`);
const money = new Set(offers.novemberCampaign.offers.flatMap((offer) => offer.lines.flatMap((line) => [line.now, line.was, line.was - line.now])));
for (const count of [6, 8, 10]) money.add(offers.streakCost(count));
const percents = new Set(offers.novemberCampaign.offers.flatMap((offer) => offer.lines.map((line) => offers.savingPercent(line))));
for (const file of ['src/data/offers.ts', 'src/data/giftMembership.ts', 'src/data/pages/tattoo.ts']) for (const m of readFileSync(file, 'utf8').matchAll(/\d+%/g)) percents.add(m[0]);
for (const { url, html } of pages) {
  if (url.startsWith('/blog/') && !url.startsWith('/blog/category')) continue;
  const text = textOf(bodyOf(html).replace(/<footer[\s\S]*<\/footer>/i, ' '));
  for (const m of text.matchAll(/(?:\+91|\b0)[ -]?\d{5}[ -]?\d{5}\b/g)) {
    const digits = `91${m[0].replace(/\D/g, '').slice(-10)}`;
    if (!phones.has(digits) && !/services\/tattoo|\/about|\/salons/.test(url)) report('ERROR', url, 'fact-phone', m[0]);
  }
  for (const m of text.matchAll(/₹([\d,]+)/g)) if (!money.has(Number(m[1].replace(/,/g, '')))) report('ERROR', url, 'fact-price', m[0]);
  for (const m of text.matchAll(/\b\d+%/g)) if (!percents.has(m[0]) && parseInt(m[0], 10) <= 100) report('ERROR', url, 'fact-percent', m[0]);
}

// ---------- Duplicate sentences
const skip = new Set(data.locations.map((loc) => loc.address));
const sentences = new Map();
for (const { url, html } of indexable) {
  // Cards repeat their excerpt wherever they're listed; that's a listing, not duplicate copy.
  const main = (html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? '').replace(/<article(?! data-article)[\s\S]*?<\/article>/g, ' ');
  const seen = new Set();
  for (const sentence of textOf(main).split(/(?<=[.?!])\s+/)) {
    if (sentence.split(/\s+/).length < 12 || skip.has(sentence) || seen.has(sentence)) continue;
    seen.add(sentence);
    (sentences.get(sentence) ?? sentences.set(sentence, []).get(sentence)).push(url);
  }
}
for (const [sentence, urls] of sentences) if (urls.length > 1) report(urls.length >= 3 ? 'ERROR' : 'WARN', urls.slice(0, 3).join(' ') + (urls.length > 3 ? ` +${urls.length - 3}` : ''), 'duplicate', sentence.slice(0, 90));

// ---------- Titles, descriptions, H1s
const seenMeta = new Map();
for (const { url, html } of indexable) {
  const title = decode(html.match(/<title>([^<]*)/)?.[1] ?? '');
  const h1 = textOf(html.match(/<h1[\s\S]*?<\/h1>/i)?.[0] ?? '');
  for (const [kind, value] of [['title', title], ['h1', h1]]) {
    const key = `${kind}:${value}`;
    if (seenMeta.has(key)) report('ERROR', url, `${kind}-duplicate`, `${value} (also ${seenMeta.get(key)})`);
    else seenMeta.set(key, url);
  }
  if (/\|\s*XING|- Xing Premium Salon/.test(title)) report('ERROR', url, 'title-suffix', title);
  if (!/ – Xing( |$)/.test(title) && title.length <= 60 - style.TITLE_SUFFIX.length) report('WARN', url, 'title-suffix', title);
}

// ---------- Headings, alt text, anchors
const altSrc = new Map();
const anchors = new Map();
for (const { url, html } of indexable) {
  const body = bodyOf(html);
  for (const m of body.matchAll(/<h([1-6])[\s>][\s\S]*?<\/h\1>/gi)) {
    const text = textOf(m[0]);
    if (text.endsWith('.')) report('WARN', url, 'heading', `full stop: ${text}`);
    if (text.length > 70) report('WARN', url, 'heading', `${text.length} chars: ${text.slice(0, 60)}`);
  }
  for (const m of body.matchAll(/<img\s[^>]*>/gi)) {
    const alt = m[0].match(/\salt="([^"]*)"/)?.[1];
    const src = m[0].match(/\ssrc="([^"]*)"/)?.[1];
    if (!alt || !src) continue;
    if (/image of|photo of/i.test(alt) || alt === src.split('/').pop()) report('WARN', url, 'alt', alt);
    (altSrc.get(alt) ?? altSrc.set(alt, new Set()).get(alt)).add(src);
  }
  for (const m of body.matchAll(/<a\s[^>]*href="(\/[^"#?]*)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const label = textOf(m[2].replace(/<span class="sr-only">[\s\S]*?<\/span>/g, ''));
    if (!label) continue;
    if (/^(click here|here|read more)$/i.test(label)) report('WARN', url, 'anchor', `"${label}" → ${m[1]}`);
    (anchors.get(label) ?? anchors.set(label, new Set()).get(label)).add(m[1]);
  }
}
for (const [alt, srcs] of altSrc) if (srcs.size > 1) report('WARN', [...srcs].slice(0, 2).join(' '), 'alt-duplicate', alt);
for (const [label, hrefs] of anchors) if (hrefs.size > 1 && label.length > 3) report('WARN', [...hrefs].slice(0, 3).join(' '), 'anchor-duplicate', label);

// ---------- Output
problems.sort((a, b) => a.level.localeCompare(b.level) || a.check.localeCompare(b.check));
const seen = new Set();
const lines = problems.map((p) => `${p.level.padEnd(5)} ${p.where} ${p.check} ${p.detail}`).filter((line) => !seen.has(line) && seen.add(line));
const counts = {};
for (const line of lines) {
  const parts = line.split(/\s+/);
  const check = line.match(/(vocabulary|source|fact|title|h1|duplicate|heading|alt|anchor|cta)[a-z-]*/)?.[0] ?? 'other';
  counts[`${parts[0]} ${check}`] = (counts[`${parts[0]} ${check}`] ?? 0) + 1;
}
const errors = lines.filter((line) => line.startsWith('ERROR')).length;
const summary = ['', `${errors} errors · ${lines.length - errors} warnings`, ...Object.entries(counts).sort().map(([key, value]) => `  ${String(value).padStart(5)}  ${key}`)];
const out = [...lines, ...summary].join('\n');
const target = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1];
if (target) writeFileSync(target, `${out}\n`);
console.log(out);
process.exit(errors ? 1 : 0);
