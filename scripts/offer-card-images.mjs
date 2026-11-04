// The offer cards' images (src/data/offerPages.ts): the photo half of each offer page's hero creative, cropped to
// 4:5, at 480 and 800px wide. The creative's printed prices and dates stay out: the card prints its own from
// offerPages.ts. Run after a creative changes: node scripts/offer-card-images.mjs
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const OUT = 'public/images/offer-cards';
const SOURCES = {
  'hair-colour': 'public/images/keyoffers/HSRHairColorOffer.png',
  'hair-treatment': 'public/images/hairtreatmentoffers/xing-hair-treatment-all.png',
  'skin-care': 'public/images/skincareoffers/xing-salon-hydra-facial-offer-35-percent-off.png',
};

mkdirSync(OUT, { recursive: true });
for (const [id, file] of Object.entries(SOURCES)) {
  const { width: w, height: h } = await sharp(file).metadata();
  // The right 48% of the square, from the top, at 4:5.
  const left = Math.round(w * 0.52);
  const area = { left, top: 0, width: w - left, height: Math.min(h, Math.round(((w - left) * 5) / 4)) };
  for (const width of [480, 800]) {
    await sharp(file)
      .extract(area)
      .resize({ width, height: Math.round((width * 5) / 4), fit: 'cover' })
      .webp({ quality: 78 })
      .toFile(`${OUT}/${id}-${width}.webp`);
  }
  console.log(id);
}
