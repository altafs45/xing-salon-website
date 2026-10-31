// Shared pieces for service pages whose search copy lives in the services.ts catalogue.
import { services } from '../services';
import type { ServicePageContent } from './types';

/** Places named in the Service schema: the city first, then the salons' neighbourhoods. */
export const AREAS = ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield', 'Koramangala', 'Bellandur', 'Whitefield', 'Marathahalli'];

/** A page's `seo` block from its catalogue entry (title, description, main keyword), plus anything page-specific. */
export function seoFor(slug: string, extra: Partial<ServicePageContent['seo']> = {}): ServicePageContent['seo'] {
  const service = services[slug];
  if (!service?.metaTitle || !service.metaDesc) throw new Error(`pages: "${slug}" needs metaTitle and metaDesc in services.ts`);
  return { title: service.metaTitle, description: service.metaDesc, keyword: service.keywords?.[0] ?? service.label, areaServed: AREAS, ...extra };
}

/** The page's H1, from the catalogue. */
export const h1For = (slug: string) => services[slug].h1!;
