// Blog photos. Lists each post (slug, category, primary keyword, image now) with the candidate photos from
// public/images for its topic, and makes the crops for the photos chosen in BLOG_IMAGES below.
//   node scripts/blog-images.mjs            list posts and candidates
//   node scripts/blog-images.mjs --write    make public/og/blog/<slug>.{webp,jpg} (1200 × 630) and
//                                           public/images/blog/<slug>-card.webp (640 × 400), and set each post's
//                                           featuredImage and featuredImageAlt
// Rules: one relevant photo per post, used by 2 posts at most; an interior only for salon-visit topics; only client
// photos already on the site; never the facialfeedback chat screenshots.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const BLOG = 'content/blog';
const IMAGES = 'public/images';
const PREFIXES = ['work-', 'ba-', 'color-', 'svc-', 'gal-', 'nail-', 'men-', 'kids-', 'facial-', 'tattoo-'];
const FOLDERS = ['xinghaircolor', 'xinghairtreatment', 'skincareoffers'];

/**
 * The photo for each post: [source in public/images, what it shows, focus from the top (0–1) for the crops].
 * Alt text says what is in the photo and the topic, in plain words.
 */
export const BLOG_IMAGES = {
  'balayage-vs-highlights': ['work-balayage-1.webp', 'Soft caramel balayage on long wavy hair, done at Xing Salon Bangalore', 0.4],
  'what-is-olaplex': ['work-balayage-2.webp', 'Lightened balayage hair kept soft with bond care at Xing Salon Bangalore', 0.4],
  'make-hair-colour-last': ['work-highlights-2.webp', 'Fresh hair highlights at Xing Salon Bangalore, before colour-care tips', 0.4],
  'hair-colour-indian-skin-tone': ['work-global-2.webp', 'Warm global hair colour on Indian skin at Xing Salon Bangalore', 0.4],
  'root-touch-up-frequency': ['work-global-3.webp', 'Even global hair colour from root to tip at Xing Salon Bangalore', 0.4],
  'what-is-nanoplastia': ['work-nanoplastia-1.webp', 'Smooth, shiny hair after a nanoplastia treatment at Xing Salon Bangalore', 0.4],
  'keratin-aftercare-tips': ['ba-keratin-1-after.webp', 'Smooth hair after a keratin treatment at Xing Salon Bangalore', 0.4],
  'keratin-vs-smoothening-vs-straightening': ['work-smoothing-2.webp', 'Sleek, straight hair after smoothening at Xing Salon Bangalore', 0.4],
  'hard-water-hair-damage-bangalore': ['work-smoothing-1.webp', 'Healthy, frizz-free hair after treatment at Xing Salon Bangalore', 0.4],
  'hair-spa-benefits': ['gal-hair-spa-1.webp', 'A hair spa treatment at Xing Salon Bangalore', 0.5],
  'types-of-hair-spa': ['gal-hair-spa-2.webp', 'Hair spa care at Xing Salon Bangalore', 0.5],
  'hydra-facial-benefits': ['svc-hydra-facial-hero.webp', 'A Hydra Facial in progress at Xing Salon Bangalore', 0.5],
  'hydra-facial-vs-facial-vs-cleanup': ['gal-facial-cleanup-1.webp', 'A facial clean-up at Xing Salon Bangalore', 0.5],
  'pre-event-skin-prep-timeline': ['svc-facial-cleanup-hero.webp', 'Facial skin prep before an event at Xing Salon Bangalore', 0.5],
  // A salon-visit topic: the salon itself.
  'pre-wedding-salon-timeline': ['loc-hsr-1.webp', 'Styling stations at Xing HSR Layout, where brides plan their pre-wedding salon visits', 0.5],
};

const front = (text) => text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const field = (fm, name) => fm.match(new RegExp(`^${name}:\\s*"?([^"\\n]*)"?`, 'm'))?.[1] ?? '';

const posts = readdirSync(BLOG)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const text = readFileSync(join(BLOG, file), 'utf8').replace(/\r\n/g, '\n');
    const fm = front(text);
    return { file, slug: field(fm, 'slug'), category: field(fm, 'category'), keyword: field(fm, 'primaryKeyword'), draft: field(fm, 'draft') === 'true', image: fm.match(/featuredImage:\s*\{\s*src:\s*"([^"]+)"/)?.[1] ?? '' };
  });

const candidates = [
  ...readdirSync(IMAGES).filter((file) => PREFIXES.some((prefix) => file.startsWith(prefix)) && /\.(webp|jpg|png)$/.test(file) && !/-\d{3}\.(webp|avif)$/.test(file)),
  ...FOLDERS.flatMap((folder) => (existsSync(join(IMAGES, folder)) ? readdirSync(join(IMAGES, folder)).map((file) => `${folder}/${file}`) : [])),
];

if (!process.argv.includes('--write')) {
  for (const post of posts) {
    const words = `${post.slug} ${post.category} ${post.keyword}`.toLowerCase().split(/[^a-z]+/).filter((word) => word.length > 3);
    const matches = candidates.filter((file) => words.some((word) => file.toLowerCase().includes(word.slice(0, 5))));
    console.log(`${post.draft ? 'draft' : 'live '} ${post.slug} [${post.category}] "${post.keyword}" now ${post.image}`);
    console.log(`      ${matches.slice(0, 8).join(', ') || '(no topic match)'}`);
  }
  console.log(`\n${candidates.length} candidate images.`);
} else {
  mkdirSync('public/og/blog', { recursive: true });
  mkdirSync(join(IMAGES, 'blog'), { recursive: true });
  const uses = {};
  for (const [slug, [source, alt, focus = 0.5]] of Object.entries(BLOG_IMAGES)) {
    uses[source] = (uses[source] ?? 0) + 1;
    if (uses[source] > 2) throw new Error(`${source} is on more than 2 posts`);
    const file = join(IMAGES, source);
    const { width, height } = await sharp(file).metadata();
    const crop = (ratio) => {
      // The widest box of this ratio, centred on the focus line.
      const w = Math.min(width, Math.round(height * ratio));
      const h = Math.round(w / ratio);
      const top = Math.max(0, Math.min(height - h, Math.round(height * focus - h / 2)));
      return { left: Math.round((width - w) / 2), top, width: w, height: h };
    };
    const og = sharp(file).extract(crop(1200 / 630)).resize(1200, 630);
    await og.clone().webp({ quality: 78 }).toFile(`public/og/blog/${slug}.webp`);
    await og.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`public/og/blog/${slug}.jpg`);
    await sharp(file).extract(crop(640 / 400)).resize(640, 400).webp({ quality: 78 }).toFile(join(IMAGES, 'blog', `${slug}-card.webp`));

    const post = posts.find((entry) => entry.slug === slug);
    if (!post) throw new Error(`no post ${slug}`);
    const path = join(BLOG, post.file);
    const raw = readFileSync(path, 'utf8');
    const next = raw
      .replace(/^featuredImage:.*$/m, `featuredImage: { src: "/og/blog/${slug}.webp", width: 1200, height: 630, srcSet: "/images/blog/${slug}-card.webp 640w, /og/blog/${slug}.webp 1200w" }`)
      .replace(/^featuredImageAlt:.*$/m, `featuredImageAlt: "${alt}"`);
    writeFileSync(path, next);
    console.log(`${slug} <- ${source}`);
  }
}
