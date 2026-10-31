import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { ServiceItem, ServiceList } from '../../data/services';
import { onTabKeyDown } from '../../lib/a11y';
import { cn } from '../../lib/cn';
import { hasPage, serviceHref } from '../../lib/route';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/Decor';
import { Eyebrow, Reveal } from '../ui/Primitives';
import { ICONS } from './icons';
import type { Tone } from './SectionHeader';

interface ServiceTabsProps {
  lists: ServiceList[];
  active: number;
  onSelect: (index: number) => void;
}

/** Pill-style category switcher, e.g. Haircuts | Beard | Colour | Add-ons. */
export function ServiceTabs({ lists, active, onSelect }: ServiceTabsProps) {
  return (
    <div role="tablist" aria-label="Service categories" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {lists.map((list, i) => {
        const selected = i === active;
        return (
          <button
            key={list.title}
            type="button"
            role="tab"
            id={`service-tab-${i}`}
            aria-selected={selected}
            aria-controls={`service-panel-${i}`}
            tabIndex={selected ? 0 : -1}
            onClick={(e) => {
              onSelect(i);
              // Keep the chosen tab in view when the row is scrolled sideways.
              e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            }}
            onKeyDown={(e) => onTabKeyDown(e, i, lists.length, onSelect)}
            className={cn(
              'relative min-h-11 shrink-0 rounded-full border px-5 text-sm font-medium transition-colors duration-200',
              selected ? 'border-berry text-cream' : 'border-ink/15 bg-white text-ink hover:border-berry hover:text-berry',
            )}
          >
            {selected && (
              <motion.span
                layoutId="service-category-pill"
                className="absolute inset-0 rounded-full bg-berry"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{list.title}</span>
          </button>
        );
      })}
    </div>
  );
}

interface ServiceCardGridProps {
  list: ServiceList;
  /** WhatsApp link for one service. */
  bookHref: (item: ServiceItem) => string;
  cta: string;
  /** Two large cards per row instead of three. */
  large?: boolean;
  /** One full-width card, for a service with a single signature treatment. */
  wide?: boolean;
  /** Smaller cards, two per row from 390px wide. */
  compact?: boolean;
}

/** One card per service: icon panel, name, description, tags and a single text link. */
export function ServiceCardGrid({ list, bookHref, cta, large = false, wide = false, compact = list.compact ?? false }: ServiceCardGridProps) {
  const swipes = list.items.length > 1;
  return (
    <ul data-swipe={swipes || undefined} className={cn('grid gap-5', swipes && 'max-sm:no-scrollbar max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:scroll-px-4 max-sm:px-4 max-sm:pb-2', compact && 'gap-3 min-[390px]:grid-cols-2 sm:gap-5', !wide && 'sm:grid-cols-2', !wide && !large && 'lg:grid-cols-3')}>
      {list.items.map((item, i) => (
        <li key={item.name} className={cn(swipes && 'max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start')}>
          <Reveal delay={i * 0.05} className="h-full">
            <ServiceCard item={item} list={list} bookHref={bookHref} cta={cta} large={large} wide={wide} compact={compact} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function ServiceCard({ item, list, bookHref, cta, large, wide, compact }: ServiceCardGridProps & { item: ServiceItem }) {
  const [variant, setVariant] = useState(0);
  const Icon = ICONS[item.icon ?? 'scissors'];
  // A service with its own page links there instead of opening WhatsApp, and stands out from its neighbours.
  const ownPage = item.page && hasPage(item.page) ? serviceHref(item.page) : null;
  const badge = item.badge ?? list.badge;
  // The version picked on the card (e.g. "Pedicure") goes into the booking message.
  const booked = list.variants ? { ...item, name: `${item.name} ${list.variants[variant].name}` } : item;

  return (
    <article
      className={cn(
        'svc-card svc-card-hover group relative flex h-full flex-col overflow-hidden',
        wide && 'md:flex-row',
        ownPage && 'border-berry ring-1 ring-berry',
      )}
    >
      <div
        className={cn(
          'relative grid shrink-0 place-items-center bg-gradient-to-br from-blush to-mint text-berry',
          wide ? 'h-40 md:h-auto md:w-2/5' : large ? 'h-44' : compact ? 'h-20 sm:h-32' : 'h-32',
        )}
      >
        <Icon aria-hidden className={large ? 'size-20' : compact ? 'size-10 sm:size-14' : 'size-14'} strokeWidth={1} />
        {badge && <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-medium text-berry">{badge}</span>}
      </div>
      <div className={cn('flex flex-1 flex-col sm:p-6', compact ? 'p-4' : 'p-5')}>
        <h3 className={cn('font-display font-medium text-ink', compact ? 'text-lg sm:text-xl' : 'text-xl')}>{item.name}</h3>
        {item.text && <p className={cn('mt-2 text-sm leading-relaxed text-muted', compact && 'line-clamp-2 sm:line-clamp-none')}>{item.text}</p>}
        {item.tags && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-blush px-3 py-1 text-xs text-berrydark">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {list.variants && (
          // Sits above the card-wide link so its buttons stay tappable.
          <div role="group" aria-label={`${item.name}: choose a version`} className="relative z-10 mt-4 grid grid-cols-3 rounded-full bg-blush p-1">
            {list.variants.map((option, v) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={v === variant}
                onClick={() => setVariant(v)}
                className={cn(
                  'min-h-11 rounded-full px-2 text-sm font-medium transition-colors duration-200',
                  v === variant ? 'bg-berry text-cream shadow-soft' : 'text-berrydark hover:text-berry',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        {/* The link's ::after covers the card, so the whole card is one tap target. */}
        <a
          href={ownPage ?? bookHref(booked)}
          {...(!ownPage && { target: '_blank', rel: 'noopener noreferrer' })}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-medium text-berry after:absolute after:inset-0"
        >
          {ownPage ? (item.cta ?? 'Explore') : cta}
          {!(ownPage && item.cta) && <span className="sr-only">: {booked.name}</span>}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
        </a>
      </div>
    </article>
  );
}

interface ServiceCardsProps extends Omit<ServiceCardGridProps, 'list'> {
  lists: ServiceList[];
  notes: string[];
  tone: Tone;
  askHref: string;
  askText?: string;
  /** Replaces the WhatsApp button in the strip, e.g. with an external portfolio link. */
  askButton?: { label: string; href: string };
  /** One-line pointer to neighbouring service pages, shown under the cards when at least one link is live. */
  moreLink?: { text: string; links: Array<{ href: string; label: string }> };
}

/** The services of one page: category tabs (when there is more than one), the card grid and one section CTA. */
export function ServiceCards({
  lists,
  notes,
  tone,
  askHref,
  askText = 'Not sure what to pick? Ask our stylist on WhatsApp.',
  askButton,
  moreLink,
  ...grid
}: ServiceCardsProps) {
  const [active, setActive] = useState(0);

  return (
    <>
      {lists.length > 1 && (
        // Stays under the header while the cards scroll past.
        <div className={cn('under-header sticky z-20 -mx-4 mt-6 px-4 py-3 backdrop-blur md:mx-0 md:px-0', tone === 'tint' ? 'bg-blush/90' : 'bg-cream/90')}>
          <ServiceTabs lists={lists} active={active} onSelect={setActive} />
        </div>
      )}

      {lists.map((list, i) => (
        // Inactive panels stay in the page (hidden), so every service is still in the HTML.
        <div
          key={list.title}
          id={`service-panel-${i}`}
          role={lists.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={lists.length > 1 ? `service-tab-${i}` : undefined}
          hidden={i !== active}
          className="mt-6"
        >
          {list.allLengths && <p className="mb-5 text-sm text-muted">Available for all hair lengths.</p>}
          <ServiceCardGrid list={list} {...grid} wide={lists.length === 1 && list.items.length === 1} />
          {list.note && <p className="mt-4 text-xs text-muted">{list.note}</p>}
          {list.link && hasPage(list.link.slug) && (
            <a href={serviceHref(list.link.slug)} className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline">
              {list.link.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </a>
          )}
        </div>
      ))}

      {notes.length > 0 && (
        <ul className="mt-5 space-y-1 text-xs leading-relaxed text-muted">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      {moreLink && moreLink.links.length > 0 && (
        <div className="svc-card mt-8 flex flex-wrap items-center justify-between gap-3 p-5 text-sm sm:p-6">
          <span className="text-ink">{moreLink.text}</span>
          <span className="flex flex-wrap gap-x-6">
            {moreLink.links.map((link) => (
              <a key={link.href} href={link.href} className="group inline-flex min-h-11 items-center gap-2 font-medium text-berry">
                {link.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
              </a>
            ))}
          </span>
        </div>
      )}

      <Reveal className="svc-card mt-8 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="font-display text-xl font-medium text-ink">{askText}</p>
        {askButton ? (
          <Button href={askButton.href} external rel="noopener" arrow={false} className="w-full shrink-0 sm:w-auto">
            {askButton.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Button>
        ) : (
          <Button href={askHref} external arrow={false} className="w-full shrink-0 sm:w-auto">
            <WhatsAppIcon className="size-4" />
            Chat on WhatsApp
          </Button>
        )}
      </Reveal>
    </>
  );
}

interface FeaturedComboCardProps {
  title: string;
  text: string;
  includes: string[];
  bookHref: string;
  badge?: string;
  cta?: string;
  /** Optional links to related service pages. */
  links?: Array<{ label: string; href: string }>;
  /** Links to other pages, shown instead of the booking button. */
  actions?: Array<{ label: string; href: string }>;
}

/** Full-width featured card for a combo or offer: what is included, as a checklist. No price. */
export function FeaturedComboCard({ title, text, includes, bookHref, badge = 'Combo', cta = 'Book this combo', links = [], actions }: FeaturedComboCardProps) {
  return (
    <Reveal
      className={cn(
        'on-dark svc-card grid gap-8 border-0 bg-gradient-to-br from-berry to-berrydark p-7 text-cream shadow-lift sm:p-10 lg:items-center lg:gap-12',
        includes.length > 0 && 'lg:grid-cols-2',
      )}
    >
      <div>
        <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{badge}</span>
        <h2 className="heading mt-4 text-balance text-cream">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-cream/90 sm:text-base">{text}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {actions?.length ? (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              {actions.map((action, i) => (
                <Button key={action.href} variant={i === 0 ? 'light' : 'outlineLight'} href={action.href}>
                  {action.label}
                </Button>
              ))}
            </div>
          ) : (
            <Button variant="light" href={bookHref} external>
              {cta}
            </Button>
          )}
          {links.map((link) => (
            <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cream underline underline-offset-4">
              About our {link.label}
              <ArrowRight aria-hidden className="size-4" />
            </a>
          ))}
        </div>
      </div>
      {includes.length > 0 && (
      <div>
        <Eyebrow tone="dark">What’s included</Eyebrow>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {includes.map((entry) => (
            <li key={entry} className="flex items-center gap-3 text-sm">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cream/15">
                <Check aria-hidden className="size-4" />
              </span>
              {entry}
            </li>
          ))}
        </ul>
      </div>
      )}
    </Reveal>
  );
}
