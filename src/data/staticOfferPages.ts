// The old xingsalons.com offer pages, served exactly as they were from public/<slug>.html (their own HTML, CSS
// and scripts, untouched apart from the form action and image addresses). Hosts serve each at its clean address;
// the app only sends a visitor on in the dev server, and the build lists them in the sitemap and redirects.
// "sarjapaura" is the live site's spelling; kept so its links still work.
export const staticOfferPages = [
  '/hsrhaircoloroffers',
  '/hsrhairtreatmentoffers',
  '/hsrskincareoffers',
  '/sarjapaurahaircoloroffers',
  '/sarjapurahairtreatmentoffers',
  '/sarjapuraskincareoffers',
];
