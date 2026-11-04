// The offer pages' photos (src/data/offerCatalog.ts): the photo half of each salon poster, cropped to 4:5 so no
// printed price, percentage or "valid until" date is in it, at 480 and 800px as AVIF and WebP; and a 1200 × 630
// share image per offer page. The posters live in ../xing-media-originals/offers/.
//   node scripts/offer-images.mjs
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const SOURCE = '../xing-media-originals/offers';
const OUT = 'public/images/offers';
const OG = 'public/og';

/** [poster, left edge, top edge] of the crop, as shares of the 1200px square. Checked by eye on each poster. */
const CROPS = {
  'global-hair-colour': ['offer-global-color.jpg', 0.67, 0.02],
  highlights: ['offer-highlights.jpg', 0.52, 0.04],
  'fashion-colour': ['offer-crazy-colors.jpg', 0.5, 0.04],
  balayage: ['offer-balayage.jpg', 0.52, 0.2],
  keratin: ['xing-salon-hair-keratin-treatment-offer.png', 0.52, 0.02],
  nanoplastia: ['xing-salon-hair-nanoplastia-treatment-offer.png', 0.52, 0.04],
  olaplex: ['xing-salon-hair-olaplex-bond-repair-treatment-offer.png', 0.52, 0.04],
  'anti-dandruff': ['xing-salon-hair-anti-dandruff-scalp-treatment-offer.png', 0.52, 0.06],
  'haircut-styling': ['xingsalonhaircutoffer.png', 0.53, 0],
  'hydra-facial': ['xing-salon-hydra-facial-offer-35-percent-off.png', 0.52, 0.06],
  'body-polish': ['xing-salon-body-polish-offer-35-percent-off.png', 0.5, 0.1],
  'hair-spa': ['xing-salon-hair-spa-two-plus-one-offer.png', 0.5, 0.2],
  'express-facial': ['xing-salon-express-facial-offer-2499-only.png', 0.55, 0.3],
};
/** Each offer page's share image comes from its lead offer's poster. */
const SHARE = { 'hair-colour': 'global-hair-colour', 'hair-treatment': 'keratin', 'skin-care': 'hydra-facial' };

mkdirSync(OUT, { recursive: true });
const box = async (file, left, top, ratio) => {
  const { width: size } = await sharp(file).metadata();
  const x = Math.round(size * left);
  const w = size - x;
  const h = Math.min(size - Math.round(size * top), Math.round(w / ratio));
  return { left: x, top: Math.min(Math.round(size * top), size - h), width: w, height: h };
};

for (const [id, [poster, left, top]] of Object.entries(CROPS)) {
  const file = `${SOURCE}/${poster}`;
  const area = await box(file, left, top, 4 / 5);
  for (const width of [480, 800]) {
    const image = sharp(file).extract(area).resize({ width, height: Math.round((width * 5) / 4), fit: 'cover' });
    await image.clone().avif({ quality: 55 }).toFile(`${OUT}/${id}-${width}.avif`);
    await image.clone().webp({ quality: 80 }).toFile(`${OUT}/${id}-${width}.webp`);
  }
  console.log(id);
}
for (const [page, id] of Object.entries(SHARE)) {
  const [poster, left, top] = CROPS[id];
  const file = `${SOURCE}/${poster}`;
  // The same photo, as wide as the poster allows, on the site's blush either side.
  const area = await box(file, left, top, 4 / 5);
  const photo = await sharp(file).extract(area).resize({ height: 630 }).toBuffer();
  const { width } = await sharp(photo).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#FCE4EA' } })
    .composite([{ input: photo, left: Math.round((1200 - width) / 2), top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OG}/offers-${page}.jpg`);
}
console.log('share images written');

// Client results for the Results rows: the first 12 photos of each hair category, 600px wide, AVIF and WebP.
const RESULTS = { 'hair-colour': 'xinghaircolor', 'hair-treatment': 'xinghairtreatment' };
mkdirSync('public/images/results', { recursive: true });
for (const [page, folder] of Object.entries(RESULTS)) {
  for (let i = 1; i <= 12; i++) {
    const name = `gallery-${String(i).padStart(2, '0')}.jpg`;
    const image = sharp(`${SOURCE}/${folder}/${name}`).resize({ width: 600, height: 750, fit: 'cover' });
    await image.clone().avif({ quality: 55 }).toFile(`public/images/results/${page}-${i}.avif`);
    await image.clone().webp({ quality: 78 }).toFile(`public/images/results/${page}-${i}.webp`);
  }
}
console.log('results written');
