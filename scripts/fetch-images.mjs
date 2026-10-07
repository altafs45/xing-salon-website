// Downloads the Unsplash placeholder set into /public/images as WebP.
// Replace any file in /public/images with a real photo of the same name and size to swap it.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

// [file name, unsplash photo id, width, height]
// Real salon photos (hero, hero-arch, why-salon, svc-*, loc-*, og) and the logo are not listed here, so this script never overwrites them.
const manifest = [
  ['guide-balayage-vs-global', '1629397685944-7073f5589754', 640, 400],
  ['guide-keratin-vs-nanoplastia', '1634449571010-02389ed0f9b0', 640, 400],
  ['guide-choose-hair-color', '1529626455594-4ff0802cfb7e', 640, 400],
  ['guide-balayage-last', '1522337360788-8b13dee7a37e', 640, 400],
  ['guide-bridal-makeup', '1583391733956-3750e0ff4e8b', 640, 400],
  ['guide-hair-spa', '1562322140-8baeececf3df', 640, 400],
  ['color-global', '1544005313-94ddf0286df2', 400, 400],
  ['color-balayage', '1560869713-7d0a29430803', 400, 400],
  ['color-ombre', '1508214751196-bcfd4ca60f91', 400, 400],
  ['color-fashion', '1554519515-242161756769', 400, 400],
  ['offer-global', '1529626455594-4ff0802cfb7e', 560, 400],
  ['offer-keratin', '1580618672591-eb180b1a973f', 560, 400],
  ['tf-haircolor-1', '1544005313-94ddf0286df2', 720, 480],
  ['tf-haircolor-2', '1529626455594-4ff0802cfb7e', 720, 480],
  ['tf-haircolor-3', '1492106087820-71f1a00d2b11', 720, 480],
  ['tf-balayage-1', '1560869713-7d0a29430803', 720, 480],
  ['tf-balayage-2', '1629397685944-7073f5589754', 720, 480],
  ['tf-balayage-3', '1508214751196-bcfd4ca60f91', 720, 480],
  ['tf-keratin-1', '1522337360788-8b13dee7a37e', 720, 480],
  ['tf-keratin-2', '1524504388940-b1c1722653e1', 720, 480],
  ['tf-keratin-3', '1595959183082-7b570b7e08e2', 720, 480],
  ['tf-haircut-1', '1438761681033-6461ffad8d80', 720, 480],
  ['tf-haircut-2', '1582095133179-bfd08e2fc6b3', 720, 480],
  ['tf-haircut-3', '1562322140-8baeececf3df', 720, 480],
  ['tf-makeup-1', '1487412947147-5cebf100ffc2', 720, 480],
  ['tf-makeup-2', '1488426862026-3ee34a7d66df', 720, 480],
  ['tf-makeup-3', '1531746020798-e6953c6e8e04', 720, 480],
  ['tf-nails-1', '1519014816548-bf5fe059798b', 720, 480],
  ['tf-nails-2', '1604654894610-df63bc536371', 720, 480],
  ['tf-nails-3', '1632345031435-8727f6897d53', 720, 480],
  ['bridal', '1610173826608-bd1f53a52db1', 1200, 700],
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
