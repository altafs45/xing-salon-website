// Recompresses the images the six offer pages use, in place: same names, formats and sizes, except that anything
// wider or taller than 1,200px comes down to 1,200px. JPG at quality 78 (mozjpeg), PNG quantised. Originals are in
// ../xing-media-originals/offer-pages/; run this only on fresh copies from there.
//   node scripts/offer-page-images.mjs
import { readdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images';
const FOLDERS = ['xinghaircolor', 'xinghairtreatment', 'skincareoffers', 'facialfeedback', 'keyoffers', 'hairtreatmentoffers', 'interiors'];
const FILES = [...FOLDERS.flatMap((folder) => readdirSync(join(ROOT, folder)).map((file) => join(ROOT, folder, file))), ...readdirSync(ROOT).filter((file) => /^offer-.*\.jpg$|^haircare\.jpg$/.test(file)).map((file) => join(ROOT, file))];

let before = 0;
let after = 0;
for (const file of FILES) {
  const type = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(type)) continue;
  const size = statSync(file).size;
  const image = sharp(file).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true });
  const out = type === '.png' ? image.png({ palette: true, quality: 80, effort: 8, compressionLevel: 9 }) : image.jpeg({ quality: 78, mozjpeg: true });
  await out.toFile(`${file}.tmp`);
  const next = statSync(`${file}.tmp`).size;
  // Keep the original where recompressing would not make it smaller.
  if (next < size) renameSync(`${file}.tmp`, file);
  else unlinkSync(`${file}.tmp`);
  before += size;
  after += Math.min(size, next);
}
console.log(`${FILES.length} files: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
