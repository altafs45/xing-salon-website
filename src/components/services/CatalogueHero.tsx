// Opening sections of /services and /services/<category>. Text only, so the first screen paints at once. The build
// also renders these as plain HTML before any script loads (SHELLS in vite.config.ts), so keep them free of state.
import { ChevronRight } from 'lucide-react';
import { servicesHubPath, type ServiceCategory } from '../../data/services';
import { bookingWhatsappHref } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

interface HeroProps {
  eyebrow: string;
  title: string;
  text: string;
  /** Breadcrumb steps between Home and this page. */
  trail: Array<{ label: string; href: string }>;
  current: string;
}

function CatalogueHeroBase({ eyebrow, title, text, trail, current }: HeroProps) {
  return (
    <section aria-labelledby="catalogue-title" className="bg-gradient-to-b from-blush to-cream pt-header-sm lg:pt-header">
      <div className="container-site pb-10 pt-4 lg:pb-14 lg:pt-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {[{ label: 'Home', href: '/' }, ...trail].map((step) => (
              <li key={step.href} className="flex items-center gap-1">
                <a href={step.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:text-berry hover:underline">
                  {step.label}
                </a>
                <ChevronRight aria-hidden className="size-4" />
              </li>
            ))}
            <li aria-current="page" className="font-medium text-ink">
              {current}
            </li>
          </ol>
        </nav>
        <p className="mt-2 text-eyebrow font-medium uppercase text-berry">{eyebrow}</p>
        <h1 id="catalogue-title" className="mt-3 max-w-3xl text-balance font-display text-[2.125rem] font-medium leading-[1.1] text-ink sm:text-hero">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{text}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={bookingWhatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-berry px-6 text-base font-semibold text-cream transition hover:bg-berrydark sm:w-auto md:text-sm"
          >
            <WhatsAppIcon className="size-5" />
            Book on WhatsApp
          </a>
          <p className="text-center text-sm text-muted sm:text-left">Free consultation · Price confirmed before we start</p>
        </div>
      </div>
    </section>
  );
}

export function CategoryHero({ category }: { category: ServiceCategory }) {
  return (
    <CatalogueHeroBase
      eyebrow="XING Services"
      title={`${category.title} Services in Bangalore`}
      text={category.intro}
      trail={[{ label: 'Services', href: servicesHubPath }]}
      current={category.title}
    />
  );
}

export const HUB_COPY = {
  title: 'Salon Services in Bangalore',
  text: 'Hair care, skin & body, nail care and tattoo at XING Sarjapur Road, HSR Layout and Brookfield — with a free consultation and the price confirmed before we start.',
};

export function HubHero() {
  return <CatalogueHeroBase eyebrow="Our Services" title={HUB_COPY.title} text={HUB_COPY.text} trail={[]} current="Services" />;
}
