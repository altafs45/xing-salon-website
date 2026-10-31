// Single source of truth for all site copy, links and image references.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { CTA } from './style';
import { allHoursText, bookingSlots, overallRating, SALON_HOURS, totalReviewsLabel, totalReviewsRounded } from './branches';
import type { IconKey } from './pages/types';

export interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The same sizes as AVIF, tried first. */
  avifSrcSet?: string;
  /** Smaller versions for small screens, e.g. "/images/hero-480.webp 480w, …". */
  srcSet?: string;
}

/** An image in /public/images, by file name (without .webp). */
export const img = (name: string, alt: string, width: number, height: number): Img => ({
  src: `/images/${name}.webp`,
  alt,
  width,
  height,
});

const mapSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export const site = {
  name: 'Xing',
  tagline: 'Premium Unisex Salon',
  url: 'https://www.xingsalons.com',
  menuUrl: 'https://xingsalons.com/menu.html',
  founded: 2020,
  // The owner's logo, lifted off its mock-up unchanged (public/brand). `light` is the version for dark
  // backgrounds; each has a 2x file for sharp phone screens. `square` is for search-engine schema.
  logo: {
    src: '/brand/logo.webp',
    srcSet: '/brand/logo.webp 1x, /brand/logo@2x.webp 2x',
    lightSrc: '/brand/logo-light.webp',
    lightSrcSet: '/brand/logo-light.webp 1x, /brand/logo-light@2x.webp 2x',
    width: 240,
    height: 118,
    square: '/brand/logo-square-512.png',
  },
  /** The full name, as shown to search engines, link previews and screen readers. */
  fullName: 'Xing Premium Unisex Salon',
  // Google rating across the three salons: calculated from their profiles in branches.ts, never typed.
  rating: overallRating,
  reviewCount: totalReviewsLabel,
  // 24-hour "HH:MM" in salon local time; drives the Open now badge, booking slots and schema.
  hours: SALON_HOURS,
  copyright: '© 2026 Xing Premium Unisex Salon. All Rights Reserved.',
};

/** How wide the hero photo is shown: full width on phones, three-fifths on desktop. Shared with the preload hint. */
export const HERO_SIZES = '(min-width: 1024px) 60vw, 100vw';

/** How wide a service page's hero photo is shown: full width on phones, half on desktop. */
export const SERVICE_HERO_SIZES = '(min-width: 1024px) 50vw, 100vw';

export const seo = {
  // Up to 60 and 155 characters, so search results show them in full.
  title: 'Xing Unisex Salon in Bangalore | Sarjapur, HSR, Brookfield',
  description:
    'Premium hair, skin & nail salon in Bangalore. Haircuts, hair colour, keratin, hair spa, hydra facials & nails at Sarjapur Road, HSR Layout & Brookfield.',
};

export const faqPath = '/faq';

export const nav = [
  { label: 'Home', id: 'home' },
  { label: 'Services', id: 'services' },
  { label: 'Offers', id: 'offers' },
  { label: 'Salons', id: 'branches' },
  { label: 'Blogs', id: 'guides' },
  { label: 'FAQ', id: 'faq' },
  { label: 'About Us', id: 'about' },
] as const;

export const hero = {
  eyebrow: 'Premium Unisex Salon',
  titleLines: ['Expert Beauty', 'Guidance.'],
  titleAccent: 'Beautiful Results.',
  text: 'Hair, skin, nails and bridal hair care designed around you.',
  primaryCta: 'Book Appointment',
  secondaryCta: 'Chat on WhatsApp',
  assurances: ['Free consultation', 'Walk-ins welcome', 'Price confirmed before we start'],
  trust: [
    { icon: 'star', label: `${overallRating} on Google · ${totalReviewsLabel} reviews` },
    { icon: 'expert', label: 'Expert professionals' },
    { icon: 'shield', label: 'Hygienic & safe' },
    { icon: 'pin', label: '3 salons in Bangalore' },
  ],
  badge: 'BEAUTY • CARE • CONFIDENCE • YOU • ',
  script: ['More', 'Than', 'a Salon'],
  image: {
    ...img('hero', 'Reception desk and illuminated sign at Xing HSR Layout', 1200, 858),
    srcSet: '/images/hero-480.webp 480w, /images/hero-800.webp 800w, /images/hero.webp 1200w',
  },
  archImage: img('hero-arch', 'Pedicure lounge at Xing HSR Layout', 520, 800),
} as const;

export const services = {
  eyebrow: 'Our Services',
  title: 'Find the Right Beauty Service for You',
  text: 'Personalised services to bring out your natural beauty.',
  cta: 'View All Services',
  menuEyebrow: 'Service Menu',
  menuTitle: 'Everything We Offer',
  menuNote: 'Pricing is confirmed at your salon after a consultation.',
  menuSearch: 'Search services…',
  menuEmpty: 'No results',
  // One card per category (services.ts `categories`), linking to its page.
  items: [
    {
      title: 'Hair Care',
      text: 'Haircuts, hair colour, smoothing and hair treatments.',
      href: '/services/hair-care',
      image: img('svc-hair', 'Styling stations with round lit mirrors at Xing HSR Layout', 640, 480),
    },
    {
      title: 'Skin & Body',
      text: 'Facials, clean-ups, body polish, waxing, threading and de-tan.',
      href: '/services/skin-body',
      // Shown over the card photo.
      badge: 'Bestseller',
      image: img('svc-skin', 'Pedicure lounge with armchairs at Xing HSR Layout', 640, 480),
    },
    {
      title: 'Nail Care',
      text: 'Manicure, pedicure, extensions, nail art and quick nail care.',
      href: '/services/nail-care',
      image: img('svc-nails', 'The Nail Bar with neon signs at Xing HSR Layout', 640, 480),
    },
    {
      title: 'Tattoo',
      text: 'Custom, fine-line, realistic and cover-up tattoos in Brookfield.',
      href: '/services/tattoo',
      image: { src: '/images/tattoo-hero.svg', alt: 'Tattoo machine illustration for Xing Premium Tattoo Studio, Brookfield', width: 800, height: 600 },
    },
  ],
};

// The full service catalog. Names only: prices are intentionally not shown on the site.
// `bookAs` must match an entry in `booking.services`. `page` is the slug of the category's service page, if it has one.
export const serviceMenu = [
  {
    id: 'haircuts',
    label: 'Haircuts',
    bookAs: 'Haircut & Styling',
    note: 'Kids haircuts are for children up to 10 years.',
    sections: [
      { title: 'Women', items: ['Basic Haircut with Wash or Styling', 'Advance Haircut'] },
      { title: 'Kids', items: ['Kids Haircut (Boy)', 'Kids Haircut (Girl)'] },
    ],
  },
  {
    id: 'styling',
    label: 'Styling',
    bookAs: 'Haircut & Styling',
    page: 'womens-haircut-styling',
    note: 'Available for short, shoulder, below-shoulder and waist-length hair.',
    sections: [
      { title: '', items: ['Wash & Blast Dry', 'Wash & Blow Dry', 'Moroccan / Defabulous', 'Ironing', 'Tongs'] },
    ],
  },
  {
    id: 'hair-color',
    label: 'Hair Colour',
    bookAs: 'Hair Colour',
    page: 'global-hair-color',
    note: '',
    sections: [
      {
        title: '',
        items: [
          'Root Touch-up',
          'Root Touch-up (Ammonia Free)',
          'Global Colour',
          'Global Colour (Ammonia Free)',
          'Highlights',
          'Highlights (Per Foil)',
          'Crazy Colour (Per Foil)',
          'Balayage',
        ],
      },
    ],
  },
  {
    id: 'hair-treatments',
    label: 'Hair Treatments',
    bookAs: 'Hair Treatment',
    page: 'keratin-treatment',
    note: 'Available for short, shoulder, below-shoulder and waist-length hair.',
    sections: [
      { title: '', items: ['Smoothening', 'Straightening', 'Keratin', 'Cysteine', 'Botox', 'Nanoplastia'] },
    ],
  },
  {
    id: 'hair-spa',
    label: 'Hair Spa',
    bookAs: 'Hair Spa',
    page: 'hair-spa',
    note: 'Available for short, shoulder, below-shoulder and waist-length hair.',
    sections: [
      {
        title: '',
        items: [
          'Head Massage',
          'Nourishing',
          'Tribond',
          'Anti Dandruff',
          'Anti Hairfall',
          'Moroccan',
          'Olaplex (Add-on)',
          'Olaplex Spa',
        ],
      },
    ],
  },
  {
    id: 'skin-care',
    label: 'Skin Care',
    bookAs: 'Skin & Facial',
    page: 'facial-cleanup',
    note: '',
    sections: [
      { title: 'Clean-up', items: ['Masque', 'Premium'] },
      { title: 'Facial', items: ['Express', 'Premium', 'Ultra', 'Hydra Facial'] },
    ],
  },
  {
    id: 'body-polish',
    label: 'Body Polish',
    bookAs: 'Body Polish',
    page: 'body-polish',
    note: 'Available for female clients only.',
    sections: [{ title: '', items: ['Underarms', 'Full Arms', 'Back', 'Half Legs', 'Full Legs', 'Full Body'] }],
  },
  {
    id: 'waxing',
    label: 'Waxing',
    bookAs: 'Waxing',
    page: 'waxing',
    note: 'Flavored, cartridge and stripless wax options, depending on the area.',
    sections: [
      {
        title: '',
        items: [
          'Full Arms',
          'Full Legs',
          'Half Legs',
          'Front / Back',
          'Stomach',
          'Full Body',
          'Upper Lip / Lower Lip / Forehead / Chin',
          'Side Locks',
          'Underarms',
          'Full Face',
          'Bikini',
        ],
      },
    ],
  },
  {
    id: 'beauty-essentials',
    label: 'Threading & De‑tan',
    bookAs: 'Threading & De-tan',
    page: 'threading-detan',
    note: '',
    sections: [
      { title: 'Threading', items: ['Eyebrows / Forehead', 'Upper Lip / Lower Lip / Chin', 'Full Face', 'Side Locks'] },
      { title: 'De-tan', items: ['Underarms', 'Face & Neck', 'Foot', 'Arms (Half / Full)', 'Legs (Half / Full)'] },
    ],
  },
  {
    id: 'mani-pedi',
    label: 'Mani & Pedi',
    bookAs: 'Manicure & Pedicure',
    page: 'manicure',
    note: '',
    sections: [
      { title: 'Manicure & Pedicure', items: ['D-Lux', 'Crystal', 'Alga', 'Tango', 'Detox'] },
      { title: 'Foot Care', items: ['Foot Massage', 'Heel Peel Treatment'] },
    ],
  },
  {
    id: 'nails',
    label: 'Nails',
    bookAs: 'Nails',
    page: 'nail-extensions',
    note: '',
    sections: [
      { title: 'File & Polish', items: ['Cut & File', 'Normal Polish', 'Cut, File & Polish'] },
      {
        title: 'Extensions',
        items: ['Acrylic with Gel Polish', 'Temporary', 'Poly Gel', 'UV Builder Hard Gel', 'Builder in a Bottle'],
      },
      { title: 'Overlays', items: ['UV Builder Hard Gel', 'Acrylic', 'Refilling', 'Builder in a Bottle', 'Poly Gel'] },
      { title: 'Removal', items: ['Acrylic', 'Hard Poly Gel', 'Gel Paint', 'Temporary Extensions'] },
      {
        title: 'Nail Art',
        items: [
          'Chrome',
          'Cat Eye',
          'Stone',
          'Glitters',
          'French',
          'Ombre',
          'Millers',
          'Marble Art',
          '3D Art',
          'Gel Polish',
          'Liner',
          'Sticker',
          'Dry Flower',
          'Galaxy',
        ],
      },
    ],
  },
  {
    id: 'men-grooming',
    label: 'Men Grooming',
    bookAs: 'Men Grooming',
    page: 'mens-haircut-beard-grooming',
    note: '',
    sections: [
      { title: 'Hair', items: ['Haircut (without Wash)', 'Haircut (with Wash & Styling)', 'Creative Haircut', 'Head Massage'] },
      { title: 'Beard', items: ['Beard Shave', 'Beard Trim', 'Beard Styling', 'Beard Colour'] },
      { title: 'Colour', items: ['Global Colour', 'Global Colour (Ammonia Free)', 'Fashion Colour', 'Highlights'] },
    ],
  },
  {
    id: 'tattoo',
    label: 'Tattoo',
    bookAs: 'Tattoo',
    page: 'tattoo',
    note: '',
    sections: [{ title: '', items: ['Black & Grey Tattoo', 'Coloured Tattoo'] }],
  },
];

export const guides = {
  eyebrow: 'Beauty Guides',
  title: 'Educate Yourself on Your Beauty Needs',
  text: 'Read our beauty guides to choose the right service, know what to expect and care for your results. Written by Xing’s professionals.',
  // Shown once the blog has a live post.
  cta: 'Explore all guides',
  featuredBadge: 'Featured guide',
  readLabel: 'Read the guide',
  consultTitle: 'Still unsure? Get a free consultation',
  bookLabel: 'Book Appointment',
  whatsappLabel: 'Chat on WhatsApp',
  whatsappText: 'Hi Xing, I’d like a free consultation at Xing ___ (location). I’m not sure which service I need.',
  // Each guide opens as a short summary on the page. Its link points at the service page it leads to
  // (`page`, plus `anchor` for a section of it), which is also the URL search engines get.
  items: [
    {
      title: 'Balayage vs Global Hair Colour',
      category: 'Hair Colour',
      page: 'global-hair-color',
      excerpt: 'One blends, one transforms. See which suits your look and upkeep.',
      points: [
        'Global colour applies one shade from root to tip, ideal for grey coverage or a complete change.',
        'Balayage is hand-painted for soft, sun-kissed dimension that grows out gracefully.',
        'Choose global for uniform impact, balayage for a low-maintenance, natural finish.',
      ],
      image: img('guide-balayage-vs-global', 'Soft bronze balayage curls at Xing Salon Bangalore', 640, 400),
    },
    {
      title: 'Keratin vs Nanoplastia',
      category: 'Hair Treatments',
      page: 'keratin-treatment',
      // The large card in the section.
      featured: true,
      teaser: 'Find out which smoothing treatment suits your hair, how long each one lasts and what upkeep to expect.',
      excerpt: 'Two smoothing treatments, two different formulas and finishes.',
      points: [
        'Keratin coats the hair to tame frizz and add shine for around three to five months.',
        'Nanoplastia uses amino acids and nutrients to repair and straighten with a softer formula.',
        'Your stylist will recommend one based on hair texture, damage and how straight you want it.',
      ],
      image: img('guide-keratin-vs-nanoplastia', 'Poker-straight, glossy hair after a smoothing treatment at Xing Salon Bangalore', 640, 400),
    },
    {
      title: 'How to Choose a Hair Colour',
      category: 'Hair Colour',
      page: 'global-hair-color',
      anchor: 'menu',
      excerpt: 'Match shade to skin undertone, lifestyle and maintenance comfort.',
      points: [
        'Warm undertones glow with caramel, honey and copper; cool undertones suit ash and mocha.',
        'Think about upkeep: the further from your natural shade, the more frequent the touch-ups.',
        'A consultation with a strand test is the surest way to preview the result.',
      ],
      image: img('guide-choose-hair-color', 'Client with copper-red global hair colour at Xing Salon Bangalore', 640, 400),
    },
    {
      title: 'How Long Does Balayage Last?',
      category: 'Hair Colour',
      page: 'global-hair-color',
      anchor: 'faq',
      excerpt: 'Typically three to four months, and longer with the right care.',
      points: [
        'Because there is no harsh regrowth line, balayage usually lasts 12 to 16 weeks.',
        'A gloss or toner every six to eight weeks keeps the tone fresh.',
        'Sulphate-free shampoo and heat protection noticeably extend the life of your colour.',
      ],
      image: img('guide-balayage-last', 'Honey balayage waves seen from behind at Xing Salon Bangalore', 640, 400),
    },
    {
      title: 'Planning Your Bridal Hair',
      category: 'Bridal',
      page: 'womens-haircut-styling',
      anchor: 'bridal',
      excerpt: 'When to book treatments, colour and styling before the wedding.',
      points: [
        'Book hair treatments and colour six to eight weeks ahead, so your hair has settled by the big day.',
        'A hair spa three to four weeks before keeps lengths soft and glossy.',
        'Share your outfit, jewellery and reference photos with your stylist when you book your wedding-day styling.',
      ],
      image: img('svc-hair', 'Styling stations with round lit mirrors at Xing HSR Layout, where bridal hair is styled', 640, 480),
    },
    {
      title: 'How Often Should You Get a Hair Spa?',
      category: 'Hair Spa',
      page: 'hair-spa',
      excerpt: 'Usually every three to four weeks, adjusted to your hair type.',
      points: [
        'Dry, coloured or chemically treated hair benefits from a spa every two to three weeks.',
        'Healthy hair stays nourished with one session a month.',
        'Pair spa sessions with regular trims to keep ends strong and smooth.',
      ],
      image: img('guide-hair-spa', 'Stylist blow-drying a client’s hair after a spa treatment', 640, 400),
    },
  ],
};

/** Site-relative URL a guide links to. */
export const guidePath = (guide: { page: string; anchor?: string }) => `/services/${guide.page}${guide.anchor ? `#${guide.anchor}` : ''}`;

export const hairColor = {
  eyebrow: 'Hair Colour',
  title: 'Choose Your Hair Colour with Confidence',
  text: 'From subtle tones to bold transformations, find the perfect hair colour that suits your style, skin tone and lifestyle.',
  cta: 'Compare Hair Colour Options',
  options: [
    {
      name: 'Global Hair Colour',
      caption: 'Uniform all-over colour for a classic look.',
      description:
        'A single, even shade applied from root to tip. Perfect for full grey coverage or a clean, polished change of colour.',
      idealFor: 'Grey coverage, first-time colour, a uniform finish',
      duration: '1.5 – 2 hours',
      maintenance: 'Root touch-up every 4–6 weeks',
      bookAs: 'Global Hair Colour',
      image: img('color-global', 'Client with copper global hair colour at Xing Salon Bangalore', 640, 480),
    },
    {
      name: 'Balayage',
      caption: 'Hand-painted highlights for a natural, blended look.',
      description:
        'Freehand-painted lightness that melts into your natural shade, giving soft dimension and an easy grow-out.',
      idealFor: 'Low-maintenance, sun-kissed dimension',
      duration: '3 – 4 hours',
      maintenance: 'Gloss or toner every 6–8 weeks',
      bookAs: 'Balayage',
      image: img('color-balayage', 'Golden copper balayage waves at Xing Salon Bangalore', 640, 480),
    },
    {
      name: 'Ombre',
      caption: 'Dark roots to lighter lengths.',
      description:
        'A deliberate gradient from deeper roots to lighter ends for a striking, high-contrast statement.',
      idealFor: 'Bold contrast with minimal root upkeep',
      duration: '2.5 – 3.5 hours',
      maintenance: 'Tone refresh every 8–12 weeks',
      bookAs: 'Ombre',
      image: img('color-ombre', 'Dark roots fading into peach ombre ends at Xing Salon Bangalore', 640, 480),
    },
    {
      name: 'Fashion Colour',
      caption: 'Vibrant and expressive shades.',
      description:
        'Pastels, vivids and creative placements — from rose gold to electric blue — crafted to express your personality.',
      idealFor: 'Statement looks and creative expression',
      duration: '3 – 5 hours',
      maintenance: 'Colour refresh every 4–6 weeks',
      bookAs: 'Fashion Colour',
      image: img('color-fashion', 'Purple and lilac fashion colour streaks at Xing Salon Bangalore', 640, 480),
    },
  ],
};

// The home page's Offers section. The offers themselves (prices, terms, posters) live in offers.ts.
export const offers = {
  eyebrow: 'Special Offers',
  title: 'Exclusive Xing Offers',
  text: 'Up to 37% off hair colour, a flat keratin price for any length, 35% off Hydra Facial and 25% off every Tuesday.',
  cta: 'View All Offers',
  note: 'Limited-time offers. Terms apply; your salon confirms the final details before starting.',
  claimLabel: 'Claim Offer',
  detailsLabel: 'Details',
};

/** A photo of the salon's own work, named by what it shows. Files are 600 × 800 portraits in /public/images. */
const work = (name: string, caption: string) => ({
  caption,
  image: img(name, `${caption} at Xing Salon Bangalore`, 600, 800),
});

// Real client results only: no stock photos here. Service pages show these too, through `workPhotos`.
export const transformations = {
  eyebrow: 'Real Transformations',
  title: 'Signature Transformations',
  cta: 'View More',
  categories: [
    {
      label: 'Balayage',
      items: [
        work('work-balayage-1', 'Caramel balayage curls'),
        work('work-balayage-2', 'Honey balayage waves'),
        work('work-balayage-4', 'Golden copper balayage'),
        work('work-balayage-5', 'Blonde face-framing balayage'),
        work('work-balayage-3', 'Soft bronze balayage'),
        work('work-balayage-6', 'Chestnut balayage'),
        work('work-balayage-7', 'Caramel melt on dark hair'),
        work('work-balayage-8', 'Mocha balayage with bouncy layers'),
      ],
    },
    {
      label: 'Highlights',
      items: [
        work('work-highlights-1', 'Golden blonde highlights'),
        work('work-highlights-2', 'Ash blonde highlights'),
        work('work-highlights-3', 'Copper ribbon highlights'),
        work('work-highlights-4', 'Honey highlights on dark hair'),
        work('work-highlights-5', 'Soft ash-brown highlights'),
        work('work-highlights-6', 'Sun-kissed caramel highlights'),
        work('work-highlights-7', 'Mahogany highlights'),
        work('work-highlights-8', 'Warm copper-blonde highlights'),
      ],
    },
    {
      label: 'Haircuts & Styling',
      items: [
        work('work-haircut-2', 'Long layers with a soft blow-dry'),
        work('work-haircut-6', 'Face-framing layers'),
        work('work-haircut-1', 'Bouncy layered curls'),
        work('work-haircut-4', 'Shoulder-length layered cut'),
        work('work-haircut-7', 'Layers with golden highlights'),
        work('work-haircut-3', 'Side-swept layers'),
        work('work-haircut-5', 'Layered cut, back view'),
      ],
    },
    {
      label: 'Global Colour',
      items: [
        work('work-global-1', 'Copper global colour'),
        work('work-global-2', 'Rose-brown global colour'),
        work('work-global-3', 'Vivid copper-red'),
        work('work-global-4', 'Burnt copper layers'),
        work('work-global-5', 'Golden brown curls'),
        work('work-global-6', 'Chocolate brown waves'),
        work('work-global-7', 'Light chestnut brown'),
        work('work-global-8', 'Rosewood brown layers'),
      ],
    },
    {
      label: 'Fashion Colours',
      items: [
        work('work-fashion-3', 'Plum with a purple money piece'),
        work('work-fashion-1', 'Teal green waves'),
        work('work-fashion-8', 'Fiery red dip-dye'),
        work('work-fashion-4', 'Purple and lilac streaks'),
        work('work-fashion-5', 'Lilac face-framing colour'),
        work('work-fashion-6', 'Red ombre bob'),
        work('work-fashion-2', 'Violet panels'),
        work('work-fashion-7', 'Deep burgundy'),
      ],
    },
    {
      label: 'Keratin & Botox',
      items: [
        work('work-smoothing-2', 'Glass-smooth straight hair'),
        work('work-smoothing-3', 'Smooth, glossy finish'),
        work('work-smoothing-1', 'Sleek, frizz-free lengths'),
        work('work-smoothing-4', 'Extra-long hair, smooth from root to tip'),
        work('work-smoothing-5', 'Soft, natural-looking smoothness'),
        work('work-smoothing-6', 'Extra-long hair, sleek back view'),
      ],
    },
    {
      label: 'Nanoplastia',
      items: [
        work('work-nanoplastia-3', 'Poker-straight, glossy finish'),
        work('work-nanoplastia-1', 'Sleek V-cut lengths'),
        work('work-nanoplastia-2', 'Mirror-shine straight hair'),
        work('work-nanoplastia-4', 'Smooth mid-length hair'),
        work('work-nanoplastia-5', 'Long, frizz-free lengths'),
        work('work-nanoplastia-6', 'Smoothed coloured hair'),
        work('work-nanoplastia-7', 'Silky straight hair'),
        work('work-nanoplastia-8', 'Sleek waist-length hair'),
      ],
    },
    {
      label: 'Men’s Grooming',
      items: [
        work('work-men-1', 'Textured quiff with skin fade and beard'),
        work('work-men-2', 'Brushed-up quiff with taper fade'),
        work('work-men-3', 'Mid fade with full beard'),
        work('work-men-4', 'Side-swept top with low fade'),
        work('work-men-5', 'Textured crop with taper fade'),
      ],
    },
  ],
};

/** The first `count` photos of each named Transformations category, in the shape a service page gallery takes. */
export const workPhotos = (labels: string[], count = Infinity) =>
  transformations.categories
    .filter((category) => labels.includes(category.label))
    .flatMap((category) => category.items.slice(0, count).map((item) => ({ ...item.image, design: item.caption })));

/** Treatment photos for a service page gallery: /images/gal-<slug>-<n>.webp (600 × 600), each with a 400px version. */
export const servicePhotos = (slug: string, items: Array<[design: string, alt: string]>) =>
  items.map(([design, alt], i) => {
    const file = `/images/gal-${slug}-${i + 1}`;
    return { src: `${file}.webp`, srcSet: `${file}-400.webp 400w, ${file}.webp 600w`, alt, width: 600, height: 600, design };
  });

/** A service page's hero photo: /images/svc-<slug>-hero.webp (800 × 600), with a 480px version. */
export const serviceHero = (slug: string, alt: string) => ({
  src: `/images/svc-${slug}-hero.webp`,
  srcSet: `/images/svc-${slug}-hero-480.webp 480w, /images/svc-${slug}-hero.webp 800w`,
  alt,
  width: 800,
  height: 600,
});

export const why = {
  eyebrow: 'Why Choose Xing',
  titleLines: ['More Than a Salon', 'A Complete Beauty Experience'],
  features: [
    { icon: 'consult', label: 'Expert Consultation' },
    { icon: 'products', label: 'Premium Products' },
    { icon: 'personal', label: 'Personalised Service' },
    { icon: 'hygiene', label: 'Hygiene & Care' },
    { icon: 'pin', label: 'Multiple Locations' },
  ],
  journeyEyebrow: 'Your Xing Experience',
  journey: [
    { step: 'Explore', text: 'Discover our services and guides' },
    { step: 'Choose', text: 'Select the service that suits you' },
    { step: 'Consult', text: 'Get expert advice from our professionals' },
    { step: 'Transform', text: 'Enjoy a relaxing premium experience' },
    { step: 'Maintain', text: 'Follow a personalised care routine' },
  ],
  script: 'A Beauty Haven',
  // The same corner of the salon twice: a portrait photo for desktop, a landscape one for phones and tablets.
  image: img('why-salon', 'Pedicure lounge with armchairs under the “Just Relax” sign at Xing HSR Layout', 520, 700),
  wideImage: img('why-salon-wide', 'Pedicure lounge and Nail Bar at Xing HSR Layout', 800, 500),
} as const;

/**
 * Bridal hair care and pre-wedding salon services. Each card links to an existing service page; there is
 * no bridal package. Shown on the landing page and on some service pages.
 */
export const bridalCare = {
  eyebrow: 'For Brides & Guests',
  title: 'Bridal Hair Care & Pre-Wedding Salon Services in Bangalore',
  text: 'Your wedding look starts weeks before the big day. At Xing Premium Unisex Salon, we help brides, grooms and wedding guests prepare with bridal hair styling, hair spas and treatments, glowing facials, body polishing, waxing, manicures, pedicures and nail art, at our salons in Sarjapur Road, HSR Layout and Brookfield.',
  cards: [
    {
      id: 'hair-styling',
      title: 'Bridal Hair Styling',
      text: 'Blow dries, sleek ironed looks and soft curls for the bride and her guests.',
      slug: 'womens-haircut-styling',
      icon: 'crown',
    },
    {
      id: 'hair-spa',
      title: 'Hair Spa & Treatments',
      text: 'Hair spas, Olaplex and smoothing treatments for soft, glossy hair.',
      slug: 'hair-spa',
      icon: 'droplets',
    },
    {
      id: 'glow',
      title: 'Pre-Wedding Glow',
      text: 'A 7-Step Hydra Facial series for fresh, glowing skin.',
      slug: 'hydra-facial',
      icon: 'sparkles',
    },
    {
      id: 'body-polish',
      title: 'Body Polish',
      text: 'Scrub, polish and nourishing lotion for soft, glowing skin. For women.',
      slug: 'body-polish',
      icon: 'heart',
    },
    {
      id: 'waxing',
      title: 'Waxing & Threading',
      text: 'Smooth skin and neat brows before the celebrations.',
      slug: 'waxing',
      icon: 'brush',
    },
    {
      id: 'nails',
      title: 'Wedding Nails',
      text: 'Manicures, extensions and bridal nail art to finish your look.',
      slug: 'nail-art',
      icon: 'star',
    },
  ],
  timelineTitle: 'Suggested timeline',
  timeline: [
    { title: '6–8 weeks before', text: 'Hair treatments & colour' },
    { title: '3–4 weeks before', text: 'Hydra facial series, hair spa' },
    { title: '1 week before', text: 'Waxing, threading, de-tan' },
    { title: '1–3 days before', text: 'Body polish, mani-pedi, nail art' },
    { title: 'Wedding day', text: 'Hair styling' },
  ],
  cta: 'Plan My Wedding Prep on WhatsApp',
  whatsappText: 'Hi, I’m planning my wedding prep at Xing ___ (location). Wedding date: ___ Services I’m interested in: ___',
} as const satisfies {
  cards: ReadonlyArray<{ id: string; title: string; text: string; slug: string; icon: IconKey }>;
  [key: string]: unknown;
};

export const reviews = {
  eyebrow: 'What Our Clients Say',
  rating: site.rating,
  ratingLabel: `from ${site.reviewCount} Google reviews`,
  source: 'Google review',
  // Client feedback as published on xingsalons.com.
  items: [
    {
      quote: 'Went for a hair colour and cut — extremely professional and the outcome was exactly what I showed.',
      name: 'Ananya Misra',
    },
    {
      quote: 'I’ve done keratin at other salons and it always wore off in 6 weeks. This one lasted nearly 4 months.',
      name: 'Priya S.',
    },
    {
      quote: 'Expert advice led to a result I love, plus a classy haircut that complements my personality.',
      name: 'Alina Jana',
    },
    {
      quote:
        'They told me my hair wasn’t ready for smoothening and recommended a repair treatment first. I appreciated the honesty.',
      name: 'Kavitha R.',
    },
    {
      quote:
        'Got Nanoplastia done here. My hair feels so natural and soft — nothing like the stiff straightened look elsewhere.',
      name: 'Ritu K.',
    },
  ],
};

/**
 * "Signature Service: Hair Colour" on the landing page. The colour cards come from `hairColor.options`, the
 * photo from `transformations`, the rating from `site` and the offer from offers.ts. `faqs` is also sent to
 * search engines (seo.ts), so keep it free of prices and of promises the salon can't keep.
 */
export const signatureColor = {
  eyebrow: 'Our Signature Service',
  title: 'Hair Colour in Bangalore, Done Right the First Time',
  text: 'Walk out with the colour you pictured. We consult first, confirm the price before we start, and offer Olaplex to protect your hair.',
  // Three balayage results from the Transformations section.
  featured: transformations.categories[0].items.slice(0, 3),
  benefits: [
    { icon: 'users', title: 'Free colour consultation', text: 'Talk through your look first. No charge and no pressure.' },
    {
      icon: 'shield',
      title: 'Olaplex bond protection',
      text: 'Olaplex is a treatment that protects the bonds that keep hair strong while it is coloured. Add it to any colour.',
    },
    {
      icon: 'heart',
      title: 'Patch test & hair-health check',
      text: 'We check your hair’s condition before any colour goes on. Patch tests are available on request.',
    },
    { icon: 'palette', title: 'Shade matched to your skin tone', text: 'Your colourist picks tones that flatter your skin and fit your routine.' },
  ],
  offerSuffix: 'on hair colours',
  cardsTitle: 'Choose your colour',
  labels: { bestFor: 'Best for', duration: 'Duration', maintenance: 'Upkeep', book: 'Book this' },
  cta: 'Book Hair Colour',
  bookAs: 'Hair Colour',
  whatsappCta: 'Chat on WhatsApp',
  whatsappLabel: 'Chat on WhatsApp about hair colour',
  areas: 'Hair colour, highlights and balayage in Sarjapur Road, HSR Layout and Brookfield.',
  areasLink: { label: 'Find your nearest salon', href: '/salons' },
  stepsTitle: 'How it works',
  steps: [
    { title: 'Consult', text: 'A free chat about your hair, your skin tone and the look you want. We confirm the price here.' },
    { title: 'Patch test', text: 'New to colour or have sensitive skin? We offer a patch test and check your hair’s health first.' },
    { title: 'Colour', text: 'Your colourist applies your shade, with Olaplex if you choose it.' },
    { title: 'Aftercare plan', text: 'You leave with simple care tips and a touch-up schedule, so your colour stays fresh.' },
  ],
  trustTitle: 'Looking for the best hair colour salon in Bangalore? Hear it from our clients.',
  // The hair-colour review from the Reviews section.
  review: reviews.items[0],
  faqTitle: 'Hair colour questions, answered',
  faqs: [
    {
      q: 'How long does balayage last?',
      a: 'Usually 12 to 16 weeks, because it grows out softly with no harsh line at the roots. A gloss or toner every six to eight weeks keeps the tone fresh.',
    },
    {
      q: 'How much does hair colour cost?',
      a: 'It depends on the technique and on the length and thickness of your hair. We confirm the price after your free consultation and before we start, with no hidden charges.',
    },
    {
      q: 'Will colour damage my hair?',
      a: 'Colouring and lightening can weaken hair. So we check your hair’s health first and offer Olaplex, a treatment that protects the bonds inside each strand, as an add-on to any colour.',
    },
    {
      q: 'Which colour suits my skin tone?',
      a: 'Warm undertones glow with caramel, honey and copper, while cool undertones suit ash and mocha. Your colourist matches the shade to your skin tone during the consultation.',
    },
  ],
  linksTitle: 'Keep reading',
  // Both guides open from the Beauty Guides section of the landing page.
  links: [
    { label: 'Balayage vs global hair colour: which one suits you?', href: '#guides' },
    { label: 'How long does balayage last?', href: '#guides' },
  ],
  pageLink: { label: 'All hair colour, highlights and balayage services', slug: 'global-hair-color' },
  // The bridal section lives on this service page.
  bridalLink: { label: 'Getting married? Explore bridal hair', href: '/services/womens-haircut-styling#bridal' },
} as const satisfies { benefits: ReadonlyArray<{ icon: IconKey; title: string; text: string }>; [key: string]: unknown };

export const gallery = {
  eyebrow: 'Inside Xing',
  // One slide per salon; each salon's description, address and photos come from locations.ts.
  title: (branch: string) => `Step Inside Our ${branch} Salon`,
  cta: CTA.book,
  whatsappText: (branch: string) => `Hi Xing, I’d like to book a visit at Xing ${branch}.`,
  directions: 'Get Directions',
  call: 'Call',
  tabsLabel: 'Choose a salon',
  pause: 'Pause the salon slideshow',
  play: 'Play the salon slideshow',
};

export const locationsSection = {
  eyebrow: 'Find Your Nearest Xing Salon',
  cta: 'View All Locations',
  allUrl: mapSearch('Xing Premium Unisex Salon Bengaluru'),
  viewLabel: 'View Location',
  directionsLabel: 'Get Directions',
  bookLabel: 'Book at',
  whatsappLabel: 'WhatsApp',
};

// The salons themselves live in locations.ts.
export { locations, primaryLocation } from './branches';

export const faq = {
  eyebrow: 'Frequently Asked Questions',
  items: [
    {
      q: 'What services does Xing offer?',
      a: 'Xing offers haircuts, styling, hair colour, hair treatments and hair spa, along with skin care, body polish, waxing, threading, de-tan, manicure and pedicure, nails, men’s grooming and tattoo services — all with professional consultation and premium products. See the full list in our service menu.',
    },
    {
      q: 'How do I choose the right hair colour?',
      a: 'Start with a consultation. Our colourists look at your skin undertone, natural shade, hair health and how much upkeep you are comfortable with, then recommend options that suit you.',
    },
    {
      q: 'Does Xing have multiple locations?',
      a: `Yes. You can visit us at Sarjapur Road, HSR Layout and AECS Layout, Brookfield in Bangalore. ${allHoursText}`,
    },
    {
      q: 'Do you offer bridal services?',
      a: 'Yes. We offer bridal hair styling and pre-wedding salon care, including hair spas and treatments, facials, body polish, waxing, manicures, pedicures and nail art.',
    },
    {
      q: 'Can I book a consultation first?',
      a: 'Absolutely. Choose “Consultation” when booking and one of our experts will guide you on the right service before you commit to anything.',
    },
    {
      q: 'How can I see the latest offers?',
      a: 'Current offers are listed in the Offers section of this page and on our offers page. They can vary by location, so your salon will confirm the final offer during consultation.',
    },
  ],
};

export const about = {
  eyebrow: 'About Xing Premium Unisex Salon',
  paragraphs: [
    'Xing Premium Unisex Salon is a modern beauty destination for hair, skin, nails and bridal hair care. With expert professionals, premium products and personalised care, we help you look and feel your best at every stage.',
    'Established in 2020, with three salons across Bangalore and a strong focus on education and guidance, Xing is more than a salon — it’s a space where beauty, care and confidence come together.',
  ],
  stats: [
    { value: 3, suffix: '', decimals: 0, label: 'Locations' },
    { value: totalReviewsRounded, suffix: '+', decimals: 0, label: 'Google Reviews' },
    { value: 100, suffix: '+', decimals: 0, label: 'Services' },
    { value: site.rating, suffix: '', decimals: 1, label: 'Google Rating' },
  ],
};

export const cta = {
  title: 'Ready for Your Next Look?',
  book: 'Book Appointment',
  find: 'Find Your Salon',
  explore: 'Explore Services',
};

/** The agency that built the site: a small credit at the very foot of every page. Details from kryptonix.digital. */
export const builtBy = {
  label: 'Website designed & developed by',
  name: 'Kryptonix Digital & AI Solutions',
  url: 'https://kryptonix.digital/',
  logo: { src: '/brand/kryptonix-logo.webp', alt: 'Kryptonix — Digital & AI Solutions', width: 280, height: 70 },
  phone: '+91 70047 08826',
  phoneHref: 'tel:+917004708826',
  email: 'support@kryptonix.digital',
  address: 'Anusha Villa, Flat G1, Plot 82 83 P, SP Colony, Moti Nagar, Hyderabad, Telangana 500018',
};

export const footer = {
  socials: [
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/xingpremiumsalons/' },
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/xingpremiumsalons/' },
  ],
  columns: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Guides', href: '#guides' },
        { label: 'Blog', href: '/blog' },
        { label: 'Offers', href: '/offers' },
        { label: 'Gift Cards & Membership', href: '/membership-gift-cards' },
      ],
    },
    {
      title: 'Our Services',
      links: [
        { label: 'Hair Care', href: '/services/hair-care' },
        { label: 'Skin & Body', href: '/services/skin-body' },
        { label: 'Nail Care', href: '/services/nail-care' },
        { label: 'Tattoo', href: '/services/tattoo' },
        { label: 'All Services', href: '/services' },
      ],
    },
    {
      title: 'Our Expertise',
      links: [
        { label: 'Hair Colour', href: '#hair-color' },
        { label: 'Hair Treatments', href: '/services/hair-care#treatments' },
        { label: 'Bridal & Pre-Wedding', href: '/services/womens-haircut-styling#bridal' },
        { label: 'Salon Experience', href: '#why-xing' },
      ],
    },
    {
      title: 'Help & Support',
      links: [
        { label: 'Find a Salon', href: '/salons' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Client Reviews', href: '#reviews' },
        { label: 'About Xing', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
      ],
    },
  ],
  contactTitle: 'Our Salons',
  backToTop: 'Back to Top',
};

export const booking = {
  title: 'Book Your Appointment',
  steps: ['Service', 'Visit', 'Details'],
  services: [
    'Haircut & Styling',
    'Hair Colour',
    'Global Hair Colour',
    'Balayage',
    'Ombre',
    'Fashion Colour',
    'Hair Treatment',
    'Keratin Treatment',
    'Hair Spa',
    'Skin & Facial',
    'Body Polish',
    'Waxing',
    'Threading & De-tan',
    'Manicure & Pedicure',
    'Nails',
    'Men Grooming',
    'Tattoo',
    'Bridal Hair Styling',
    'Consultation',
  ],
  // Each salon's hourly slots; with no salon chosen, the widest range.
  slotsFor: (salon?: Parameters<typeof bookingSlots>[0]) => bookingSlots(salon),
  successTitle: 'Request received!',
  successText: 'Send it to us on WhatsApp to confirm your slot — our team will reply shortly.',
};
