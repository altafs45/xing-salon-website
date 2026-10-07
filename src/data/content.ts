// Single source of truth for all site copy, links and image references.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.

export interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Smaller versions for small screens, e.g. "/images/hero-480.webp 480w, …". */
  srcSet?: string;
}

const img = (name: string, alt: string, width: number, height: number): Img => ({
  src: `/images/${name}.webp`,
  alt,
  width,
  height,
});

const mapSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const mapDirections = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const site = {
  name: 'XING',
  tagline: 'Premium Unisex Salon',
  url: 'https://www.xingsalons.com',
  menuUrl: 'https://xingsalons.com/menu.html',
  // Central booking WhatsApp, used by service pages that send a prefilled message.
  whatsappHref: 'https://wa.me/917004708826',
  // Central phone line, used by the sticky action bar and the mobile menu.
  phoneHref: 'tel:+917004708826',
  founded: 2020,
  logo: { src: '/images/logo.webp', lightSrc: '/images/logo-light.webp', width: 480, height: 235 },
  // Google rating across the three salons, as published on xingsalons.com.
  rating: 4.9,
  reviewCount: '2,264+',
  // 24-hour "HH:MM" in salon local time; drives the Open now badge, booking slots and schema.
  hours: { opens: '10:00', closes: '21:30', label: '10:00 AM – 9:30 PM', days: 'Mon – Sun', timeZone: 'Asia/Kolkata' },
  copyright: '© 2026 XING Premium Unisex Salon. All Rights Reserved.',
};

/** How wide the hero photo is shown: full width on phones, three-fifths on desktop. Shared with the preload hint. */
export const HERO_SIZES = '(min-width: 1024px) 60vw, 100vw';

/** How wide a service page's hero photo is shown: full width on phones, half on desktop. */
export const SERVICE_HERO_SIZES = '(min-width: 1024px) 50vw, 100vw';

export const openingMinutes = { open: toMinutes(site.hours.opens), close: toMinutes(site.hours.closes) };

export const seo = {
  title: 'XING Premium Unisex Salon | Hair, Skin, Nails & Bridal Makeup in Bangalore',
  description:
    'XING is a premium unisex salon in Bangalore offering expert haircuts, hair color, balayage, keratin, nanoplastia, skin, nails and bridal makeup at HSR Layout, Sarjapur Road and AECS Layout, Brookefield. Book your appointment today.',
};

export const nav = [
  { label: 'Home', id: 'home' },
  { label: 'Services', id: 'services' },
  { label: 'Guides', id: 'guides' },
  { label: 'Offers', id: 'offers' },
  { label: 'Transformations', id: 'transformations' },
  { label: 'Locations', id: 'locations' },
  { label: 'About', id: 'about' },
] as const;

export const hero = {
  eyebrow: 'Premium Unisex Salon',
  titleLines: ['Expert Beauty', 'Guidance.'],
  titleAccent: 'Beautiful Results.',
  text: 'Hair, skin, nails, makeup and bridal services designed around you.',
  primaryCta: 'Book Appointment',
  secondaryCta: 'Chat on WhatsApp',
  assurances: ['Free consultation', 'Walk-ins welcome', 'Price confirmed before we start'],
  trust: [
    { icon: 'star', label: '4.9 on Google · 2,264+ reviews' },
    { icon: 'expert', label: 'Expert professionals' },
    { icon: 'shield', label: 'Hygienic & safe' },
    { icon: 'pin', label: '3 salons in Bengaluru' },
  ],
  badge: 'BEAUTY • CARE • CONFIDENCE • YOU • ',
  script: ['More', 'Than', 'a Salon'],
  image: {
    ...img('hero', 'Styling stations and pedicure lounge at XING HSR Layout', 1200, 858),
    srcSet: '/images/hero-480.webp 480w, /images/hero-800.webp 800w, /images/hero.webp 1200w',
  },
  archImage: img('hero-arch', 'The Nail Bar at XING HSR Layout', 520, 800),
} as const;

export const services = {
  eyebrow: 'Our Services',
  title: 'Find the Right Beauty Service for You',
  text: 'Personalised services to bring out your natural beauty.',
  cta: 'View All Services',
  menuEyebrow: 'Service Menu',
  menuTitle: 'Everything We Offer',
  menuNote: 'Pricing is confirmed at your salon after a consultation.',
  // Each card opens the matching category in the service menu below it, or links to `page` once that service page is published.
  items: [
    {
      title: 'Hair',
      text: 'Haircuts, styling, hair color, hair spa and treatments.',
      opens: 'haircuts',
      page: 'womens-haircut-styling',
      image: img('svc-hair', 'Styling chairs and arched mirrors at XING HSR Layout', 640, 480),
    },
    {
      title: 'Skin & Body',
      text: 'Facials, clean-ups, body polish, waxing, threading and de-tan.',
      opens: 'skin-care',
      page: 'hydra-facial',
      // Shown over the card photo.
      badge: 'Bestseller',
      image: img('svc-skin', 'Pedicure lounge with pink armchairs at XING HSR Layout', 640, 480),
    },
    {
      title: 'Nails',
      text: 'Manicure, pedicure, extensions, overlays and nail art.',
      opens: 'nails',
      page: 'manicure-pedicure',
      image: img('svc-nails', 'The Nail Bar at XING HSR Layout', 640, 480),
    },
    {
      title: 'Men Grooming',
      text: 'Haircuts, beard styling, color and head massage.',
      opens: 'men-grooming',
      page: 'mens-haircut-grooming',
      image: img('svc-men', 'Styling stations at XING Sarjapur Road', 640, 480),
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
    label: 'Hair Color',
    bookAs: 'Hair Color',
    page: 'hair-color',
    note: '',
    sections: [
      {
        title: '',
        items: [
          'Root Touch-up',
          'Root Touch-up (Ammonia Free)',
          'Global Color',
          'Global Color (Ammonia Free)',
          'Highlights',
          'Highlights (Per Foil)',
          'Crazy Color (Per Foil)',
          'Balayage',
        ],
      },
    ],
  },
  {
    id: 'hair-treatments',
    label: 'Hair Treatments',
    bookAs: 'Hair Treatment',
    page: 'keratin-hair-treatment',
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
    label: 'Threading & De-tan',
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
    page: 'manicure-pedicure',
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
    page: 'mens-haircut-grooming',
    note: '',
    sections: [
      { title: 'Hair', items: ['Haircut (without Wash)', 'Haircut (with Wash & Styling)', 'Creative Haircut', 'Head Massage'] },
      { title: 'Beard', items: ['Beard Shave', 'Beard Trim', 'Beard Styling', 'Beard Color'] },
      { title: 'Color', items: ['Global Color', 'Global Color (Ammonia Free)', 'Fashion Color', 'Highlights'] },
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
  title: 'Not Sure What You Need? Start Here.',
  text: 'Simple guides to help you choose the right services, understand the process and prepare for your appointment.',
  cta: 'Explore XING Beauty Guides',
  items: [
    {
      title: 'Balayage vs Global Hair Color',
      excerpt: 'One blends, one transforms. See which suits your look and upkeep.',
      points: [
        'Global color applies one shade from root to tip, ideal for grey coverage or a complete change.',
        'Balayage is hand-painted for soft, sun-kissed dimension that grows out gracefully.',
        'Choose global for uniform impact, balayage for a low-maintenance, natural finish.',
      ],
      image: img('guide-balayage-vs-global', 'Stylist curling balayage-coloured hair', 640, 400),
    },
    {
      title: 'Keratin vs Nanoplastia',
      excerpt: 'Two smoothing treatments, two different formulas and finishes.',
      points: [
        'Keratin coats the hair to tame frizz and add shine for around three to five months.',
        'Nanoplastia uses amino acids and nutrients to repair and straighten with a softer formula.',
        'Your stylist will recommend one based on hair texture, damage and how straight you want it.',
      ],
      image: img('guide-keratin-vs-nanoplastia', 'Client having hair washed at a salon basin', 640, 400),
    },
    {
      title: 'How to Choose a Hair Color',
      excerpt: 'Match shade to skin undertone, lifestyle and maintenance comfort.',
      points: [
        'Warm undertones glow with caramel, honey and copper; cool undertones suit ash and mocha.',
        'Think about upkeep: the further from your natural shade, the more frequent the touch-ups.',
        'A consultation with a strand test is the surest way to preview the result.',
      ],
      image: img('guide-choose-hair-color', 'Woman with rich copper-red hair', 640, 400),
    },
    {
      title: 'How Long Does Balayage Last?',
      excerpt: 'Typically three to four months, and longer with the right care.',
      points: [
        'Because there is no harsh regrowth line, balayage usually lasts 12 to 16 weeks.',
        'A gloss or toner every six to eight weeks keeps the tone fresh.',
        'Sulphate-free shampoo and heat protection noticeably extend the life of your color.',
      ],
      image: img('guide-balayage-last', 'Long balayage hair seen from behind', 640, 400),
    },
    {
      title: 'What to Know Before Bridal Makeup',
      excerpt: 'Trials, timelines and skin prep for a flawless wedding day.',
      points: [
        'Book a trial four to six weeks ahead so the look can be refined with your outfit and jewellery.',
        'Start a pre-bridal skin routine at least a month before the wedding.',
        'Share reference photos, venue lighting and the ceremony schedule with your artist.',
      ],
      image: img('guide-bridal-makeup', 'Bride in an embroidered outfit before her ceremony', 640, 400),
    },
    {
      title: 'How Often Should You Get a Hair Spa?',
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

export const hairColor = {
  eyebrow: 'Hair Color',
  title: 'Choose Your Hair Color with Confidence',
  text: 'From subtle tones to bold transformations, find the perfect hair color that suits your style, skin tone and lifestyle.',
  cta: 'Compare Hair Color Options',
  options: [
    {
      name: 'Global Hair Color',
      caption: 'Uniform all-over colour for a classic look.',
      description:
        'A single, even shade applied from root to tip. Perfect for full grey coverage or a clean, polished change of color.',
      idealFor: 'Grey coverage, first-time color, a uniform finish',
      duration: '1.5 – 2 hours',
      bookAs: 'Global Hair Color',
      image: img('color-global', 'Woman with glossy single-tone brunette hair', 400, 400),
    },
    {
      name: 'Balayage',
      caption: 'Hand-painted highlights for a natural, blended look.',
      description:
        'Freehand-painted lightness that melts into your natural shade, giving soft dimension and an easy grow-out.',
      idealFor: 'Low-maintenance, sun-kissed dimension',
      duration: '3 – 4 hours',
      bookAs: 'Balayage',
      image: img('color-balayage', 'Curled hair with soft caramel balayage', 400, 400),
    },
    {
      name: 'Ombre',
      caption: 'Dark roots to lighter lengths.',
      description:
        'A deliberate gradient from deeper roots to lighter ends for a striking, high-contrast statement.',
      idealFor: 'Bold contrast with minimal root upkeep',
      duration: '2.5 – 3.5 hours',
      bookAs: 'Ombre',
      image: img('color-ombre', 'Woman with darker roots fading into light blonde lengths', 400, 400),
    },
    {
      name: 'Fashion Color',
      caption: 'Vibrant and expressive shades.',
      description:
        'Pastels, vivids and creative placements — from rose gold to electric blue — crafted to express your personality.',
      idealFor: 'Statement looks and creative expression',
      duration: '3 – 5 hours',
      bookAs: 'Fashion Color',
      image: img('color-fashion', 'Hair coloured in vivid purple, blue and yellow shades', 400, 400),
    },
  ],
};

export const offers = {
  eyebrow: 'Special Offers',
  title: 'Exclusive XING Offers',
  text: 'Current offers on popular hair and skin services, straight from our salon catalog.',
  cta: 'View All Offers',
  note: 'Offers vary by location and consultation.',
  bookLabel: 'Book Now',
  // From the XING service catalog. `bookAs` must match an entry in `booking.services` (or be empty).
  items: [
    {
      service: 'Tuesday Happy Hours',
      deal: 'Flat 25% OFF',
      terms: 'On everything, every Tuesday. Minimum billing applies.',
      bookAs: '',
      image: img('loc-hsr-1', 'Styling floor at XING HSR Layout', 800, 600),
    },
    {
      service: 'Hair Spa',
      deal: 'Buy 3, Get 1 Free',
      terms: 'On all hair spa rituals.',
      bookAs: 'Hair Spa',
      image: img('offer-keratin', 'Stylist blow-drying smooth hair', 560, 400),
    },
    {
      service: 'Hydra Facial',
      deal: 'Buy 3, Get 1 Free',
      terms: 'On the 7-step Hydra Facial.',
      bookAs: 'Skin & Facial',
      image: img('svc-skin', 'Pedicure lounge with pink armchairs at XING HSR Layout', 640, 480),
    },
    {
      service: 'Olaplex Top-up',
      deal: '50% OFF',
      terms: 'With any hair color service.',
      bookAs: 'Hair Color',
      image: img('offer-global', 'Woman with freshly coloured hair', 560, 400),
    },
  ],
};

const pair = (name: string, caption: string, alt: string) => ({
  caption,
  // Swap in distinct before/after photos here; identical files get a muted "before" preview automatically.
  before: img(name, `Before: ${alt}`, 720, 480),
  after: img(name, `After: ${alt}`, 720, 480),
});

export const transformations = {
  eyebrow: 'Real Transformations',
  title: 'Signature Transformations',
  cta: 'View More',
  categories: [
    {
      label: 'Hair Color',
      items: [
        pair('tf-haircolor-1', 'Hair Color Transformation', 'rich brunette global color'),
        pair('tf-haircolor-2', 'Copper Color Refresh', 'warm copper hair color'),
        pair('tf-haircolor-3', 'Pastel Color Makeover', 'pastel lilac hair color'),
      ],
    },
    {
      label: 'Balayage',
      items: [
        pair('tf-balayage-1', 'Caramel Balayage', 'caramel balayage curls'),
        pair('tf-balayage-2', 'Soft Blended Balayage', 'soft blended balayage'),
        pair('tf-balayage-3', 'Blonde Balayage', 'bright blonde balayage'),
      ],
    },
    {
      label: 'Keratin',
      items: [
        pair('tf-keratin-1', 'Keratin Treatment', 'smooth, frizz-free long hair'),
        pair('tf-keratin-2', 'Smoothing Therapy', 'glossy smooth waves'),
        pair('tf-keratin-3', 'Frizz Control Finish', 'sleek hair after frizz control'),
      ],
    },
    {
      label: 'Haircut',
      items: [
        pair('tf-haircut-1', 'Precision Bob', 'a precision bob haircut'),
        pair('tf-haircut-2', 'Restyle & Set', 'a restyled and set haircut'),
        pair('tf-haircut-3', 'Layered Cut & Blow-dry', 'a layered cut with blow-dry'),
      ],
    },
    {
      label: 'Makeup',
      items: [
        pair('tf-makeup-1', 'Bridal Makeup Transformation', 'bridal makeup look'),
        pair('tf-makeup-2', 'Soft Glam Makeup', 'soft glam makeup look'),
        pair('tf-makeup-3', 'Natural Day Makeup', 'natural day makeup look'),
      ],
    },
    {
      label: 'Nails',
      items: [
        pair('tf-nails-1', 'Nail Art Design', 'red nail art design'),
        pair('tf-nails-2', 'Gel Polish Manicure', 'glossy gel polish manicure'),
        pair('tf-nails-3', 'Classic Manicure', 'a classic manicure'),
      ],
    },
  ],
};

export const why = {
  eyebrow: 'Why Choose XING',
  titleLines: ['More Than a Salon', 'A Complete Beauty Experience'],
  features: [
    { icon: 'consult', label: 'Expert Consultation' },
    { icon: 'products', label: 'Premium Products' },
    { icon: 'personal', label: 'Personalised Service' },
    { icon: 'hygiene', label: 'Hygiene & Care' },
    { icon: 'pin', label: 'Multiple Locations' },
  ],
  journeyEyebrow: 'Your XING Experience',
  journey: [
    { step: 'Explore', text: 'Discover our services and guides' },
    { step: 'Choose', text: 'Select the service that suits you' },
    { step: 'Consult', text: 'Get expert advice from our professionals' },
    { step: 'Transform', text: 'Enjoy a relaxing premium experience' },
    { step: 'Maintain', text: 'Follow a personalised care routine' },
  ],
  script: 'A Beauty Haven',
  image: img('why-salon', 'Retail wall of professional hair and skin products at XING HSR Layout', 520, 700),
} as const;

export const bridal = {
  eyebrow: 'Bridal Beauty',
  titleLines: ['Your Bridal Beauty', 'Journey Starts at XING'],
  services: ['Bridal Makeup', 'Engagement Makeup', 'Party Makeup', 'Bridal Hair', 'Pre-Bridal Services'],
  cta: 'Explore Bridal Services',
  bookAs: 'Bridal Makeup',
  script: ['For', 'Your Most', 'Special Day'],
  image: img('bridal', 'Bride and groom in traditional wedding attire', 1200, 700),
};

export const reviews = {
  eyebrow: 'What Our Clients Say',
  rating: site.rating,
  ratingLabel: `from ${site.reviewCount} Google reviews`,
  source: 'Google review',
  // Client feedback as published on xingsalons.com.
  items: [
    {
      quote: 'Went for a hair color and cut — extremely professional and the outcome was exactly what I showed.',
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

export const gallery = {
  eyebrow: 'Inside XING',
  title: 'Step Inside Our HSR Layout Salon',
  text: 'Pastel interiors, gold-framed mirrors, a dedicated Nail Bar, a pedicure lounge and a kids’ corner — a space designed for you to relax.',
  cta: 'Book Your Visit',
};

interface LocationInput {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  /** 10-digit Indian mobile number, no country code. */
  phone: string;
  email?: string;
  /** Google Business Profile share link; falls back to a Maps search when missing. */
  mapUrl?: string;
  description: string;
  /** File prefix in /public/images: photos are `<prefix>-1.webp`, `<prefix>-2.webp`… */
  imagePrefix: string;
  /** One alt text per photo, in file order. Leave empty until the salon has photos. */
  photos: string[];
}

const location = ({
  id,
  name,
  street,
  postalCode,
  phone,
  email,
  mapUrl,
  description,
  imagePrefix,
  photos,
}: LocationInput) => {
  const query = `XING Premium Unisex Salon, ${street}, Bengaluru ${postalCode}`;
  return {
    id,
    name,
    street,
    postalCode,
    city: 'Bengaluru',
    region: 'Karnataka',
    address: `${street}, Bengaluru, Karnataka ${postalCode}`,
    phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    phoneHref: `tel:+91${phone}`,
    whatsappHref: `https://wa.me/91${phone}`,
    email,
    description,
    mapUrl: mapUrl ?? mapSearch(query),
    directionsUrl: mapDirections(query),
    photos: photos.map((alt, i) => img(`${imagePrefix}-${i + 1}`, `XING ${name}: ${alt}`, 800, 600)),
  };
};

export const locationsSection = {
  eyebrow: 'Find Your Nearest XING Salon',
  cta: 'View All Locations',
  allUrl: mapSearch('XING Premium Unisex Salon Bengaluru'),
  viewLabel: 'View Location',
  directionsLabel: 'Get Directions',
  bookLabel: 'Book at',
  whatsappLabel: 'WhatsApp',
  photosPending: 'Photos coming soon',
};

export const locations = [
  location({
    id: 'hsr-layout',
    name: 'HSR Layout',
    street: '150/3, GSR Arcade, 9th Cross, 24th Main Rd, HSR Layout',
    postalCode: '560102',
    phone: '9380812348',
    email: 'hsrxing@gmail.com',
    mapUrl: 'https://maps.app.goo.gl/pPwNQUbv8cZuUS7Y9',
    description:
      'Xing Salon is a premium hair and beauty salon in HSR Layout, Bangalore, serving clients across HSR Layout, Sector 1, Sector 2, Sector 3, Sector 4, Sector 6 and nearby areas. Known for quality, personalized care and expert service, our professional stylists use international techniques and authentic salon products. Visit Xing Salon HSR for women’s and men’s haircuts, global hair color, highlights, balayage, Keratin, Nanoplastia, Hair Botox, hair spa, scalp treatments, facials, skincare and beauty services.',
    imagePrefix: 'loc-hsr',
    photos: [
      'styling stations with gold-framed mirrors and the pedicure lounge',
      'styling chairs in front of arched mirrors',
      'the Nail Bar with its neon sign',
      'pedicure lounge with pink armchairs',
      'retail wall with professional hair and skin products',
      'kids’ styling corner with round mirrors',
    ],
  }),
  location({
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    street: '1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli',
    postalCode: '560035',
    phone: '8970007440',
    email: 'xing.sarjapura@gmail.com',
    mapUrl: 'https://maps.app.goo.gl/nfXT59udL4KKSHCB6',
    description:
      'Xing Salon is a premium, quality-driven and customer-centric salon on Sarjapur Road, Bangalore, offering exceptional hair, beauty and grooming services. Our expert stylists use international techniques and authentic professional products to deliver personalized, high-quality results. From precision haircuts, global hair color, balayage and highlights to Keratin, Nanoplastia, Hair Botox, hair spa, skincare and beauty services, every experience is designed around you.',
    imagePrefix: 'loc-sarjapur',
    photos: [
      'reception desk and illuminated XING sign',
      'styling floor with teal chairs and sculpted mirrors',
      'styling stations along a backlit mirror wall',
    ],
  }),
  location({
    id: 'aecs-layout-brookefield',
    name: 'AECS Layout, Brookefield',
    street: '1st Floor, SV Plaza, 267, 60 Feet Rd, AECS Layout, Brookefield',
    postalCode: '560037',
    phone: '8147111344',
    description:
      'Xing Salon in AECS Layout, Brookefield is a premium unisex salon serving Brookefield, Kundalahalli, Marathahalli and Whitefield with expert haircuts, hair color, balayage, Keratin, Nanoplastia, hair spa, skincare, nails and beauty services, delivered by skilled professionals using authentic products.',
    imagePrefix: 'loc-brookefield',
    photos: [],
  }),
];

/** Salon whose phone and WhatsApp are used for the header and the floating chat button. */
export const primaryLocation = locations[0];

export const faq = {
  eyebrow: 'Frequently Asked Questions',
  items: [
    {
      q: 'What services does XING offer?',
      a: 'XING offers haircuts, styling, hair color, hair treatments and hair spa, along with skin care, body polish, waxing, threading, de-tan, manicure and pedicure, nails, men’s grooming and tattoo services — all with professional consultation and premium products. See the full list in our service menu.',
    },
    {
      q: 'How do I choose the right hair color?',
      a: 'Start with a consultation. Our colorists look at your skin undertone, natural shade, hair health and how much upkeep you are comfortable with, then recommend options that suit you.',
    },
    {
      q: 'Does XING have multiple locations?',
      a: 'Yes. You can visit us at HSR Layout, Sarjapur Road and AECS Layout, Brookefield in Bangalore. All three salons are open 10:00 AM – 9:30 PM, every day.',
    },
    {
      q: 'Can I book a consultation first?',
      a: 'Absolutely. Choose “Consultation” when booking and one of our experts will guide you on the right service before you commit to anything.',
    },
    {
      q: 'How can I see the latest offers?',
      a: 'Current offers are listed in the Offers section of this page. They can vary by location, so your salon will confirm the final offer during consultation.',
    },
  ],
};

export const about = {
  eyebrow: 'About XING Premium Unisex Salon',
  paragraphs: [
    'XING Premium Unisex Salon is a modern beauty destination for hair, skin, nails, makeup and bridal services. With expert professionals, premium products and personalised care, we help you look and feel your best at every stage.',
    'Established in 2020, with three salons across Bangalore and a strong focus on education and guidance, XING is more than a salon — it’s a space where beauty, care and confidence come together.',
  ],
  stats: [
    { value: 3, suffix: '', decimals: 0, label: 'Locations' },
    { value: 2264, suffix: '+', decimals: 0, label: 'Google Reviews' },
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

export const footer = {
  socials: [
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/xingpremiumsalons/' },
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/xingpremiumsalons/' },
  ],
  columns: [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'Guides', href: '#guides' },
        { label: 'Offers', href: '#offers' },
      ],
    },
    {
      title: 'Our Services',
      links: [
        { label: 'Hair', href: '#services' },
        { label: 'Skin', href: '#services' },
        { label: 'Nails', href: '#services' },
        { label: 'Transformations', href: '#transformations' },
      ],
    },
    {
      title: 'Our Expertise',
      links: [
        { label: 'Hair Color', href: '#hair-color' },
        { label: 'Hair Treatments', href: '#guides' },
        { label: 'Bridal Beauty', href: '#bridal' },
        { label: 'Salon Experience', href: '#why-xing' },
      ],
    },
    {
      title: 'Help & Support',
      links: [
        { label: 'Find a Location', href: '#locations' },
        { label: 'FAQs', href: '#faq' },
        { label: 'Client Reviews', href: '#reviews' },
        { label: 'About XING', href: '#about' },
      ],
    },
  ],
  contactTitle: 'Contact Us',
  backToTop: 'Back to Top',
};

export const booking = {
  title: 'Book Your Appointment',
  steps: ['Service', 'Visit', 'Details'],
  services: [
    'Haircut & Styling',
    'Hair Color',
    'Global Hair Color',
    'Balayage',
    'Ombre',
    'Fashion Color',
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
    'Bridal Makeup',
    'Party Makeup',
    'Consultation',
  ],
  // Hourly slots from opening, the last one leaving at least an hour before closing.
  slots: Array.from({ length: Math.floor((openingMinutes.close - openingMinutes.open) / 60) }, (_, i) => {
    const hour = Math.floor(openingMinutes.open / 60) + i;
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  }),
  successTitle: 'Request received!',
  successText: 'Send it to us on WhatsApp to confirm your slot — our team will reply shortly.',
};
