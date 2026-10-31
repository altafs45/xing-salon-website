import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { footer, transformations } from '../data/content';
import { beforeAfter } from '../data/media';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { BeforeAfter } from './BeforeAfter';
import { ArrowLink } from './ui/Button';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';
import { SnapRow } from './ui/SnapRow';

const INSTAGRAM_URL = footer.socials[0].href;

export function Transformations() {
  const [active, setActive] = useState(0);
  const { categories } = transformations;
  const category = categories[active];

  return (
    <section id="transformations" className="section bg-cream">
      <div className="container-site">
        <Reveal>
          <div className="flex items-end justify-between gap-5">
            <div>
              <Eyebrow>{transformations.eyebrow}</Eyebrow>
              <h2 className="heading mt-3 text-ink">{transformations.title}</h2>
            </div>
            <ArrowLink href={INSTAGRAM_URL} external className="hidden lg:inline-flex">
              {transformations.cta}
            </ArrowLink>
          </div>

          <div
            role="tablist"
            aria-label="Transformation categories"
            className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0"
          >
            {categories.map((entry, i) => {
              const selected = i === active;
              return (
                <button
                  key={entry.label}
                  type="button"
                  role="tab"
                  id={`tf-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="tf-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i, categories.length, setActive)}
                  className={cn(
                    'relative min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200 md:min-h-0',
                    selected ? 'border-berry text-cream' : 'border-ink/15 text-ink hover:border-berry hover:text-berry',
                  )}
                >
                  {selected && (
                    <m.span
                      layoutId="tf-tab-pill"
                      className="absolute inset-0 rounded-full bg-berry"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{entry.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div role="tabpanel" id="tf-panel" aria-labelledby={`tf-tab-${active}`} className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <m.ul
              key={category.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
            >
              {category.items.map((item) => (
                <li key={item.image.src}>
                  <figure>
                    <Picture image={item.image} className="aspect-portrait w-full rounded-card object-cover shadow-soft" />
                    <figcaption className="mt-3 text-center text-xs font-medium text-ink">{item.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </m.ul>
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center lg:hidden">
          <ArrowLink href={INSTAGRAM_URL} external>
            {transformations.cta}
          </ArrowLink>
        </div>

        <div id="before-after" className="mt-14 scroll-mt-24 border-t border-ink/10 pt-12 md:mt-16 md:pt-14">
          <Reveal>
            <Eyebrow>{beforeAfter.eyebrow}</Eyebrow>
            <h3 className="heading mt-3 text-ink">{beforeAfter.title}</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{beforeAfter.text}</p>
          </Reveal>
          <div className="mt-8">
            <SnapRow className="md:grid-cols-3 md:gap-6">
              {beforeAfter.pairs.map((pair) => (
                <BeforeAfter key={pair.before.src} pair={pair} />
              ))}
            </SnapRow>
          </div>
        </div>
      </div>
    </section>
  );
}
