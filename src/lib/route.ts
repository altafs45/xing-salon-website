import { servicePages } from '../data/pages';
import { redirects, servicesHubPath } from '../data/services';

// Pages are separate documents (plain links, full page loads), so the route is fixed for the page's lifetime.
const path = window.location.pathname.replace(/\/+$/, '') || '/';
if (path in redirects) window.location.replace(redirects[path]);

const slug = path.match(/^\/services\/([a-z0-9-]+)$/)?.[1];

/** The service page being shown, or undefined on the landing page. */
export const currentPage = slug ? servicePages[slug] : undefined;
export const isHome = !currentPage;

/** Link to a landing-page section such as "#offers", from whichever page we are on. */
export const homeHref = (hash: string) => (isHome ? hash : `/${hash}`);

export const hasPage = (serviceSlug: string) => serviceSlug in servicePages;

/** Link to a service page, falling back to the service menu until that page is published. */
export const serviceHref = (serviceSlug: string) =>
  hasPage(serviceSlug) ? `/services/${serviceSlug}` : servicesHubPath;
