// Downloads the remaining Unsplash placeholders into /public/images as WebP.
// Replace any file in /public/images with a real photo of the same name and size to swap it.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

// [file name, unsplash photo id, width, height]
// Real salon photos (hero, hero-arch, why-salon, svc-*, loc-*, work-*, color-*, the other guides and offers, og) and the logo are not listed here, so this script never overwrites them.
const manifest = [
  ['guide-hair-spa', '1562322140-8baeececf3df', 640, 400],
  ['offer-keratin', '1580618672591-eb180b1a973f', 560, 400],
];

await mkdir(out, { recursive: true });
await Promise.all(
  manifest.map(async ([name, id, w, h, fmt = 'webp']) => {
    const url = `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=faces,entropy&q=72&fm=${fmt}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    await writeFile(join(out, `${name}.${fmt}`), Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${name}.${fmt}`);
  }),
);
