// Copy for /offers/november. The offers, prices and dates are in offers.ts. `faqs` is also sent to search
// engines (seo.ts), so the page and the schema show the same words.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { reviews, site } from './content';
import { formatPrice, maxSavingRupees, novemberCampaign, streakCost, streakRange, type CampaignOfferId } from './offers';

const save = formatPrice(maxSavingRupees());
const [colourReview, , expertReview] = reviews.items;

export const novemberOffersPage = {
  seo: {
    // Up to 60 and 155 characters, so search results show them in full.
    title: 'Hair Colour Offers Bangalore – November | Xing Salon',
    description: 'Global hair colour ₹3,999 at any length, highlights ₹399/streak, balayage from ₹5,499. Valid till 30 Nov at Xing Sarjapur Road, HSR & Brookfield.',
    crumb: 'November Offers',
  },
  hero: {
    eyebrow: 'November Offers · Valid till 30 Nov',
    h1: 'Hair Colour Offers in Bangalore this November',
    sub: `Save up to ${save} on global colour, highlights, crazy colour and balayage at all 3 Xing salons.`,
    claim: 'Claim on WhatsApp',
    book: 'Book a slot',
    chips: [
      { label: 'Global', href: '#nov-global-colour' },
      { label: 'Highlights', href: '#nov-highlights' },
      { label: 'Balayage & Crazy', href: '#nov-colour-menu' },
    ],
    trust: [`★ ${site.rating} Google`, `${site.reviewCount} reviews`, '3 salons', 'Price confirmed before we start'],
  },
  ended: {
    title: 'The November offers have ended',
    text: 'These prices were valid until 30 November. See what’s on now, or explore our hair colour services.',
    offersLabel: 'See current offers',
    links: [
      { label: 'Global Hair Colour', href: '/services/global-hair-color' },
      { label: 'Highlights', href: '/services/highlights' },
      { label: 'Balayage', href: '/services/balayage' },
      { label: 'Fashion Colour', href: '/services/fashion-color' },
    ],
  },
  offersTitle: { eyebrow: 'The Offers', title: 'What are the November hair colour offers?', text: 'Three offers, real prices. Each one is valid at all 3 salons until 30 November.' },
  choose: {
    eyebrow: 'Find Your Offer',
    title: 'Which offer is right for me?',
    text: 'Pick what you want from your colour. We’ll take you to the right offer.',
    options: [
      { label: 'Full colour change or grey coverage', offer: 'nov-global-colour', result: 'Global Hair Colour' },
      { label: 'Natural dimension, low upkeep', offer: 'nov-highlights', result: 'Hair Highlights, or balayage on the menu' },
      { label: 'A bold statement', offer: 'nov-colour-menu', result: 'Crazy Colour on the Hair Colour Menu' },
    ] satisfies Array<{ label: string; offer: CampaignOfferId; result: string }>,
  },
  prices: {
    eyebrow: 'Every Price',
    title: 'How much does each service cost in November?',
    text: 'Every November price at a glance, with what you save in rupees and per cent.',
    note: 'No hidden charges. Olaplex is an optional add-on; your colourist confirms the final price before starting.',
  },
  deepDives: {
    'nov-global-colour': {
      eyebrow: 'Global Hair Colour',
      title: 'What is the November global hair colour offer?',
      answer: `Global hair colour at Xing is ${formatPrice(3999)} this November, at any hair length. You get one even shade from roots to ends, chosen with your colourist at a free consultation. It takes about 1.5 to 2 hours at any of our 3 Bangalore salons, and the offer runs until 30 November.`,
      blocks: [
        { title: 'Who does it suit?', text: 'Anyone covering greys, changing their colour completely or evening out faded colour.' },
        { title: 'What happens?', text: 'Your colourist checks your hair, matches a shade to your skin tone, then colours from roots to ends.' },
        { title: 'How long does it last?', text: 'Most people book a root touch-up every 4–6 weeks, depending on how fast their hair grows.' },
        { title: 'Aftercare', text: 'Use a colour-safe shampoo, wash with cooler water and protect your hair from heat.' },
      ],
      link: { label: 'More about global hair colour', href: '/services/global-hair-color' },
    },
    'nov-highlights': {
      eyebrow: 'Hair Highlights',
      title: 'How much do highlights cost this November?',
      answer: `Highlights at Xing are ${formatPrice(399)} per streak this November, down from ${formatPrice(499)}. We recommend 8 to 10 streaks, so most clients pay about ${streakRange()} in total. Your colourist plans the placement with you, and confirms the number of streaks and the full price before starting.`,
      blocks: [
        { title: 'Who does it suit?', text: 'Anyone who wants brightness and dimension without colouring all of their hair.' },
        { title: 'What happens?', text: 'You choose the shade and placement with your colourist, then strands are lightened, toned where needed and finished with a blow-dry.' },
        { title: 'How long does it last?', text: 'Highlights grow out rather than wash out. Most people refresh them every 2–3 months.' },
        { title: 'Aftercare', text: 'Use a colour-safe shampoo and a weekly mask to keep lightened strands soft.' },
      ],
      link: { label: 'More about highlights', href: '/services/highlights' },
    },
    'nov-colour-menu': {
      eyebrow: 'Balayage & Crazy Colour',
      title: 'How much are balayage and crazy colour this November?',
      answer: `Balayage at Xing starts from ${formatPrice(5499)} this November, down from ${formatPrice(7999)}, and crazy colour is ${formatPrice(499)} per streak, down from ${formatPrice(799)}. Balayage takes about 3 to 4 hours and crazy colour about 3 to 5 hours. Your colourist confirms the final price before starting.`,
      blocks: [
        { title: 'Who does balayage suit?', text: 'Anyone who wants soft, sun-kissed colour that grows out gently.' },
        { title: 'Who does crazy colour suit?', text: 'Anyone who wants a bold statement, from a few bright streaks to more.' },
        { title: 'How long does it last?', text: 'Balayage needs a gloss or toner every 6–8 weeks; crazy colour a refresh every 4–6 weeks.' },
        { title: 'Aftercare', text: 'Use a colour-safe shampoo, wash with cooler water and keep up your gloss or refresh.' },
      ],
      links: [
        { label: 'More about balayage', href: '/services/balayage' },
        { label: 'More about crazy colour', href: '/services/fashion-color' },
      ],
    },
  },
  streaks: { title: 'How many streaks do I need?', text: 'We recommend 8–10. Here is what each number costs at the November price:', examples: [6, 8, 10].map((count) => ({ count, total: formatPrice(streakCost(count)) })) },
  results: {
    eyebrow: 'Real Results',
    title: 'What do real colour results look like?',
    text: 'Our own clients, photographed in our salons.',
    pair: 'Black hair to a burgundy melt',
    reels: ['Soft brown balayage reveal', 'Copper highlights with layers', 'Red balayage reveal'],
    photos: ['balayage-1', 'balayage-2', 'balayage-3', 'highlights-1', 'highlights-2', 'highlights-3'],
  },
  safety: {
    eyebrow: 'Safe Colour Promise',
    title: 'How do you keep my hair safe?',
    text: 'Every colour starts with a conversation, not a brush.',
    items: [
      { title: 'Free consultation', text: 'We talk through the shade, the upkeep and the price first.' },
      { title: 'Patch test on request', text: 'New to colour or have sensitive skin? A patch test is available on request.' },
      { title: 'Hair-health check', text: 'We check your hair’s condition before any colour goes on.' },
      { title: 'Olaplex option', text: 'Add Olaplex to any colour as an optional paid add-on.' },
      { title: 'Shade matched to you', text: 'Your colourist matches the shade to your skin tone.' },
    ],
  },
  how: {
    eyebrow: 'How It Works',
    title: 'How do I claim a November offer?',
    items: [
      { title: 'Claim on WhatsApp', text: 'Tap Claim, choose your salon and send the message.' },
      { title: 'We confirm time & price', text: 'Your salon confirms your time and the price.' },
      { title: 'Visit & pay at the salon', text: 'Nothing is charged online.' },
    ],
  },
  genuine: {
    eyebrow: 'No Fine-Print Surprises',
    title: 'Why are these offers genuine?',
    text: 'This is a seasonal November campaign with a real end date: 30 November.',
    items: [
      'The same stylists, premium products and service as at full price.',
      'Not included: the Olaplex add-on, and extra streaks beyond those booked.',
      'One offer per service, and not together with Tuesday Happy Hours.',
      'Your price is locked at consultation, before any colour goes on.',
    ],
  },
  reviews: {
    eyebrow: 'Client Reviews',
    title: 'What do clients say about colour at Xing?',
    items: [colourReview, expertReview],
    rating: `Rated ${site.rating} ${reviews.ratingLabel}`,
    source: reviews.source,
    readAll: 'Read all reviews on Google',
  },
  salons: { eyebrow: 'Our Salons', title: 'Claim at your nearest salon' },
  faqTitle: 'November Offer Questions',
  faqs: [
    {
      q: 'How much is global hair colour at Xing Bangalore?',
      a: `Global hair colour at Xing Bangalore is ${formatPrice(3999)} this November, down from ${formatPrice(5999)}, a saving of ${formatPrice(2000)}. The price is flat at any hair length and is valid at all three salons until 30 November. Your colourist confirms it before starting, and you pay at the salon.`,
    },
    {
      q: 'Is ₹3,999 the price for long hair too?',
      a: 'Yes. ₹3,999 is one flat price at any hair length, whether your hair is short, medium or long. Your colourist still checks your hair at the free consultation and confirms the price before starting. Olaplex is an optional add-on, charged separately only if you choose it.',
    },
    {
      q: 'How much do highlights cost in total?',
      a: `Highlights are ${formatPrice(399)} per streak this November, so the 8 to 10 streaks we recommend cost about ${streakRange()} in total. You can choose fewer or more streaks. Your colourist confirms the number of streaks and the full price with you before starting.`,
    },
    {
      q: 'How many streaks do I need?',
      a: 'We recommend 8 to 10 streaks for most clients. Fewer gives a subtle lift around the face, and more gives brighter, all-over dimension. The right number depends on your hair and the look you want, so your colourist plans it with you at the free consultation.',
    },
    {
      q: 'How much is balayage this November?',
      a: `Balayage starts from ${formatPrice(5499)} this November, down from ${formatPrice(7999)}, which saves ${formatPrice(2500)}. It is a starting price because the final cost depends on your hair and the look you want. Your colourist confirms the final price at the consultation, before any colour goes on.`,
    },
    {
      q: 'Till when is the November offer valid?',
      a: 'The November hair colour offers are valid until 30 November 2026, closing at the end of that day in India time. Claim on WhatsApp or book a slot, and your salon confirms your appointment. Ask your salon about visiting close to the end date, as colour takes several hours.',
    },
    {
      q: 'Is the offer valid at all branches?',
      a: 'Yes. All three November offers are valid at every Xing salon in Bangalore: Sarjapur Road, HSR Layout and Brookfield. The prices are the same at each salon. Tap Claim, choose your nearest salon, and the message goes straight to that salon on WhatsApp so it can confirm your time.',
    },
    {
      q: 'Can I combine offers?',
      a: 'No. One November offer applies per service, and the November offers cannot be used together with Tuesday Happy Hours. You can still book more than one colour service, each at its own price. Your salon confirms exactly what applies to your visit before any colour goes on.',
    },
    {
      q: 'Do I need a patch test?',
      a: 'If you are new to colour or have sensitive skin, we recommend a patch test before your appointment. It is available on request at all three salons, so mention it when you claim your offer. Your colourist also checks the condition of your hair before any colour goes on.',
    },
    {
      q: 'Will colour damage my hair?',
      a: 'Colour changes your hair, so we check its condition first and tell you honestly if it needs care before colouring. You can add Olaplex bond protection as an optional paid add-on. Good aftercare matters too: a colour-safe shampoo, cooler water and heat protection all help hair stay healthy.',
    },
    {
      q: 'Do I pay online?',
      a: 'No. Nothing is charged online, and claiming an offer on WhatsApp costs nothing. You pay at the salon after your service. Your colourist confirms the price at the consultation before starting, so you will know the full amount before any colour goes on your hair.',
    },
  ],
  guides: { eyebrow: 'From Our Blog', title: 'Read before you colour' },
  cta: { title: 'Your new colour is one message away.' },
  claimMessage: `Hi Xing ___ (location)! I’d like to claim a November hair colour offer. My name: `,
  campaign: novemberCampaign.id,
} as const;
