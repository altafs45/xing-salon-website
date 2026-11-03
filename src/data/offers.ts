// Offers and combos for the home page's Offers section, the salon pages, the offer popup and the service pages.
// Offers with published prices (and the November campaign's) live in offerCatalog.ts; this file adds the
// campaign's dates and states, the percentage-only offers (Tuesday, memberships, gift cards) and the combos.
// While SHOW_PRICES is false the site shows percentages and wording only: no amounts anywhere, and the
// salon's offer posters (which print prices) are not used. Amounts are kept below as plain numbers so they
// can be switched back on from this one place.
// Never add a price, date or term the salon has not published.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { SALON_ORDER } from './branches';
import {
  BALAYAGE_LINE,
  CRAZY_LINE,
  GLOBAL_LINE,
  GLOBAL_POSTER,
  HIGHLIGHTS_LINE,
  catalogOfferById,
  categoryById,
  formatPrice,
  linePrice,
  lineSaving,
  offerSaving,
  offersIn,
  savingPercent,
  type CatalogOffer,
  type OfferImage,
  type OfferLine,
} from './offerCatalog';
import { CTA } from './style';

export { formatPrice, lineSaving, linePrice, savingLabel, savingPercent, PRICE_NOTE } from './offerCatalog';

/** Shows the NOW / WAS rows from `prices`. Keep false: the site does not publish prices. */
export const SHOW_PRICES = false as boolean;

export interface Offer {
  title: string;
  /** Shown large on the offer card, e.g. "25%". */
  figure: string;
  deal: string;
  terms: string;
  /** Slug of the service page this offer belongs to; other pages link the offer card there. */
  page?: string;
  /** Where the offer is listed in full; the card's title links there. */
  details?: string;
}

export type BranchId = (typeof SALON_ORDER)[number];
export type OfferCategory = 'hair' | 'skin' | 'all' | 'value';
export type SalonOfferId = 'hydra-facial' | 'keratin' | 'hair-colour' | 'tuesday' | 'membership' | 'gift-card';

/** One price line, used only while SHOW_PRICES is true. Amounts in rupees. */
export interface OfferPrice {
  label: string;
  now: number;
  /** Left out when the salon published no regular price. */
  was?: number;
}

export interface SalonOffer {
  /** The offer's anchor on /offers (#keratin) and its id in tracking. */
  id: SalonOfferId;
  category: OfferCategory;
  /** The service, e.g. "Hydra Facial". */
  title: string;
  /** The number or deal, shown on the photo, e.g. "Flat 35% off". Identical wherever the offer appears. */
  badge: string;
  /** One line on the result for you, e.g. "Skin that glows for days." */
  hook: string;
  /** What the offer covers, in one line. */
  sub: string;
  includes: string[];
  idealFor: string[];
  duration?: string;
  image: OfferImage;
  /** More photos for the offer's detail sheet. */
  gallery: OfferImage[];
  /** The service page the offer belongs to. */
  serviceLink?: string;
  /** The booking form's service for this offer; must match an entry in `booking.services` (or be empty). */
  bookingService: string;
  branches: BranchId[];
  tag?: 'Bestseller' | 'Most claimed';
  /** Highlighted with a "Today" tag on this weekday (0 = Sunday), in salon time. */
  weekday?: number;
  /** Choices inside the offer (hair colour), each with its own saving. */
  options?: Array<{ name: string; saving: string }>;
  steps: string[];
  terms: string[];
  faq: Array<{ q: string; a: string }>;
  /** Used only while SHOW_PRICES is true. */
  prices?: OfferPrice[];
}

export const ALL_BRANCHES: BranchId[] = [...SALON_ORDER];
// TODO (owner to confirm): the posters say only "Limited time offer" and "T&C apply". Until the salon gives
// an end date, every offer says "limited-time" and the salon confirms the details when you claim.
const LIMITED = 'Limited-time offer. Your salon confirms the final details before starting.';
const STEPS = ['Claim the offer on WhatsApp or book a slot.', 'Your salon confirms the time, and the price before starting.', 'Visit and pay at the salon. Nothing is charged online.'];

const photo = (name: string, alt: string, width = 800, height = 600, small = 480): OfferImage => ({
  src: `/images/${name}.webp`,
  srcSet: `/images/${name}-${small}.webp ${small}w, /images/${name}.webp ${width}w`,
  alt,
  width,
  height,
});

// From the salon's hair colour poster. The largest saving here is 37%, not the 50% the poster headline claims.
const COLOUR_PRICES: OfferPrice[] = [
  { label: 'Global Colour', now: 3999, was: 5999 },
  { label: 'Highlights', now: 399, was: 499 },
  { label: 'Crazy Colour', now: 499, was: 799 },
  { label: 'Balayage', now: 5499, was: 7999 },
];
/** The largest saving on the colour menu, e.g. "37%". */
const BEST_COLOUR_SAVING = `${Math.max(...COLOUR_PRICES.map((price) => parseInt(savingPercent(price), 10)))}%`;

/** Every current offer, in page order. */
export const salonOffers: SalonOffer[] = [
  {
    id: 'hydra-facial',
    category: 'skin',
    title: 'Hydra Facial',
    badge: 'Flat 35% off',
    hook: 'Skin that glows for days.',
    sub: '6-step deep cleanse and intense hydration for glowing skin.',
    includes: ['Cleanse & detox', 'Exfoliation', 'Hydration infusion', 'Glow finish'],
    idealFor: ['Dull or tired skin', 'Before an event', 'Dehydrated skin'],
    image: photo('svc-hydra-facial-hero', 'Hydra Facial treatment with a skin device – flat 35% off offer at Xing Salon, Bangalore'),
    gallery: [
      photo('gal-facial-cleanup-2', 'Gentle foam cleanse during a facial', 600, 600, 400),
      photo('gal-facial-cleanup-3', 'Relaxing facial massage', 600, 600, 400),
    ],
    serviceLink: '/services/hydra-facial',
    bookingService: 'Skin & Facial',
    branches: ALL_BRANCHES,
    tag: 'Most claimed',
    steps: STEPS,
    terms: [LIMITED],
    faq: [
      { q: 'What does the Hydra Facial offer include?', a: 'The complete 6-step Hydra Facial: cleanse and detox, exfoliation, a hydration infusion and a glow finish.' },
      { q: 'Is the Hydra Facial suitable for my skin?', a: 'Your therapist checks your skin first and confirms the treatment suits it before starting.' },
    ],
    prices: [{ label: 'Hydra Facial', now: 3499, was: 5499 }],
  },
  {
    id: 'keratin',
    category: 'hair',
    title: 'Hair Keratin',
    badge: 'Flat price · Any length',
    hook: 'Glass-smooth hair, one flat price.',
    sub: 'One flat price for short, medium or long hair, with smooth, frizz-free results.',
    includes: ['Any hair length', 'Frizz control', 'Smooth, shiny finish', 'Long-lasting'],
    idealFor: ['Frizzy hair', 'Long hair (same price)', 'Humid Bangalore days'],
    image: photo('keratin-hair-treatment-bangalore', 'Smooth, frizz-free hair after keratin – flat price for any length at Xing Salon, Bangalore'),
    gallery: [
      photo('ba-keratin-1-after', 'Glass-smooth hair after a keratin treatment at Xing Salon', 800, 1067),
      photo('ba-smoothening-1-after', 'Sleek, straight hair after a smoothing treatment at Xing Salon', 800, 1067),
    ],
    serviceLink: '/services/keratin-treatment',
    bookingService: 'Keratin Treatment',
    branches: ALL_BRANCHES,
    tag: 'Bestseller',
    steps: STEPS,
    terms: [LIMITED],
    faq: [
      { q: 'Is the keratin price the same for long hair?', a: 'Yes. The Hair Keratin offer is one flat price for any hair length: short, medium or long.' },
      { q: 'How long does keratin last?', a: 'With the right aftercare, keratin keeps hair smoother and frizz-free for months. Your stylist gives you an aftercare plan.' },
    ],
    prices: [{ label: 'Hair Keratin, any length', now: 4999, was: 7999 }],
  },
  {
    id: 'hair-colour',
    category: 'hair',
    title: 'Hair Colour',
    // The poster says more, but its own prices save at most this much.
    badge: `Save up to ${BEST_COLOUR_SAVING}`,
    hook: `Colour you’ll love, up to ${BEST_COLOUR_SAVING} off.`,
    sub: 'Global colour, highlights, crazy colour and balayage.',
    includes: ['Free colour consultation', 'Patch test on request', 'Olaplex add-on', 'Shade matched to your skin tone'],
    idealFor: ['A new look', 'Covering greys', 'Balayage and highlights'],
    image: photo('balayage-hair-colour-bangalore', 'Balayage hair colour – hair colour offer at Xing Salon, Bangalore'),
    gallery: [
      photo('color-balayage', 'Golden copper balayage waves at Xing Salon Bangalore', 640, 480, 480),
      photo('color-global', 'Copper global hair colour at Xing Salon Bangalore', 640, 480, 480),
      photo('color-fashion', 'Fashion hair colour at Xing Salon Bangalore', 640, 480, 480),
    ],
    serviceLink: '/services/global-hair-color',
    bookingService: 'Hair Colour',
    branches: ALL_BRANCHES,
    options: COLOUR_PRICES.map((price) => ({ name: price.label, saving: `Save ${savingPercent(price)}` })),
    steps: STEPS,
    terms: [LIMITED],
    faq: [
      { q: 'Which colours are on offer?', a: 'Global colour, highlights, crazy colour and balayage. Each has its own saving, shown on the offer.' },
      { q: 'Do you protect my hair while colouring?', a: 'Every colour starts with a free consultation, a patch test is available on request, and you can add Olaplex bond protection.' },
    ],
    prices: COLOUR_PRICES,
  },
  {
    id: 'tuesday',
    category: 'all',
    title: 'Tuesday Happy Hours',
    badge: 'Flat 25% off',
    hook: 'Make Tuesday your salon day.',
    sub: '25% off every service, every Tuesday.',
    includes: ['All services', 'All 3 salons', 'Minimum billing applies'],
    idealFor: ['Any service', 'Weekday visits', 'Trying something new'],
    image: photo('loc-hsr-1', 'Reception at Xing Salon HSR Layout – flat 25% off every Tuesday'),
    gallery: [photo('loc-sarjapur-2', 'Styling floor at Xing Salon Sarjapur Road'), photo('loc-brookfield-6', 'Styling floor at Xing Salon Brookfield')],
    bookingService: '',
    branches: ALL_BRANCHES,
    weekday: 2,
    steps: STEPS,
    // TODO (owner to confirm): the minimum bill for Tuesday Happy Hours.
    terms: ['Every Tuesday, on all services. Minimum billing applies; your salon confirms the amount.'],
    faq: [
      { q: 'Which services does Tuesday Happy Hours cover?', a: 'All services, every Tuesday, at all three salons. Minimum billing applies.' },
      { q: 'Do I need to book for a Tuesday?', a: 'Walk-ins are welcome, but Tuesdays get busy, so message your salon to hold a time.' },
    ],
  },
  {
    id: 'membership',
    category: 'value',
    title: 'Xing Membership',
    badge: 'Up to 30% extra value',
    hook: 'Pay once, enjoy more all year.',
    sub: 'Valid for 1 year on all services.',
    includes: ['Up to 30% extra value', 'All services', 'Valid for 1 year'],
    idealFor: ['Regular visits', 'Colour and treatment upkeep', 'Families'],
    image: photo('loc-hsr-5', 'Hair wash stations at Xing Salon HSR Layout – Xing Membership with up to 30% extra value'),
    gallery: [photo('loc-brookfield-1', 'Reception and lounge at Xing Salon Brookfield')],
    serviceLink: '/membership-gift-cards#membership',
    bookingService: '',
    branches: ALL_BRANCHES,
    steps: ['Choose a plan with your salon.', 'Pay at the salon or via WhatsApp.', 'Use your balance on any service for a year.'],
    terms: ['Valid for 1 year from purchase, on all services.'],
    faq: [
      { q: 'How does the membership work?', a: 'You pay once and get up to 30% extra salon value, to use on any service for a year.' },
      { q: 'Can I use it at any salon?', a: 'Ask your salon when you join; it confirms where your membership can be used.' },
    ],
  },
  {
    id: 'gift-card',
    category: 'value',
    title: 'Gift Cards',
    badge: 'Gift a Xing day',
    hook: 'The gift of looking and feeling good.',
    sub: 'The perfect birthday or anniversary gift.',
    includes: ['Bonus value added', 'Any service', 'A personal message'],
    idealFor: ['Birthdays', 'Anniversaries', 'Thank-you gifts'],
    image: photo('loc-hsr-4', 'Pedicure lounge at Xing Salon HSR Layout – Xing gift cards'),
    gallery: [photo('loc-sarjapur-5', 'Lounge at Xing Salon Sarjapur Road')],
    serviceLink: '/membership-gift-cards#gift-cards',
    bookingService: '',
    branches: ALL_BRANCHES,
    steps: ['Pick an amount with your salon.', 'We add bonus value to the card.', 'They redeem it on any service.'],
    terms: ['Redeemable on salon services. Your salon confirms the bonus value.'],
    faq: [
      { q: 'How do I buy a gift card?', a: 'Message your salon on WhatsApp or visit. You choose the amount and we add bonus value.' },
      { q: 'What can it be used for?', a: 'Any salon service: hair, skin, nails and more.' },
    ],
  },
];

export const salonOfferById = (id: string) => salonOffers.find((offer) => offer.id === id);

// ---------- Campaigns: dated offers with published prices, on their own page.

/** The campaign's offers are the catalogue's hair colour offers (offerCatalog.ts). */
export type CampaignOfferId = string;
export type CampaignState = 'upcoming' | 'live' | 'ended';
export type CampaignLine = OfferLine;
export type CampaignOffer = CatalogOffer;

export const STREAKS_RECOMMENDED = { min: 8, max: 10 };
export const STREAK_CHOICES = [6, 8, 10];

/** The salon's global colour poster, whole: its printed prices match the offer. */
export const heroPoster = GLOBAL_POSTER;

export const novemberCampaign = {
  id: 'november-2026',
  /** The hair colour offers page; /offers/november redirects here. */
  path: categoryById('hair-colour').path,
  start: '2026-11-01',
  end: '2026-11-30',
  startLabel: '1 Nov',
  endLabel: '30 Nov',
  timeZone: 'Asia/Kolkata',
  // The site-wide SHOW_PRICES stays false; the salon's posters publish these prices.
  showPrices: true,
  branches: ALL_BRANCHES,
  offers: offersIn('hair-colour'),
};

const CAMPAIGN_STARTS = Date.parse(`${novemberCampaign.start}T00:00:00+05:30`);
const CAMPAIGN_ENDS = Date.parse(`${novemberCampaign.end}T23:59:59.999+05:30`);

/** Now, or the `?today=2026-12-01` date in the address, for previewing a campaign's stages. */
export const campaignNow = () => {
  const today = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('today');
  return today && /^\d{4}-\d{2}-\d{2}$/.test(today) ? new Date(`${today}T12:00:00+05:30`) : new Date();
};
export const campaignState = (now = campaignNow()): CampaignState =>
  now.getTime() < CAMPAIGN_STARTS ? 'upcoming' : now.getTime() > CAMPAIGN_ENDS ? 'ended' : 'live';
export const isCampaignLive = (now = campaignNow()) => campaignState(now) === 'live';
/** True until the end date passes: dated schema and FAQ text is already safe to publish before the start. */
export const isCampaignOpen = (now = campaignNow()) => campaignState(now) !== 'ended';

const salonDay = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: novemberCampaign.timeZone }).format(date);
/** Whole days left in salon time, counting today; 0 once it has ended. */
export const daysLeft = (now = campaignNow()) =>
  isCampaignOpen(now) ? Math.round((Date.parse(novemberCampaign.end) - Date.parse(salonDay(now))) / 86_400_000) + 1 : 0;
/** "Valid till 30 Nov · 12 days left". Empty once ended. */
export const campaignCountdown = (now = campaignNow()) => {
  const { startLabel, endLabel } = novemberCampaign;
  const state = campaignState(now);
  if (state === 'ended') return '';
  if (state === 'upcoming') return `Starts ${startLabel} · valid till ${endLabel}`;
  const days = daysLeft(now);
  return days === 1 ? `Last day · valid till ${endLabel}` : `Valid till ${endLabel} · ${days} days left`;
};
/** The short form: "Starts 1 Nov", "12 days left" or "Last day". */
export const campaignPill = (now = campaignNow()) => {
  const state = campaignState(now);
  if (state === 'ended') return '';
  if (state === 'upcoming') return `Starts ${novemberCampaign.startLabel}`;
  const days = daysLeft(now);
  return days === 1 ? 'Last day' : `${days} days left`;
};
/** The main button and its WhatsApp sentence: before the start you reserve, once live you claim. */
export const campaignCta = (now = campaignNow()) =>
  campaignState(now) === 'upcoming'
    ? { label: CTA.reserve, text: 'I’d like to book for November, for one of your hair colour offers.' }
    : { label: CTA.claimWhatsapp, text: 'I’d like to claim a November hair colour offer.' };

export const maxSavingRupees = () => Math.max(...novemberCampaign.offers.flatMap((offer) => offer.lines.map(lineSaving)));
/** Every offered service once (the menu repeats global colour and highlights). */
export const campaignLines = () => novemberCampaign.offers.flatMap((offer) => offer.lines).filter((line, i, all) => all.indexOf(line) === i);
/** The offer whose page section explains a line. */
export const campaignAnchor = (line: CampaignLine) => novemberCampaign.offers.find((offer) => offer.lines.includes(line))!.id;
/** The lowest November price. */
export const fromPrice = () => Math.min(...novemberCampaign.offers.flatMap((offer) => offer.lines.map((line) => line.now)));
export const streakCost = (streaks: number) => streaks * HIGHLIGHTS_LINE.now;
/** "₹3,192–₹3,990": the whole bill for the recommended number of streaks. */
export const streakRange = () => `${formatPrice(streakCost(STREAKS_RECOMMENDED.min))}–${formatPrice(streakCost(STREAKS_RECOMMENDED.max))}`;

/** Any offer the details and claim sheet can show. */
export type SheetOffer = Omit<SalonOffer, 'id'> & {
  id: SalonOfferId | CampaignOfferId;
  /** Shows `prices` even while SHOW_PRICES is false. */
  showPrices?: boolean;
  /** Replaces the badge in the WhatsApp message. */
  claimDetail?: string;
  campaign?: boolean;
  /** Longer answers, under the price in the sheet. */
  details?: Array<{ title: string; text: string }>;
  answer?: string;
};

/** The sheet's badge: the rupee saving, or the price where there is no regular price to save on. */
const sheetBadge = (offer: CatalogOffer) => {
  const saving = offerSaving(offer);
  const first = offer.lines[0];
  return saving ? `Save ${offer.lines.length > 1 ? 'up to ' : ''}${formatPrice(saving)}` : `${first.from ? 'From ' : ''}${formatPrice(first.now)}`;
};

/** Any catalogue offer, as the details and claim sheet shows it. */
export const catalogSheetOffer = (offer: CatalogOffer): SheetOffer => ({
  id: offer.id,
  category: offer.category === 'skin-care' ? 'skin' : 'hair',
  title: offer.title,
  badge: sheetBadge(offer),
  hook: offer.hook,
  sub: offer.sub,
  includes: offer.includes,
  idealFor: offer.bestFor,
  duration: offer.duration,
  image: offer.image,
  gallery: [],
  serviceLink: offer.serviceLink,
  bookingService: offer.bookingService,
  branches: offer.branches as BranchId[],
  steps: STEPS,
  terms: offer.terms,
  faq: offer.faq,
  prices: offer.lines.map((line) => ({ label: line.unit ? `${line.label}, ${line.unit}` : line.from ? `${line.label}, from` : line.label, now: line.now, was: line.was })),
  showPrices: true,
  claimDetail: offer.lines.map((line) => (offer.lines.length > 1 ? `${line.label} ${linePrice(line)}` : linePrice(line))).join('; '),
  // A campaign offer only while the campaign runs: after it ends the same offer is claimed as a plain one.
  campaign: !!offer.validUntil && isCampaignOpen(),
  details: offer.details,
  answer: offer.answer,
});

/** A catalogue offer by its id or an old anchor (#nov-highlights), or a percentage-only offer. */
export const sheetOfferById = (id: string): SheetOffer | undefined => {
  const offer = catalogOfferById(id);
  return offer ? catalogSheetOffer(offer) : salonOfferById(id);
};

/** A colour service page's November line, while the campaign is open. */
export const serviceOfferText = (slug: string) => {
  if (!isCampaignOpen()) return '';
  const texts: Record<string, string> = {
    'global-hair-color': `November: ${formatPrice(GLOBAL_LINE.now)} any length`,
    highlights: `November: ${formatPrice(HIGHLIGHTS_LINE.now)} per streak`,
    balayage: `November: from ${formatPrice(BALAYAGE_LINE.now)}`,
    'fashion-color': `November: ${formatPrice(CRAZY_LINE.now)} per streak`,
  };
  return texts[slug] ?? '';
};

/** Added to a salon's "which offers" FAQ answer until the campaign ends. */
export const campaignFaqNote = () =>
  `This November, global hair colour is ${formatPrice(GLOBAL_LINE.now)} at any length, highlights ${formatPrice(HIGHLIGHTS_LINE.now)} per streak, crazy colour ${formatPrice(CRAZY_LINE.now)} per streak and balayage from ${formatPrice(BALAYAGE_LINE.now)}, valid till 30 November.`;
/** A salon's FAQ with the campaign sentence added where marked. Both the page and the schema read this. */
export const withCampaignFaq = <T extends { a: string; campaign?: boolean }>(faqs: T[], now = campaignNow()) =>
  faqs.map((item) => (item.campaign && isCampaignOpen(now) ? { ...item, a: `${item.a} ${campaignFaqNote()}` } : item));

/** Old anchors that still open the right offer. */
export const OFFER_ALIASES: Record<string, SalonOfferId> = { 'hair-color': 'hair-colour', 'tuesday-happy-hours': 'tuesday', 'gift-cards': 'gift-card' };

/** The offer an /offers anchor asks for, e.g. "#keratin" or the old "#hair-color". */
export const offerFromHash = (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  return sheetOfferById(OFFER_ALIASES[id] ?? id);
};

/** The Offers section of the home page. */
export const OFFERS_SECTION = '/#offers';
/** The offers page, where every offer is listed. */
export const offersPath = '/offers';
/** Where an offer is listed: its card on its category page (/offers/skin-care#hydra-facial), or on /offers. */
export const promoHref = (id: string) => {
  const offer = catalogOfferById(id);
  if (offer) return `${categoryById(offer.category).path}#${offer.id}`;
  if (id === 'hair-colour') return categoryById('hair-colour').path;
  return `${offersPath}#${OFFER_ALIASES[id] ?? id}`;
};

export const offers = {
  hydraFlat: {
    title: 'Hydra Facial',
    figure: '35%',
    deal: 'Flat 35% Off',
    terms: 'Complete 6-step Hydra Facial at a special offer price. Limited time offer, T&C apply.',
    page: 'hydra-facial',
    details: promoHref('hydra-facial'),
  },
  keratinFlat: {
    title: 'Hair Keratin',
    figure: 'Flat',
    deal: 'Flat Offer Price, Any Length',
    terms: 'Hair keratin for any length at one flat offer price. Limited time offer, T&C apply.',
    page: 'keratin-treatment',
    details: promoHref('keratin'),
  },
  colourOffer: {
    title: 'Hair Colours',
    figure: BEST_COLOUR_SAVING,
    deal: `Up to ${BEST_COLOUR_SAVING} Off`,
    terms: `Up to ${BEST_COLOUR_SAVING} off on global colour, highlights, crazy colour and balayage. Limited time offer.`,
    page: 'global-hair-color',
    details: promoHref('hair-colour'),
  },
  // Service-page offers below are not featured on the home page.
  hydra3plus1: {
    title: '7-Step Hydra Facial',
    figure: '3 + 1',
    deal: 'Buy 3, Get 1 Free',
    terms: 'Buy three Hydra Facial sessions and get one more free.',
    page: 'hydra-facial',
  },
  spa3plus1: {
    title: 'Hair Spa',
    figure: '3 + 1',
    deal: 'Buy 3, Get 1 Free',
    terms: 'Buy three hair spa sessions and get one more free.',
  },
  acaiOil: {
    title: 'Acai Oil Treatment',
    figure: 'Free',
    deal: 'Complimentary',
    terms: 'With all hair treatments.',
  },
  kidsFree: {
    title: 'Kids Haircut',
    figure: 'Free',
    deal: 'Free',
    terms: 'Free kids haircut on qualifying bills.',
  },
  membership: {
    title: 'Memberships',
    figure: '30%',
    deal: 'Up to 30% Extra Value',
    terms: 'Membership packages with up to 30% extra value, valid for 1 year on all services.',
    details: '/membership-gift-cards#membership',
  },
  polishMassage: {
    title: 'Head Massage',
    figure: 'Free',
    deal: 'Complimentary',
    terms: 'With a full body polish.',
  },
  waxingCombo: {
    title: 'Waxing Combo',
    figure: 'Combo',
    deal: 'Special Combo Pricing',
    terms: 'Full arms, half legs and underarms waxing, threading, a Crystal Pedicure and a D-Lux Manicure.',
    page: 'waxing',
  },
  threadingCombos: {
    title: 'Combos with Threading & De‑tan',
    figure: 'Combo',
    deal: 'Special Combo Pricing',
    terms: 'Get a Face Lift (women’s and men’s) and the Waxing Combo include threading or de-tan.',
  },
  manipediCombos: {
    title: 'Combos with Mani-Pedi',
    figure: 'Combo',
    deal: 'Special Combo Pricing',
    terms: 'The Waxing Combo includes a Crystal Pedicure and D-Lux Manicure; the women’s Get a Face Lift includes a nail cut, file & polish.',
  },
  tempExtensions: {
    title: 'Temporary Extensions',
    figure: 'Easy',
    deal: 'Easy, Affordable Start',
    terms: 'An easy, affordable way to try extensions for an event or for the first time.',
    page: 'nail-extensions',
  },
  tuesday: {
    title: 'Tuesday Happy Hours',
    figure: '25%',
    deal: 'Flat 25% Off',
    terms: 'Flat 25% off every Tuesday (minimum billing applies).',
    details: OFFERS_SECTION,
  },
  birthday: {
    title: 'Birthday Week',
    figure: '30%',
    deal: '30% Off',
    terms: '30% off all services across your birthday week.',
  },
} satisfies Record<string, Offer>;

export type OfferId = keyof typeof offers;

/** Combos are sold at special combo pricing; the salon quotes it on request. */
export const combos = {
  menFaceLift: {
    name: 'Get a Face Lift',
    audience: 'Men',
    includes: ['Haircut', 'Beard Trim or Shave', 'Hair Wash', 'Schwarzkopf Hair Spa', 'Face De-tan'],
  },
  womenFaceLift: {
    name: 'Get a Face Lift',
    audience: 'Women',
    includes: ['Haircut', 'Nourishing Hair Spa', 'O3+ De-tan', 'Eyebrow Threading', 'Nail Cut, File & Polish'],
  },
  waxing: {
    name: 'Waxing Combo',
    audience: 'Women',
    includes: ['Full Arms', 'Half Legs', 'Underarms', 'Threading', 'Crystal Pedicure', 'D-Lux Manicure'],
  },
};

export type ComboId = keyof typeof combos;
