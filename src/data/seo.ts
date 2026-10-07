// Per-route <head> data: title, description, canonical and JSON-LD. Read by vite.config.ts at build time.
import { hero, HERO_SIZES, locations, seo, SERVICE_HERO_SIZES, site } from './content';
import { servicePages, type ServicePageContent } from './pages';
import { services, servicesHubPath } from './services';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Site-relative image used for link previews. */
  image: { src: string; width: number; height: number };
  /** Image to preload for the first paint. */
  preload: { src: string; srcSet?: string; sizes?: string };
  jsonLd: object[];
}

const BRAND = 'Xing Salon';
const OG_IMAGE = { src: '/images/og.jpg', width: 1200, height: 630 };
const abs = (path: string) => `${site.url}${path}`;

/** Link previews and schema need a raster image, so an SVG hero falls back to the site's share image. */
const shareImage = (page: ServicePageContent) => (page.hero.image.src.endsWith('.svg') ? OG_IMAGE : page.hero.image);

type Salon = (typeof locations)[number];

const salonNode = (loc: Salon, type: 'HairSalon' | 'BeautySalon' | 'NailSalon' = 'HairSalon') => ({
  '@type': type,
  '@id': `${site.url}/#${loc.id}`,
  name: `${site.name} ${site.tagline} – ${loc.name}`,
  url: site.url,
  image: abs(loc.photos[0]?.src ?? OG_IMAGE.src),
  telephone: loc.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: loc.street,
    addressLocality: loc.city,
    addressRegion: loc.region,
    postalCode: loc.postalCode,
    addressCountry: 'IN',
  },
});

const home: PageMeta = {
  path: '/',
  title: seo.title,
  description: seo.description,
  image: OG_IMAGE,
  preload: { src: hero.image.src, srcSet: hero.image.srcSet, sizes: HERO_SIZES },
  jsonLd: locations.map((loc) => ({
    '@context': 'https://schema.org',
    ...salonNode(loc),
    description: loc.description,
    ...(loc.email && { email: loc.email }),
    foundingDate: String(site.founded),
    hasMenu: site.menuUrl,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    hasMap: loc.mapUrl,
  })),
};

const DAY_NAMES: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

/** TattooParlor for a page with its own venue. Names only, no prices. */
function venueNode(page: ServicePageContent, url: string) {
  const venue = page.contact!;
  return {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    '@id': `${url}#studio`,
    name: venue.name,
    description: page.seo.description,
    url: venue.website,
    image: abs(shareImage(page).src),
    telephone: venue.phoneHref.replace('tel:', ''),
    email: venue.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.postal.street,
      addressLocality: venue.postal.locality,
      addressRegion: venue.postal.region,
      postalCode: venue.postal.postalCode,
      addressCountry: 'IN',
    },
    hasMap: venue.mapUrl,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: venue.hours.days.map((day) => DAY_NAMES[day]),
      opens: venue.hours.opens,
      closes: venue.hours.closes,
    },
    foundingDate: String(venue.founded),
    sameAs: [venue.website, venue.instagram.href],
    brand: { '@type': 'Brand', name: site.name },
    parentOrganization: { '@type': 'Organization', name: `${site.name} ${site.tagline}`, url: site.url },
    areaServed: (page.seo.areaServed ?? ['Bengaluru']).map((name, i) => ({ '@type': i === 0 ? 'City' : 'Place', name })),
  };
}

function serviceMeta(page: ServicePageContent): PageMeta {
  const service = services[page.slug];
  const path = `/services/${page.slug}`;
  const url = abs(path);

  const breadcrumbs = [
    ['Home', abs('/')],
    ['Services', abs(servicesHubPath)],
    [service.label, url],
  ];

  // Services are listed by name only: the site does not publish prices.
  const catalogOf = (lists: typeof service.lists) => lists.flatMap((entry) =>
    // Items with their own page are listed in that page's schema, not this one.
    entry.items.filter((item) => !item.page).map((item) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        // e.g. "D-Lux Manicure & Pedicure" for a card offered in several versions.
        name: entry.variants ? `${item.name} ${entry.variants.at(-1)!.name}` : item.name,
        ...(item.text && { description: item.text }),
      },
    })),
  );

  // One Service object for the page, or one per `splitServices` entry.
  const serviceNodes = page.seo.splitServices
    ? page.seo.splitServices.map((node) => ({
        ...node,
        catalog: catalogOf(service.lists.filter((entry) => entry.title === node.list)),
      }))
    : [{ anchor: 'service', name: service.label, serviceType: page.seo.serviceType ?? service.label, catalog: catalogOf(service.lists) }];

  return {
    path,
    title: page.seo.title ?? `${page.seo.titleLead} | ${BRAND}`,
    description: page.seo.description,
    image: shareImage(page),
    preload: { src: page.hero.image.src, srcSet: page.hero.image.srcSet, sizes: SERVICE_HERO_SIZES },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
      },
      // A separate venue (the tattoo studio) is described as that business instead of as a salon service.
      ...(page.contact ? [venueNode(page, url)] : []),
      ...(page.contact ? [] : serviceNodes).map((node) => ({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${url}#${node.anchor}`,
        name: node.name,
        serviceType: node.serviceType,
        description: page.seo.description,
        url: node.anchor === 'service' ? url : `${url}#${node.anchor}`,
        image: abs(shareImage(page).src),
        provider: locations.map((loc) => salonNode(loc, page.seo.providerType)),
        ...(page.seo.audienceGender && {
          audience: { '@type': 'PeopleAudience', suggestedGender: page.seo.audienceGender },
        }),
        areaServed: (page.seo.areaServed ?? ['Bengaluru']).map((name, i) => ({ '@type': i === 0 ? 'City' : 'Place', name })),
        hasOfferCatalog: { '@type': 'OfferCatalog', name: node.name, itemListElement: node.catalog },
      })),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
}

/** Every page the build writes to disk and lists in sitemap.xml. */
export const routes: PageMeta[] = [home, ...Object.values(servicePages).map(serviceMeta)];

/** Head data for a request URL; unknown paths fall back to the home page. */
export function metaFor(url: string) {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return routes.find((route) => route.path === path) ?? home;
}
