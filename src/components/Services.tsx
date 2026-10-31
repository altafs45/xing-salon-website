import { Fragment, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Search, Sparkles, X } from 'lucide-react';
import { useBooking } from '../context/booking';
import { serviceMenu, services } from '../data/content';
import type { IconKey } from '../data/pages/types';
import { servicesHubPath } from '../data/services';
import { cn } from '../lib/cn';
import { hasPage, serviceHref } from '../lib/route';
import { ICONS } from './service/icons';
import { ArrowLink, Button } from './ui/Button';
import { Eyebrow, Picture, Reveal, SectionIntro } from './ui/Primitives';

type Service = (typeof services.items)[number];
type Category = (typeof serviceMenu)[number];

const MENU_ID = 'service-menu';
const SEARCH_ID = 'service-search';

/** Icon on each category card, by `serviceMenu` id. */
const CATEGORY_ICONS: Record<string, IconKey> = {
  haircuts: 'scissors',
  styling: 'wind',
  'hair-color': 'palette',
  'hair-treatments': 'waves',
  'hair-spa': 'droplets',
  'skin-care': 'sparkles',
  'body-polish': 'sun',
  waxing: 'zap',
  'beauty-essentials': 'brush',
  'mani-pedi': 'heart',
  nails: 'nail-almond',
  'men-grooming': 'users',
  tattoo: 'flame',
};

const countItems = (category: Category) => category.sections.reduce((n, section) => n + section.items.length, 0);

/** Categories matching the search; a category matched only by its items keeps just those items. */
function filterMenu(query: string): Category[] {
  const q = query.trim().toLowerCase();
  if (!q) return serviceMenu;
  return serviceMenu.flatMap((category) => {
    if (category.label.toLowerCase().includes(q)) return [category];
    const sections = category.sections.flatMap((section) => {
      if (section.title.toLowerCase().includes(q)) return [section];
      const items = section.items.filter((item) => item.toLowerCase().includes(q));
      return items.length ? [{ ...section, items }] : [];
    });
    return sections.length ? [{ ...category, sections }] : [];
  });
}

/** A category card; the whole card links to its category page. */
function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden">
        {service.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">{service.badge}</span>
        )}
        <Picture
          image={service.image}
          className="aspect-photo w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">{service.title}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{service.text}</p>
        <a
          href={service.href}
          className="mt-1 inline-flex min-h-11 items-center gap-2 self-start text-xs font-medium text-berry after:absolute after:inset-0 md:mt-3 md:min-h-0"
        >
          View services
          <span className="sr-only"> in {service.title}</span>
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none"
          />
        </a>
      </div>
    </article>
  );
}

function CategoryPanel({ category }: { category: Category }) {
  const booking = useBooking();
  // A lone sub-group splits its own items into two columns; several sub-groups sit side by side instead.
  const single = category.sections.length === 1;

  return (
    <div className="rounded-card bg-white p-5 shadow-soft sm:p-7">
      <div className={cn('gap-x-10', !single && 'sm:columns-2')}>
        {category.sections.map((section) => (
          <div key={section.title || category.id} className="mb-6 break-inside-avoid">
            <h4 className="font-display text-xl font-medium text-berry">{section.title || category.label}</h4>
            <ul className={cn('mt-2 gap-x-10 border-t border-ink/10', single && 'sm:columns-2')}>
              {section.items.map((item) => (
                <li key={item} className="flex break-inside-avoid items-center gap-3 border-b border-ink/10 py-2.5 text-sm text-ink">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          {category.note && <span className="block text-ink">{category.note}</span>}
          {services.menuNote}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {category.page && hasPage(category.page) && (
            <ArrowLink href={serviceHref(category.page)} className="text-xs">
              More about {category.label}
            </ArrowLink>
          )}
          <Button size="sm" onClick={() => booking.open(category.bookAs)}>
            Book {category.label}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ServiceMenuProps {
  openId: string | null;
  query: string;
  /** Holds the id of a category whose card should scroll into view on phones once its panel has opened. */
  scrollTo: MutableRefObject<string | null>;
  onToggle: (id: string) => void;
  onQuery: (query: string) => void;
}

function ServiceMenu({ openId, query, scrollTo, onToggle, onQuery }: ServiceMenuProps) {
  const results = useMemo(() => filterMenu(query), [query]);
  const term = query.trim();

  const scrollToCard = (id: string) => {
    if (scrollTo.current !== id) return;
    scrollTo.current = null;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`service-card-${id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div id={MENU_ID} className="mt-12 scroll-mt-header lg:mt-14">
      <Reveal>
        <Eyebrow>{services.menuEyebrow}</Eyebrow>
        <h3 className="heading mt-3 text-ink">{services.menuTitle}</h3>

        <div className="relative mt-6 sm:max-w-sm">
          <label htmlFor={SEARCH_ID} className="sr-only">
            {services.menuSearch}
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            id={SEARCH_ID}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            placeholder={services.menuSearch}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) onQuery('');
            }}
            className="h-12 w-full rounded-full border border-ink/15 bg-white pl-11 pr-12 text-base text-ink placeholder:text-muted focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/25 md:text-sm"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onQuery('');
                document.getElementById(SEARCH_ID)?.focus();
              }}
              className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-berry"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>

        <div role="status" aria-live="polite">
          {results.length === 0 ? (
            <p className="mt-5 rounded-card bg-white p-6 text-center text-sm text-muted shadow-soft">
              <span className="block font-display text-xl font-medium text-ink">{services.menuEmpty}</span>
              Nothing matches “{term}”. Try another word.
            </p>
          ) : (
            term && (
              <p className="sr-only">
                {results.length} {results.length === 1 ? 'category' : 'categories'} found
              </p>
            )
          )}
        </div>

        {/* Each panel follows its card in the markup and spans every column; dense flow lets the next cards
            fill the rest of that card's row, so the panel lands just below the row. */}
        <div className="-mb-3 mt-5 grid grid-flow-row-dense grid-cols-2 gap-x-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((category) => {
            const expanded = category.id === openId;
            const Icon = ICONS[CATEGORY_ICONS[category.id]] ?? Sparkles;
            const count = countItems(category);
            return (
              <Fragment key={category.id}>
                <div className="pb-3">
                  <button
                    type="button"
                    id={`service-card-${category.id}`}
                    aria-expanded={expanded}
                    aria-controls={`service-panel-${category.id}`}
                    onClick={() => onToggle(category.id)}
                    className={cn(
                      'relative flex h-full w-full scroll-mt-header flex-col items-start gap-2.5 rounded-card border p-3.5 text-left transition-colors duration-200 sm:flex-row sm:items-center sm:gap-3',
                      expanded ? 'border-berry bg-berry text-cream' : 'border-ink/10 bg-white text-ink hover:border-berry',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-200',
                        expanded ? 'bg-white/15 text-cream' : 'bg-blush text-berry',
                      )}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug">{category.label}</span>
                      <span className={cn('mt-0.5 block text-xs', expanded ? 'text-cream/80' : 'text-muted')}>
                        {count} {count === 1 ? 'service' : 'services'}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        'absolute right-3.5 top-3.5 size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none sm:static',
                        expanded ? 'rotate-180 text-cream' : 'text-berry',
                      )}
                    />
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`service-panel-${category.id}`}
                      role="region"
                      aria-labelledby={`service-card-${category.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      onAnimationComplete={() => scrollToCard(category.id)}
                      className="col-span-full -mx-4 overflow-hidden px-4"
                    >
                      {/* The padding leaves room for the card's shadow inside the clipped box. */}
                      <div className="pb-6 pt-1">
                        <CategoryPanel category={category} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

export function Services() {
  const [openId, setOpenId] = useState<string | null>(serviceMenu[0].id);
  const [query, setQuery] = useState('');
  const scrollTo = useRef<string | null>(null);

  const toggle = (id: string) => {
    scrollTo.current = id === openId ? null : id;
    setOpenId(id === openId ? null : id);
  };
  const search = (value: string) => {
    setQuery(value);
    // Keep a panel open while typing: when the open category drops out of the results, open the first match.
    const results = filterMenu(value);
    if (!results.some((category) => category.id === openId)) setOpenId(results[0]?.id ?? null);
  };

  return (
    <section id="services" className="section bg-cream">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <SectionIntro eyebrow={services.eyebrow} title={services.title} text={services.text} className="lg:col-span-3">
            <ArrowLink href={servicesHubPath}>{services.cta}</ArrowLink>
          </SectionIntro>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:col-span-9 lg:gap-5">
            {services.items.map((service, i) => (
              <li key={service.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <ServiceCard service={service} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <ServiceMenu openId={openId} query={query} scrollTo={scrollTo} onToggle={toggle} onQuery={search} />
      </div>
    </section>
  );
}
