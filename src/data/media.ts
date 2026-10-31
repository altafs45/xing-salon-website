// Before/after pairs and video reels. Components read from here, so adding media is a one-line change.
import type { Img } from './content';

export interface BeforeAfterPair {
  /** What was done, shown under the photos. */
  caption: string;
  /** Service name shown as the link, and the service page it opens. */
  service: string;
  slug: string;
  before: Img;
  after: Img;
}

export interface Reel {
  src: string;
  poster: string;
  /** Said by screen readers and shown under the video. */
  caption: string;
  /** Slug of the service page that also shows this clip. */
  service: string;
  /** Shown in the home page's video row. */
  home: boolean;
  width: number;
  height: number;
}

/**
 * A pair saved as /public/images/<name>-before.webp and <name>-after.webp (800 px wide), each with a
 * 480 px "-480" version. Both photos of a pair must be cropped to the same shape.
 */
const pair = (name: string, caption: string, service: string, slug: string, width = 800, height = 1067): BeforeAfterPair => {
  const side = (which: 'before' | 'after'): Img => ({
    src: `/images/${name}-${which}.webp`,
    srcSet: `/images/${name}-${which}-480.webp 480w, /images/${name}-${which}.webp 800w`,
    alt: `${which === 'before' ? 'Before' : 'After'}: ${caption.toLowerCase()} at Xing Salon Bangalore`,
    width,
    height,
  });
  return { caption, service, slug, before: side('before'), after: side('after') };
};

export const beforeAfter = {
  eyebrow: 'Before & After',
  title: 'See the Difference',
  text: 'Real clients, photographed in our salons on the day of their appointment.',
  pairs: [
    pair('ba-keratin-1', 'Frizzy lengths to glass-smooth hair', 'Keratin Treatment', 'keratin-treatment'),
    pair('ba-haircolor-1', 'Black hair to a burgundy melt', 'Hair Colour', 'global-hair-color'),
    pair('ba-haircut-1', 'Grown-out lengths to bouncy layers', 'Women’s Haircut & Styling', 'womens-haircut-styling'),
    pair('ba-smoothening-1', 'Unruly curls to sleek, straight hair', 'Keratin Treatment', 'keratin-treatment'),
    pair('ba-styling-1', 'Loose waves to defined curls', 'Women’s Haircut & Styling', 'womens-haircut-styling'),
    pair('ba-nails-1', 'Bare nails to glossy red extensions', 'Nail Extensions', 'nail-extensions', 800, 800),
  ],
};

/**
 * A portrait clip saved as /public/videos/<name>.mp4 (H.264, no audio, 720 px wide at most) with a poster
 * frame at /public/images/<name>-poster.webp. `service` is the service page that also shows the clip;
 * `home` puts it in the home page's video row.
 */
const reel = (name: string, caption: string, service: string, home = false, width = 720, height = 1280): Reel => ({
  src: `/videos/${name}.mp4`,
  poster: `/images/${name}-poster.webp`,
  caption,
  service,
  home,
  width,
  height,
});

const COLOUR = 'global-hair-color';
const HAIRCUT = 'womens-haircut-styling';
const KERATIN = 'keratin-treatment';
const NANOPLASTIA = 'nanoplastia-cysteine';

export const reels = {
  eyebrow: 'Watch',
  title: 'Transformations in Motion',
  text: 'Short clips from the salon floor, straight after the final blow-dry.',
  /** Heading for the clips on a service page. */
  pageEyebrow: 'Watch',
  pageTitle: 'See It in Motion',
  items: [
    reel('reel-balayage-1', 'Soft brown balayage reveal', COLOUR, true, 464, 824),
    reel('reel-haircut-1', 'Long layers with a bouncy blow-dry', HAIRCUT, true),
    reel('reel-colour-1', 'Red balayage reveal', COLOUR, true),
    reel('reel-keratin-1', 'Glass-smooth straight lengths', KERATIN, true),
    reel('reel-kids-1', 'A fresh cut for a young client', 'kids-haircut', true, 464, 824),
    reel('reel-highlights-2', 'Copper highlights with layers', COLOUR, true, 576, 1024),
    reel('reel-nanoplastia-2', 'Nanoplastia: brushed-out shine', NANOPLASTIA, true, 576, 1024),
    reel('reel-haircut-6', 'Voluminous layers, all smiles', HAIRCUT, true),
    reel('reel-colour-2', 'Burgundy curls', COLOUR, true),
    reel('reel-haircut-5', 'Layered cut, back view', HAIRCUT, true),
    reel('reel-highlights-4', 'Bouncy blow-dry on global colour', COLOUR, false),
    reel('reel-balayage-2', 'Burgundy balayage reveal', COLOUR, false, 576, 1024),
    reel('reel-highlights-1', 'Global colour makeover', COLOUR, false, 576, 1024),
    reel('reel-highlights-3', 'Plum highlights on dark hair', COLOUR, false, 576, 1024),
    reel('reel-colour-3', 'Caramel highlights with layers', COLOUR, false),
    reel('reel-haircut-2', 'Layered cut and blow-dry', HAIRCUT, false),
    reel('reel-haircut-3', 'Fresh layers with a fringe', HAIRCUT, false),
    reel('reel-haircut-4', 'Soft curls styling', HAIRCUT, false),
    reel('reel-keratin-2', 'Sleek, straight finish', KERATIN, false),
    reel('reel-nanoplastia-3', 'Nanoplastia on extra-long hair', NANOPLASTIA, false, 576, 1024),
    reel('reel-nanoplastia-1', 'Nanoplastia: sleek, straight finish', NANOPLASTIA, false, 576, 1024),
    reel('reel-nanoplastia-4', 'Nanoplastia: frizz-free lengths', NANOPLASTIA, false, 576, 1024),
  ],
};

/** The clips a service page shows. */
export const reelsFor = (service: string) => reels.items.filter((item) => item.service === service);

// ---------- Service gallery

/**
 * A photo of the salon's work, saved as /public/images/gal-<group>-<n>.webp (800 × 1000) with a 480 px wide
 * "-480" copy. List one caption per photo, in file order.
 */
const photos = (group: string, captions: string[]): Array<Img & { caption: string }> =>
  captions.map((caption, i) => ({
    src: `/images/gal-${group}-${i + 1}.webp`,
    srcSet: `/images/gal-${group}-${i + 1}-480.webp 480w, /images/gal-${group}-${i + 1}.webp 800w`,
    alt: `${caption} at Xing Salon Bangalore`,
    caption,
    width: 800,
    height: 1000,
  }));

export const serviceGallery = {
  eyebrow: 'Gallery',
  title: 'Our Work, Service by Service',
  text: 'Hair, nails and grooming on our own clients, photographed in our salons.',
  /** Photos shown before "Show more" is pressed. */
  initial: 8,
  moreLabel: 'Show More',
  categories: [
    {
      label: 'Hair',
      items: photos('hair', [
        'Copper highlights in bouncy curls',
        'Ash grey layered blow-dry',
        'Soft layers with a side-swept fringe',
        'Caramel balayage waves',
        'Purple and grey fashion colour curls',
        'Chestnut brown waves',
        'Caramel highlights in loose curls',
        'Copper-toned waves',
        'Voluminous blow-dry on dark hair',
        'Plum highlights in soft curls',
        'Copper-brown bob',
        'Layered cut with a curtain fringe',
        'Burgundy curls',
        'Copper global colour with layers',
        'Golden-brown straight lengths',
        'Soft bronze lob',
        'Rose-brown layers',
        'Chocolate curls with caramel lights',
        'Long defined curls',
        'Copper highlights with a bouncy blow-dry',
        'Auburn layers',
        'Honey balayage waves',
        'Sleek waist-length straight hair',
        'Golden blonde highlights with layers',
      ]),
    },
    {
      label: 'Nails',
      items: photos('nails', [
        'Pastel pedicure with nail art',
        'Lilac nails with heart accents',
        'Lilac ombre almond nails',
        'French tip nail extensions',
        'Glossy pink chrome nails',
        'Deep pink gel polish',
        'Glitter French nail extensions',
        'Burnt orange gel nails',
        'Classic red nails with mehndi',
        'Teal gel polish',
        'Clear extensions with line nail art',
        'Hot pink gel polish',
        'White gel nails',
        'Black and nude geometric nail art',
        'Lilac nails with red heart nail art',
        'Deep red almond nails',
      ]),
    },
    {
      label: 'Men & Kids',
      items: photos('men', [
        'Men’s textured crop with a fade',
        'Skin fade with a design line',
        'Men’s quiff with a taper fade',
        'Men’s textured top with a beard trim',
        'Men’s classic taper cut',
        'Men’s textured fringe with a beard',
        'Boy’s short haircut',
        'Kids’ bob haircut',
      ]),
    },
  ],
};
