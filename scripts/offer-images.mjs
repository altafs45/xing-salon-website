// Makes the November offer images from the salon's posters. Run once per campaign: node scripts/offer-images.mjs
// Two posters print claims the site must not repeat ("Upto 50%", "-40%", ₹599), so only their photo side and the
// accurate price list are cut out. The Global Hair Colour poster is accurate and is used whole.
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE = '../xing-media-originals/offers for november';
const OUT = 'public/images';
const GLOBAL = 'Global Hair Color Offer.png';
const HIGHLIGHTS = 'Premium Highlights Salon Offer.png';
const MENU = 'Pink Salon Promotion_ Up to 50% Off.png';

const images = [
  { name: 'offer-nov-global-colour', file: GLOBAL, widths: [480, 800, 1200] },
  { name: 'offer-nov-global-colour-portrait', file: GLOBAL, crop: { left: 823, top: 125, width: 431, height: 539 }, widths: [480, 800] },
  { name: 'offer-nov-highlights-photo', file: HIGHLIGHTS, crop: { left: 640, top: 40, width: 600, height: 1080 }, widths: [480, 800] },
  { name: 'offer-nov-menu-photo', file: MENU, crop: { left: 664, top: 40, width: 590, height: 1062 }, widths: [480, 800] },
  { name: 'offer-nov-menu-prices', file: MENU, crop: { left: 28, top: 615, width: 625, height: 450 }, widths: [480, 800] },
];

for (const { name, file, crop, widths } of images) {
  for (const width of widths) {
    const base = () => {
      const image = sharp(join(SOURCE, file));
      return (crop ? image.extract(crop) : image).resize({ width, kernel: 'lanczos3' });
    };
    await base().webp({ quality: 80 }).toFile(join(OUT, `${name}-${width}.webp`));
    await base().avif({ quality: 55 }).toFile(join(OUT, `${name}-${width}.avif`));
  }
}
console.log('Offer images written.');
