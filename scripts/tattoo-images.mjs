// The tattoo studio's photo (../xing-media-originals/tattoo/tattoo-work-1.jpeg, 800 × 1000) at the sizes the site
// uses: 4:5 at 480 and 800px (AVIF and WebP), and a 1200 × 630 crop on the face for share cards and the blog.
// Run after the photo changes: node scripts/tattoo-images.mjs
import sharp from 'sharp';

const SOURCE = '../xing-media-originals/tattoo/tattoo-work-1.jpeg';
const OUT = 'public/images/tattoo-work-1';

for (const width of [480, 800]) {
  const image = sharp(SOURCE).resize({ width, height: Math.round((width * 5) / 4), fit: 'cover' });
  await image.clone().avif({ quality: 55 }).toFile(`${OUT}-${width}.avif`);
  await image.clone().webp({ quality: 78 }).toFile(`${OUT}-${width}.webp`);
}
// The helmet and face sit between 26% and 72% down the photo.
const wide = sharp(SOURCE).extract({ left: 0, top: 270, width: 800, height: 420 }).resize({ width: 1200, height: 630 });
await wide.clone().webp({ quality: 78 }).toFile(`${OUT}-1200x630.webp`);
await wide.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}-1200x630.jpg`);
console.log('tattoo images written');
