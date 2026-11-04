// llms.txt and llms-full.txt: a plain summary of the business for AI assistants, written from the data at build time
// so it can't go stale. Keep this file free of React/asset imports: vite.config.ts reads it.
import { locations, ratingLabel } from './branches';
import { site } from './content';
import { fromLabel, offerPages, offerPath, saveLabel } from './offerPages';
import type { BranchId } from './offers';
import { servicePages } from './pages';
import { services } from './services';
import { ENTITY_DESCRIPTION } from './style';

interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
}

const salonLines = () =>
  locations.flatMap((loc) => [
    `- ${loc.fullName}`,
    `  Address: ${loc.address}`,
    `  Phone: ${loc.phone}`,
    `  Hours: Open daily ${loc.hours.label}`,
    `  Google: ${ratingLabel(loc.rating)}, ${loc.mapsUrl}`,
    `  Page: ${site.url}${loc.path}`,
  ]);

const serviceLines = () =>
  Object.keys(servicePages)
    .filter((slug) => services[slug])
    .map((slug) => `- ${services[slug].label}: ${site.url}/services/${slug}`);

// Each salon's three offers and their pages.
const offerLines = () => [
  '## Offers',
  '',
  ...locations.flatMap((salon) => offerPages.map((page) => `- ${page.name}, Xing ${salon.name}: ${[fromLabel(page), saveLabel(page)].filter(Boolean).join(', ')}: ${site.url}${offerPath(page.id, salon.id as BranchId)}`)),
  '',
];

export function llmsText(guides: Guide[], updated: string, full = false) {
  const picked = full ? guides : guides.slice(0, 10);
  return [
    `# ${site.fullName}`,
    '',
    `> ${ENTITY_DESCRIPTION}`,
    '',
    '## Salons',
    '',
    ...salonLines(),
    '',
    '## Services',
    '',
    ...serviceLines(),
    '',
    ...offerLines(),
    '## Guides',
    '',
    ...picked.map((guide) => `- ${guide.title}: ${site.url}/blog/${guide.slug}. ${guide.metaDescription}`),
    '',
    `Last updated: ${updated}`,
    '',
  ].join('\n');
}
