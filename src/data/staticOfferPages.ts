// Pages from xingsalons.com, served exactly as they are from public/<slug>.html (their own HTML, CSS and scripts).
// Hosts serve each at its clean address; the app only sends a visitor on in the dev server, and the build lists
// them in the redirects (and, for the indexable ones, the sitemap).
//   - /offers: the xingsalons.com home page, byte for byte (live copy of 4 Nov 2026).
//   - The six offer pages, untouched apart from the form action, image addresses, the site's fonts and colours,
//     the logo, and a salon picker for WhatsApp.
// "sarjapaura" is the live site's spelling; kept so its links still work.
export const staticOfferPages = [
  '/offers',
  '/hsrhaircoloroffers',
  '/hsrhairtreatmentoffers',
  '/hsrskincareoffers',
  '/sarjapaurahaircoloroffers',
  '/sarjapurahairtreatmentoffers',
  '/sarjapuraskincareoffers',
];

/** The home page's care guides, also copied byte for byte. They are noindex on xingsalons.com, so not in the sitemap. */
export const staticGuidePages = ['/haircolorcare', '/hairtreatmentacare'];

/** Every page served from public/ as it is. */
export const staticPages = [...staticOfferPages, ...staticGuidePages];
