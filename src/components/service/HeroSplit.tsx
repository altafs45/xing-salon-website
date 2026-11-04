import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, ChevronRight, Phone } from 'lucide-react';
import { SERVICE_HERO_SIZES } from '../../data/content';
import type { ServicePageContent } from '../../data/pages/types';
import { servicesHubPath } from '../../data/services';
import { cn } from '../../lib/cn';
import { PICK_CALL } from '../../lib/whatsapp';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/Decor';
import { Eyebrow, Picture } from '../ui/Primitives';
import { ICONS } from './icons';

interface HeroSplitProps {
  page: { hero: ServicePageContent['hero'] };
  /** Current page in the breadcrumb. */
  label: string;
  /** Breadcrumb steps between Home and this page; defaults to Services. */
  trail?: Array<{ label: string; href: string }>;
  whatsappHref?: string;
  /** Defaults to asking which salon to call. */
  phone?: { href: string; label: string };
  /** Replaces the default WhatsApp and Call buttons. */
  actions?: ReactNode;
  /** A shorter photo on phones, for pages whose long heading would push the main button off the first screen. */
  compactPhoto?: boolean;
}

/** Service-page hero: copy beside the photo on desktop, photo first on phones. */
export function HeroSplit({
  page,
  label,
  trail = [{ label: 'Services', href: servicesHubPath }],
  whatsappHref,
  phone = { href: PICK_CALL, label: 'a salon' },
  actions,
  compactPhoto = false,
}: HeroSplitProps) {
  const { hero } = page;

  return (
    // id="home": the back-to-top links in the footer and floating actions target it.
    <section id="home" className="relative overflow-hidden bg-blush pt-header-sm lg:pt-header">
      <div className="container-site grid gap-1 pb-12 pt-3 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-24 lg:pt-12">
        <div className="relative order-first min-w-0 lg:order-last">
          {/* Soft shape behind the photo */}
          <span aria-hidden className="absolute -right-6 -top-6 hidden size-2/3 rounded-full bg-mint lg:block" />
          <span aria-hidden className="absolute -bottom-6 -left-6 hidden size-1/2 rounded-full bg-berry/10 lg:block" />
          <Picture image={hero.image} eager priority sizes={SERVICE_HERO_SIZES} className={cn('svc-card hero-photo relative aspect-guide w-full object-cover shadow-lift lg:aspect-photo', compactPhoto && 'max-lg:!max-h-[19svh]')} />
          {hero.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-berry px-4 py-1.5 text-xs font-medium text-cream shadow-soft">
              {hero.badge}
            </span>
          )}
        </div>

        {/* min-w-0: lets the one-line breadcrumb and chip row scroll or truncate instead of widening the column. */}
        <div className="min-w-0">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-xs text-muted">
              <li>
                <a href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-berry">
                  Home
                </a>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3" />
              </li>
              {trail.map((step) => (
                <li key={step.href} className="flex items-center gap-1.5">
                  <a href={step.href} className="inline-flex min-h-11 min-w-11 items-center hover:text-berry">
                    {step.label}
                  </a>
                  <ChevronRight aria-hidden className="size-3" />
                </li>
              ))}
              <li aria-current="page" className="min-w-0 truncate text-ink">
                {label}
              </li>
            </ol>
          </nav>

          <Eyebrow className="lg:mt-4">{hero.eyebrow}</Eyebrow>
          <h1 className="mt-2 text-balance font-display text-hero font-medium text-ink lg:mt-4">{hero.h1}</h1>
          <p className="mt-3 max-w-md text-sm leading-normal text-muted sm:text-base sm:leading-relaxed lg:mt-5">{hero.sub}</p>
          {hero.tagline && <p className="mt-5 font-display text-2xl font-medium text-berry">{hero.tagline}</p>}
          {actions ?? (
          <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-7">
            <Button href={whatsappHref} external arrow={false} wrap>
              <WhatsAppIcon className="size-4" />
              {hero.cta ?? 'Book on WhatsApp'}
            </Button>
            {hero.secondary ? (
              // Sister-brand site: a normal followed link that keeps the referrer.
              <Button variant="outline" href={hero.secondary.href} external rel="noopener" arrow={false} wrap>
                {hero.secondary.label}
                <ArrowUpRight aria-hidden className="size-4" />
              </Button>
            ) : (
              <Button variant="outline" href={phone.href} arrow={false}>
                <Phone aria-hidden className="size-4" />
                Call {phone.label}
              </Button>
            )}
          </div>
          {hero.secondary && (
            <a href={phone.href} className="mt-2 inline-flex min-h-11 min-w-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline">
              <Phone aria-hidden className="size-4" />
              Call {phone.label}
            </a>
          )}
          </>
          )}
          {hero.chips.length > 0 && (
          <ul className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {hero.chips.map((chip) => {
              const Icon = ICONS[chip.icon];
              return (
                <li key={chip.label} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-berry/20 bg-cream px-3 py-1.5 text-xs text-ink">
                  <Icon aria-hidden className="size-3.5 text-berry" />
                  {chip.label}
                </li>
              );
            })}
          </ul>
          )}
          {hero.jumps && (
            <nav aria-label="On this page" className="mt-4 flex gap-3">
              {hero.jumps.map((jump) => (
                <a
                  key={jump.href}
                  href={jump.href}
                  className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-berry/10 px-5 text-sm font-medium text-berry transition-colors hover:bg-berry hover:text-cream"
                >
                  {jump.label}
                  <ArrowDown aria-hidden className="size-4" />
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
