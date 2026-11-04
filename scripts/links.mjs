// Internal links in the build. Every href and src on every page must reach a file in dist/, never a redirect, and
// every redirect must land on a live page in one step. Prints one line per problem; exits 1 on any.
//   node scripts/links.mjs   (after npm run build)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const walk = (dir) => readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]));
const files = walk(DIST);
const pages = files.filter((file) => file.endsWith('.html'));
const redirects = new Map(
  readFileSync(join(DIST, '_redirects'), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('/') && !line.includes('*'))
    .map((line) => line.trim().split(/\s+/).slice(0, 2)),
);
/** The file a site path is served from, if any. */
const served = (path) => {
  const clean = decodeURI(path.split(/[?#]/)[0]).replace(/\/+$/, '') || '/';
  if (clean === '/') return existsSync(join(DIST, 'index.html'));
  return [join(DIST, clean), join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')].some((file) => existsSync(file) && statSync(file).isFile());
};
const isStub = (path) => {
  const file = join(DIST, `${path}.html`);
  return existsSync(file) && /http-equiv="refresh"/.test(readFileSync(file, 'utf8'));
};

const problems = [];
let checked = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/.test(html)) continue;
  const page = `/${relative(DIST, file).split(sep).join('/')}`.replace(/(\/index)?\.html$/, '') || '/';
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const target = m[1];
    if (target.startsWith('//')) continue;
    checked++;
    const path = target.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    if (redirects.has(path) || isStub(path)) problems.push(`${page} → ${target}: links to a redirect`);
    else if (!served(path)) problems.push(`${page} → ${target}: no such page or file`);
  }
}
for (const [from, to] of redirects) {
  if (to.startsWith('http')) continue;
  if (redirects.has(to)) problems.push(`redirect ${from} → ${to}: chain`);
  else if (!served(to)) problems.push(`redirect ${from} → ${to}: lands on nothing`);
}
for (const line of [...new Set(problems)]) console.log(line);
console.log(`${checked} internal links on ${pages.length} pages, ${redirects.size} redirects · ${new Set(problems).size} problems`);
process.exit(problems.length ? 1 : 0);
