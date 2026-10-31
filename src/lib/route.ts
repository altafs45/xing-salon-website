import { categorySlugs, postSlugs } from 'virtual:blog-routes';
import { salonById, salonsPath } from '../data/branches';
import { faqPath } from '../data/content';
import { membershipPath } from '../data/membershipLinks';
import { novemberCampaign, offersPath } from '../data/offers';
import type { ServicePageContent } from '../data/pages/types';
import { categoryBySlug, redirects, servicesHubPath } from '../data/services';

// Pages are separate documents (plain links, full page loads), so the route is fixed for the page's lifetime.
const path = window.location.pathname.replace(/\/+$/, '') || '/';
if (path in redirects) window.location.replace(redirects[path]);

const slug = path.match(/^\/services\/([a-z0-9-]+)$/)?.[1];

/** /services/hair-care and the other category pages. Tattoo has none: its category link is the studio's own page. */
export const currentCategory = slug ? categoryBySlug(slug) : undefined;

export const hasPage = (serviceSlug: string) => __SERVICE_PAGE_SLUGS__.includes(serviceSlug);

/** True on a service page, before its copy has loaded. */
export const isServicePage = !!slug && !currentCategory && hasPage(slug);

/** The service page being shown, set by `loadCurrentPage` before the app renders. */
export let currentPage: ServicePageContent | undefined;

/** The pages' copy is heavy, so only a service page fetches it. */
export async function loadCurrentPage() {
  if (isServicePage) currentPage = (await import('../data/pages')).servicePages[slug!];
}

/** /services, the list of every category. */
export const isServicesHub = path === servicesHubPath;

// Only slugs live here, so the main bundle doesn't grow with every post; the blog pages look up the details.
export type BlogRoute = { kind: 'list'; category?: string } | { kind: 'post'; slug: string };

/** True once at least one post is live; until then the nav keeps pointing at the landing guides. */
export const hasBlog = postSlugs.length > 0;

// Before the first post is live, blog URLs show the home page rather than an empty blog.
const blogMatch = hasBlog ? path.match(/^\/blog(?:\/category\/([a-z0-9-]+)|\/([a-z0-9-]+))?$/) : null;

/** The blog page being shown. Unknown categories and posts fall back to the listing. */
export const blogRoute: BlogRoute | undefined = blogMatch
  ? blogMatch[2] && postSlugs.includes(blogMatch[2])
    ? { kind: 'post', slug: blogMatch[2] }
    : { kind: 'list', category: categorySlugs.find((category) => category === blogMatch[1]) }
  : undefined;

/** The About page, with every salon's details. */
export const isAbout = path === '/about';

/** The offers page. */
export const isOffers = path === offersPath;

/** The November hair colour offers page. */
export const isNovemberOffers = path === novemberCampaign.path;

/** /faq, the site's questions in one place. */
export const isFaq = path === faqPath;

/** The membership and gift cards page. */
export const isMembership = path === membershipPath;

/** /salons, the list of all three salons. */
export const isSalons = path === salonsPath;

/** The salon whose page is being shown (/salons/<id>). An unknown id is a missing page. */
export const currentSalon = salonById(path.match(/^\/salons\/([a-z0-9-]+)$/)?.[1] ?? '');

// Blog addresses show the home page until the first post is live.
const blogNotLiveYet = !hasBlog && /^\/blog(\/|$)/.test(path);

/** An address no page answers to. */
export const isNotFound =
  path !== '/' && !isServicePage && !currentCategory && !isServicesHub && !blogRoute && !isAbout && !isOffers && !isNovemberOffers && !isFaq && !isMembership && !isSalons && !currentSalon && !(path in redirects) && !blogNotLiveYet;

export const isHome = !isServicePage && !currentCategory && !isServicesHub && !blogRoute && !isAbout && !isOffers && !isNovemberOffers && !isFaq && !isMembership && !isSalons && !currentSalon && !isNotFound;

/** Link to a landing-page section such as "#offers", from whichever page we are on. Other paths pass through. */
export const homeHref = (href: string) => (href.startsWith('#') && !isHome ? `/${href}` : href);

/** Link to a service page, falling back to the service menu until that page is published. */
export const serviceHref = (serviceSlug: string) => (hasPage(serviceSlug) ? `/services/${serviceSlug}` : servicesHubPath);
