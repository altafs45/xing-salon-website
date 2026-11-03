// Every current offer with a published price: the single source for /offers, /offers/hair-colour,
// /offers/hair-treatment, /offers/skin-care, the Offers menu and the offer schema. The November hair colour
// campaign (offers.ts) takes its offers from here; it adds only its dates and states.
// Prices are the salon's own, from its offer posters and the offer pages of the old site. Never add a price, date
// or term the salon has not published.
// Data only (no React or asset imports): vite.config.ts and the tests read it.

export type OfferCategoryId = 'hair-colour' | 'hair-treatment' | 'skin-care';

export interface OfferImage {
  src: string;
  srcSet?: string;
  /** The same sizes as AVIF, tried first. */
  avifSrcSet?: string;
  alt: string;
  width: number;
  height: number;
}

export interface OfferLine {
  label: string;
  /** Left out when the salon published no regular price. */
  was?: number;
  now: number;
  unit?: 'per streak';
  /** "From" price: the final price depends on the hair or skin, confirmed at consultation. */
  from?: boolean;
  note?: string;
}

export interface CatalogOffer {
  /** The offer's anchor on its category page (#highlights) and its id in tracking. */
  id: string;
  category: OfferCategoryId;
  /** The sticky tab's label: one or two short words that never wrap. */
  tab: string;
  title: string;
  /** One line on the result for you. */
  hook: string;
  /** What the offer is, in one or two sentences. */
  sub: string;
  lines: OfferLine[];
  /** At most 3; shown as the card's bullets. */
  includes: string[];
  bestFor: string[];
  duration?: string;
  upkeep?: string;
  /** The 4:5 photo crop (no text on it), made by scripts/offer-images.mjs. */
  image: OfferImage;
  /** The salon's whole poster, only where its printed claims match the prices here. */
  poster?: OfferImage;
  serviceLink: string;
  /** Must match an entry in `booking.services`. */
  bookingService: string;
  /** Salon ids, in the site's order. */
  branches: string[];
  /** Last day, as YYYY-MM-DD, for dated (campaign) offers only. */
  validUntil?: string;
  /** The answer first, then the longer details: shown in the details sheet. */
  answer: string;
  details: Array<{ title: string; text: string }>;
  terms: string[];
  faq: Array<{ q: string; a: string }>;
  /** Old anchors that should still land on this offer (#nov-highlights). */
  aliases?: string[];
  /** Slugs in content/blog; the page shows the first live ones. */
  relatedBlog: string[];
}

export interface OfferCategory {
  id: OfferCategoryId;
  path: string;
  /** "Hair Colour": breadcrumbs, the menu and the hub's cards. */
  name: string;
  h1: string;
  title: string;
  description: string;
  keyword: string;
  /** The hub card's photo. */
  image: OfferImage;
  /** One line under the H1. */
  intro: string;
}

// The salons, in the site's order (branches.ts). Kept as plain ids so this file needs no other data.
const ALL_SALONS = ['sarjapur-road', 'hsr-layout', 'brookfield'];

export const PRICE_NOTE = 'Price confirmed at consultation before we start · Pay at the salon, nothing online';
const FROM_NOTE = '“From” price: the final price depends on your hair or skin, and is confirmed at consultation before we start.';
// OWNER: the end dates of the hair treatment and skin care offers. Until they are given, the offers say
// "Limited-time offer" and the salon confirms the details when you claim.
const LIMITED = 'Limited-time offer. Your salon confirms the final details before starting.';
const NOVEMBER = 'Valid until 30 November 2026 at all 3 salons.';
const ONE_OFFER = 'One offer per service. Not valid with Tuesday Happy Hours.';

const sized = (name: string, widths: number[], ext: string) => widths.map((width) => `/images/${name}-${width}.${ext} ${width}w`).join(', ');
const POSTER_WIDTHS = [480, 800, 1200];
/** Crops from full-size originals; those from the site's smaller service photos have only the 480px width. */
const FULL = [480, 800];
const SMALL = [480];

/** A 4:5 photo crop from scripts/offer-images.mjs: offer-<category>-<id>-<width>.<avif|webp>. */
export const cropImage = (category: OfferCategoryId, id: string, alt: string, widths = FULL): OfferImage => {
  const name = `offer-${category}-${id}`;
  const largest = widths[widths.length - 1];
  return { src: `/images/${name}-${largest}.webp`, srcSet: sized(name, widths, 'webp'), avifSrcSet: sized(name, widths, 'avif'), alt, width: largest, height: largest * 1.25 };
};

/** The salon's global colour poster, whole: its printed prices match the offer. */
export const GLOBAL_POSTER: OfferImage = {
  src: '/images/offer-nov-global-colour-800.webp',
  srcSet: sized('offer-nov-global-colour', POSTER_WIDTHS, 'webp'),
  avifSrcSet: sized('offer-nov-global-colour', POSTER_WIDTHS, 'avif'),
  alt: 'Global hair colour offer poster – any length ₹3,999, save ₹2,000, valid till 30 November, Xing Salon Bangalore',
  width: 1200,
  height: 1200,
};

export const GLOBAL_LINE: OfferLine = { label: 'Global Hair Colour', was: 5999, now: 3999, note: 'any length' };
// The highlights poster says ₹599 and the colour menu poster ₹499. The lower one never overstates the saving.
export const HIGHLIGHTS_LINE: OfferLine = { label: 'Hair Highlights', was: 499, now: 399, unit: 'per streak' };
export const BALAYAGE_LINE: OfferLine = { label: 'Balayage', was: 7999, now: 5499, from: true };
export const CRAZY_LINE: OfferLine = { label: 'Crazy Fashion Colour', was: 799, now: 499, unit: 'per streak' };

export const offerCategories: OfferCategory[] = [
  {
    id: 'hair-colour',
    path: '/offers/hair-colour',
    name: 'Hair Colour',
    h1: 'Hair Colour Offers in Bangalore',
    title: 'Hair Colour Offers in Bangalore – Xing Salon',
    description: 'Global hair colour ₹3,999 at any length, highlights ₹399 per streak, balayage from ₹5,499 and crazy fashion colour ₹499 per streak, at all 3 Xing salons.',
    keyword: 'hair colour offer Bangalore',
    image: cropImage('hair-colour', 'balayage', 'Balayage hair colour at Xing Salon, Bangalore'),
    intro: 'Four colour services at offer prices, each confirmed at a free colour consultation.',
  },
  {
    id: 'hair-treatment',
    path: '/offers/hair-treatment',
    name: 'Hair Treatment',
    h1: 'Hair Treatment Offers in Bangalore',
    title: 'Keratin & Hair Treatment Offers in Bangalore – Xing Salon',
    description: 'Hair keratin ₹4,999 at any length, nanoplastia from ₹5,999, Olaplex bond repair ₹2,999 and an anti-dandruff scalp treatment ₹1,999, at all 3 Xing salons.',
    keyword: 'keratin offer Bangalore',
    image: cropImage('hair-treatment', 'keratin', 'Smooth, frizz-free hair after keratin at Xing Salon, Bangalore'),
    intro: 'Smoothing, bond repair and scalp care at offer prices, after a free hair analysis.',
  },
  {
    id: 'skin-care',
    path: '/offers/skin-care',
    name: 'Skin Care',
    h1: 'Skin Care & Facial Offers in Bangalore',
    title: 'Facial & Skin Care Offers in Bangalore – Xing Salon',
    description: 'Hydra Facial ₹3,499, head-to-toe body polish ₹4,999, hair spa 2+1 from ₹1,999 and an express facial ₹2,499, at all 3 Xing salons in Bangalore.',
    keyword: 'facial offer Bangalore',
    image: cropImage('skin-care', 'hydra-facial', 'A Hydra Facial treatment with a skin device', SMALL),
    intro: 'Facials, a full-body polish and a hair spa at offer prices, at all three salons.',
  },
];

export const offerCatalog: CatalogOffer[] = [
  // ---------- Hair colour: the November campaign (offers.ts adds its dates and states).
  {
    id: 'global-colour',
    category: 'hair-colour',
    tab: 'Global',
    title: 'Global Hair Colour',
    hook: 'One flat price, whatever your length.',
    sub: 'One even shade from roots to ends, at the same price for short, medium or long hair.',
    lines: [GLOBAL_LINE],
    includes: ['Any hair length', 'Shade matched to skin tone', 'Free colour consultation'],
    bestFor: ['Covering greys', 'A full colour change', 'Long hair (same price)'],
    duration: '1.5 – 2 hours',
    upkeep: 'Root touch-up every 4–6 weeks',
    image: cropImage('hair-colour', 'global-colour', 'Client with copper global hair colour at Xing Salon, Bangalore'),
    poster: GLOBAL_POSTER,
    serviceLink: '/services/global-hair-color',
    bookingService: 'Global Hair Colour',
    branches: ALL_SALONS,
    validUntil: '2026-11-30',
    answer: 'Global hair colour at Xing is ₹3,999 this November, at any hair length: one even shade from roots to ends, chosen with your colourist at a free consultation.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone covering greys, changing their colour completely or evening out faded colour.' },
      { title: 'What happens?', text: 'Your colourist checks your hair, matches a shade to your skin tone, then colours from roots to ends.' },
      { title: 'How long does it last?', text: 'Most people book a root touch-up every 4–6 weeks, depending on how fast their hair grows.' },
      { title: 'Aftercare', text: 'Use a colour-safe shampoo, wash with cooler water and protect your hair from heat.' },
    ],
    terms: [NOVEMBER, ONE_OFFER, 'Olaplex is an optional add-on, charged separately.', `${PRICE_NOTE}.`],
    faq: [{ q: 'Is the price the same for long hair?', a: 'Yes. Global hair colour is one flat price at any hair length this November.' }],
    aliases: ['nov-global-colour'],
    relatedBlog: ['hair-colour-indian-skin-tone', 'root-touch-up-frequency'],
  },
  {
    id: 'highlights',
    category: 'hair-colour',
    tab: 'Highlights',
    title: 'Hair Highlights',
    hook: 'Brightness and dimension, priced by the streak.',
    sub: 'Brighter, defined strands placed where they flatter you. 8–10 streaks recommended.',
    lines: [{ ...HIGHLIGHTS_LINE, note: '8–10 streaks recommended' }],
    // OWNER: confirm toning and the blow-dry finish are included in the per-streak price.
    includes: ['8–10 streaks recommended', 'Toning where needed', 'Blow-dry finish'],
    bestFor: ['Adding dimension', 'Dark hair that wants brightness', 'A first step into colour'],
    upkeep: 'Refresh every 2–3 months',
    image: cropImage('hair-colour', 'highlights', 'Golden blonde highlights on long wavy hair at Xing Salon, Bangalore'),
    serviceLink: '/services/highlights',
    bookingService: 'Highlights',
    branches: ALL_SALONS,
    validUntil: '2026-11-30',
    answer: 'Highlights at Xing are ₹399 per streak this November. Your colourist plans the placement with you, and confirms the number of streaks and the full price before starting.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone who wants brightness and dimension without colouring all of their hair.' },
      { title: 'What happens?', text: 'You choose the shade and placement with your colourist, then strands are lightened, toned where needed and finished with a blow-dry.' },
      { title: 'How long does it last?', text: 'Highlights grow out rather than wash out. Most people refresh them every 2–3 months.' },
      { title: 'Aftercare', text: 'Use a colour-safe shampoo and a weekly mask to keep lightened strands soft.' },
    ],
    terms: [NOVEMBER, 'Priced per streak; extra streaks beyond those booked are charged at the same rate.', ONE_OFFER, 'Olaplex is an optional add-on, charged separately.', `${PRICE_NOTE}.`],
    faq: [{ q: 'Why is it priced per streak?', a: 'You pay only for the streaks you choose. Your colourist recommends a number at the consultation and confirms the total first.' }],
    aliases: ['nov-highlights'],
    relatedBlog: ['balayage-vs-highlights', 'make-hair-colour-last'],
  },
  {
    id: 'balayage',
    category: 'hair-colour',
    tab: 'Balayage',
    title: 'Balayage',
    hook: 'Soft, sun-kissed colour that grows out gently.',
    sub: 'Hand-painted, blended colour for a natural, lived-in look.',
    lines: [BALAYAGE_LINE],
    includes: ['Hand-painted, blended colour', 'Free colour consultation', 'Olaplex available as an add-on'],
    bestFor: ['Soft, lived-in colour', 'Low-maintenance dimension', 'A natural grow-out'],
    duration: '3 – 4 hours',
    upkeep: 'Gloss or toner every 6–8 weeks',
    image: cropImage('hair-colour', 'balayage', 'Client with blonde face-framing balayage at Xing Salon, Bangalore'),
    serviceLink: '/services/balayage',
    bookingService: 'Balayage',
    branches: ALL_SALONS,
    validUntil: '2026-11-30',
    answer: 'Balayage at Xing starts from ₹5,499 this November. Your colourist confirms the final price for your hair before starting.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone who wants soft, sun-kissed colour that grows out gently.' },
      { title: 'How long does it last?', text: 'Balayage grows out softly; most people book a gloss or toner every 6–8 weeks.' },
      { title: 'Aftercare', text: 'Use a colour-safe shampoo, wash with cooler water and keep up your gloss.' },
    ],
    terms: [NOVEMBER, 'Balayage is a “from” price; your colourist confirms the final price before starting.', ONE_OFFER, 'Olaplex is an optional add-on, charged separately.', `${PRICE_NOTE}.`],
    faq: [{ q: 'Why is balayage a “from” price?', a: 'Balayage depends on your hair and the look you want. Your colourist confirms the final price before starting.' }],
    aliases: ['nov-colour-menu'],
    relatedBlog: ['balayage-vs-highlights', 'what-is-olaplex'],
  },
  {
    id: 'fashion-colour',
    category: 'hair-colour',
    tab: 'Fashion',
    title: 'Crazy Fashion Colour',
    hook: 'Bold colour, priced by the streak.',
    sub: 'Vivid streaks, from a few bright pieces to more, placed where you want them.',
    lines: [CRAZY_LINE],
    includes: ['Priced per streak', 'Free colour consultation', 'Olaplex available as an add-on'],
    bestFor: ['A bold statement', 'Trying colour on a few streaks', 'Festive looks'],
    duration: '3 – 5 hours',
    upkeep: 'Colour refresh every 4–6 weeks',
    image: cropImage('hair-colour', 'fashion-colour', 'Purple and lilac crazy fashion colour streaks at Xing Salon, Bangalore'),
    serviceLink: '/services/fashion-color',
    bookingService: 'Crazy Fashion Colour',
    branches: ALL_SALONS,
    validUntil: '2026-11-30',
    answer: 'Crazy fashion colour at Xing is ₹499 per streak this November. Your colourist confirms the shade, the number of streaks and the total before starting.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone who wants a bold statement, from a few bright streaks to more.' },
      { title: 'How long does it last?', text: 'Vivid shades fade faster than natural ones; most people refresh them every 4–6 weeks.' },
      { title: 'Aftercare', text: 'Wash with cool water and a colour-safe shampoo, and keep heat styling low.' },
    ],
    terms: [NOVEMBER, 'Priced per streak; lightening, where needed, is confirmed at consultation.', ONE_OFFER, 'Olaplex is an optional add-on, charged separately.', `${PRICE_NOTE}.`],
    faq: [{ q: 'Do I need to lighten my hair first?', a: 'Often, yes: vivid shades show best on lighter hair. Your colourist checks your hair and confirms any lightening and the total before starting.' }],
    relatedBlog: ['fashion-hair-colour-guide', 'make-hair-colour-last'],
  },

  // ---------- Hair treatment.
  // OWNER: confirm Brookfield honours the hair treatment and skin care offers. The old site called Brookfield's
  // offers "salon-wide"; until told otherwise, every offer is valid at all 3 salons.
  {
    id: 'keratin',
    category: 'hair-treatment',
    tab: 'Keratin',
    title: 'Hair Keratin',
    hook: 'Glass-smooth hair, one flat price.',
    sub: 'Flat, any length. A smoothing treatment for a sleeker, more manageable finish.',
    lines: [{ label: 'Hair Keratin', was: 7999, now: 4999, note: 'any length' }],
    includes: ['Any hair length', 'Frizz control, smooth finish', 'Free Acai oil treatment'],
    bestFor: ['Frizzy hair', 'Long hair (same price)', 'Humid Bangalore days'],
    image: cropImage('hair-treatment', 'keratin', 'Smooth, frizz-free hair after keratin at Xing Salon, Bangalore'),
    serviceLink: '/services/keratin-treatment',
    bookingService: 'Keratin Treatment',
    branches: ALL_SALONS,
    answer: 'Hair keratin at Xing is one flat offer price of ₹4,999, at any hair length. Your stylist checks your hair first and confirms the price before starting.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone with frizzy, hard-to-manage hair who wants it smoother and shinier while keeping its volume.' },
      { title: 'What happens?', text: 'A hair analysis, a cleanse, then keratin applied section by section, sealed and finished with a blow-dry.' },
      { title: 'How long does it last?', text: 'With the right aftercare, keratin keeps hair smoother and frizz-free for months.' },
    ],
    terms: [LIMITED, 'A complimentary Acai oil treatment comes with every hair treatment.', ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [
      { q: 'Is the keratin price the same for long hair?', a: 'Yes. The Hair Keratin offer is one flat price for any hair length: short, medium or long.' },
      { q: 'How long does keratin last?', a: 'With the right aftercare, keratin keeps hair smoother and frizz-free for months. Your stylist gives you an aftercare plan.' },
    ],
    relatedBlog: ['keratin-aftercare-tips', 'keratin-vs-smoothening-vs-straightening'],
  },
  {
    id: 'nanoplastia',
    category: 'hair-treatment',
    tab: 'Nanoplastia',
    title: 'Hair Nanoplastia',
    hook: 'Silky, straighter hair that still looks natural.',
    sub: 'A smoother, shinier finish designed around your hair type and desired result.',
    lines: [{ label: 'Hair Nanoplastia', now: 5999, from: true }],
    includes: ['Hair analysis first', 'Smoother, straighter finish', 'Free Acai oil treatment'],
    bestFor: ['Frizzy, wavy or curly hair', 'A silky, straighter finish', 'Easier styling'],
    image: cropImage('hair-treatment', 'nanoplastia', 'Sleek, straight lengths after nanoplastia at Xing Salon, Bangalore'),
    serviceLink: '/services/nanoplastia',
    bookingService: 'Hair Treatment',
    branches: ALL_SALONS,
    answer: 'Nanoplastia at Xing starts from ₹5,999. Your stylist analyses your hair and confirms the final price for your length and texture before starting.',
    details: [
      { title: 'Who does it suit?', text: 'Frizzy, wavy or curly hair that you want silkier and noticeably straighter.' },
      { title: 'How long does it last?', text: 'Results usually last a few months; new growth comes in with your natural texture.' },
    ],
    // OWNER: the "from" terms for nanoplastia (what sets the final price).
    terms: [LIMITED, FROM_NOTE, 'A complimentary Acai oil treatment comes with every hair treatment.', ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'Why is nanoplastia a “from” price?', a: 'The final price depends on your hair length and texture. Your stylist analyses your hair and confirms it before starting.' }],
    relatedBlog: ['what-is-nanoplastia', 'cysteine-hair-treatment'],
  },
  {
    id: 'olaplex',
    category: 'hair-treatment',
    tab: 'Olaplex',
    title: 'Olaplex Bond Repair Treatment',
    hook: 'Stronger, healthier, shinier hair.',
    sub: 'Bond-repair care designed to help repair damaged bonds, restore strength, improve elasticity and leave hair smoother and shinier.',
    lines: [{ label: 'Olaplex Bond Repair Treatment', was: 3999, now: 2999 }],
    includes: ['Bond repair for damaged hair', 'Strength and elasticity', 'Smoother, shinier finish'],
    bestFor: ['Coloured or bleached hair', 'Heat-damaged hair', 'Weak, brittle lengths'],
    image: cropImage('hair-treatment', 'olaplex', 'Glossy, healthy lengths after a bond repair treatment at Xing Salon, Bangalore'),
    serviceLink: '/services/hair-spa',
    bookingService: 'Hair Treatment',
    branches: ALL_SALONS,
    answer: 'The Olaplex Bond Repair Treatment at Xing is ₹2,999, down from ₹3,999. It helps repair damaged bonds and restore strength, for smoother, shinier hair.',
    details: [
      { title: 'Who does it suit?', text: 'Hair weakened by colouring, bleaching or heat styling.' },
      { title: 'What happens?', text: 'Your stylist checks your hair, then applies the bond-repair treatment and finishes your hair.' },
    ],
    terms: [LIMITED, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'Who needs a bond repair treatment?', a: 'Anyone whose hair feels weak, brittle or rough after colouring, bleaching or heat styling. Your stylist checks your hair first.' }],
    relatedBlog: ['what-is-olaplex', 'make-hair-colour-last'],
  },
  {
    id: 'scalp-treatment',
    category: 'hair-treatment',
    tab: 'Scalp',
    title: 'Schwarzkopf Anti-Dandruff Scalp Treatment',
    hook: 'Cleanse, soothe and revive your scalp.',
    sub: 'Targeted scalp care to help remove dandruff, soothe an irritated scalp, balance scalp oil and support healthier-looking hair.',
    lines: [{ label: 'Anti-Dandruff Scalp Treatment', was: 2999, now: 1999 }],
    includes: ['Targeted dandruff care', 'Soothes an irritated scalp', 'Balances scalp oil'],
    bestFor: ['Dandruff', 'An itchy or oily scalp', 'Healthier-looking hair'],
    image: cropImage('hair-treatment', 'scalp-treatment', 'A relaxing scalp wash and treatment', SMALL),
    serviceLink: '/services/hair-spa',
    bookingService: 'Hair Spa',
    branches: ALL_SALONS,
    answer: 'The Schwarzkopf Anti-Dandruff Scalp Treatment at Xing is ₹1,999, down from ₹2,999. It targets dandruff, soothes the scalp and balances scalp oil.',
    details: [
      { title: 'Who does it suit?', text: 'Anyone with dandruff, or an itchy, irritated or oily scalp.' },
      { title: 'What happens?', text: 'Your stylist checks your scalp, then cleanses it and applies the targeted treatment.' },
    ],
    terms: [LIMITED, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'Will one treatment clear my dandruff?', a: 'It helps remove dandruff and soothe the scalp. Your stylist checks your scalp and suggests how often to repeat it.' }],
    relatedBlog: ['dandruff-causes-treatment-bangalore', 'types-of-hair-spa'],
  },

  // ---------- Skin care.
  {
    id: 'hydra-facial',
    category: 'skin-care',
    tab: 'Hydra',
    title: 'Hydra Facial',
    hook: 'Skin that glows for days.',
    sub: 'A six-step Hydra Facial experience focused on deep cleansing, hydration and a fresh, glowing finish.',
    lines: [{ label: 'Hydra Facial', was: 5499, now: 3499, note: '6-step' }],
    includes: ['Cleanse & detox', 'Exfoliation', 'Hydration infusion'],
    bestFor: ['Dull or tired skin', 'Before an event', 'Dehydrated skin'],
    image: cropImage('skin-care', 'hydra-facial', 'A Hydra Facial treatment with a skin device', SMALL),
    serviceLink: '/services/hydra-facial',
    bookingService: 'Skin & Facial',
    branches: ALL_SALONS,
    answer: 'The Hydra Facial at Xing is ₹3,499, down from ₹5,499: a six-step facial for deep cleansing, hydration and a fresh, glowing finish.',
    details: [
      { title: 'What does it include?', text: 'Cleanse and detox, exfoliation, a hydration infusion and a glow finish.' },
      { title: 'Is it for my skin?', text: 'Your therapist checks your skin first and confirms the treatment suits it before starting.' },
    ],
    terms: [LIMITED, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'What does the Hydra Facial offer include?', a: 'The complete six-step Hydra Facial: cleanse and detox, exfoliation, a hydration infusion and a glow finish.' }],
    relatedBlog: ['hydra-facial-benefits', 'hydra-facial-vs-facial-vs-cleanup'],
  },
  {
    id: 'body-polish',
    category: 'skin-care',
    tab: 'Body Polish',
    title: 'Head-to-Toe Body Polish',
    hook: 'Smooth, radiant, refreshed skin.',
    sub: 'A full-body polishing ritual designed for deep exfoliation, tan and dullness removal, smoother-feeling skin and a refreshed glow.',
    lines: [{ label: 'Head-to-Toe Body Polish', was: 7999, now: 4999 }],
    includes: ['Full-body exfoliation', 'Tan and dullness removal', 'Smoother-feeling skin'],
    bestFor: ['Tanned or dull skin', 'Before a wedding or trip', 'A head-to-toe refresh'],
    image: cropImage('skin-care', 'body-polish', 'A full-body polish scrub', SMALL),
    serviceLink: '/services/body-polish',
    bookingService: 'Body Polish',
    branches: ALL_SALONS,
    answer: 'The Head-to-Toe Body Polish at Xing is ₹4,999, down from ₹7,999: deep exfoliation, tan and dullness removal and a refreshed glow.',
    details: [{ title: 'Who does it suit?', text: 'Anyone with tanned or dull skin, or who wants a head-to-toe refresh before an event.' }],
    terms: [LIMITED, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'What does the body polish do?', a: 'It deeply exfoliates from head to toe, helps remove tan and dullness, and leaves skin smoother-feeling with a refreshed glow.' }],
    relatedBlog: ['body-polishing-benefits'],
  },
  {
    id: 'hair-spa',
    category: 'skin-care',
    tab: 'Hair Spa',
    title: 'Hair Spa 2+1',
    hook: 'Book 2, get 1: relax, repair, rejuvenate.',
    sub: 'A nourishing hair-spa offer designed to deeply condition, strengthen hair and add softness and shine while you relax.',
    // OWNER: the service page lists "Hair Spa, buy 3 get 1 free"; confirm which spa offer is current, and its
    // "from" terms.
    lines: [{ label: 'Hair Spa 2+1', now: 1999, from: true, note: 'book 2, get 1' }],
    includes: ['Book 2, get 1', 'Deep conditioning', 'Softness and shine'],
    bestFor: ['Dry or frizzy hair', 'Regular hair care', 'A relaxing visit'],
    image: cropImage('skin-care', 'hair-spa', 'A relaxing hair spa wash', SMALL),
    serviceLink: '/services/hair-spa',
    bookingService: 'Hair Spa',
    branches: ALL_SALONS,
    answer: 'The Hair Spa 2+1 offer at Xing starts from ₹1,999: book two hair spas and get a third. Your salon confirms the spa variant and price when you book.',
    details: [{ title: 'Which spa is it?', text: 'Your salon confirms the spa variant and the final price for your hair when you book.' }],
    terms: [LIMITED, FROM_NOTE, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'How does the 2+1 work?', a: 'You book two hair spas and get a third. Your salon confirms the spa variant and the final price when you book.' }],
    relatedBlog: ['hair-spa-benefits', 'types-of-hair-spa'],
  },
  {
    id: 'express-facial',
    category: 'skin-care',
    tab: 'Express',
    title: 'Express Facial',
    hook: 'Cleanse, hydrate and glow.',
    sub: 'A complete six-step facial focused on deep cleansing, detox, intense hydration and visibly fresh, radiant-looking skin.',
    lines: [{ label: 'Express Facial', now: 2499, note: '6-step' }],
    includes: ['Deep cleansing and detox', 'Intense hydration', 'Fresh, radiant finish'],
    bestFor: ['A quick refresh', 'Busy weekdays', 'Tired-looking skin'],
    image: cropImage('skin-care', 'express-facial', 'A facial mask being applied', SMALL),
    serviceLink: '/services/facial-cleanup',
    bookingService: 'Skin & Facial',
    branches: ALL_SALONS,
    answer: 'The Express Facial at Xing is ₹2,499: a complete six-step facial for deep cleansing, detox, hydration and fresh, radiant-looking skin.',
    details: [{ title: 'Who does it suit?', text: 'Anyone who wants a quick, complete facial and fresher-looking skin.' }],
    terms: [LIMITED, ONE_OFFER, `${PRICE_NOTE}.`],
    faq: [{ q: 'What is the difference from the Hydra Facial?', a: 'The Express Facial is a quicker six-step cleanse, detox and hydration. The Hydra Facial adds a hydration infusion for a deeper glow.' }],
    relatedBlog: ['hydra-facial-vs-facial-vs-cleanup', 'hydra-facial-benefits'],
  },
];

// ---------- Look-ups and figures, all calculated from the data above.

export const categoryById = (id: OfferCategoryId) => offerCategories.find((category) => category.id === id)!;
export const categoryByPath = (path: string) => offerCategories.find((category) => category.path === path);
export const offersIn = (category: OfferCategoryId) => offerCatalog.filter((offer) => offer.category === category);
export const catalogOfferById = (id: string) => offerCatalog.find((offer) => offer.id === id || offer.aliases?.includes(id));

export const lineSaving = (line: OfferLine) => (line.was ? line.was - line.now : 0);
/** "33%": how much is saved, rounded down so the site never overstates it. */
export const savingPercent = (price: { now: number; was?: number }) => `${price.was ? Math.floor((1 - price.now / price.was) * 100) : 0}%`;
export const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
/** "Save ₹2,000 · 33% off", or nothing for a line with no regular price. */
export const savingLabel = (line: OfferLine) => (line.was ? `Save ${formatPrice(lineSaving(line))} · ${savingPercent(line)} off` : '');

export const offerSaving = (offer: CatalogOffer) => Math.max(0, ...offer.lines.map(lineSaving));
/** The lowest offer price in a category, or across all of them. */
export const fromPriceIn = (category?: OfferCategoryId) => Math.min(...(category ? offersIn(category) : offerCatalog).flatMap((offer) => offer.lines.map((line) => line.now)));
/** The largest rupee saving in a category, or across all of them. */
export const maxSavingIn = (category?: OfferCategoryId) => Math.max(...(category ? offersIn(category) : offerCatalog).map(offerSaving));
/** The offer with the biggest rupee saving. */
export const biggestSaving = () => offerCatalog.reduce((best, offer) => (offerSaving(offer) > offerSaving(best) ? offer : best));

/** "₹399 per streak, 8–10 streaks recommended": a line as one phrase, for messages and schema. */
export const linePrice = (line: OfferLine) => `${line.from ? 'from ' : ''}${formatPrice(line.now)}${line.unit ? ` ${line.unit}` : ''}${line.note ? `, ${line.note}` : ''}`;
