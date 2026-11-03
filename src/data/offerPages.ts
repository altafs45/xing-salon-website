// Copy for the Offers section: the hub (/offers) and the three category pages (/offers/hair-colour,
// /offers/hair-treatment, /offers/skin-care). The offers, prices and dates are in offerCatalog.ts and offers.ts.
// The FAQs are also sent to search engines (seo.ts), so the page and the schema show the same words.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { allHoursText } from './branches';
import { reviews, site } from './content';
import { BALAYAGE_LINE, CRAZY_LINE, GLOBAL_LINE, HIGHLIGHTS_LINE, catalogOfferById, formatPrice, fromPriceIn, maxSavingIn, type OfferCategoryId } from './offerCatalog';
import { CTA } from './style';

const [colourReview, keratinReview, expertReview, honestyReview, nanoplastiaReview] = reviews.items;
const streaks = (count: number) => formatPrice(count * HIGHLIGHTS_LINE.now);
/** An offer's price and regular price, from the catalogue, so the answers can never drift from the cards. */
const priced = (id: string) => {
  const line = catalogOfferById(id)!.lines[0];
  return { now: formatPrice(line.now), was: line.was ? formatPrice(line.was) : '' };
};
const [keratin, nanoplastia, hydra, polish, spa] = ['keratin', 'nanoplastia', 'hydra-facial', 'body-polish', 'hair-spa'].map(priced);

/** A FAQ item; `campaign` ones are about the November dates and show only while the campaign is open. */
export interface OfferFaq {
  q: string;
  a: string;
  campaign?: boolean;
}

// Questions every offer page answers, each worded for its own page so no two pages repeat a sentence.
const sameSalons = (what: string): OfferFaq => ({
  q: `Are the ${what} offers valid at all three salons?`,
  a: `Yes. The ${what} offers are valid at Xing Sarjapur Road, HSR Layout and Brookfield, at the same prices. Tap Claim on any ${what} offer and choose your salon: the WhatsApp message goes straight to it.`,
});
const PAY_AT_SALON: OfferFaq = {
  q: 'Do I pay anything online?',
  a: 'No. Nothing is charged online, and claiming on WhatsApp costs nothing. You pay at the salon after your service, and the price is confirmed before we start.',
};
const bookAhead = (who: string): OfferFaq => ({
  q: 'Do I need to book an appointment?',
  a: `Walk-ins are welcome, but booking ahead holds a ${who} and enough time for your ${who === 'therapist' ? 'treatment' : 'service'}. ${allHoursText}`,
});
const limitedTime = (what: string): OfferFaq => ({
  q: `How long are the ${what} offers valid?`,
  a: `They are limited-time offers. No end date has been set for the ${what} offers yet, so your salon tells you when you claim.`,
});

const STEPS = [
  { title: 'Claim', text: 'Send us the WhatsApp message, or book a slot.' },
  { title: 'We confirm', text: 'Your salon confirms the time and price.' },
  { title: 'Visit', text: 'Pay at the salon, nothing online.' },
];

const TRUST_ITEMS = [
  { icon: 'chat', label: 'Free consultation' },
  { icon: 'shield', label: 'Same stylists and products' },
  { icon: 'lock', label: 'Price fixed before we start' },
  { icon: 'wallet', label: 'Pay at salon, nothing online' },
] as const;

/** Shared by the hub and the category pages. */
export const offerPagesShared = {
  steps: { title: 'How claiming works', items: STEPS },
  trust: { title: 'Why claim with Xing', items: TRUST_ITEMS, rating: `★ ${site.rating} on Google · ${site.reviewCount} reviews`, genuineTitle: 'Why these offers are genuine' },
  salons: { title: 'Claim at your salon', showAddress: 'Show address' },
  reviews: { readAll: 'Read all on Google', source: reviews.source, moreLabel: '…more', limit: 25 },
  guides: { title: 'Read before you book', all: CTA.allArticles },
  prices: { title: 'Every offer price', caption: 'Offer prices: service, regular price, offer price and saving' },
  more: { title: 'More offers' },
  picker: { label: 'Choose your salon', all: 'All salons' },
};

export interface OfferCategoryCopy {
  /** The page's crumb and the cross-sell links. */
  crumb: string;
  /** Real results from the salon; left out where there are none yet. */
  results?: { title: string; text: string; pair?: string; reels: string[]; photos: Array<{ name: string; alt: string }> };
  reviews?: { title: string; items: Array<{ quote: string; name: string }> };
  genuine: string[];
  pricesNote: string;
  faqTitle: string;
  faqs: OfferFaq[];
  cta: string;
  /** The WhatsApp sentence when no single offer is chosen. */
  claim: string;
}

export const offerCategoryPages: Record<OfferCategoryId, OfferCategoryCopy> = {
  'hair-colour': {
    crumb: 'Hair Colour',
    results: {
      title: 'Real colour results',
      text: 'Our own clients, photographed in our salons.',
      pair: 'Black hair to a burgundy melt',
      reels: ['Soft brown balayage reveal', 'Copper highlights with layers', 'Red balayage reveal'],
      photos: [
        { name: 'work-balayage-1', alt: 'Balayage on a client at Xing Salon Bangalore' },
        { name: 'work-highlights-1', alt: 'Highlights on a client at Xing Salon Bangalore' },
        { name: 'work-fashion-1', alt: 'Crazy fashion colour on a client at Xing Salon Bangalore' },
      ],
    },
    reviews: { title: 'What clients say', items: [colourReview, expertReview] },
    genuine: [
      'A seasonal campaign with a real end date: 30 November.',
      'The same stylists, premium products and service as at full price.',
      'Not included: the Olaplex add-on, and extra streaks beyond those booked.',
      'One offer per service, and not together with Tuesday Happy Hours.',
      'Your price is locked at consultation, before any colour goes on.',
    ],
    pricesNote: 'Olaplex optional · price confirmed before we start',
    faqTitle: 'Hair colour offer questions',
    faqs: [
      {
        q: 'How much is global hair colour at Xing Bangalore?',
        a: `Global hair colour is ${formatPrice(GLOBAL_LINE.now)}, down from ${formatPrice(GLOBAL_LINE.was!)}: one flat price at any hair length, at all three salons. Your colourist confirms it before starting.`,
      },
      {
        q: 'How much do highlights cost in total?',
        a: `Highlights are ${formatPrice(HIGHLIGHTS_LINE.now)} per streak, so the 8 to 10 streaks we recommend cost about ${streaks(8)}–${streaks(10)} in total. Your colourist confirms the number and the full price before starting.`,
      },
      {
        q: 'How many streaks do I need?',
        a: 'We recommend 8 to 10 for most clients. Fewer gives a subtle lift around the face, and more gives brighter, all-over dimension. Your colourist plans it with you at the free consultation.',
      },
      {
        q: 'How much are balayage and crazy fashion colour?',
        a: `Balayage starts from ${formatPrice(BALAYAGE_LINE.now)}, down from ${formatPrice(BALAYAGE_LINE.was!)}, and crazy fashion colour is ${formatPrice(CRAZY_LINE.now)} per streak. Your colourist confirms the final price before any colour goes on.`,
      },
      {
        q: 'Till when are the hair colour offers valid?',
        a: 'Until 30 November 2026, closing at the end of that day in India time. Colour takes a few hours, so message your salon early if you’re booking near the end date.',
        campaign: true,
      },
      sameSalons('hair colour'),
      {
        q: 'Can I combine offers?',
        a: 'No. One offer applies per service, and these offers can’t be used with Tuesday Happy Hours. You can still book more than one colour service, each at its own price.',
      },
      {
        q: 'Do I need a patch test?',
        a: 'If you’re new to colour or have sensitive skin, we recommend one before your appointment. It’s available on request at all three salons, so mention it when you claim.',
      },
    ],
    cta: 'Your new colour is one message away.',
    claim: 'I’d like to claim one of your hair colour offers.',
  },
  'hair-treatment': {
    crumb: 'Hair Treatment',
    results: {
      title: 'Real treatment results',
      text: 'Our own clients, photographed in our salons.',
      pair: 'Frizzy lengths to glass-smooth hair',
      reels: ['Glass-smooth straight lengths', 'Nanoplastia: brushed-out shine', 'Nanoplastia: frizz-free lengths'],
      photos: [
        { name: 'work-smoothing-1', alt: 'Sleek, frizz-free lengths at Xing Salon Bangalore' },
        { name: 'work-nanoplastia-3', alt: 'Poker-straight, glossy finish after nanoplastia at Xing Salon Bangalore' },
      ],
    },
    reviews: { title: 'What clients say', items: [keratinReview, nanoplastiaReview, honestyReview] },
    genuine: [
      'Real offer prices from the salon, at all three salons.',
      'The same stylists, premium products and service as at full price.',
      'A free hair analysis first: we tell you honestly if a treatment isn’t right.',
      'One offer per service, and not together with Tuesday Happy Hours.',
      'Your price is confirmed at consultation, before we start.',
    ],
    pricesNote: 'Free Acai oil treatment with every hair treatment · price confirmed before we start',
    faqTitle: 'Hair treatment offer questions',
    faqs: [
      {
        q: 'How much is keratin at Xing Bangalore?',
        a: `Hair keratin is ${keratin.now}, down from ${keratin.was}: one flat price at any hair length, at all three salons. Your stylist checks your hair first and confirms the price before starting.`,
      },
      {
        q: 'Why is nanoplastia a “from” price?',
        a: `Nanoplastia starts from ${nanoplastia.now}. The final price depends on your hair length and texture, and your stylist confirms it after a hair analysis, before starting.`,
      },
      {
        q: 'Which treatment is right for me?',
        a: 'Keratin and nanoplastia smooth your hair; the Olaplex treatment repairs damaged bonds; the scalp treatment targets dandruff. Your stylist recommends one after checking your hair and scalp.',
      },
      {
        q: 'Is the Acai oil treatment included?',
        a: 'Yes. Every hair treatment at Xing comes with a complimentary Acai oil treatment for extra nourishment and shine.',
      },
      sameSalons('hair treatment'),
      limitedTime('hair treatment'),
      bookAhead('stylist'),
    ],
    cta: 'Smoother, healthier hair is one message away.',
    claim: 'I’d like to claim one of your hair treatment offers.',
  },
  'skin-care': {
    crumb: 'Skin Care',
    // OWNER: no skin care results or client feedback photos yet. The old skin care page's "client feedback" images
    // (originals/offers/facialfeedback) are hair colour before/afters, so they are not used here. Add real ones
    // as `results` when the salon has them.
    genuine: [
      'Real offer prices from the salon, at all three salons.',
      'The same therapists, premium products and service as at full price.',
      'Your therapist checks your skin first and confirms the treatment suits it.',
      'One offer per service, and not together with Tuesday Happy Hours.',
      'Your price is confirmed before we start.',
    ],
    pricesNote: 'Price confirmed before we start · pay at the salon',
    faqTitle: 'Skin care offer questions',
    faqs: [
      {
        q: 'How much is the Hydra Facial at Xing Bangalore?',
        a: `The Hydra Facial is ${hydra.now}, down from ${hydra.was}: a six-step facial for deep cleansing, hydration and a fresh, glowing finish, at all three salons.`,
      },
      {
        q: 'What does the body polish do?',
        a: `The Head-to-Toe Body Polish, ${polish.now} down from ${polish.was}, deeply exfoliates from head to toe, helps remove tan and dullness, and leaves skin smoother-feeling with a refreshed glow.`,
      },
      {
        q: 'How does the Hair Spa 2+1 offer work?',
        a: `Book two hair spas and get a third, from ${spa.now}. Your salon confirms the spa variant and the final price for your hair when you book.`,
      },
      {
        q: 'Which offer is right for me?',
        a: 'The Hydra Facial focuses on deep cleansing and hydration; the Express Facial is a quicker six-step cleanse; the body polish exfoliates head to toe; the hair spa nourishes your hair. We’ll help you choose.',
      },
      sameSalons('skin care'),
      limitedTime('skin care'),
      bookAhead('therapist'),
    ],
    cta: 'Your glow is one message away.',
    claim: 'I’d like to claim one of your skin care offers.',
  },
};

/** The hub, /offers. */
export const offersHubPage = {
  seo: {
    // Up to 60 and 155 characters, so search results show them in full.
    title: 'Salon Offers in Bangalore | Colour, Keratin, Facials – Xing',
    description: `Save up to ${formatPrice(maxSavingIn())} on hair colour, keratin, facials and more at Xing Sarjapur Road, HSR Layout & Brookfield. Prices confirmed before we start.`,
  },
  hero: {
    h1: 'Salon Offers in Bangalore',
    sub: `Save up to ${formatPrice(maxSavingIn())} · Sarjapur Road, HSR Layout & Brookfield`,
  },
  categoriesTitle: 'Choose your offer',
  featuredTitle: 'Biggest saving',
  extrasTitle: 'More ways to save',
  faqTitle: 'Questions about the offers',
  faqs: [
    {
      q: 'Which salons have these offers?',
      a: 'All three Xing salons in Bangalore: Sarjapur Road, HSR Layout and Brookfield, at the same prices. Choose your salon when you claim, and your message goes straight to it.',
    },
    {
      q: 'How long are the offers valid?',
      a: 'The hair colour offers run until 30 November 2026. The hair treatment and skin care offers are limited-time: your salon confirms the end date when you claim.',
      campaign: true,
    },
    {
      q: 'Can I combine two offers?',
      a: 'No. One offer applies per service, and the offers can’t be used with Tuesday Happy Hours. You can book more than one service, each at its own offer price.',
    },
    {
      q: 'Is there a minimum bill for Tuesday Happy Hours?',
      a: 'Yes. Minimum billing applies to the Tuesday 25% off. Your salon confirms the amount when you book.',
    },
    {
      q: 'Can I walk in to claim an offer?',
      a: `Walk-ins are welcome at all three salons. ${allHoursText} For longer services such as keratin or colour, message first so a stylist is free.`,
    },
    PAY_AT_SALON,
  ] satisfies OfferFaq[],
  cta: 'Your next look is one message away.',
  claim: 'I’d like to claim one of your current offers.',
};

/** The categories' "from" prices, for the menu and the hub cards. */
export const categoryFromLabel = (category: OfferCategoryId) => `from ${formatPrice(fromPriceIn(category))}`;
/** The prefilled WhatsApp message for a page. "___ (location)" becomes the salon the visitor picks. */
export const pageClaimMessage = (text: string) => `Hi Xing ___ (location)! ${text} My name: `;
