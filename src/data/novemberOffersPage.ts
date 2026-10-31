// Copy for /offers/november. The offers, prices and dates are in offers.ts. `faqs` is also sent to search
// engines (seo.ts), so the page and the schema show the same words.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { reviews, site } from './content';
import { CTA } from './style';
import { formatPrice, fromPrice, maxSavingRupees, novemberCampaign, streakRange, type CampaignOfferId } from './offers';

const save = formatPrice(maxSavingRupees());
const [colourReview, , expertReview] = reviews.items;
const [globalOffer, highlightsOffer, menuOffer] = novemberCampaign.offers;
const [balayage, crazy] = [menuOffer.lines[3], menuOffer.lines[2]];

export const novemberOffersPage = {
  seo: {
    // Up to 60 and 155 characters, so search results show them in full.
    title: 'Hair Colour Offers Bangalore – November – Xing Salon',
    description: 'Global hair colour ₹3,999 at any length, highlights ₹399/streak, balayage from ₹5,499. Valid till 30 Nov at Xing Sarjapur Road, HSR & Brookfield.',
    crumb: 'November Offers',
  },
  hero: {
    h1: 'November Hair Colour Offers',
    h1Hidden: ' in Bangalore',
    sub: `Save up to ${save} · all 3 Xing salons`,
    book: CTA.book,
    sticker: `Save ${formatPrice(globalOffer.lines[0].was - globalOffer.lines[0].now)}`,
  },
  ended: {
    title: 'These offers have ended',
    text: 'The November prices were valid until 30 November. See what’s on now, or explore our hair colour services.',
    offersLabel: 'See current offers',
    links: [
      { label: 'Global Hair Colour', href: '/services/global-hair-color' },
      { label: 'Highlights', href: '/services/highlights' },
      { label: 'Balayage', href: '/services/balayage' },
      { label: 'Fashion Colour', href: '/services/fashion-color' },
    ],
  },
  switcher: [
    { label: 'Global', id: 'nov-global-colour' },
    { label: 'Highlights', id: 'nov-highlights' },
    { label: 'Balayage & Crazy', id: 'nov-colour-menu' },
  ] satisfies Array<{ label: string; id: CampaignOfferId }>,
  offersTitle: 'The 3 November offers',
  trust: {
    title: 'Why book with us?',
    items: [
      { icon: 'chat', label: 'Free consultation' },
      { icon: 'shield', label: 'Patch test on request' },
      { icon: 'lock', label: 'Price fixed before we start' },
      { icon: 'wallet', label: 'Pay at salon, nothing online' },
    ],
    rating: `★ ${site.rating} on Google · ${site.reviewCount} reviews`,
    genuineTitle: 'Why these offers are genuine',
    genuine: [
      'This is a seasonal campaign with a real end date: 30 November.',
      'The same stylists, premium products and service as at full price.',
      'Not included: the Olaplex add-on, and extra streaks beyond those booked.',
      'One offer per service, and not together with Tuesday Happy Hours.',
      'Your price is locked at consultation, before any colour goes on.',
    ],
    steps: ['Claim', 'We confirm', 'Visit'],
  },
  choose: {
    title: 'Which one suits me?',
    options: [
      { label: 'New colour or grey coverage', offer: 'nov-global-colour', result: 'Global Hair Colour' },
      { label: 'Natural, low upkeep', offer: 'nov-highlights', result: 'Highlights' },
      { label: 'A bold statement', offer: 'nov-colour-menu', result: 'Balayage & Crazy' },
    ] satisfies Array<{ label: string; offer: CampaignOfferId; result: string }>,
  },
  results: {
    title: 'Real colour results',
    text: 'Our own clients, photographed in our salons.',
    pair: 'Black hair to a burgundy melt',
    reels: ['Soft brown balayage reveal', 'Copper highlights with layers', 'Red balayage reveal'],
    photos: ['balayage-1', 'highlights-1', 'balayage-2', 'highlights-2'],
  },
  prices: {
    title: 'Every November price',
    posterLabel: 'From our poster',
    note: 'Olaplex optional · price confirmed before we start',
  },
  reviews: {
    title: 'What clients say',
    items: [colourReview, expertReview],
    readAll: 'Read all on Google',
    source: reviews.source,
    moreLabel: '…more',
    /** How many words of a review show before "…more". */
    limit: 25,
  },
  salons: { title: 'Claim at your salon', showAddress: 'Show address' },
  more: { title: 'More about each offer' },
  faqTitle: 'November offer questions',
  faqs: [
    {
      q: 'How much is global hair colour at Xing Bangalore?',
      a: `Global hair colour is ${formatPrice(globalOffer.lines[0].now)} this November, down from ${formatPrice(globalOffer.lines[0].was)}. It’s a flat price at any hair length, at all three salons until 30 November. Your colourist confirms it before starting.`,
    },
    {
      q: 'Is ₹3,999 the price for long hair too?',
      a: 'Yes. It’s one flat price whether your hair is short, medium or long. Your colourist still checks your hair first. Olaplex is an optional add-on, charged only if you choose it.',
    },
    {
      q: 'How much do highlights cost in total?',
      a: `Highlights are ${formatPrice(highlightsOffer.lines[0].now)} per streak, so the 8 to 10 streaks we recommend cost about ${streakRange()} in total. Your colourist confirms the number and the full price before starting.`,
    },
    {
      q: 'How many streaks do I need?',
      a: 'We recommend 8 to 10 for most clients. Fewer gives a subtle lift around the face, and more gives brighter, all-over dimension. Your colourist plans it with you at the free consultation.',
    },
    {
      q: 'How much is balayage this November?',
      a: `Balayage starts from ${formatPrice(balayage.now)}, down from ${formatPrice(balayage.was)}. Crazy colour is ${formatPrice(crazy.now)} per streak. Balayage is a starting price: your colourist confirms the final price before any colour goes on.`,
    },
    {
      q: 'Till when is the November offer valid?',
      a: 'Until 30 November 2026, closing at the end of that day in India time. Colour takes a few hours, so message your salon early if you’re booking near the end date.',
    },
    {
      q: 'Is the offer valid at all branches?',
      a: 'Yes. All three offers are valid at Xing Sarjapur Road, HSR Layout and Brookfield, at the same prices. Tap Claim, choose your salon, and the message goes straight to it on WhatsApp.',
    },
    {
      q: 'Can I combine offers?',
      a: 'No. One November offer applies per service, and these offers can’t be used with Tuesday Happy Hours. You can still book more than one colour service, each at its own price.',
    },
    {
      q: 'Do I need a patch test?',
      a: 'If you’re new to colour or have sensitive skin, we recommend one before your appointment. It’s available on request at all three salons, so mention it when you claim your offer.',
    },
    {
      q: 'Will colour damage my hair?',
      a: 'Colour changes your hair, so we check its condition first and tell you honestly if it needs care. You can add Olaplex as a paid option. Colour-safe shampoo and heat protection help too.',
    },
    {
      q: 'Do I pay online?',
      a: 'No. Nothing is charged online, and claiming on WhatsApp costs nothing. You pay at the salon after your service, and your colourist confirms the full price before starting.',
    },
  ],
  guides: { title: 'Read before you colour', all: CTA.allArticles },
  cta: { title: 'Your new colour is one message away.' },
  fromLabel: `from ${formatPrice(fromPrice())}`,
  saveLabel: `Save up to ${save}`,
};

/** The prefilled WhatsApp message for this page, for the campaign's stage. */
export const pageClaimMessage = (claimText: string) => `Hi Xing ___ (location)! ${claimText} My name: `;
