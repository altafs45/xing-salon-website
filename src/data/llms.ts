// llms.txt and llms-full.txt: a plain summary of the business for AI assistants, written from the data at build time
// so it can't go stale. Keep this file free of React/asset imports: vite.config.ts reads it.
import { locations, ratingLabel } from './branches';
import { site } from './content';
import { campaignLines, formatPrice, isCampaignOpen, novemberCampaign } from './offers';
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

const offerLines = () =>
  isCampaignOpen()
    ? [
        '## Current offers',
        '',
        `Valid until 30 November 2026 at all 3 salons: ${site.url}${novemberCampaign.path}`,
        ...campaignLines().map((line) => `- ${line.label}: ${line.from ? 'from ' : ''}${formatPrice(line.now)}${line.unit ? ` ${line.unit}` : ''}, was ${formatPrice(line.was)}`),
        '',
      ]
    : [];

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
