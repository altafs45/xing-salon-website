import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
const DIST = resolve('dist');
const T = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/';
  const file = extname(path) ? join(DIST, path) : path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': T[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((d) => server.listen(0, '127.0.0.1', d));
const [path, out, width = '393', full] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(width), height: 852 }, isMobile: true, hasTouch: true });
const errors = []; p.on('console', (m) => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', (e) => errors.push(e.message));
await p.goto(`http://127.0.0.1:${server.address().port}${path}`, { waitUntil: 'load' }); await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: full === 'full' });
console.log('errors:', errors.slice(0, 5));
await b.close(); server.close();
