import { ArrowRight } from 'lucide-react';
import { HubHero } from '../components/services/CatalogueHero';
import { ICONS } from '../components/service/icons';
import { categories, servicesIn } from '../data/services';
import { useHasShell } from '../hooks/useHasShell';
import { serviceHref } from '../lib/route';

/** How many services each category card lists before "View all". */
const TOP = 4;

/** /services: one card per category, each with its first few services and a link to the rest. */
export default function ServicesHubPage() {
  const hasShell = useHasShell();
  return (
    <>
      {!hasShell && <HubHero />}
      <section aria-label="Service categories" className="bg-cream pb-14 lg:pb-24">
        <div className="container-site">
          <ul data-swipe className="grid gap-5 md:grid-cols-2 max-sm:no-scrollbar max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:scroll-px-4 max-sm:px-4 max-sm:pb-2">
            {categories.map((category) => {
              const Icon = ICONS[category.icon];
              const all = servicesIn(category);
              return (
                <li key={category.key} className="max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start flex flex-col rounded-3xl border border-berry/10 bg-white p-5 shadow-soft sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
                      <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                    </span>
                    <h2 className="font-display text-3xl font-medium text-ink">
                      <a href={category.path} className="hover:text-berry">
                        {category.title}
                      </a>
                    </h2>
                  </div>
                  <p className="mt-3 text-base text-muted max-sm:line-clamp-3">{category.intro}</p>
                  <ul className="mt-4 flex-1 divide-y divide-ink/10">
                    {all.slice(0, TOP).map((service) => (
                      <li key={service.slug}>
                        <a href={serviceHref(service.slug)} className="flex min-h-14 items-center justify-between gap-3 py-2">
                          <span className="min-w-0">
                            <span className="block text-base font-medium text-ink">{service.menuLabel}</span>
                            <span className="block truncate text-sm text-muted">{service.blurb}</span>
                          </span>
                          <ArrowRight aria-hidden className="size-4 shrink-0 text-berry" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={category.path}
                    className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-berry px-5 text-base font-semibold text-berry transition-colors hover:bg-berry hover:text-cream md:text-sm"
                  >
                    {category.hasPage ? `View all ${category.title} (${all.length})` : `Visit the ${category.title} Studio`}
                    <ArrowRight aria-hidden className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
