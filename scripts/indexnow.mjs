// Tells Bing (and so ChatGPT search and Copilot) which pages changed. Run by hand after a deploy, never during a build:
//   node scripts/indexnow.mjs          pages whose sitemap date changed since the last run
//   node scripts/indexnow.mjs --all    every page
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const HOST = 'www.xingsalons.com';
const STATE = '.indexnow-state.json';
const key = readdirSync('public').find((file) => /^[0-9a-f]{32}\.txt$/.test(file))?.replace('.txt', '');
if (!key) throw new Error('No IndexNow key file in public/.');

const entries = ['dist/sitemap-pages.xml', 'dist/sitemap-blog.xml'].flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)/g)].map((m) => [m[1], m[2]]));
const last = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
const urlList = entries.filter(([url, date]) => process.argv.includes('--all') || last[url] !== date).map(([url]) => url);
if (urlList.length === 0) {
  console.log('Nothing changed.');
  process.exit(0);
}
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
if (response.ok) writeFileSync(STATE, JSON.stringify(Object.fromEntries(entries), null, 1));
