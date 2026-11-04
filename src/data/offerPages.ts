// The three offer pages (public/<slug>.html, copied from xingsalons.com): one name, price line and image each, for
// the nav's Offers menu, the offer cards (home, salon, service and category pages, the popup), the footer and
// llms.txt. Prices are the pages' own; change them here and on the page together.
import { formatPrice } from './offers';

export type OfferPageId = 'hair-colour' | 'hair-treatment' | 'skin-care';

interface OfferLine {
  name: string;
  price: number;
  /** "a streak" for per-streak prices. */
  unit?: string;
  was?: number;
}

export interface OfferPage {
  id: OfferPageId;
  name: string;
  path: string;
  offers: OfferLine[];
  /** The page's hero creative, cropped to 4:5 by scripts/offer-card-images.mjs. */
  image: { src: string; srcSet: string; width: number; height: number; alt: string };
}

const card = (id: OfferPageId, alt: string) => ({
  src: `/images/offer-cards/${id}-800.webp`,
  srcSet: `/images/offer-cards/${id}-480.webp 480w, /images/offer-cards/${id}-800.webp 800w`,
  width: 800,
  height: 1000,
  alt,
});

export const offerPages: OfferPage[] = [
  {
    id: 'hair-colour',
    name: 'Hair Colour Offers',
    path: '/hsrhaircoloroffers',
    offers: [
      { name: 'Global Hair Colour', price: 3999 },
      { name: 'Highlights', price: 399, unit: 'a streak' },
      { name: 'Balayage', price: 5499 },
      { name: 'Crazy Fashion Colour', price: 499, unit: 'a streak' },
    ],
    image: card('hair-colour', 'Hair colour offers at Xing Premium Unisex Salon, Bangalore'),
  },
  {
    id: 'hair-treatment',
    name: 'Hair Treatment Offers',
    path: '/hsrhairtreatmentoffers',
    offers: [
      { name: 'Keratin', price: 4999 },
      { name: 'Nanoplastia', price: 5999 },
      { name: 'Olaplex Bond Repair', price: 2999, was: 3999 },
      { name: 'Anti-Dandruff Scalp Treatment', price: 1999, was: 2999 },
    ],
    image: card('hair-treatment', 'Hair treatment offers at Xing Premium Unisex Salon, Bangalore'),
  },
  {
    id: 'skin-care',
    name: 'Skin Care Offers',
    path: '/hsrskincareoffers',
    offers: [
      { name: 'Hydra Facial', price: 3499, was: 5499 },
      { name: 'Body Polish', price: 4999, was: 7999 },
      { name: 'Hair Spa 2+1', price: 1999 },
      { name: 'Express Facial', price: 2499 },
    ],
    image: card('skin-care', 'Skin care offers at Xing Premium Unisex Salon, Bangalore'),
  },
];

export const offerPage = (id: OfferPageId) => offerPages.find((page) => page.id === id)!;

/** The lowest price on the page: "from ₹399 a streak". */
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
  'hair-spa': 'hair-treatment',
  'hydra-facial': 'skin-care',
  'facial-cleanup': 'skin-care',
  'body-polish': 'skin-care',
};
export const offerPageForService = (slug: string): OfferPageId | undefined => BY_SERVICE[slug];
