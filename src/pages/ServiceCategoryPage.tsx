// /services/hair-care, /services/skin-body, /services/nail-care. The whole page is plain links and images, so the
// build writes all of it as HTML (SHELLS in vite.config.ts) and it works before, or without, any script. Script
// only adds the chip bar's moving highlight and edge fades.
import { useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { CategoryHero } from '../components/services/CatalogueHero';
import { ServiceListingCard } from '../components/services/ServiceListingCard';
import { categories, type ServiceCategory } from '../data/services';
import { useHasShell } from '../hooks/useHasShell';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../lib/cn';

const CHIP = 'inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-base font-medium transition-colors duration-150 motion-reduce:transition-none md:text-sm';
const CHIP_ON = 'border-berry bg-berry text-cream';
const CHIP_OFF = 'border-ink/15 bg-white text-ink hover:border-berry';

/** Everything below the hero: the chip bar (for a category with several groups), each group's cards, and links on. */
export function CategoryBody({ category }: { category: ServiceCategory }) {
  const grouped = category.groups.length > 1;
  const others = categories.filter((entry) => entry.key !== category.key);
  return (
    <>
      {grouped && (
        // Sticks under the header (or the top of the screen while the header hides); the chips scroll inside it.
        <nav aria-label={`${category.title} groups`} className="under-header sticky z-20 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
          <div className="container-site">
            <div data-chip-row className="no-scrollbar flex gap-2 overflow-x-auto py-2.5">
              {category.groups.map((group, i) => (
                <a key={group.key} href={`#${group.key}`} data-chip={group.key} aria-current={i === 0 ? 'true' : undefined} className={cn(CHIP, i === 0 ? CHIP_ON : CHIP_OFF)}>
                  {group.chip ?? group.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {category.groups.map((group, i) => (
        // scroll-mt: room for the chip bar, on top of the header's own room, when a chip jumps here.
        <section key={group.key} id={group.key} aria-labelledby={`${group.key}-title`} className={cn('scroll-mt-16 py-12 lg:py-16', i % 2 === 0 ? 'bg-cream' : 'bg-blush')}>
          <div className="container-site">
            <h2 id={`${group.key}-title`} className="heading text-balance text-ink">
              {group.title ?? `All ${category.title} Services`}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.services.map((service, j) => (
                <li key={service.slug}>
                  {/* The first card's photo can show on the first screen, so it loads straight away. */}
                  <ServiceListingCard service={service} priority={i === 0 && j === 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section aria-labelledby="more-categories" className="bg-cream py-12">
        <div className="container-site">
          <h2 id="more-categories" className="font-display text-2xl font-medium text-ink">
            Explore More at XING
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((entry) => (
              <li key={entry.key}>
                <a href={entry.path} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-berry/10 bg-white px-5 py-3 text-base font-medium text-ink shadow-soft hover:border-berry/40">
                  {entry.title}
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-berry" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/** The chip bar's script: the chip for the group on screen lights up and scrolls into view; edges fade when there's more. */
function useChipBar(category: ServiceCategory) {
  const ids = useMemo(() => category.groups.map((group) => group.key), [category]);
  const active = useScrollSpy(ids);

  useEffect(() => {
    const row = document.querySelector<HTMLElement>('[data-chip-row]');
    if (!row) return;
    const update = () => {
      const start = row.scrollLeft > 2;
      const end = row.scrollLeft + row.clientWidth < row.scrollWidth - 2;
      const mask = `linear-gradient(to right, ${start ? 'transparent' : 'black'}, black 24px, black calc(100% - 24px), ${end ? 'transparent' : 'black'})`;
      row.style.maskImage = mask;
      row.style.setProperty('-webkit-mask-image', mask);
    };
    update();
    row.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const row = document.querySelector<HTMLElement>('[data-chip-row]');
    row?.querySelectorAll<HTMLElement>('[data-chip]').forEach((chip) => {
      const on = chip.dataset.chip === active;
      chip.className = cn(CHIP, on ? CHIP_ON : CHIP_OFF);
      if (on) {
        chip.setAttribute('aria-current', 'true');
        row.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
      } else chip.removeAttribute('aria-current');
    });
  }, [active]);
}

export default function ServiceCategoryPage({ category }: { category: ServiceCategory }) {
  const hasShell = useHasShell();
  useChipBar(category);
  // With the build's HTML in place there is nothing to draw; without it, draw the same page.
  return hasShell ? null : (
    <>
      <CategoryHero category={category} />
      <CategoryBody category={category} />
    </>
  );
}
