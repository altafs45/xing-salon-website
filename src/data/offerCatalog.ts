// Every offer on the three offer pages (/offers/hair-colour, /offers/hair-treatment, /offers/skin-care), from the
// salon's posters and old offer pages as read on 4 Nov 2026. Data only: the pages, cards, nav, schema and llms.txt
// read it, so a price changes here and nowhere else. Photos: scripts/offer-images.mjs (crops of the posters, with no
// printed prices or dates).
import type { Img } from './content';
import { formatPrice, novemberCampaign } from './offers';

export type OfferCategoryId = 'hair-colour' | 'hair-treatment' | 'skin-care';

export interface OfferLine {
  label: string;
  now: number;
  was?: number;
  /** "per streak". */
  unit?: string;
  /** A starting price: "from ₹5,999". */
  from?: boolean;
}

export interface CatalogOffer {
  id: string;
  category: OfferCategoryId;
  title: string;
  /** Up to 8 words. */
  hook: string;
  lines: OfferLine[];
  /** Three, up to 4 words each, from the poster's icons. */
  benefits: [string, string, string];
  bestFor: string;
  /** What the visit includes, in order (the haircut package lists its steps). */
  includes?: string[];
  image: Img;
  /** The service page this offer is for, e.g. "/services/balayage". */
  serviceLink: string;
  /** What the booking form and WhatsApp message call it. */
  bookingService: string;
  /** "YYYY-MM-DD". Left out where the salon hasn't given an end date. */
  validUntil?: string;
  terms: string;
  /** The streak calculator (highlights). */
  streaks?: boolean;
}

export interface OfferCategoryPage {
  id: OfferCategoryId;
  path: string;
  /** The nav, cards and footer name. */
  name: string;
  /** The page's tab label. */
  short: string;
  h1: string;
  seo: { title: string; description: string; crumb: string };
  heroOfferId: string;
  /** Six questions, shown on the page and as FAQPage. */
  faq: Array<{ q: string; a: string }>;
}

const photo = (id: string, alt: string): Img => ({
  src: `/images/offers/${id}-800.webp`,
  srcSet: `/images/offers/${id}-480.webp 480w, /images/offers/${id}-800.webp 800w`,
  avifSrcSet: `/images/offers/${id}-480.avif 480w, /images/offers/${id}-800.avif 800w`,
  width: 800,
  height: 1000,
  alt,
});

const TERMS = 'Price confirmed at your consultation, before we start. Pay at the salon.';
const FROM_TERMS = 'Starting price. Final price confirmed at consultation. Pay at the salon.';
// OWNER: give end dates for these offers; until then they show "Limited-time offer".
const COLOUR_UNTIL = novemberCampaign.end;

export const offerCatalog: CatalogOffer[] = [
  // Hair colour: valid to the end of the November campaign.
  {
    id: 'global-hair-colour',
    category: 'hair-colour',
    title: 'Global Hair Colour',
    hook: 'One flat price, any length.',
    lines: [{ label: 'Any length', was: 5999, now: 3999 }],
    benefits: ['Even, rich shade', 'Any hair length', 'Grey coverage'],
    bestFor: 'A full colour change or grey coverage',
    image: photo('global-hair-colour', 'Client with global hair colour at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/global-hair-color',
    bookingService: 'Global Hair Colour',
    validUntil: COLOUR_UNTIL,
    terms: TERMS,
  },
  {
    id: 'highlights',
    category: 'hair-colour',
    title: 'Hair Highlights',
    hook: 'Brightness and dimension, streak by streak.',
    lines: [{ label: 'Per streak', was: 499, now: 399, unit: 'per streak' }],
    benefits: ['Lighter strands', 'Natural dimension', '8–10 streaks suggested'],
    bestFor: 'Brightness without a full colour change',
    image: photo('highlights', 'Hair highlights done at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/highlights',
    bookingService: 'Hair Highlights',
    validUntil: COLOUR_UNTIL,
    terms: TERMS,
    streaks: true,
  },
  {
    id: 'fashion-colour',
    category: 'hair-colour',
    title: 'Fashion (Crazy) Colour',
    hook: 'Be bold, be you.',
    lines: [{ label: 'Per streak', was: 799, now: 499, unit: 'per streak' }],
    benefits: ['Vivid shades', 'Placed where you like', 'Pastels to brights'],
    bestFor: 'A bold, playful look',
    image: photo('fashion-colour', 'Fashion hair colour streaks done at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/fashion-color',
    bookingService: 'Fashion Colour',
    validUntil: COLOUR_UNTIL,
    terms: TERMS,
  },
  {
    id: 'balayage',
    category: 'hair-colour',
    title: 'Premium Balayage',
    hook: 'Hand-painted, soft and blended.',
    lines: [{ label: 'Starting price', was: 7999, now: 5499, from: true }],
    benefits: ['Hand-painted', 'Soft grow-out', 'Premium quality'],
    bestFor: 'Low-upkeep, sun-kissed colour',
    image: photo('balayage', 'Balayage hair colour done at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/balayage',
    bookingService: 'Balayage',
    validUntil: COLOUR_UNTIL,
    terms: FROM_TERMS,
  },
  // Hair care and treatment.
  {
    id: 'keratin',
    category: 'hair-treatment',
    title: 'Hair Keratin',
    hook: 'Smoother hair, one flat price.',
    lines: [{ label: 'Any length', was: 7999, now: 4999 }],
    benefits: ['Smoother hair', 'Frizz control', 'Long-lasting'],
    bestFor: 'Frizzy or hard-to-manage hair',
    image: photo('keratin', 'Smooth hair after a keratin treatment at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/keratin-treatment',
    bookingService: 'Keratin Treatment',
    terms: TERMS,
  },
  {
    id: 'nanoplastia',
    category: 'hair-treatment',
    title: 'Hair Nanoplastia',
    hook: 'Sleeker, smoother, stronger hair.',
    // OWNER: confirm ₹5,999. The summary poster prints ₹5,499; the single poster and the old page say ₹5,999.
    lines: [{ label: 'Starting price', now: 5999, from: true }],
    benefits: ['Frizz control', 'Natural shine', 'Stronger hair'],
    bestFor: 'A natural, smooth finish',
    image: photo('nanoplastia', 'Smooth, shiny hair after nanoplastia at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/nanoplastia',
    bookingService: 'Nanoplastia',
    terms: FROM_TERMS,
  },
  {
    id: 'olaplex',
    category: 'hair-treatment',
    title: 'Olaplex Bond Repair',
    hook: 'Repairs damaged bonds from within.',
    lines: [{ label: 'Treatment', was: 3999, now: 2999 }],
    benefits: ['Repairs bonds', 'Restores strength', 'Smoother, shinier hair'],
    bestFor: 'Coloured, lightened or damaged hair',
    image: photo('olaplex', 'Hair after an Olaplex bond repair treatment at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/hair-care#treatments',
    bookingService: 'Olaplex Bond Repair',
    terms: TERMS,
  },
  {
    id: 'anti-dandruff',
    category: 'hair-treatment',
    title: 'Schwarzkopf Professional Anti-Dandruff Scalp Treatment',
    hook: 'Cleanse, soothe, revive your scalp.',
    lines: [{ label: 'Treatment', was: 2999, now: 1999 }],
    benefits: ['Removes dandruff', 'Soothes the scalp', 'Balances scalp oil'],
    bestFor: 'Dandruff or an oily, itchy scalp',
    image: photo('anti-dandruff', 'Scalp treatment at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/hair-spa',
    bookingService: 'Anti-Dandruff Scalp Treatment',
    terms: TERMS,
  },
  {
    id: 'haircut-styling',
    category: 'hair-treatment',
    title: 'Haircut & Styling Package',
    hook: 'Wash, cut, condition and style.',
    lines: [{ label: 'Any length', now: 1099 }],
    benefits: ['Hair wash', 'Haircut', 'Styling'],
    bestFor: 'A fresh cut, styled to finish',
    includes: ['Hair wash', 'Haircut', 'Conditioning', 'Styling'],
    image: photo('haircut-styling', 'Haircut and styling at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/womens-haircut-styling',
    bookingService: 'Haircut & Styling',
    terms: TERMS,
  },
  // Skin and self-care.
  {
    id: 'hydra-facial',
    category: 'skin-care',
    title: 'Hydra Facial',
    hook: 'Six steps to fresh, glowing skin.',
    lines: [{ label: '6-step facial', was: 5499, now: 3499 }],
    benefits: ['Deep cleansing', 'Intense hydration', 'Glowing skin'],
    bestFor: 'Dull, dry or tired skin',
    image: photo('hydra-facial', 'A Hydra Facial at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/hydra-facial',
    bookingService: 'Hydra Facial',
    terms: TERMS,
  },
  {
    id: 'body-polish',
    category: 'skin-care',
    title: 'Head-to-Toe Body Polish',
    hook: 'Exfoliate, de-tan and relax.',
    lines: [{ label: 'Full body', was: 7999, now: 4999 }],
    benefits: ['Deep exfoliation', 'Removes tan', 'Softer skin'],
    bestFor: 'Tan, dullness or rough skin',
    image: photo('body-polish', 'A body polish at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/body-polish',
    bookingService: 'Body Polish',
    terms: TERMS,
  },
  {
    id: 'hair-spa',
    category: 'skin-care',
    title: 'Hair Spa 2+1',
    hook: 'Book 2 hair spas, get 1.',
    lines: [{ label: 'Starting price', now: 1999, from: true }],
    benefits: ['Deeply nourishes', 'Strengthens hair', 'Adds shine'],
    bestFor: 'Dry, dull or tired hair',
    image: photo('hair-spa', 'A hair spa at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/hair-spa',
    bookingService: 'Hair Spa',
    terms: FROM_TERMS,
  },
  {
    id: 'express-facial',
    category: 'skin-care',
    title: 'Express Facial',
    hook: 'A monthly facial in six steps.',
    lines: [{ label: '6-step facial', now: 2499 }],
    benefits: ['Deep cleansing', 'Hydration', 'Radiant skin'],
    bestFor: 'A regular monthly facial',
    image: photo('express-facial', 'An express facial at Xing Premium Unisex Salon, Bangalore'),
    serviceLink: '/services/facial-cleanup',
    bookingService: 'Express Facial',
    terms: TERMS,
  },
];

const FAQ_CLAIM = { q: 'How do I claim an offer?', a: 'Tap Claim Offer, choose your salon and send the WhatsApp message. We confirm your slot and the price before you visit.' };
const FAQ_SALONS = { q: 'Are these offers at all 3 salons?', a: 'Yes. Every offer on this page is valid at Sarjapur Road, HSR Layout and Brookfield.' };
const FAQ_PAY = { q: 'Do I pay online?', a: 'No. You pay at the salon after your service. Nothing is charged online.' };
const FAQ_COMBINE = { q: 'Can I combine two offers?', a: 'Usually one offer applies per service. Ask the salon when you book and we will tell you what applies.' };

export const offerCategoryPages: OfferCategoryPage[] = [
  {
    id: 'hair-colour',
    path: '/offers/hair-colour',
    name: 'Hair Colour Offers',
    short: 'Hair Colour',
    h1: 'Hair Colour Offers in Bangalore',
    seo: {
      title: 'Hair Colour Offers in Bangalore | Xing Salon',
      description: 'Global hair colour ₹3,999, highlights ₹399 a streak, fashion colour ₹499 a streak and balayage from ₹5,499 at Xing Salon, Bangalore. All 3 salons.',
      crumb: 'Hair Colour',
    },
    heroOfferId: 'global-hair-colour',
    faq: [
      FAQ_CLAIM,
      FAQ_SALONS,
      { q: 'How many highlight streaks do I need?', a: 'Most people choose 8 to 10 streaks. Your colourist suggests the number for your hair at the consultation.' },
      { q: 'Is the global colour price for any length?', a: 'Yes. Global Hair Colour is one flat price for short, medium or long hair.' },
      { q: 'Until when are the hair colour offers valid?', a: 'The hair colour offers are valid till 30 Nov 2026.' },
      FAQ_PAY,
    ],
  },
  {
    id: 'hair-treatment',
    path: '/offers/hair-treatment',
    name: 'Hair Care & Treatment Offers',
    short: 'Hair Care',
    h1: 'Hair Care & Treatment Offers in Bangalore',
    seo: {
      title: 'Hair Treatment Offers in Bangalore | Xing Salon',
      description: 'Keratin ₹4,999, nanoplastia from ₹5,999, Olaplex ₹2,999, anti-dandruff scalp care ₹1,999 and a ₹1,099 haircut package at Xing Salon, Bangalore.',
      crumb: 'Hair Care & Treatment',
    },
    heroOfferId: 'keratin',
    faq: [
      FAQ_CLAIM,
      FAQ_SALONS,
      { q: 'Is the keratin price for any length?', a: 'Yes. Hair Keratin is one flat price for any hair length.' },
      { q: 'Why is nanoplastia a starting price?', a: 'The final price depends on your hair length and density. We confirm it at your consultation, before we start.' },
      { q: 'What does the haircut package include?', a: 'A hair wash, haircut, conditioning and styling, at one price for any length.' },
      FAQ_PAY,
    ],
  },
  {
    id: 'skin-care',
    path: '/offers/skin-care',
    name: 'Skin & Self-Care Offers',
    short: 'Skin Care',
    h1: 'Skin & Self-Care Offers in Bangalore',
    seo: {
      title: 'Skin & Self-Care Offers in Bangalore | Xing Salon',
      description: 'Hydra Facial ₹3,499, head-to-toe body polish ₹4,999, hair spa 2+1 from ₹1,999 and an express facial at ₹2,499 at Xing Salon, Bangalore. All 3 salons.',
      crumb: 'Skin & Self-Care',
    },
    heroOfferId: 'hydra-facial',
    faq: [
      FAQ_CLAIM,
      FAQ_SALONS,
      { q: 'What is in the Hydra Facial?', a: 'A six-step facial: deep cleansing and detox, intense hydration and a glowing finish.' },
      { q: 'How does the hair spa 2+1 work?', a: 'Book 2 hair spas and get the third one free. The starting price is confirmed at your consultation.' },
      FAQ_COMBINE,
      FAQ_PAY,
    ],
  },
];

export const offersIn = (category: OfferCategoryId) => offerCatalog.filter((offer) => offer.category === category);
export const catalogOffer = (id: string) => offerCatalog.find((offer) => offer.id === id)!;
export const categoryPageByPath = (path: string) => offerCategoryPages.find((page) => page.path === path);

/** "₹3,999", "from ₹5,499", "₹399 per streak". */
export const linePrice = (line: OfferLine) => `${line.from ? 'from ' : ''}${formatPrice(line.now)}${line.unit ? ` ${line.unit}` : ''}`;
/** The rupee saving on a line, if it shows one. */
const lineSave = (line: OfferLine) => (line.was ? line.was - line.now : 0);
/** "Save ₹2,000 · 33% off", rounded down. */
export const saveText = (line: OfferLine) => (line.was ? `Save ${formatPrice(lineSave(line))} · ${Math.floor((1 - line.now / line.was) * 100)}% off` : '');
/** Shown on every card: the end date, or "Limited-time offer". */
export const validityText = (offer: CatalogOffer) =>
  offer.validUntil ? `Valid till ${new Date(`${offer.validUntil}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Limited-time offer';

/** The lowest price on a page: "from ₹399 per streak". */
export const pageFrom = (id: OfferCategoryId) => {
  const lines = offersIn(id).flatMap((offer) => offer.lines);
  const low = lines.reduce((a, b) => (b.now < a.now ? b : a));
  return `from ${formatPrice(low.now)}${low.unit ? ` ${low.unit}` : ''}`;
};
