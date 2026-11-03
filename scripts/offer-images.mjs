// Makes the Offers section's images: node scripts/offer-images.mjs
//   - One 4:5 photo crop per offer (no text on it), named offer-<category>-<id>-<width>.<avif|webp>, read by
//     offerCatalog.ts. Sources are the salon's own photos: the full-size originals where there are some, the site's
//     service photos otherwise. Nothing is ever upscaled: a crop gets only the widths its source can fill.
//   - The global colour poster, whole: its printed prices match the offer. The salon's other posters print figures
//     the prices don't support ("Upto 50%", "-40%", ₹599), so they are not used at all.
// The originals are never edited. Budget: ≤ 70 KB at 480px and ≤ 160 KB at 800px; the script says if one isn't.
import { statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ORIGINALS = '../xing-media-originals';
const GALLERY = join(ORIGINALS, 'XING Gallery');
const SITE = 'public/images';
const OUT = 'public/images';
const BUDGET = { 480: 70_000, 800: 160_000 };

// The gallery photos are 1080 × 1350 with a branding strip down the left edge and a logo at the top right: each
// crop starts below and beside them (900 × 1125, still enough for a true 800px version).
const gallery = (file, top = 200) => ({ file: join(GALLERY, file), left: 100, top, width: 900 });

const crops = [
  { name: 'offer-hair-colour-global-colour', ...gallery('xing services photos (67).png'), widths: [480, 800] },
  { name: 'offer-hair-colour-highlights', ...gallery('xing services photos (43).png'), widths: [480, 800] },
  { name: 'offer-hair-colour-balayage', ...gallery('xing services photos (71).png'), widths: [480, 800] },
  { name: 'offer-hair-colour-fashion-colour', ...gallery('xing services photos (21).png'), widths: [480, 800] },
  { name: 'offer-hair-treatment-keratin', ...gallery('xing services photos (72).png'), widths: [480, 800] },
  { name: 'offer-hair-treatment-nanoplastia', ...gallery('xing services photos (70).png'), widths: [480, 800] },
  { name: 'offer-hair-treatment-olaplex', ...gallery('xing services photos (53).png'), widths: [480, 800] },
  // OWNER: no full-size photos of these yet. These are the site's 800 × 600 service photos, which look like stock
  // images (their alt text doesn't claim they are at Xing); replace them with the salon's own when it has some.
  { name: 'offer-hair-treatment-scalp-treatment', file: join(SITE, 'svc-hair-spa-hero.webp'), centre: true, widths: [480] },
  { name: 'offer-skin-care-hydra-facial', file: join(SITE, 'svc-hydra-facial-hero.webp'), centre: true, widths: [480] },
  { name: 'offer-skin-care-body-polish', file: join(SITE, 'svc-body-polish-hero.webp'), centre: true, widths: [480] },
  { name: 'offer-skin-care-hair-spa', file: join(SITE, 'gal-hair-spa-1.webp'), centre: true, widths: [480] },
  { name: 'offer-skin-care-express-facial', file: join(SITE, 'svc-facial-cleanup-hero.webp'), centre: true, widths: [480] },
];

const POSTERS = [{ name: 'offer-nov-global-colour', file: join(ORIGINALS, 'offers for november', 'Global Hair Color Offer.png'), widths: [480, 800, 1200] }];

/** The 4:5 region to keep: given, or the largest one in the middle of the photo. */
async function region({ file, left, top, width, centre }) {
  if (!centre) return { left, top, width, height: Math.round(width * 1.25) };
  const { width: w, height: h } = await sharp(file).metadata();
  const cropW = Math.min(w, Math.floor(h / 1.25));
  const cropH = Math.round(cropW * 1.25);
  return { left: Math.floor((w - cropW) / 2), top: Math.floor((h - cropH) / 2), width: cropW, height: cropH };
}

const over = [];
async function write(name, image, widths) {
  for (const width of widths) {
    const base = () => image().resize({ width, kernel: 'lanczos3' });
    // WebP q80 and AVIF q55, stepping the quality down a little for a detailed photo until it fits the budget.
    for (const [ext, start] of [['webp', 80], ['avif', 55]]) {
      const file = join(OUT, `${name}-${width}.${ext}`);
      for (let quality = start; ; quality -= 4) {
        await base()[ext]({ quality }).toFile(file);
        const bytes = statSync(file).size;
        if (!BUDGET[width] || bytes <= BUDGET[width]) break;
        if (quality <= start - 16) {
          over.push(`${name}-${width}.${ext} ${Math.round(bytes / 1000)} KB`);
          break;
        }
      }
    }
  }
}

for (const crop of crops) {
  const box = await region(crop);
  const widths = crop.widths.filter((width) => width <= box.width);
  await write(crop.name, () => sharp(crop.file).rotate().extract(box), widths);
}
for (const poster of POSTERS) await write(poster.name, () => sharp(poster.file), poster.widths);

console.log(`Offer images written: ${crops.length} crops, ${POSTERS.length} poster.`);
if (over.length) {
  console.log(`Over budget:\n  ${over.join('\n  ')}`);
  process.exitCode = 1;
}
