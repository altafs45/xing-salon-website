import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBooking } from '../context/booking';
import { serviceMenu, services } from '../data/content';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { hasPage, serviceHref } from '../lib/route';
import { ArrowLink, Button } from './ui/Button';
import { Eyebrow, Picture, Reveal, SectionIntro } from './ui/Primitives';

type Service = (typeof services.items)[number];

const MENU_ID = 'service-menu';

function ServiceCard({ service, onExplore }: { service: Service; onExplore: () => void }) {
  // A card with its own service page links there; the others open their category in the menu below.
  const page = service.page && hasPage(service.page) ? service.page : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden">
        {page && service.badge && (
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
          href={page ? serviceHref(page) : `#${MENU_ID}`}
          onClick={page ? undefined : onExplore}
          className="mt-1 inline-flex min-h-11 items-center gap-2 self-start text-xs font-medium text-berry after:absolute after:inset-0 md:mt-3 md:min-h-0"
        >
          {page ? 'View services' : 'Explore'}
          <span className="sr-only"> {page ? `in ${service.title}` : `${service.title} services`}</span>
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none"
          />
        </a>
      </div>
    </article>
  );
}

function ServiceMenu({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const booking = useBooking();
  const category = serviceMenu[active];

  return (
    <div id={MENU_ID} className="mt-12 scroll-mt-header lg:mt-14">
      <Reveal>
        <Eyebrow>{services.menuEyebrow}</Eyebrow>
        <h3 className="heading mt-3 text-ink">{services.menuTitle}</h3>

        <div
          role="tablist"
          aria-label="Service categories"
          className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
        >
          {serviceMenu.map((entry, i) => {
            const selected = i === active;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`service-tab-${entry.id}`}
                aria-selected={selected}
                aria-controls="service-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(i)}
                onKeyDown={(e) => onTabKeyDown(e, i, serviceMenu.length, onSelect)}
                className={cn(
                  'relative min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200 md:min-h-0',
                  selected ? 'border-berry text-cream' : 'border-ink/15 text-ink hover:border-berry hover:text-berry',
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="service-tab-pill"
                    className="absolute inset-0 rounded-full bg-berry"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{entry.label}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="service-panel"
          aria-labelledby={`service-tab-${category.id}`}
          tabIndex={0}
          className="mt-5 overflow-hidden rounded-card bg-white shadow-soft"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="p-5 sm:p-7"
            >
              <div className="gap-x-10 sm:columns-2 lg:columns-3">
                {category.sections.map((section) => (
                  <div key={section.title || category.id} className="mb-6 break-inside-avoid">
                    <h4 className="font-display text-xl font-medium text-berry">{section.title || category.label}</h4>
                    <ul className="mt-2 divide-y divide-ink/10 border-t border-ink/10">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 py-2.5 text-sm text-ink">
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
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  const openCategory = (id: string) => setActive(Math.max(0, serviceMenu.findIndex((entry) => entry.id === id)));

  return (
    <section id="services" className="section bg-cream">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <SectionIntro eyebrow={services.eyebrow} title={services.title} text={services.text} className="lg:col-span-3">
            <ArrowLink href={`#${MENU_ID}`}>{services.cta}</ArrowLink>
          </SectionIntro>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:col-span-9 lg:gap-5">
            {services.items.map((service, i) => (
              <li key={service.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <ServiceCard service={service} onExplore={() => openCategory(service.opens)} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <ServiceMenu active={active} onSelect={setActive} />
      </div>
    </section>
  );
}
