import { ArrowRight } from 'lucide-react';
import { novemberCampaign, serviceOfferText } from '../../data/offers';

/** The hair colour offer page's card for each colour service page (src/data/offerCatalog.ts ids). */
const SERVICE_OFFER: Record<string, string> = { 'global-hair-color': 'global-hair-colour', highlights: 'highlights', balayage: 'balayage', 'fashion-color': 'fashion-colour' };

/** A slim offer bar near the top of the colour service pages, while the campaign runs. */
export function NovemberServiceLink({ slug }: { slug: string }) {
  const text = serviceOfferText(slug);
  if (!text) return null;
  return (
    <a href={`${novemberCampaign.path}#${SERVICE_OFFER[slug]}`} className="block bg-berry text-cream hover:bg-berrydark">
      <span className="container-site flex min-h-12 items-center justify-between gap-3 py-2 text-sm font-medium">
        {text}
        <span className="inline-flex shrink-0 items-center gap-1 font-semibold">
          See offer
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </span>
    </a>
  );
}
