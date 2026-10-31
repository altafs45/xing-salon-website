import { useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Navigation, Phone } from 'lucide-react';
import type { Offer } from '../../data/offers';
import type { IconKey, ServicePageContent } from '../../data/pages/types';
import { cn } from '../../lib/cn';
import { PICK_CALL } from '../../lib/whatsapp';
import { Button } from '../ui/Button';
import { Floral, WhatsAppIcon } from '../ui/Decor';
import { Picture, Reveal } from '../ui/Primitives';
import { SnapRow } from '../ui/SnapRow';
import { ICONS } from './icons';

/** Icon tiles: icon in a tinted circle, title and one line. */
export function BenefitGrid({ items }: { items: Array<{ icon: IconKey; title: string; text?: string }> }) {
  return (
    <ul className={cn('mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5', items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {items.map((item, i) => {
        const Icon = ICONS[item.icon];
        return (
          <li key={item.title}>
            {/* Phones: icon beside the text, so four tiles take half the height. */}
            <Reveal delay={i * 0.05} className="svc-card flex h-full items-center gap-4 p-5 sm:block sm:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
                <Icon aria-hidden className="size-6" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink sm:mt-4">{item.title}</h3>
                {item.text && <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

type Compare = NonNullable<ServicePageContent['compare']>;

/** One card per option, with a labelled row for each comparison column. Swipes sideways on phones. */
export function CompareCards({ compare, hrefFor }: { compare: Compare; hrefFor: (slug: string) => string | null }) {
  const labels = compare.columns.slice(1);
  // Up to five options sit in one row on wide screens; more wrap three to a row.
  const oneRow = compare.rows.length <= 5;
  return (
    <div className="mt-10">
      <SnapRow className={cn('md:grid-cols-2 md:gap-5 lg:grid-cols-3', oneRow && 'xl:grid-flow-col xl:auto-cols-fr xl:grid-cols-none')}>
        {compare.rows.map((row, i) => {
          const href = row.slug ? hrefFor(row.slug) : null;
          return (
            <Reveal key={row.name} delay={i * 0.05} className={cn('svc-card h-full p-6', row.current && 'border-berry ring-1 ring-berry')}>
              <h3 className="font-display text-xl font-medium text-ink">
                {href ? (
                  <a href={href} className="inline-flex min-h-11 items-center text-berry underline-offset-4 hover:underline">
                    {row.name}
                  </a>
                ) : (
                  row.name
                )}
              </h3>
              <dl className="mt-4 space-y-3">
                {row.cells.map((cell, c) => (
                  <div key={labels[c]}>
                    <dt className="text-eyebrow font-medium uppercase text-berry">{labels[c]}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink">{cell}</dd>
                  </div>
                ))}
              </dl>
              {row.link && hrefFor(row.link.slug) && (
                <a href={hrefFor(row.link.slug)! + (row.link.hash ?? '')} className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline">
                  {row.link.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                </a>
              )}
            </Reveal>
          );
        })}
      </SnapRow>
    </div>
  );
}

const STEP_COLUMNS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
};

/** Numbered timeline: a horizontal line on desktop, a vertical one on phones. */
export function ProcessStepper({ steps }: { steps: ReadonlyArray<{ title: string; text?: string }> }) {
  return (
    <ol className={cn('relative mt-10 grid gap-8 lg:gap-6', STEP_COLUMNS[steps.length])}>
      {/* Connecting line */}
      <span aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-berry/25 lg:bottom-auto lg:left-6 lg:right-6 lg:top-6 lg:h-px lg:w-auto" />
      {steps.map((step, i) => (
        <li key={step.title}>
          <Reveal delay={i * 0.06} className="relative flex items-center gap-5 lg:block">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-berry font-display text-xl font-medium lining-nums text-cream">
              {i + 1}
            </span>
            <div className="lg:mt-5 lg:pr-4">
              <h3 className="text-base font-semibold text-ink">{step.title}</h3>
              {step.text && <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/** Checklist: one column on phones, two from tablet up. */
export function TipsChecklist({ tips }: { tips: string[] }) {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2">
      {tips.map((tip, i) => (
        <li key={tip}>
          <Reveal delay={i * 0.04} className="svc-card flex h-full items-start gap-4 p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-berry">
              <Check aria-hidden className="size-4" />
            </span>
            <p className="text-sm leading-relaxed text-ink">{tip}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** Grouped checklists (e.g. Before | After): collapsible on phones, always open side by side from tablet up. */
export function TipGroups({ groups }: { groups: Array<{ title: string; tips: string[] }> }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-6">
      {groups.map((group, i) => {
        const expanded = open === i;
        return (
          <Reveal key={group.title} delay={i * 0.05} className="svc-card p-5 sm:p-6">
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`tips-panel-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="flex min-h-11 w-full items-center justify-between gap-3 text-left font-display text-xl font-medium text-ink md:pointer-events-none"
              >
                {group.title}
                <ChevronDown aria-hidden className={cn('size-5 shrink-0 text-berry transition-transform duration-200 md:hidden', expanded && 'rotate-180')} />
              </button>
            </h3>
            <ul id={`tips-panel-${i}`} className={cn('mt-3 space-y-3', !expanded && 'hidden md:block')}>
              {group.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blush text-berry">
                    <Check aria-hidden className="size-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{tip}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}
    </div>
  );
}

const OFFER_COLUMNS: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4', 5: 'md:grid-cols-3 lg:grid-cols-5' };

interface OfferCardsProps {
  /** `href` links the card's title to the offer's own service page. */
  offers: Array<Offer & { href?: string }>;
  /** Shown on the single large card when a page has just one offer. */
  badge?: string;
  links?: Array<{ label: string; href: string }>;
}

/** Offer cards with the percentage as the visual focus. One offer alone becomes a large featured card. */
export function OfferCards({ offers, badge, links = [] }: OfferCardsProps) {
  if (offers.length === 1) {
    const [offer] = offers;
    return (
      <Reveal className="on-dark svc-card mt-10 flex flex-col gap-6 border-0 bg-gradient-to-br from-berry to-berrydark p-7 text-cream shadow-lift sm:p-10 md:flex-row md:items-center md:gap-10">
        <p className="font-display text-stat font-medium text-cream">{offer.figure}</p>
        <div>
          {badge && <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{badge}</span>}
          <h3 className="mt-3 font-display text-2xl font-medium">{offer.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/90 sm:text-base">{offer.terms}</p>
          {links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cream underline underline-offset-4">
                    {link.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    );
  }

  return (
    <div className="mt-10">
      <SnapRow className={cn('md:gap-5', OFFER_COLUMNS[offers.length])}>
        {offers.map((offer, i) => (
          <Reveal key={offer.title} delay={i * 0.05} className="svc-card h-full bg-gradient-to-br from-blush via-cream to-mint p-6">
            <p className="font-display text-stat font-medium text-berry">{offer.figure}</p>
            <h3 className="mt-3 text-base font-semibold text-ink">
              {offer.href ? (
                <a href={offer.href} className="inline-flex min-h-11 items-center text-berry underline underline-offset-4 md:min-h-0">
                  {offer.title}
                </a>
              ) : (
                offer.title
              )}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{offer.terms}</p>
          </Reveal>
        ))}
      </SnapRow>
    </div>
  );
}

/** Image cards with the title on the photo. */
export function RelatedServiceCards({ items }: { items: Array<{ href: string; label: string; text: string; image: ServicePageContent['hero']['image'] }> }) {
  return (
    <div className="mt-10">
      <SnapRow className="md:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.href} delay={i * 0.05}>
            <a href={item.href} className="svc-card svc-card-hover group relative block aspect-photo overflow-hidden">
              <Picture
                image={item.image}
                decorative
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30" />
              <span className="absolute inset-x-5 bottom-5 text-cream">
                <span className="block font-display text-xl font-medium">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-cream/90">{item.text}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium">
                  Explore
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </SnapRow>
    </div>
  );
}

/** Closing band: large headline and the two ways to book. */
export function CTABand({
  title,
  whatsappHref,
  phone = { href: PICK_CALL, label: 'a salon' },
  secondary,
  directionsHref,
  book,
}: {
  title: string;
  whatsappHref: string;
  phone?: { href: string; label: string };
  /** Replaces the Call button, e.g. with a link to an external site. */
  secondary?: { label: string; href: string };
  /** A third button with directions, on a page about one salon. */
  directionsHref?: string;
  /** Replaces the Call button with one that opens the booking form. */
  book?: { label: string; onClick: () => void };
}) {
  return (
    <section aria-labelledby="cta-title" className="on-dark relative overflow-hidden bg-gradient-to-br from-berry via-berrydark to-ink py-16 lg:py-24">
      <Floral className="-left-10 -top-10 h-56 rotate-180 text-cream/20" />
      <Floral flip className="-right-10 -top-10 h-56 rotate-180 text-cream/20" />
      <Reveal className="container-site relative flex flex-col items-center gap-8 text-center">
        <h2 id="cta-title" className="max-w-3xl text-balance font-display text-hero font-medium text-cream">
          {title}
        </h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-4">
          <Button variant="light" href={whatsappHref} external arrow={false}>
            <WhatsAppIcon className="size-4" />
            Book on WhatsApp
          </Button>
          {book ? (
            <Button variant="outlineLight" onClick={book.onClick} arrow={false}>
              <CalendarDays aria-hidden className="size-4" />
              {book.label}
            </Button>
          ) : secondary ? (
            <Button variant="outlineLight" href={secondary.href} external rel="noopener" arrow={false}>
              {secondary.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </Button>
          ) : (
            <Button variant="outlineLight" href={phone.href} arrow={false}>
              <Phone aria-hidden className="size-4" />
              Call {phone.label}
            </Button>
          )}
          {directionsHref && (
            <Button variant="outlineLight" href={directionsHref} external arrow={false}>
              <Navigation aria-hidden className="size-4" />
              Directions
            </Button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
