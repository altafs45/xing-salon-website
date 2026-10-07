// Offers and combos. Kept apart from the service list because they change often.
// No amounts here: the site shows percentages and offer mechanics only.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.

export interface Offer {
  title: string;
  /** Shown large on the offer card, e.g. "25%". */
  figure: string;
  deal: string;
  terms: string;
  /** Slug of the service page this offer belongs to; other pages link the offer card there. */
  page?: string;
}

export const offers = {
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
  olaplexTopUp: {
    title: 'Olaplex Top-up',
    figure: '50%',
    deal: '50% Off',
    terms: 'With any hair color service.',
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
    title: 'Combos with Threading & De-tan',
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
