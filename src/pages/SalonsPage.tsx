import { ChevronRight } from 'lucide-react';
import { BranchesSection } from '../components/BranchesSection';
import { CTABand } from '../components/service/Sections';
import { Eyebrow } from '../components/ui/Primitives';
import { salonsPage } from '../data/branchPages';
import { bookingWhatsappHref } from '../lib/whatsapp';

/** /salons: all three salons, each leading to its own page. */
export default function SalonsPage() {
  return (
    <div id="home" className="pt-header-sm lg:pt-header">
      <BranchesSection
        id="locations"
        className="pt-6 lg:pt-10"
        header={
          <div id="locations-title">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-muted">
                <li>
                  <a href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-berry">
                    Home
                  </a>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3" />
                </li>
                <li aria-current="page" className="text-ink">
                  Salons
                </li>
              </ol>
            </nav>
            <Eyebrow>Our Branches</Eyebrow>
            <h1 className="mt-3 text-balance font-display text-hero font-medium text-ink">{salonsPage.h1}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{salonsPage.text}</p>
          </div>
        }
      />
      <CTABand title="Not sure which salon is nearest? Ask us on WhatsApp." whatsappHref={bookingWhatsappHref} />
    </div>
  );
}
