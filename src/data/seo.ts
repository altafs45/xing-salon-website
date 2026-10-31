// Per-route <head> data: title, description, canonical and JSON-LD. Read by vite.config.ts at build time.
import { about } from './about';
import { salonsPath, type Salon } from './branches';
import { branchPages, salonsPage, type BranchPageContent } from './branchPages';
import { allFaqs, faqGroups, faqPage } from './faqPage';
import { faq, faqPath, footer, guidePath, guides, hero, HERO_SIZES, locations, seo, SERVICE_HERO_SIZES, signatureColor, site } from './content';
import { faqs as gmFaqs, gmPage, howToVideo, membershipPath, occasions, tiers } from './giftMembership';
import { notFound } from './notFound';
import {
  campaignAnchor,
  campaignLines,
  campaignState,
  heroPoster,
  isCampaignOpen,
  novemberCampaign,
  offersPath,
  promoHref,
  salonOffers,
  SHOW_PRICES,
  withCampaignFaq,
  type CampaignLine,
  type SalonOffer,
} from './offers';
import { novemberOffersPage } from './novemberOffersPage';
import { fitness } from './fitness';
import { OFFER_CARD_SIZES } from './offerSizes';
import { ENTITY_DESCRIPTION } from './style';
import { offersPage } from './offersPage';
import { servicePages, type ServicePageContent } from './pages';
import { categories, categoryOf, services, servicesHubPath, servicesIn, type ServiceCategory } from './services';
import type { BlogCategory, BlogPostMeta } from '../blog/types';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Site-relative image used for link previews: 1200 × 630, with a description for screen readers. */
  image: { src: string; width: number; height: number; alt?: string };
  /** Image to preload for the first paint; left out when the first screen is text only. `type` (e.g. AVIF) makes
   * browsers that can't show that format skip the preload instead of fetching a file they won't use. */
  preload?: { src: string; srcSet?: string; sizes?: string; type?: string };
  jsonLd: object[];
  /** Open Graph type; posts are articles. */
  type?: 'website' | 'article';
  /** Kept out of sitemap.xml (e.g. drafts in a review build). */
  noindex?: boolean;
}

/** The robots meta for a page. A preview build is never indexed, whatever the page says. */
export const robotsMeta = (meta: Pick<PageMeta, 'noindex'>, preview = false) => (preview ? 'noindex,nofollow' : meta.noindex ? 'noindex,follow' : 'index,follow');
/** robots.txt: the file in /public, or a blanket block on a preview build. */
export const robotsTxt = (base: string, sitemapUrl: string, preview = false) => (preview ? 'User-agent: *\nDisallow: /\n' : `${base.trimEnd()}\n\nSitemap: ${sitemapUrl}\n`);

const BRAND = 'Xing Salon';
/** A share image from /public/og: 1200 × 630, the logo and a headline over a salon photo. No prices. */
const og = (name: string, alt: string) => ({ src: `/og/${name}.jpg`, width: 1200, height: 630, alt });
const OG_IMAGE = og('og-default', 'Xing Premium Unisex Salon in Bangalore: Sarjapur Road, HSR Layout and Brookfield');
const OG_BLOG = og('og-blog', 'Hair, skin and nail care tips from Xing Premium Unisex Salon');
const OG_OFFERS = og('og-offers', 'Salon offers in Bangalore at Xing Premium Unisex Salon');
const OG_NOVEMBER = og('og-offers-november', 'November hair colour offers at Xing Salon, Bangalore');
/** One share image per service group, used by every service page in it. */
const OG_BY_GROUP: Record<string, ReturnType<typeof og>> = {
  hair: og('og-hair', 'Hair colour, keratin and hair spa at Xing Premium Unisex Salon'),
  'skin-body': og('og-skin', 'Hydra facial and skin care at Xing Premium Unisex Salon'),
  nails: og('og-nails', 'Nail extensions and nail art at Xing Premium Unisex Salon'),
  tattoo: og('og-tattoo', 'Xing Premium Tattoo Studio, Brookfield'),
};
/** A blog post previews with its own photo, cut to 1200 × 630 in /public/og/blog; an SVG falls back. */
const blogShare = (post: { featuredImage: { src: string }; featuredImageAlt: string }) =>
  post.featuredImage.src.endsWith('.svg')
    ? OG_BLOG
    : { src: `/og/blog/${post.featuredImage.src.split('/').pop()!.replace(/\.\w+$/, '')}.jpg`, width: 1200, height: 630, alt: post.featuredImageAlt };
/** The logo for schema: a square PNG on a solid background. */
const LOGO = { '@type': 'ImageObject', url: `${site.url}${site.logo.square}`, width: 512, height: 512 };
const SOCIALS = footer.socials.map((social) => social.href);
const abs = (path: string) => `${site.url}${path}`;

const crumbs = (items: Array<[string, string]>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

/** Link previews and schema need a raster image, so an SVG hero falls back to the site's share image. */
const shareImage = (page: ServicePageContent) => (page.hero.image.src.endsWith('.svg') ? OG_IMAGE : page.hero.image);

/** A salon's schema @id: its own page, wherever the salon appears. */
const salonId = (id: string) => `${site.url}${salonsPath}/${id}#salon`;

/** A salon as schema: one node, with the same @id wherever it appears, and every fact from its Google Business Profile.
 * No prices and no ratings: Google doesn't allow third-party review markup on your own business. */
const salonNode = (loc: Salon) => ({
  '@type': loc.gbpCategory === 'Hairdresser' ? ['HairSalon', 'BeautySalon'] : ['BeautySalon', 'HairSalon'],
  '@id': salonId(loc.id),
  name: loc.gbpName,
  url: abs(loc.path),
  image: loc.photos.slice(0, 3).map((photo) => abs(photo.src)),
  logo: LOGO.url,
  telephone: loc.phone.replace(/ /g, '-'),
  ...(loc.email && { email: loc.email }),
  address: {
    '@type': 'PostalAddress',
    streetAddress: loc.street,
    addressLocality: loc.city,
    addressRegion: loc.region,
    postalCode: loc.postalCode,
    addressCountry: 'IN',
  },
  hasMap: loc.mapsUrl,
  sameAs: [loc.mapsUrl],
  geo: { '@type': 'GeoCoordinates', latitude: loc.lat, longitude: loc.lng },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: loc.hours.dayNames,
    opens: loc.hours.opens,
    closes: loc.hours.closes,
  },
  parentOrganization: { '@id': `${site.url}/#organization` },
  amenityFeature: loc.attributes.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  areaServed: loc.areasServed.map((name) => ({ '@type': 'Place', name })),
});

const home: PageMeta = {
  path: '/',
  title: seo.title,
  description: seo.description,
  image: OG_IMAGE,
  preload: { src: hero.image.src, srcSet: hero.image.srcSet, sizes: HERO_SIZES },
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.fullName, publisher: { '@id': `${site.url}/#organization` } },
    // The organisation and its three salons. Each salon keeps the @id of its own page, so every page
    // describes the same entities.
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: `${site.name} ${site.tagline}`,
      url: site.url,
      logo: LOGO,
      image: abs(OG_IMAGE.src),
      description: ENTITY_DESCRIPTION,
      sameAs: [...SOCIALS, ...locations.map((loc) => loc.mapsUrl), 'https://www.xingtattoo.in/', fitness.website],
      foundingDate: String(site.founded),
      subOrganization: locations.map((loc) => ({ ...salonNode(loc), description: loc.description, hasMenu: site.menuUrl })),
    },
    // The signature service on the landing page: the same entity as the Service on /services/global-hair-color.
    // Names and places only, no prices and no ratings.
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${site.url}/services/global-hair-color#service`,
      name: services['global-hair-color'].label,
      serviceType: 'Hair Colouring',
      description: signatureColor.text,
      url: abs('/services/global-hair-color'),
      provider: locations.map((loc) => salonNode(loc)),
      areaServed: [{ '@type': 'City', name: 'Bengaluru' }, ...locations.map((loc) => ({ '@type': 'Place', name: loc.name }))],
    },
    // The Beauty Guides on the landing page, each with the URL its card links to. No dates or authors.
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${site.name} ${guides.eyebrow}`,
      itemListElement: guides.items.map((guide, i) => ({ '@type': 'ListItem', position: i + 1, name: guide.title, url: abs(guidePath(guide)) })),
    },
    // Same questions and answers as the two FAQs on the page: the hair colour one, then the general one.
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...signatureColor.faqs, ...faq.items].map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
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
    logo: LOGO.url,
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

  const category = categoryOf(service);
  const breadcrumbs = [
    ['Home', abs('/')],
    ['Services', abs(servicesHubPath)],
    // Tattoo's category page is the studio page itself.
    ...(category.hasPage ? [[category.title, abs(category.path)]] : []),
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
    // Search copy from the services.ts catalogue first, then the page's own.
    title: service.metaTitle ?? page.seo.title ?? `${page.seo.titleLead} | ${BRAND}`,
    description: service.metaDesc ?? page.seo.description,
    image: OG_BY_GROUP[service.group] ?? OG_IMAGE,
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
        description: service.metaDesc ?? page.seo.description,
        url: node.anchor === 'service' ? url : `${url}#${node.anchor}`,
        image: abs(shareImage(page).src),
        provider: locations.map((loc) => salonNode(loc)),
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

// ---------- Salon pages

/** A salon's share image: its photo with the logo and its name, 1200 × 630, in /public/og. */
/** One priced November service as a schema Offer, provided by the salons given. Built per deploy: a page built
 * before the end date is corrected in the browser (NovemberOffersPage), so rebuild after the campaign ends. */
const campaignOfferNode = (line: CampaignLine, salons: string[]) => ({
  '@type': 'Offer',
  name: `${line.label}: November offer`,
  url: abs(`${novemberCampaign.path}#${campaignAnchor(line)}`),
  price: line.now,
  priceCurrency: 'INR',
  validFrom: novemberCampaign.start,
  priceValidUntil: novemberCampaign.end,
  availability: `https://schema.org/${campaignState() === 'ended' ? 'Discontinued' : 'InStock'}`,
  priceSpecification: {
    '@type': line.unit ? 'UnitPriceSpecification' : 'PriceSpecification',
    ...(line.from ? { minPrice: line.now } : { price: line.now }),
    priceCurrency: 'INR',
    ...(line.unit && { referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'streak' } }),
  },
  itemOffered: {
    '@type': 'Service',
    name: line.label,
    provider: salons.map((id) => ({ '@id': salonId(id) })),
    areaServed: { '@type': 'City', name: 'Bengaluru' },
  },
});

const salonShare = (loc: Salon) => og(`og-salon-${loc.id}`, `Xing Premium Unisex Salon, ${loc.name}, Bangalore`);

/** /salons/<id>: the salon, the page, its breadcrumb and its FAQ, as one graph. */
function branchMeta(loc: Salon, page: BranchPageContent): PageMeta {
  const url = abs(loc.path);
  const hero = loc.photos[page.hero.photo];
  return {
    path: loc.path,
    title: page.seo.title,
    description: page.seo.description,
    image: salonShare(loc),
    preload: { src: hero.src, srcSet: hero.srcSet, sizes: SERVICE_HERO_SIZES },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          {
            ...salonNode(loc),
            description: loc.description,
            image: [hero, ...loc.photos.filter((photo) => photo !== hero)].slice(0, 3).map((photo) => abs(photo.src)),
            hasMenu: site.menuUrl,
            ...(isCampaignOpen() && { makesOffer: campaignLines().map((line) => campaignOfferNode(line, [loc.id])) }),
            // Services by name only: the site does not publish prices.
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `Services at ${loc.fullName}`,
              itemListElement: page.services.items.map((item) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: item.label, description: item.text, url: abs(`/services/${item.slug}${item.hash ?? ''}`) },
              })),
            },
          },
          {
            '@type': 'WebPage',
            '@id': `${url}#webpage`,
            url,
            name: page.seo.title,
            description: page.seo.description,
            isPartOf: { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.fullName },
            about: { '@id': salonId(loc.id) },
            primaryImageOfPage: { '@type': 'ImageObject', url: abs(hero.src), width: hero.width, height: hero.height },
            breadcrumb: { '@id': `${url}#breadcrumb` },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${url}#breadcrumb`,
            itemListElement: [
              ['Home', abs('/')],
              ['Salons', abs(salonsPath)],
              [loc.name, url],
            ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
          },
          {
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            mainEntity: withCampaignFaq(page.faqs).map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
          },
        ],
      },
    ],
  };
}

const salonsMeta: PageMeta = {
  path: salonsPath,
  title: salonsPage.title,
  description: salonsPage.description,
  image: OG_IMAGE,
  jsonLd: [
    crumbs([
      ['Home', '/'],
      ['Salons', salonsPath],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: salonsPage.h1,
      itemListElement: locations.map((loc, i) => ({ '@type': 'ListItem', position: i + 1, name: loc.fullName, url: abs(loc.path) })),
    },
  ],
};

// ---------- /services and the category pages

const SERVICES_TITLE = 'Salon Services in Bangalore | Hair & Nails – Xing Salon';
const SERVICES_DESCRIPTION =
  'Hair care, skin & body, nail care and tattoo at Xing Sarjapur Road, HSR Layout & Brookfield. Free consultation, price confirmed before we start.';

/** A service in an ItemList: name, page and one line, no price. */
const listedService = (slug: string, position: number) => ({
  '@type': 'ListItem',
  position,
  url: abs(`/services/${slug}`),
  name: services[slug].label,
});

const servicesHubMeta: PageMeta = {
  path: servicesHubPath,
  title: SERVICES_TITLE,
  description: SERVICES_DESCRIPTION,
  image: OG_IMAGE,
  jsonLd: [
    crumbs([
      ['Home', '/'],
      ['Services', servicesHubPath],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Xing salon service categories',
      itemListElement: categories.map((category, i) => ({ '@type': 'ListItem', position: i + 1, name: category.title, url: abs(category.path) })),
    },
  ],
};

/** /services/<category>: its services as an ItemList, and the breadcrumb. */
function categoryMeta(category: ServiceCategory): PageMeta {
  const path = category.path;
  // The first card's photo can be on the first screen of a phone: fetch it with the page.
  const first = servicePages[servicesIn(category)[0].slug].hero.image;
  return {
    path,
    preload: { src: first.src, srcSet: first.srcSet, sizes: first.srcSet ? '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' : undefined },
    title: `${category.title} Services in Bangalore – Xing Salon`,
    description: category.metaDesc,
    image: OG_BY_GROUP[category.key] ?? OG_IMAGE,
    jsonLd: [
      crumbs([
        ['Home', '/'],
        ['Services', servicesHubPath],
        [category.title, path],
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${category.title} services at Xing`,
        url: abs(path),
        itemListElement: servicesIn(category).map((service, i) => listedService(service.slug, i + 1)),
      },
    ],
  };
}

/** Every page the build writes to disk and lists in sitemap.xml. */
export const routes: PageMeta[] = [
  home,
  servicesHubMeta,
  ...categories.filter((category) => category.hasPage).map(categoryMeta),
  ...Object.values(servicePages).map(serviceMeta),
  salonsMeta,
  ...locations.map((loc) => branchMeta(loc, branchPages[loc.id])),
];

/** Head data for a request URL (dev server). Unknown paths get the home page's, as the app decides what to show. */
export function metaFor(url: string, extra: PageMeta[] = []) {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return [...routes, ...extra].find((route) => route.path === path) ?? home;
}

// ---------- Blog

export const BLOG_TITLE = 'Hair, Skin & Nail Care Blog | Xing Premium Salon Bangalore';
const BLOG_DESCRIPTION =
  'Practical hair, skin and nail care advice from Xing Premium Unisex Salon in Bangalore: hair spas, keratin, colour, facials, waxing and nails.';

const organization = {
  '@type': 'Organization',
  name: `${site.name} ${site.tagline}`,
  url: site.url,
  logo: LOGO,
  image: `${site.url}${OG_IMAGE.src}`,
};


/** /about: the organisation, its three salons and the tattoo studio, plus the page's FAQ. */
export const aboutMeta: PageMeta = {
  path: '/about',
  title: about.seo.title,
  description: about.seo.description,
  image: OG_IMAGE,
  preload: { src: about.hero.image.src, srcSet: about.hero.image.srcSet, sizes: SERVICE_HERO_SIZES },
  jsonLd: [
    crumbs([
      ['Home', '/'],
      ['About Us', '/about'],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: about.seo.title,
      description: about.seo.description,
      url: abs('/about'),
      mainEntity: { '@id': `${site.url}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      ...organization,
      '@id': `${site.url}/#organization`,
      foundingDate: String(about.founded),
      sameAs: footer.socials.map((social) => social.href),
      // No prices and no ratings: only who and where each business is.
      subOrganization: [...locations.map((loc) => salonNode(loc)), venueNode(servicePages.tattoo, abs('/services/tattoo'))],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: about.faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    },
  ],
};


/** One schema Offer, tied to the salons that honour it and to the service it is for. No price while SHOW_PRICES is off. */
const offerNode = (offer: SalonOffer) => ({
  '@type': 'Offer',
  name: `${offer.title}: ${offer.badge}`,
  description: offer.sub,
  url: abs(promoHref(offer.id)),
  image: abs(offer.image.src),
  ...(SHOW_PRICES && offer.prices?.length === 1 && { price: offer.prices[0].now, priceCurrency: 'INR' }),
  areaServed: { '@type': 'City', name: 'Bengaluru' },
  seller: offer.branches.map((id) => ({ '@id': salonId(id) })),
  itemOffered: {
    '@type': 'Service',
    name: offer.title,
    ...(offer.serviceLink?.startsWith('/services/') && { url: abs(offer.serviceLink) }),
  },
});

/** /offers: every current offer, plus the page's FAQ. */
export const offersMeta: PageMeta = {
  path: offersPath,
  title: offersPage.seo.title,
  description: offersPage.seo.description,
  image: OG_OFFERS,
  preload: { src: salonOffers[0].image.src, srcSet: salonOffers[0].image.srcSet, sizes: OFFER_CARD_SIZES },
  jsonLd: [
    crumbs([
      ['Home', '/'],
      ['Offers', offersPath],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: offersPage.hero.h1,
      url: abs(offersPath),
      itemListElement: salonOffers.map(offerNode),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: offersPage.faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    },
  ],
};

/** /offers/november: the priced offers and the page's FAQ. No rating here: it belongs to the salons. */
export const novemberOffersMeta: PageMeta = {
  path: novemberCampaign.path,
  title: novemberOffersPage.seo.title,
  description: novemberOffersPage.seo.description,
  image: OG_NOVEMBER,
  preload: { src: heroPoster.src, srcSet: heroPoster.avifSrcSet, sizes: '(min-width: 1024px) 448px, 340px', type: 'image/avif' },
  jsonLd: [
    crumbs([
      ['Home', '/'],
      ['Offers', offersPath],
      [novemberOffersPage.seo.crumb, novemberCampaign.path],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: novemberOffersPage.hero.h1,
      url: abs(novemberCampaign.path),
      itemListElement: campaignLines().map((line) => campaignOfferNode(line, novemberCampaign.branches)),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: novemberOffersPage.faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    },
  ],
};

/** /faq: one FAQPage with every question on the page. */
export const faqPageMeta: PageMeta = {
  path: faqPath,
  title: faqPage.seo.title,
  description: faqPage.seo.description,
  image: OG_IMAGE,
  jsonLd: [
    crumbs([
      ['Home', '/'],
      [faqPage.seo.crumb, faqPath],
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs(faqGroups()).map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    },
  ],
};

/** Places the gift cards and memberships serve, named in the schema. */
const GM_AREAS = ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield', 'Koramangala', 'Bellandur', 'Whitefield', 'Marathahalli', 'ITPL', 'Electronic City'];

/**
 * /membership-gift-cards: the organisation's catalogue of memberships and gift cards (as services, never with a
 * price), the FAQ, the breadcrumb and the page, with the summary and FAQ answers marked as speakable.
 */
export const membershipMeta: PageMeta = (() => {
  const url = abs(membershipPath);
  const { hero } = gmPage;
  const areaServed = GM_AREAS.map((name, i) => ({ '@type': i === 0 ? 'City' : 'Place', name }));
  const offer = (name: string, description: string, anchor: string) => ({
    '@type': 'Offer',
    url: `${url}#${anchor}`,
    seller: { '@id': `${site.url}/#organization` },
    itemOffered: { '@type': 'Service', name, description, areaServed, provider: { '@id': `${site.url}/#organization` } },
  });
  return {
    path: membershipPath,
    title: gmPage.seo.title,
    description: gmPage.seo.description,
    image: { src: '/og/og-gift-cards.jpg', width: 1200, height: 630, alt: 'Xing salon gift cards and memberships in Bangalore' },
    preload: {
      src: `${hero.image.base}-768.avif`,
      srcSet: hero.image.widths.map((w) => `${hero.image.base}-${w}.avif ${w}w`).join(', '),
      sizes: hero.image.sizes,
      type: 'image/avif',
    },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BeautySalon',
            '@id': `${site.url}/#organization`,
            name: site.fullName,
            url: site.url,
            logo: LOGO,
            image: abs(OG_IMAGE.src),
            department: locations.map((loc) => salonNode(loc)),
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Xing Gift Cards & Memberships',
              url,
              itemListElement: [
                ...tiers.map((tier) =>
                  offer(
                    `${tier.name} Membership`,
                    `+${tier.bonus}% bonus value on salon services, valid ${tier.validityMonths} months, at all three Xing salons in Bangalore. ${tier.perks.join(', ')}.`,
                    'membership',
                  ),
                ),
                ...occasions.map((occasion) =>
                  offer(occasion.heading, [occasion.hook, occasion.includes.length ? `Includes ${occasion.includes.join(', ').toLowerCase()}.` : ''].filter(Boolean).join(' '), 'gift-cards'),
                ),
              ],
            },
          },
          {
            '@type': 'WebPage',
            '@id': `${url}#webpage`,
            url,
            name: gmPage.seo.title,
            description: gmPage.seo.description,
            inLanguage: 'en-IN',
            isPartOf: { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.fullName },
            about: { '@id': `${site.url}/#organization` },
            primaryImageOfPage: { '@type': 'ImageObject', url: abs(`${hero.image.base}-1600.webp`), width: hero.image.width, height: hero.image.height },
            breadcrumb: { '@id': `${url}#breadcrumb` },
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-summary', '.faq-answer'] },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${url}#breadcrumb`,
            itemListElement: [
              ['Home', abs('/')],
              ['Gift Cards & Membership', url],
            ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
          },
          {
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            mainEntity: gmFaqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
          },
          // Only once the owner has added the how-to video.
          ...(howToVideo.enabled
            ? [
                {
                  '@type': 'VideoObject',
                  name: howToVideo.name,
                  description: howToVideo.description,
                  thumbnailUrl: abs(howToVideo.poster),
                  uploadDate: howToVideo.uploadDate,
                  duration: howToVideo.duration,
                  contentUrl: abs(howToVideo.src),
                },
              ]
            : []),
        ],
      },
    ],
  };
})();

/** The not-found page: written to 404.html, kept out of search results and the sitemap. */
export const notFoundMeta: PageMeta = {
  path: '/404',
  title: notFound.title,
  description: notFound.description,
  image: OG_IMAGE,
  jsonLd: [],
  noindex: true,
};

/** Head data for /blog, each category and each post. Only posts passed in are listed. */
export function blogRoutes(posts: Array<BlogPostMeta & { faqs: Array<{ q: string; a: string }> }>, categories: BlogCategory[]): PageMeta[] {
  if (posts.length === 0) return [];
  const list: PageMeta = {
    path: '/blog',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    image: OG_BLOG,
    preload: { src: posts[0].featuredImage.src, srcSet: posts[0].featuredImage.srcSet, sizes: '(min-width: 1024px) 33vw, 100vw' },
    jsonLd: [
      crumbs([
        ['Home', '/'],
        ['Blog', '/blog'],
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Xing Salon Blog',
        description: BLOG_DESCRIPTION,
        url: abs('/blog'),
        publisher: organization,
        blogPost: posts.slice(0, 12).map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: abs(`/blog/${post.slug}`) })),
      },
    ],
  };

  const categoryPages = categories.map((category): PageMeta => {
    const inCategory = posts.filter((post) => post.categorySlug === category.slug);
    const path = `/blog/category/${category.slug}`;
    return {
      path,
      title: `${category.name} Tips & Guides | Xing Salon Blog`.slice(0, 60),
      description: `${category.name} advice from the team at Xing Premium Unisex Salon, Bangalore: ${inCategory
        .slice(0, 2)
        .map((post) => post.title.split(':')[0])
        .join(', ')} and more.`.slice(0, 155),
      image: OG_BLOG,
      preload: { src: inCategory[0].featuredImage.src },
      jsonLd: [
        crumbs([
          ['Home', '/'],
          ['Blog', '/blog'],
          [category.name, path],
        ]),
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${category.name} articles`, url: abs(path), isPartOf: abs('/blog') },
      ],
    };
  });

  const postPages = posts.map((post): PageMeta => {
    const path = `/blog/${post.slug}`;
    return {
      path,
      type: 'article',
      noindex: post.draft,
      title: post.metaTitle,
      description: post.metaDescription,
      // Previews and schema need a raster image, so an SVG falls back to the site share image.
      image: blogShare(post),
      preload: { src: post.featuredImage.src, srcSet: post.featuredImage.srcSet, sizes: '(min-width: 1024px) 768px, 100vw' },
      jsonLd: [
        crumbs([
          ['Home', '/'],
          ['Blog', '/blog'],
          [post.category, `/blog/category/${post.categorySlug}`],
          [post.title, path],
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.metaDescription,
          image: abs(post.featuredImage.src.endsWith('.svg') ? OG_IMAGE.src : post.featuredImage.src),
          datePublished: post.publishDate,
          dateModified: post.updatedDate,
          author: organization,
          publisher: organization,
          mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
          articleSection: post.category,
          keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
          wordCount: post.wordCount,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
        },
      ],
    };
  });

  return [list, ...categoryPages, ...postPages];
}
