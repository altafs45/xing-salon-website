// Makes the November offer images from the salon's posters. Run once per campaign: node scripts/offer-images.mjs
// All three posters are shown whole in the offer slider. Two of them print figures the prices don't support
// ("Upto 50%", "-40%", ₹599), so only those digits are repainted here; the originals are never edited.
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE = '../xing-media-originals/offers for november';
const OUT = 'public/images';
const GLOBAL = 'Global Hair Color Offer.png';
const HIGHLIGHTS = 'Premium Highlights Salon Offer.png';
const MENU = 'Pink Salon Promotion_ Up to 50% Off.png';
const FONT = `font-family="Arial" font-weight="700"`;

const svg = (width, height, body) => ({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`) });

// "UPTO 50%": 37% is the largest saving on the menu.
const menuFix = {
  ...svg(1254, 1254, `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdf0ef"/><stop offset="1" stop-color="#fbeeec"/></linearGradient>
      <linearGradient id="digits"><stop offset="0" stop-color="#f4502f"/><stop offset=".55" stop-color="#e0127f"/><stop offset="1" stop-color="#7f1aa8"/></linearGradient>
    </defs>
    <rect x="142" y="412" width="256" height="160" fill="url(#bg)"/>
    <text x="270" y="562" text-anchor="middle" ${FONT} font-size="190" fill="url(#digits)">37</text>`),
  top: 0,
  left: 0,
};

// "-40%" and ₹599: ₹499 to ₹399 is 20%.
const highlightsFix = {
  ...svg(1241, 1268, `
    <text x="256" y="708" text-anchor="middle" ${FONT} font-size="190" fill="#fff">-20</text>
    <rect x="58" y="806" width="136" height="54" fill="#fff"/>
    <text x="62" y="850" ${FONT} font-size="46" fill="#222">₹499</text>
    <line x1="62" y1="852" x2="186" y2="818" stroke="#f0442a" stroke-width="4"/>`),
  top: 0,
  left: 0,
};

/** Paints a box over with its own colours, blending the pixel rows just above and below it. */
async function clearBox(file, { left, top, right, bottom }) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const at = (x, y, c) => (y * info.width + x) * 3 + c;
  for (let y = top; y < bottom; y++) {
    const share = (y - top) / (bottom - top);
    for (let x = left; x < right; x++) {
      for (let c = 0; c < 3; c++) data[at(x, y, c)] = data[at(x, top, c)] * (1 - share) + data[at(x, bottom, c)] * share;
    }
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

const images = [
  { name: 'offer-nov-global-colour', file: GLOBAL, widths: [480, 800, 1200] },
  { name: 'offer-nov-highlights-poster', file: HIGHLIGHTS, clear: { left: 96, top: 546, right: 418, bottom: 726 }, fix: highlightsFix, widths: [480, 800, 1200] },
  { name: 'offer-nov-menu-poster', file: MENU, fix: menuFix, widths: [480, 800, 1200] },
];

for (const { name, file, clear, fix, widths } of images) {
  const path = join(SOURCE, file);
  const source = fix ? await sharp(clear ? await clearBox(path, clear) : path).composite([fix]).png().toBuffer() : path;
  for (const width of widths) {
    const base = () => sharp(source).resize({ width, kernel: 'lanczos3' });
    await base().webp({ quality: 80 }).toFile(join(OUT, `${name}-${width}.webp`));
    await base().avif({ quality: 55 }).toFile(join(OUT, `${name}-${width}.avif`));
  }
}
console.log('Offer images written.');
