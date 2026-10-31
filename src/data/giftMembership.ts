// Gift cards & membership: every tier, occasion, festival, salon route, FAQ and term for /membership-gift-cards,
// its lead form and the lead server (server/). Edit offers here; no component needs to change.
// Keep this file free of React/asset imports: vite.config.ts and the server also read it.
//
// HARD RULE: no prices, rupee signs or amounts anywhere the visitor can see them (page, meta, schema, alt text).
// Value is expressed only as bonus % and perks. The one exception is `internal` at the foot of this file, which
// only the server reads (for staff emails); the page never imports it, so it is left out of the site bundle.
//
// OWNER TODO:
//   1. `internal.tierMinLoadINR`: the minimum load for each tier (staff emails only).
//   2. `terms`: the final terms and conditions text.
//   3. `testimonials`: real Google reviews that mention gifting or membership (see the note there).
//   4. Festival dates in `festivalWindows` are from published 2026–27 calendars; check them each year.
//   5. Salon emails and WhatsApp numbers default to data/branches.ts; override per salon in the server env.
import { locations } from './branches';
import { site } from './content';
import { membershipPath } from './membershipLinks';

export { membershipPath };

/** Business facts, used exactly as written. */
export const facts = {
  brand: 'XING Premium Unisex Salon',
  rating: site.rating,
  reviewCount: site.reviewCount,
  /** "4.9★ · 2,264+ Google reviews", shown next to every call to action. */
  proof: `${site.rating}★ · ${site.reviewCount} Google reviews`,
  salonCount: 3,
};

// ---------- Salons (lead routing)

export type SalonKey = 'sarjapur' | 'hsr' | 'brookfield';

const branch = (id: string) => locations.find((loc) => loc.id === id)!;

/**
 * Where each lead goes. `emailEnv` and `waEnv` name the server env vars that override the salon's email and
 * WhatsApp number; without them the server uses the details in data/branches.ts.
 */
export const salons = [
  { key: 'sarjapur', name: 'Sarjapur Road', area: 'Sarjapur Road', locationId: 'sarjapur-road', emailEnv: 'SALON_EMAIL_SARJAPUR', waEnv: 'WA_NUMBER_SARJAPUR' },
  { key: 'hsr', name: 'HSR Layout', area: 'HSR Layout', locationId: 'hsr-layout', emailEnv: 'SALON_EMAIL_HSR', waEnv: 'WA_NUMBER_HSR' },
  { key: 'brookfield', name: 'Brookfield', area: 'Brookfield', locationId: 'brookfield', emailEnv: 'SALON_EMAIL_BROOKFIELD', waEnv: 'WA_NUMBER_BROOKFIELD' },
].map((entry) => {
  const loc = branch(entry.locationId);
  return {
    ...entry,
    key: entry.key as SalonKey,
    mapsUrl: loc.mapUrl,
    tel: loc.phoneHref,
    phone: loc.phone,
    address: loc.address,
    pagePath: loc.path,
    /** The salon's WhatsApp number, digits only with country code ("919380812348"). */
    defaultWa: loc.whatsappHref.replace('https://wa.me/', ''),
    defaultEmail: loc.email ?? '',
  };
});

export type GmSalon = (typeof salons)[number];

export const salonByKey = (key: string) => salons.find((salon) => salon.key === key);

export const SALON_KEYS = ['sarjapur', 'hsr', 'brookfield'] as const satisfies readonly SalonKey[];

/** "Closest XING for…": one line under the salon calls to action. */
export const nearYou = 'Closest XING for Sarjapur & Bellandur → Sarjapur Road · Koramangala & Bellandur → HSR Layout · Whitefield & ITPL → Brookfield.';

// ---------- Membership tiers

export type TierKey = 'glow' | 'gold' | 'prive';

export interface Tier {
  key: TierKey;
  name: string;
  short: string;
  badge?: string;
  /** Bonus value added on top of the amount loaded, in percent. */
  bonus: number;
  validityMonths: number;
  perks: string[];
  cta: string;
  /** How many family members can share it; 0 = just the member. */
  familySeats: number;
  /** Look of the card: Glow rose, Gold soft gold, Privé deep plum with gold text. */
  look: 'rose' | 'gold' | 'plum';
  recommended?: boolean;
}

export const tiers: Tier[] = [
  {
    key: 'glow',
    name: 'XING Glow',
    short: 'Glow',
    bonus: 10,
    validityMonths: 6,
    perks: ['Free consultation', 'Use at all 3 salons', 'Birthday-month 10-min head massage'],
    cta: 'Choose Glow',
    familySeats: 0,
    look: 'rose',
  },
  {
    key: 'gold',
    name: 'XING Gold',
    short: 'Gold',
    badge: '★ Most Chosen',
    bonus: 18,
    validityMonths: 12,
    perks: ['Everything in Glow', 'Priority weekend slots', 'Share with 1 family member', '2 complimentary blow-dries', 'Birthday-month head & shoulder massage'],
    cta: 'Get Gold Membership',
    familySeats: 1,
    look: 'gold',
    recommended: true,
  },
  {
    key: 'prive',
    name: 'XING Privé',
    short: 'Privé',
    badge: 'Best Value',
    bonus: 25,
    validityMonths: 12,
    perks: [
      'Everything in Gold',
      'Share with 2 family members',
      'Preferred stylist booking',
      'One complimentary express facial',
      'Birthday + anniversary treats',
      'Early access to festival offers',
    ],
    cta: 'Choose Privé',
    familySeats: 2,
    look: 'plum',
  },
];

export const TIER_KEYS = ['glow', 'gold', 'prive'] as const satisfies readonly TierKey[];
export const defaultTier = tiers.find((tier) => tier.recommended)!;
export const tierByKey = (key: string) => tiers.find((tier) => tier.key === key);
export const maxBonus = Math.max(...tiers.map((tier) => tier.bonus));

// ---------- Occasions and festivals

export type GiftCategory = 'celebrations' | 'festivals' | 'her' | 'him' | 'thanks' | 'corporate';

export const giftFilters: Array<{ key: 'all' | GiftCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'celebrations', label: 'Celebrations' },
  { key: 'festivals', label: 'Festivals' },
  { key: 'her', label: 'For Her' },
  { key: 'him', label: 'For Him' },
  { key: 'thanks', label: 'Thank You' },
  { key: 'corporate', label: 'Corporate' },
];

/** A period in local dates (YYYY-MM-DD, inclusive). The card is "in season" during it and in the lead-up. */
export interface DateWindow {
  start: string;
  end: string;
}

/** Days before a window when its card is already pinned as "This Season". */
export const SEASON_LEAD_DAYS = 21;

/** One theme per occasion: a gradient for the card art and the preview, and the text colour that reads on it. */
export interface GiftTheme {
  from: string;
  to: string;
  text: 'light' | 'dark';
}

export type OccasionIcon = 'cake' | 'heart' | 'gem' | 'flower' | 'users' | 'lamp' | 'building' | 'smile' | 'sparkles' | 'gift' | 'sun' | 'moon' | 'palette' | 'party';

export interface Occasion {
  slug: string;
  /** The card's H3, with the keyword people search for ("Birthday Gift Card"). */
  heading: string;
  /** The gift's own name. */
  title: string;
  hook: string;
  includes: string[];
  perk?: string;
  /** Experience = a curated ritual; value = they choose any service. */
  kind: 'experience' | 'value';
  /** Feature cards always show; mini cards (festivals) show in their season, and always under "Festivals". */
  size: 'feature' | 'mini';
  categories: GiftCategory[];
  theme: GiftTheme;
  icon: OccasionIcon;
  /** Photo-style art in /public/images, named for search; CSS art stands in when left out. */
  image?: { src: string; srcSet: string; alt: string; width: number; height: number };
  windows?: DateWindow[];
  /** A real end date for a time-limited offer (YYYY-MM-DD). Only then does the card show "Offer ends …". */
  endsAt?: string;
  /** Short messages offered as one-tap chips in the form. */
  messages: string[];
  /** Opens the form as a corporate request. */
  corporate?: boolean;
  note?: string;
  link?: { label: string; href: string };
  /** The label printed on the gift card preview. */
  cardLabel: string;
}

const art = (slug: string, alt: string) => ({
  src: `/images/xing-${slug}-gift-card-bangalore.webp`,
  srcSet: `/images/xing-${slug}-gift-card-bangalore-480.webp 480w, /images/xing-${slug}-gift-card-bangalore.webp 800w`,
  alt,
  width: 800,
  height: 450,
});

// Festival dates move each year (lunar calendars). Each window runs from the start of the festive period to the
// day itself. Sources: published 2026–27 Indian festival calendars; check before each season.
const festivalWindows: Record<string, DateWindow[]> = {
  mothersDay: [
    { start: '2026-05-04', end: '2026-05-10' },
    { start: '2027-05-03', end: '2027-05-09' },
  ],
  diwali: [
    { start: '2026-10-30', end: '2026-11-09' },
    { start: '2027-10-20', end: '2027-10-30' },
  ],
  durgaPuja: [
    { start: '2026-10-15', end: '2026-10-20' },
    { start: '2027-10-04', end: '2027-10-09' },
  ],
  navratri: [
    { start: '2026-10-11', end: '2026-10-19' },
    { start: '2027-09-30', end: '2027-10-09' },
  ],
  karvaChauth: [
    { start: '2026-10-25', end: '2026-10-29' },
    { start: '2027-10-14', end: '2027-10-18' },
  ],
  rakhi: [
    { start: '2026-08-22', end: '2026-08-28' },
    { start: '2027-08-10', end: '2027-08-17' },
  ],
  holi: [
    { start: '2027-03-18', end: '2027-03-26' },
  ],
  newSeason: [
    // Pongal, Ugadi, Onam.
    { start: '2027-01-10', end: '2027-01-16' },
    { start: '2027-04-01', end: '2027-04-07' },
    { start: '2027-09-05', end: '2027-09-12' },
  ],
  eid: [
    { start: '2027-03-04', end: '2027-03-11' },
  ],
  christmas: [
    { start: '2026-12-15', end: '2027-01-01' },
    { start: '2027-12-15', end: '2028-01-01' },
  ],
  valentines: [
    { start: '2027-02-07', end: '2027-02-14' },
    { start: '2028-02-07', end: '2028-02-14' },
  ],
  womensDay: [
    { start: '2027-03-01', end: '2027-03-08' },
    { start: '2028-03-01', end: '2028-03-08' },
  ],
};

const ROSE: GiftTheme = { from: '#FCE4EA', to: '#F2B8C6', text: 'dark' };
const BERRY: GiftTheme = { from: '#A8325E', to: '#4A1230', text: 'light' };
const GOLD: GiftTheme = { from: '#F6E7C1', to: '#D9B25C', text: 'dark' };
const PLUM: GiftTheme = { from: '#3B1430', to: '#160910', text: 'light' };
const MINT: GiftTheme = { from: '#E4F3EA', to: '#B9DEC8', text: 'dark' };
const SAFFRON: GiftTheme = { from: '#FBE3C4', to: '#E9A863', text: 'dark' };
const CREAM: GiftTheme = { from: '#FFF9F8', to: '#F4E6DC', text: 'dark' };

export const occasions: Occasion[] = [
  {
    slug: 'birthday',
    heading: 'Birthday Gift Card',
    title: 'Birthday Glow Ritual',
    hook: 'Make their birthday look as good as it feels.',
    includes: ['Haircut & styling', 'Express facial'],
    perk: 'Complimentary birthday blow-dry',
    kind: 'experience',
    size: 'feature',
    categories: ['celebrations', 'her', 'him'],
    theme: ROSE,
    icon: 'cake',
    image: art('birthday', 'XING birthday gift card for a haircut, styling and express facial in Bangalore'),
    messages: ['Happy birthday! Go treat yourself — you deserve it.', 'Another year more fabulous. Enjoy your glow day!', 'Birthday hair, don’t care. Have the best day!'],
    cardLabel: 'Birthday',
  },
  {
    slug: 'anniversary',
    heading: 'Anniversary Gift Card',
    title: 'Couple’s Pamper Date',
    hook: 'Celebrate together, glow together.',
    includes: ['Hair spa for two', 'Manicure for two'],
    perk: 'Complimentary head massage for both',
    kind: 'experience',
    size: 'feature',
    categories: ['celebrations', 'her', 'him'],
    theme: BERRY,
    icon: 'heart',
    image: art('anniversary', 'XING anniversary gift card for a couple’s hair spa and manicure in Bangalore'),
    messages: ['Happy anniversary! Here’s to us — and a little pampering.', 'Every year with you is my favourite. Let’s glow together.', 'A date just for the two of us. Happy anniversary!'],
    cardLabel: 'Anniversary',
  },
  {
    slug: 'wedding',
    heading: 'Wedding & Bridal Gift Card',
    title: 'Wedding Ready + Bride Squad',
    hook: 'For the bride and her whole squad.',
    includes: ['Pre-bridal hair & skin prep', 'Group styling'],
    perk: 'Groups of 4+ get a complimentary bridal trial consult',
    kind: 'experience',
    size: 'feature',
    categories: ['celebrations', 'her'],
    theme: GOLD,
    icon: 'gem',
    image: art('wedding', 'XING bridal gift card for pre-bridal hair and skin prep and group styling in Bangalore'),
    messages: ['To the bride-to-be: glow up before the big day!', 'For the whole squad — let’s get wedding ready together.', 'Congratulations! A little pampering before you say yes.'],
    link: { label: 'See bridal hair & styling', href: '/services/womens-haircut-styling#bridal' },
    cardLabel: 'Wedding',
  },
  {
    slug: 'mothers-day',
    heading: 'Mother’s Day Gift Card',
    title: 'For Amma',
    hook: 'She took care of everyone. Now it’s her turn.',
    includes: ['Hair spa', 'Pedicure', 'Head & shoulder massage'],
    kind: 'experience',
    size: 'feature',
    categories: ['celebrations', 'her'],
    theme: MINT,
    icon: 'flower',
    image: art('mothers-day', 'XING Mother’s Day gift card for a hair spa, pedicure and head massage in Bangalore'),
    messages: ['Amma, this one’s just for you. Thank you for everything.', 'You take care of us. Today, let them take care of you.', 'For the best mom in the world — relax, you’ve earned it.'],
    cardLabel: 'For Amma',
  },
  {
    slug: 'mom-and-me',
    heading: 'Mom & Me Gift Card',
    title: 'Mom & Me Duo',
    hook: 'A salon date she’ll remember.',
    includes: ['Matching ritual for two'],
    perk: 'Complimentary keepsake gift card envelope',
    kind: 'experience',
    size: 'feature',
    categories: ['celebrations', 'her'],
    theme: ROSE,
    icon: 'users',
    windows: festivalWindows.mothersDay,
    messages: ['A salon date for us, Amma. Happy Mother’s Day!', 'Matching glow, just you and me.'],
    cardLabel: 'Mom & Me',
  },
  {
    slug: 'diwali',
    heading: 'Diwali Gift Card',
    title: 'Diwali Glow Gift',
    hook: 'Light up their festive look.',
    includes: ['Festive styling', 'Glow facial'],
    perk: 'Complimentary festive blow-dry',
    kind: 'experience',
    size: 'feature',
    categories: ['festivals', 'her', 'him'],
    theme: SAFFRON,
    icon: 'lamp',
    image: art('diwali', 'XING Diwali gift card for festive styling and a glow facial in Bangalore'),
    windows: festivalWindows.diwali,
    messages: ['Happy Diwali! May your festive look shine as bright as the diyas.', 'Wishing you light, love and a little glow this Diwali.'],
    cardLabel: 'Diwali',
  },
  {
    slug: 'diwali-corporate',
    heading: 'Corporate Diwali Gift Cards',
    title: 'Diwali Corporate Gifting',
    hook: 'Thank your team with a gift they’ll actually use.',
    includes: ['10+ gift cards', 'Your company logo on the e-card', 'A single invoice'],
    kind: 'value',
    size: 'feature',
    categories: ['festivals', 'corporate'],
    theme: PLUM,
    icon: 'building',
    image: art('corporate-diwali', 'XING corporate Diwali gift cards with a company logo for teams in Bangalore'),
    windows: festivalWindows.diwali,
    messages: ['Happy Diwali from all of us. Thank you for a brilliant year!', 'With gratitude this festive season — enjoy some time for you.'],
    corporate: true,
    cardLabel: 'Happy Diwali',
  },
  {
    slug: 'thank-you',
    heading: 'Thank You Gift Card',
    title: 'Thank You Treat',
    hook: 'For the people who make life easier.',
    includes: ['Express manicure', 'Blow-dry'],
    kind: 'experience',
    size: 'feature',
    categories: ['thanks', 'her', 'him'],
    theme: CREAM,
    icon: 'smile',
    image: art('thank-you', 'XING thank-you gift card for an express manicure and blow-dry in Bangalore'),
    note: 'Suggested for teachers, mentors, colleagues and doctors.',
    messages: ['Thank you for everything you do. Treat yourself!', 'A small thank-you for a big help.', 'You made it easier. Thank you!'],
    cardLabel: 'Thank You',
  },
  // Festival cards: shown in their season (and the 21 days before), and always under the Festivals filter.
  festival('durga-puja', 'Durga Puja Gift Card', 'Pujo Ready Look', 'Festive styling for every pandal hop.', 'sparkles', SAFFRON, festivalWindows.durgaPuja, ['festivals', 'her'], 'Shubho Pujo!'),
  festival('navratri', 'Navratri Gift Card', 'Dandiya Night Glam', 'Hair and glow that last all nine nights.', 'party', BERRY, festivalWindows.navratri, ['festivals', 'her'], 'Happy Navratri!'),
  festival('karva-chauth', 'Karva Chauth Gift Card', 'Karva Chauth Glow', 'Mehendi-ready hands and a festive glow.', 'moon', GOLD, festivalWindows.karvaChauth, ['festivals', 'her'], 'Karva Chauth'),
  festival('raksha-bandhan', 'Raksha Bandhan Gift Card', 'A Gift for Your Sibling', 'Better than chocolates, and they’ll actually use it.', 'gift', ROSE, festivalWindows.rakhi, ['festivals', 'her', 'him'], 'Happy Rakhi!'),
  festival('holi', 'Holi Gift Card', 'Post-Holi Hair & Skin Rescue', 'Wash away the colour, bring back the shine.', 'palette', MINT, festivalWindows.holi, ['festivals', 'her', 'him'], 'Happy Holi!'),
  festival('new-season', 'Ugadi, Onam & Pongal Gift Card', 'New Season, New You', 'Fresh hair and glowing skin for the new season.', 'sun', SAFFRON, festivalWindows.newSeason, ['festivals', 'her', 'him'], 'Festive Wishes'),
  festival('eid', 'Eid Gift Card', 'Eid Festive Glow', 'A fresh, festive look for Eid.', 'moon', MINT, festivalWindows.eid, ['festivals', 'her', 'him'], 'Eid Mubarak!'),
  festival('christmas-new-year', 'Christmas & New Year Gift Card', 'Party-Ready Look', 'Styled for every party, December to New Year.', 'sparkles', PLUM, festivalWindows.christmas, ['festivals', 'celebrations', 'her', 'him'], 'Season’s Greetings'),
  festival('valentines', 'Valentine’s Day Gift Card', 'Date-Night Ready', 'Look your best for the one who matters.', 'heart', BERRY, festivalWindows.valentines, ['festivals', 'celebrations', 'her', 'him'], 'Happy Valentine’s'),
  festival('womens-day', 'Women’s Day Gift Card', 'Celebrate Her', 'For the women who inspire you.', 'flower', ROSE, festivalWindows.womensDay, ['festivals', 'her'], 'Happy Women’s Day'),
  // Always last.
  {
    slug: 'value',
    heading: 'XING Value Gift Card',
    title: 'XING Value Gift Card',
    hook: 'Can’t decide? Let them choose.',
    includes: ['Any value, any service, any XING salon'],
    kind: 'value',
    size: 'feature',
    categories: ['celebrations', 'thanks', 'her', 'him', 'corporate'],
    theme: CREAM,
    icon: 'gift',
    image: art('value', 'XING value gift card for any hair, skin or nail service at any XING salon in Bangalore'),
    messages: ['Something special, your way. Enjoy!', 'Pick whatever makes you feel amazing.', 'Treat yourself — on me.'],
    cardLabel: 'Gift Card',
  },
];

function festival(
  slug: string,
  heading: string,
  title: string,
  hook: string,
  icon: OccasionIcon,
  theme: GiftTheme,
  windows: DateWindow[],
  categories: GiftCategory[],
  cardLabel: string,
): Occasion {
  return {
    slug,
    heading,
    title,
    hook,
    includes: [],
    kind: 'experience',
    size: 'mini',
    categories,
    theme,
    icon,
    windows,
    messages: [`${cardLabel} Here’s a little glow for the celebrations.`, 'Wishing you a beautiful festive season!'],
    cardLabel: cardLabel.replace(/!$/, ''),
  };
}

export const occasionBySlug = (slug: string) => occasions.find((occasion) => occasion.slug === slug);
export const OCCASION_SLUGS = occasions.map((occasion) => occasion.slug);

/** Local date as YYYY-MM-DD (the visitor's clock; the salons are all in IST). */
export const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const addDays = (day: string, days: number) => {
  const date = new Date(`${day}T00:00:00`);
  date.setDate(date.getDate() + days);
  return isoDay(date);
};

/**
 * The window that puts an occasion "in season" on `today`: inside it, or within SEASON_LEAD_DAYS before it.
 * Returns the soonest such window, or undefined.
 */
export function seasonWindow(occasion: Occasion, today: string) {
  return occasion.windows?.find((window) => today <= window.end && today >= addDays(window.start, -SEASON_LEAD_DAYS));
}

/** "8 Nov": for the real `endsAt` label only. */
export const shortDate = (day: string) =>
  new Date(`${day}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// ---------- Page copy

export const gmPage = {
  seo: {
    title: 'Salon Gift Cards & Membership in Bangalore | XING',
    description:
      'Gift a XING salon card for birthdays, anniversaries, weddings & Diwali, or save up to 25% extra with membership. Sarjapur Road, HSR Layout & Brookfield.',
  },
  hero: {
    eyebrow: 'Gift Cards & Membership',
    h1: 'Salon Gift Cards & Memberships in Bangalore',
    sub: 'Gift a beautiful moment or save on every visit — hair, skin, nails and bridal care at our Sarjapur Road, HSR Layout and Brookfield salons.',
    /** Two sentences that answer "What gift cards and memberships does XING offer?" (read aloud by assistants). */
    summary:
      'XING offers occasion gift cards for birthdays, anniversaries, weddings, Mother’s Day and Diwali, plus a value gift card for any service. Memberships add 10% to 25% bonus value to every visit at our Sarjapur Road, HSR Layout and Brookfield salons in Bangalore.',
    primary: 'Explore Membership',
    secondary: 'Send a Gift Card',
    trust: [`${site.rating}★ Google`, `${site.reviewCount} reviews`, '3 salons', 'Free consultation'],
    image: {
      base: '/images/xing-gift-card-bangalore',
      widths: [480, 768, 1100, 1600],
      width: 1600,
      height: 1200,
      alt: 'XING salon gift card for hair, skin and nail services in Bangalore',
      /** Up to 373px wide on phones (4:3, so at most 280px tall), about half the page on desktop. */
      sizes: '(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 373px',
    },
  },
  chooser: {
    title: 'What brings you here?',
    gift: { title: 'Gifting someone?', text: 'A gift card they’ll actually use. Birthdays, anniversaries, festivals and thank-yous.', cta: 'Find a Gift' },
    self: { title: 'Treating yourself?', text: `Membership adds up to ${maxBonus}% extra value to every visit.`, cta: 'See Memberships' },
  },
  membership: {
    eyebrow: 'XING Membership',
    title: 'Load Once. Enjoy More, Every Visit.',
    sub: 'Prepay your salon visits and we add bonus value on top. Use it on any service at any XING salon.',
    strip: { from: 'Pay for 100%', to: `Enjoy up to ${100 + maxBonus}%` },
    microcopy: 'Value confirmed with you on WhatsApp before payment.',
    note: 'Tier value is confirmed by our team on WhatsApp or at the salon — no surprises.',
    loss: 'Without membership, every visit is full price.',
    reciprocity: 'Free consultation with every membership',
  },
  gifts: {
    eyebrow: 'Gift Cards',
    title: 'The Gift of Feeling Beautiful',
    sub: 'Choose an occasion or pick any value. Delivered instantly on WhatsApp or email, or as a printed card at the salon.',
    kinds: 'Experience Card = a curated pamper ritual. Value Card = they choose any service.',
    season: 'This Season',
    cta: 'Gift This',
    corporateCta: 'Request Corporate Cards',
    teaser: { recipient: 'Ananya', message: 'Happy birthday! Go treat yourself — you deserve it.', sender: 'Rahul' },
  },
  compare: {
    title: 'Gift Card or Membership? Decide in 5 Seconds',
    left: { q: 'Buying for someone else?', a: 'Gift Card' },
    right: { q: 'For yourself, visiting once a month or more?', a: 'Membership', note: 'saves most' },
    tag: 'Recommended for you',
    rows: [
      { label: 'Best for', gift: 'Gifting someone', member: 'Yourself & family' },
      { label: 'Bonus value', gift: 'Occasion perk', member: '+10% to +25% every visit' },
      { label: 'Validity', gift: '12 months', member: '6–12 months' },
      { label: 'Use at all 3 salons', gift: true, member: true },
      { label: 'Share with family', gift: 'Recipient only', member: 'Up to 2 members (Privé)' },
      { label: 'Priority booking', gift: false, member: 'Gold & Privé' },
    ] as Array<{ label: string; gift: string | boolean; member: string | boolean }>,
    giftCta: 'Send a Gift Card',
    memberCta: 'Get Gold Membership',
  },
  how: {
    title: 'How It Works',
    steps: ['Choose a membership or gift card.', 'Share a few details — we confirm on WhatsApp.', 'Pay online or at the salon and start enjoying.'],
  },
  proof: { title: `Loved by ${site.reviewCount} Clients in Bangalore` },
  faqTitle: 'Gift Card & Membership Questions',
  cta: {
    title: 'Give Someone a Reason to Glow',
    sub: 'Gift cards delivered instantly. Memberships activated the same day.',
    gift: 'Send a Gift Card',
    member: 'Get Gold Membership',
    whatsapp: 'Chat on WhatsApp',
  },
  risk: ['Use at any of our 3 salons', 'Price confirmed before we start'],
  /** Opening message for the general WhatsApp buttons; the branch picker fills in the salon. */
  whatsappText: 'Hi XING ___ (location)! I’d like to know more about gift cards and memberships.',
};

/**
 * Testimonials. OWNER TODO: replace with real Google reviews that mention gifting or membership. Until then the
 * page shows three real client reviews from data/content.ts (`reviews.items`), never invented ones.
 */
export const testimonials: Array<{ quote: string; name: string }> = [];

/** Voice-search FAQ: conversational questions, and answers whose first sentence answers fully. */
export const faqs = [
  {
    q: 'Where can I buy a salon gift card in Bangalore?',
    a: 'At XING, online on this page or at our Sarjapur Road, HSR Layout and Brookfield salons. Choose an occasion card or a value card, add a personal message, and we deliver it instantly on WhatsApp or email, or as a printed card.',
  },
  {
    q: 'How does XING salon membership work?',
    a: 'You prepay once and we add 10% to 25% bonus value depending on your tier. Use the balance for hair, skin, nail and bridal services at any XING salon until it expires. Our team confirms your tier value on WhatsApp or at the salon before you pay, so there are no surprises.',
  },
  {
    q: 'Which XING membership is best?',
    a: 'Most clients choose XING Gold: 18% bonus value, 12-month validity, priority weekend slots and sharing with one family member. Choose Privé for maximum value and family sharing, or Glow if you are trying membership for the first time and visit a little less often.',
  },
  {
    q: 'Can I use my gift card at any XING salon?',
    a: 'Yes, gift cards and memberships work at all three XING salons in Bangalore. Use them at Sarjapur Road, HSR Layout or Brookfield, for hair, skin, nail and bridal services, and switch between salons whenever it suits you. We confirm the details with you before every service starts.',
  },
  {
    q: 'How long is a XING gift card valid?',
    a: 'A XING gift card is valid for 12 months from the date it is issued. The person you gift it to can book any time in that year at Sarjapur Road, HSR Layout or Brookfield, and our team confirms every detail with them before the service starts.',
  },
  {
    q: 'Can I send a gift card on WhatsApp?',
    a: 'Yes. We send a personalised e-card with your message on WhatsApp or email, on the date you choose. You can also collect a printed card at any XING salon. Just share the recipient’s name and the delivery date in the form, and our team confirms everything with you on WhatsApp.',
  },
  {
    q: 'Do you offer corporate Diwali gift cards?',
    a: 'Yes. For 10 or more cards we add your company logo to the e-card and provide a single invoice. Your team can use their cards at any of our three Bangalore salons, and we deliver every e-card on WhatsApp or email on the date you choose.',
  },
  {
    q: 'Can I share my membership with family?',
    a: 'Gold covers one family member and Privé covers two, registered at purchase. Glow is for the member only. Family members use the same balance at any XING salon in Bangalore, so a parent, partner or sibling can book their own hair, skin and nail services.',
  },
  {
    q: 'What’s the best gift for my mother in Bangalore?',
    a: 'Our “For Amma” gift card: hair spa, pedicure and a relaxing head massage at a XING salon near her. She can visit Sarjapur Road, HSR Layout or Brookfield, and we deliver the card with your personal message on WhatsApp, by email or as a printed card.',
  },
  {
    q: 'Is a gift card or membership better?',
    a: 'A gift card is for gifting someone else; membership is for yourself and saves the most if you visit once a month or more. Membership adds 10% to 25% bonus value to every visit, while a gift card comes with an occasion perk and a personal message.',
  },
];

/** Shown in the Terms accordion. OWNER TODO: confirm the final wording. */
export const terms = [
  { q: 'Validity', a: 'Gift cards are valid for 12 months from the date of issue. Memberships are valid for 6 months (Glow) or 12 months (Gold and Privé) from the date of activation.' },
  { q: 'Services only', a: 'Bonus value applies to salon services only, not to retail products.' },
  { q: 'Refunds', a: 'Gift cards and memberships are non-refundable and cannot be exchanged for cash.' },
  { q: 'Other offers', a: 'Gift cards and memberships cannot be combined with other offers or packages.' },
  { q: 'Lost e-card', a: 'A lost e-card is reissued to the registered phone number.' },
  { q: 'Family sharing', a: 'Gold covers one family member and Privé two. Each family member’s name is registered at purchase.' },
  { q: 'Festival offers', a: 'Festival gift cards and perks are valid only within the stated festival window.' },
];

/** The short-film slot: hidden until the owner adds a video file and sets `enabled`. */
export const howToVideo = {
  enabled: false,
  name: 'How to gift a XING card',
  description: 'A 30-second guide to choosing, personalising and sending a XING salon gift card on WhatsApp.',
  src: '/videos/how-to-gift-a-xing-card.mp4',
  poster: '/images/xing-gift-card-bangalore-768.webp',
  captions: '/videos/how-to-gift-a-xing-card.vtt',
  /** ISO date and ISO 8601 duration, for search engines. */
  uploadDate: '2026-11-01',
  duration: 'PT30S',
  transcript: 'Choose an occasion or a value card. Add their name and your message. We send it on WhatsApp, by email or as a printed card, on the day you choose.',
};

/** Online payment stays switched off in the form until the server has PAYMENTS_ENABLED=true (see vite.config.ts). */
export const paymentOptions = [
  { key: 'online', label: 'Pay online', note: 'Launching soon' },
  { key: 'salon', label: 'Pay at the salon' },
  { key: 'call', label: 'Call me to confirm' },
] as const;

export const SERVICE_CHOICES = ['Hair', 'Hair Color', 'Skin', 'Nails', 'Bridal'] as const;
export const DELIVERY_METHODS = [
  { key: 'whatsapp', label: 'WhatsApp e-card' },
  { key: 'email', label: 'Email e-card' },
  { key: 'printed', label: 'Printed card at salon' },
] as const;

// ---------- Internal (server only)

/**
 * Staff-email data. The page never imports this, so the build leaves it out of the site.
 * OWNER TODO: the minimum load for each tier; null shows "to be confirmed" in staff emails.
 */
export const internal = {
  tierMinLoadINR: { glow: null, gold: null, prive: null } as Record<TierKey, number | null>,
};
