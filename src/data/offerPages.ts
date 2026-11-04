// The three offer pages as the nav, the offer cards, the popup, the footer and llms.txt show them: one name, price
// line and photo each, all from src/data/offerCatalog.ts.
import { formatPrice } from './offers';
import { catalogOffer, offerCategoryPages, offersIn, type OfferCategoryId } from './offerCatalog';

export type OfferPageId = OfferCategoryId;

export interface OfferPage {
  id: OfferPageId;
  name: string;
  path: string;
  offers: Array<{ name: string; price: number; unit?: string; was?: number }>;
  image: ReturnType<typeof catalogOffer>['image'];
}

export const offerPages: OfferPage[] = offerCategoryPages.map((page) => ({
  id: page.id,
  name: page.name,
  path: page.path,
  offers: offersIn(page.id).map((offer) => ({ name: offer.title, price: offer.lines[0].now, unit: offer.lines[0].unit, was: offer.lines[0].was })),
  image: catalogOffer(page.heroOfferId).image,
}));

export const offerPage = (id: OfferPageId) => offerPages.find((page) => page.id === id)!;

/** The lowest price on the page: "from ₹399 per streak". */
export const fromLabel = (page: OfferPage) => {
  const lowest = page.offers.reduce((low, offer) => (offer.price < low.price ? offer : low));
  return `from ${formatPrice(lowest.price)}${lowest.unit ? ` ${lowest.unit}` : ''}`;
};

/** The biggest saving on the page, if it shows any: "Save up to ₹3,000". */
export const saveLabel = (page: OfferPage) => {
  const most = Math.max(0, ...page.offers.map((offer) => (offer.was ? offer.was - offer.price : 0)));
  return most ? `Save up to ${formatPrice(most)}` : '';
};

/** Every offer page is the same at the three salons. */
export const offerPagesNote = 'All 3 salons';

/** The offer page that fits a service page, if one does: colour services, hair treatments, facials and body polish. */
const BY_SERVICE: Record<string, OfferPageId> = {
  'global-hair-color': 'hair-colour',
  highlights: 'hair-colour',
  balayage: 'hair-colour',
  'fashion-color': 'hair-colour',
  'keratin-treatment': 'hair-treatment',
  'hair-smoothening': 'hair-treatment',
  'hair-straightening': 'hair-treatment',
  nanoplastia: 'hair-treatment',
  cysteine: 'hair-treatment',
  'womens-haircut-styling': 'hair-treatment',
  'hair-spa': 'skin-care',
  'hydra-facial': 'skin-care',
  'facial-cleanup': 'skin-care',
  'body-polish': 'skin-care',
};
export const offerPageForService = (slug: string): OfferPageId | undefined => BY_SERVICE[slug];
