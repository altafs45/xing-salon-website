// Copy for /offers. The offers themselves are in offers.ts. `faqs` is also sent to search engines (seo.ts),
// so keep it free of prices and of promises the salon can't keep.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { reviews, site } from './content';
import { allHoursText } from './branches';
import type { OfferCategory, SalonOfferId } from './offers';

const [colourReview, keratinReview, , honestyReview] = reviews.items;

export type OfferFilter = 'all-offers' | Exclude<OfferCategory, 'all'> | 'tuesday';

export const offersPage = {
  seo: {
    // Up to 60 and 155 characters, so search results show them in full.
    title: 'Salon Offers in Bangalore | Colour, Keratin, Facials – Xing',
    description:
      'Save up to 37% on hair colour, 35% on Hydra Facial, a flat keratin price at any length and 25% off Tuesdays at Xing Sarjapur Road, HSR Layout & Brookfield.',
  },
  hero: {
    eyebrow: 'Limited-Time Offers',
    h1: 'Salon Offers in Bangalore',
    text: 'Save up to 37% on hair colour, 35% on Hydra Facial, and 25% off every Tuesday at 3 Xing salons.',
    claim: 'Claim on WhatsApp',
    book: 'Book a Slot',
    trust: [`★ ${site.rating} Google`, `${site.reviewCount} reviews`, '3 salons'],
  },
  filters: [
    { id: 'all-offers', label: 'All' },
    { id: 'hair', label: 'Hair' },
    { id: 'skin', label: 'Skin' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'value', label: 'Value' },
  ] satisfies Array<{ id: OfferFilter; label: string }>,
  deckTitle: 'All Current Offers',
  /** Keyword headings, read by screen readers and search engines above each offer in the deck. */
  headings: {
    'hydra-facial': 'Hydra Facial Offer in Bangalore',
    keratin: 'Keratin Treatment Offer – Any Hair Length',
    'hair-colour': 'Hair Colour & Balayage Offers',
    tuesday: 'Tuesday Salon Offer: 25% Off',
    membership: 'Xing Membership Offer',
    'gift-card': 'Salon Gift Cards',
  } satisfies Record<SalonOfferId, string>,
  smallPrint: 'Limited-time offers. Terms apply; your salon confirms the final details before starting.',
  pick: {
    title: 'Not sure which one?',
    items: [
      { label: 'Frizzy hair', offer: 'keratin' },
      { label: 'Dull skin', offer: 'hydra-facial' },
      { label: 'New look', offer: 'hair-colour' },
    ] satisfies Array<{ label: string; offer: SalonOfferId }>,
  },
  proof: {
    eyebrow: 'Real Clients',
    title: 'Results You Can See',
    text: 'Drag each photo to compare. These are our own clients, photographed in our salons.',
    // Before/after pairs (media.ts) by caption, and the offer each one shows.
    pairs: [
      { caption: 'Frizzy lengths to glass-smooth hair', offer: 'keratin' },
      { caption: 'Black hair to a burgundy melt', offer: 'hair-colour' },
      // No facial before/after photos yet; swap this for one when the salon has them.
      { caption: 'Unruly curls to sleek, straight hair', offer: 'keratin' },
    ] satisfies Array<{ caption: string; offer: SalonOfferId }>,
    reviews: [keratinReview, colourReview, honestyReview],
    rating: `Rated ${site.rating} ${reviews.ratingLabel}`,
    source: reviews.source,
    readAll: 'Read all reviews on Google',
  },
  steps: {
    eyebrow: 'How It Works',
    title: 'Three Steps to Your Offer',
    items: [
      { title: 'Claim', text: 'Tap Claim and send the message on WhatsApp, or book a slot.' },
      { title: 'We confirm time & price', text: 'Your salon confirms the time, and the price before starting.' },
      { title: 'Visit & pay at the salon', text: 'Nothing charged online.' },
    ],
  },
  salons: { eyebrow: 'Our Salons', title: 'Claim at Your Nearest Xing Salon' },
  faqTitle: 'Questions About the Offers',
  faqs: [
    {
      q: 'How long are these offers valid?',
      a: 'They are limited-time offers. An end date has not been announced, so your salon confirms it when you claim. Tuesday Happy Hours runs every Tuesday.',
    },
    {
      q: 'Which salons have these offers?',
      a: 'All three Xing salons in Bangalore: Sarjapur Road, HSR Layout and Brookfield. Your salon confirms the offer when you message it.',
    },
    {
      q: 'Is the keratin offer the same for long hair?',
      a: 'Yes. The Hair Keratin offer is one flat price for any hair length: short, medium or long.',
    },
    {
      // TODO (owner to confirm): whether offers can be combined.
      q: 'Can I combine two offers?',
      a: 'No. One offer applies per bill, unless your salon tells you otherwise.',
    },
    {
      q: 'Is there a minimum bill for Tuesday Happy Hours?',
      a: 'Yes. Minimum billing applies to the Tuesday 25% off. Your salon confirms the amount when you book.',
    },
    {
      q: 'Can I walk in to claim an offer?',
      a: `Walk-ins are welcome at all three salons. ${allHoursText} For longer services such as keratin or colour, message first so a stylist is free.`,
    },
    {
      q: 'Do I pay anything online?',
      a: 'No. Nothing is charged online. You pay at the salon, and the price is confirmed before we start.',
    },
  ],
  cta: { title: 'Your next look is one message away.' },
} as const;
