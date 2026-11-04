// What the build adds to the six offer pages (public/<slug>.html, copied from xingsalons.com), from
// src/data/offerPages.ts, so the pages keep their own images, sections and layout: a tab between the three pages
// under the hero, the lead offer's price and a Claim button in the hero, one Claim button per offer card, a trust
// strip, links to the other two pages, a sticky Claim bar on phones and the site's own footer. Styles:
// public/offer-pages/site-theme.css. WhatsApp and Call links go through the page's salon picker.
import { site } from '../data/content';
import { CTA } from '../data/style';
import { formatPrice } from '../data/offers';
import { fromLabel, offerPages, saveLabel, type OfferPage } from '../data/offerPages';

/** Each page and its copy at the live site's other address. */
const COPIES: Record<string, string> = {
  '/sarjapaurahaircoloroffers': '/hsrhaircoloroffers',
  '/sarjapurahairtreatmentoffers': '/hsrhairtreatmentoffers',
  '/sarjapuraskincareoffers': '/hsrskincareoffers',
};

// The picker re-addresses the message to the salon chosen; the number here is only a default.
const wa = (text: string) => `https://wa.me/919380812348?text=${encodeURIComponent(text)}`;
const READY = 'data-contact-buttons-ready="1" data-treatment-buttons-ready="1" data-sarjapur-buttons-ready="1" data-sarjapur-treatment-buttons-ready="1"';
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const priceOf = (offer: OfferPage['offers'][number]) => `${formatPrice(offer.price)}${offer.unit ? ` ${offer.unit}` : ''}`;
const claimText = (offer: OfferPage['offers'][number]) => `Hi Xing! I’d like to claim the ${offer.name} offer (${priceOf(offer)}).`;
/** The offer that leads: the biggest saving, else the first. */
const lead = (page: OfferPage) => page.offers.reduce((top, offer) => ((offer.was ?? offer.price) - offer.price > (top.was ?? top.price) - top.price ? offer : top), page.offers[0]);

const tabs = (page: OfferPage) => `
<nav class="page-tabs" aria-label="Offer pages" data-cta="offer-tabs"><div class="page-tabs-row">${offerPages
  .map((other) => `<a href="${other.path}"${other.id === page.id ? ' aria-current="page"' : ''}>${esc(other.name.replace(' Offers', ''))}</a>`)
  .join('')}</div></nav>
<ul class="trust-strip" aria-label="How offers work"><li>Free consultation</li><li>Price fixed before we start</li><li>Pay at the salon</li></ul>`;

const more = (page: OfferPage) => `
<section class="more-offers" aria-labelledby="more-offers-title"><div class="container"><h2 id="more-offers-title" class="section-title">More offers</h2><div class="more-offers-row">${offerPages
  .filter((other) => other.id !== page.id)
  .map((other) => `<a class="more-offer" href="${other.path}" data-cta="more-offers-${other.id}"><strong>${esc(other.name)}</strong><span>${esc([fromLabel(other), saveLabel(other)].filter(Boolean).join(' · '))}</span></a>`)
  .join('')}</div></div></section>
`;

const sticky = (page: OfferPage) => `
<div class="offer-sticky" data-cta="sticky-claim"><a class="offer-sticky-claim" href="${esc(wa(claimText(lead(page))))}" target="_blank" rel="noopener">Claim · ${esc(fromLabel(page))}</a><a class="offer-sticky-call" href="tel:+919380812348">${CTA.call}</a></div>`;

/** BreadcrumbList JSON-LD for [name, url] steps. */
const breadcrumb = (steps: Array<[string, string]>) =>
  `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: steps.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  })}</script>`;

/**
 * /offers, the xingsalons.com home page copied as it is: the site's head for it (en-IN, a title and description that
 * fit search results, canonical, share tags, breadcrumb).
 */
export function finishOffersHome(html: string) {
  const url = `${site.url}/offers`;
  const title = 'Salon Offers in Bangalore | Xing Premium Unisex Salon';
  const description = `Hair colour, hair treatment and skin care offers at Xing Premium Unisex Salon: ${offerPages.map((page) => `${page.name.replace(' Offers', '')} ${fromLabel(page)}`).join(', ')}. All 3 salons.`;
  const short = description.length <= 155 ? description : `${description.slice(0, 152).replace(/[ ,]+\S*$/, '')}…`;
  const tags = [
    `<meta name="description" content="${esc(short)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.fullName)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${esc(short)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${site.url}${offerPages[0].image.src}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${esc(short)}">`,
    `<meta name="twitter:image" content="${site.url}${offerPages[0].image.src}">`,
    breadcrumb([['Home', site.url], ['Offers', url]]),
  ];
  return html
    .replace(/<html lang="[^"]*"/, '<html lang="en-IN"')
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/\s*<meta (name|property)="(description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/(<\/title>)/, `$1\n    ${tags.join('\n    ')}`);
}

/**
 * The head the site gives every page: en-IN, a canonical address, a description that fits search results, and share
 * tags. The page at the live site's other address points to this one and stays out of the index.
 */
function head(html: string, page: OfferPage, path: string) {
  const url = `${site.url}${page.path}`;
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? `${page.name} in Bangalore`;
  const description = `${page.name} at Xing Premium Unisex Salon, Bangalore: ${page.offers.map((offer) => offer.name).join(', ')}, ${fromLabel(page)}. All 3 salons.`;
  const short = description.length <= 155 ? description : `${description.slice(0, 152).replace(/[ ,]+\S*$/, '')}…`;
  const tags = [
    `<meta name="description" content="${esc(short)}">`,
    `<meta name="robots" content="${path === page.path ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.fullName)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${esc(short)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${site.url}${page.image.src}">`,
    `<meta property="og:image:alt" content="${esc(page.image.alt)}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${esc(short)}">`,
    `<meta name="twitter:image" content="${site.url}${page.image.src}">`,
    breadcrumb([['Home', site.url], [page.name, url]]),
  ];
  return html
    .replace(/<html lang="[^"]*"/, '<html lang="en-IN"')
    .replace(/\s*<meta (name|property)="(description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/(<\/title>)/, `$1\n    ${tags.join('\n    ')}`);
}

/** Adds the blocks to one offer page's HTML; any other page comes back as it is. */
export function enhanceOfferPage(html: string, path: string) {
  const page = offerPages.find((entry) => entry.path === (COPIES[path] ?? path));
  if (!page) return html;
  const top = lead(page);
  let card = 0;
  return (
    head(html, page, path)
      // The hero: the lead offer's price and saving, and Claim on WhatsApp first.
      .replace(/<div class="hero-actions">[\s\S]*?<\/div>/, () => {
        const saving = top.was ? ` <span>Save ${formatPrice(top.was - top.price)}</span>` : '';
        return `<p class="hero-lead"><strong>${esc(top.name)} ${esc(priceOf(top))}</strong>${saving}</p><div class="hero-actions"><a class="btn btn-primary" href="${esc(wa(claimText(top)))}" target="_blank" rel="noopener" data-cta="hero-claim">${CTA.claimWhatsapp}</a><a class="btn btn-outline" href="#offers">See all ${page.offers.length} offers</a></div>`;
      })
      // Under the hero: the tabs and the trust strip.
      .replace(/(<section[^>]*class="hero"[\s\S]*?<\/section>)/, (hero) => `${hero}${tabs(page)}`)
      // Each offer card: one Claim button, the enquiry form as a quieter link.
      .replace(/<div class="offer-actions">[\s\S]*?<\/div>/g, (actions) => {
        const offer = page.offers[card++];
        if (!offer) return actions;
        const enquire = actions.match(/<button[^>]*data-lead-open[^>]*data-service="[^"]*"[^>]*>|<button[^>]*data-service="[^"]*"[^>]*data-lead-open[^>]*>/)?.[0];
        const form = enquire ? enquire.replace(/class="[^"]*"/, 'class="text-link"') + 'Or send an enquiry</button>' : '';
        // The data- flags tell each page's own card script (it builds call and WhatsApp buttons) to leave these be.
        return `<div class="offer-actions" ${READY}><a class="btn btn-primary" href="${esc(wa(claimText(offer)))}" target="_blank" rel="noopener" data-cta="card-claim">${CTA.claimWhatsapp}</a>${form}</div>`;
      })
      // Above the salons: the other two pages.
      .replace(/(<section[^>]*class="location")/, (location) => `${more(page)}${location}`)
      // The site's footer stands in for the page's own; a sticky Claim bar on phones.
      .replace(/<footer class="footer">/, '<footer class="footer" hidden>')
      .replace(/(<a\b[^>]*class="brand"[^>]*)href="#"/, '$1href="/"')
      // The viewer's image gets its source from the page's script; a size keeps its box from jumping.
      .replace(/<img\b([^>]*)id="lightboxImage"/, '<img width="1000" height="1000"$1id="lightboxImage"')
      .replace('</body>', `<div data-site-footer></div>${sticky(page)}\n</body>`)
  );
}
