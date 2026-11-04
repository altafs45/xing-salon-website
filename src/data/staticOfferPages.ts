// The salon offer pages, served exactly as supplied (public/<slug>.html, from _public_html): their own HTML, CSS and
// scripts. Hosts serve each at its clean address. Each salon has three: hair colour, hair treatment and skin care.
// "sarjapaura" is the old site's spelling; kept so its links still work.
import type { BranchId } from './offers';

export type OfferPageId = 'hair-colour' | 'hair-treatment' | 'skin-care';

const HSR: Record<OfferPageId, string> = {
  'hair-colour': '/hsrhaircoloroffers',
  'hair-treatment': '/hsrhairtreatmentoffers',
  'skin-care': '/hsrskincareoffers',
};

/** Each salon's three offer pages. Brookfield has none of its own yet: it uses HSR Layout's (valid at all salons). */
export const salonOfferPages: Record<BranchId, Record<OfferPageId, string>> = {
  'sarjapur-road': {
    'hair-colour': '/sarjapaurahaircoloroffers',
    'hair-treatment': '/sarjapurahairtreatmentoffers',
    'skin-care': '/sarjapuraskincareoffers',
  },
  'hsr-layout': HSR,
  // OWNER: add Brookfield's own offer pages; until then it shows HSR Layout's.
  brookfield: HSR,
};

/** Every copied page, once. */
export const staticPages = [...new Set(Object.values(salonOfferPages).flatMap((pages) => Object.values(pages)))];
