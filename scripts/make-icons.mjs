// Makes the favicon and app icons from the logo. Run once: node scripts/make-icons.mjs
// Tab sizes use the "xing" wordmark alone, because "Premium Salons" can't be read at 16 px. App icons use the full logo.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const LOGO = 'public/brand/logo-square-512.png';
const CREAM = '#FFF8F4';

// Paint out the tagline, leaving the tail of the "g" alone, then trim to the wordmark.
const cover = Buffer.from('<svg width="512" height="512"><rect x="50" y="296" width="316" height="40" fill="#fff"/></svg>');
const sample = await sharp(LOGO).extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer();
const background = `rgb(${sample[0]},${sample[1]},${sample[2]})`;
const paint = Buffer.from(cover.toString().replace('#fff', background));
const wordmark = await sharp(await sharp(LOGO).composite([{ input: paint }]).png().toBuffer()).trim({ threshold: 12 }).png().toBuffer();

const tile = async (size) => {
  const inner = Math.round(size * 0.92);
  const mark = await sharp(wordmark).resize({ width: inner, kernel: 'lanczos3' }).sharpen().toBuffer();
  const radius = Math.round(size * 0.18);
  const shape = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${CREAM}"/></svg>`);
  return sharp(shape).composite([{ input: mark, gravity: 'center' }]).png().toBuffer();
};

const logoAt = async (size, scale = 1) => {
  const logo = await sharp(LOGO).resize(Math.round(size * scale)).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background } }).composite([{ input: logo, gravity: 'center' }]).png().toBuffer();
};

const sizes = { 16: await tile(16), 32: await tile(32), 48: await tile(48) };
writeFileSync('public/favicon-16x16.png', sizes[16]);
writeFileSync('public/favicon-32x32.png', sizes[32]);
writeFileSync('public/apple-touch-icon.png', await logoAt(180));
writeFileSync('public/icon-192.png', await logoAt(192));
writeFileSync('public/icon-512.png', await logoAt(512));
// Android crops maskable icons to a circle, so the logo sits inside the safe zone.
writeFileSync('public/icon-maskable-512.png', await logoAt(512, 0.8));

// favicon.ico: a small header, then one PNG per size.
const entries = Object.entries(sizes).map(([size, data]) => ({ size: Number(size), data }));
const header = Buffer.alloc(6 + 16 * entries.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach(({ size, data }, i) => {
  const at = 6 + 16 * i;
  header[at] = size;
  header[at + 1] = size;
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(data.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries.map(({ data }) => data)]));
console.log('Icons written.');
