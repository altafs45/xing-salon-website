import { ArrowRight } from 'lucide-react';
import { fromLabel, offerPages, offerPagesNote, saveLabel, type OfferPage, type OfferPageId } from '../../data/offerPages';
import { cn } from '../../lib/cn';
import { Section, SectionHeader } from '../service/SectionHeader';
import { Picture } from '../ui/Primitives';
import { SnapRow } from '../ui/SnapRow';

/** The price line: "From ₹1,999 · Save up to ₹3,000". */
const priceLine = (page: OfferPage) => {
  const from = fromLabel(page);
  return [from.charAt(0).toUpperCase() + from.slice(1), saveLabel(page)].filter(Boolean).join(' · ');
};

/** One offer page as a card: its photo, name, prices and offers. The whole card links to the page. */
function OfferPageCard({ page, className }: { page: OfferPage; className?: string }) {
  return (
    <a
      href={page.path}
      data-cta={`offer-card-${page.id}`}
      className={cn('svc-card svc-card-hover group flex h-full flex-col overflow-hidden', className)}
    >
      <Picture image={page.image} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 80vw" className="aspect-[4/5] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-center justify-between gap-3 font-display text-2xl font-medium text-ink">
          {page.name}
          <ArrowRight aria-hidden className="size-5 shrink-0 text-berry transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
        </h3>
        <p className="mt-1 text-sm font-semibold text-berry">{priceLine(page)}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {page.offers.slice(0, 3).map((offer) => (
            <li key={offer.name} className="rounded-full bg-blush px-3 py-1 text-xs font-medium text-berrydark">
              {offer.name}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-4 text-xs text-muted">{offerPagesNote}</p>
      </div>
    </a>
  );
}

interface OfferPagesSectionProps {
  /** Only these pages, e.g. the one that fits a service. All three by default. */
  only?: OfferPageId[];
  id?: string;
  tone?: 'white' | 'tint';
  title?: string;
}

/** The offers slot: the three offer pages (or the ones that fit), and their terms. */
export function OfferPagesSection({ only, id = 'offers', tone = 'tint', title = 'Offers at All 3 Salons' }: OfferPagesSectionProps) {
  const pages = only ? offerPages.filter((page) => only.includes(page.id)) : offerPages;
  return (
    <Section tone={tone} id={id}>
      <SectionHeader eyebrow="Offers" title={title} />
      <div className="mt-8">
        {pages.length > 1 ? (
          <SnapRow itemWidth="w-[78%]" className="md:grid-cols-3 md:gap-5">
            {pages.map((page) => (
              <OfferPageCard key={page.id} page={page} />
            ))}
          </SnapRow>
        ) : (
          <OfferPageCard page={pages[0]} className="max-w-sm" />
        )}
      </div>
      <p className="mt-4 text-xs text-muted">Terms apply. We confirm the offer and the price before we start.</p>
    </Section>
  );
}
