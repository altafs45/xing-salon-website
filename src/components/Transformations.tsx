import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { footer, transformations } from '../data/content';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { BeforeAfter } from './BeforeAfter';
import { ArrowLink } from './ui/Button';
import { Eyebrow, Reveal } from './ui/Primitives';

const INSTAGRAM_URL = footer.socials[0].href;

export function Transformations() {
  const [active, setActive] = useState(0);
  const { categories } = transformations;
  const category = categories[active];

  return (
    <section id="transformations" className="section bg-cream">
      <div className="container-site">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>{transformations.eyebrow}</Eyebrow>
            <h2 className="heading mt-3 text-ink">{transformations.title}</h2>
          </div>

          <div
            role="tablist"
            aria-label="Transformation categories"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:px-0"
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
                    <motion.span
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

          <ArrowLink href={INSTAGRAM_URL} external className="hidden lg:inline-flex">
            {transformations.cta}
          </ArrowLink>
        </Reveal>

        <div role="tabpanel" id="tf-panel" aria-labelledby={`tf-tab-${active}`} className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={category.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {category.items.map((item) => (
                <li key={item.caption}>
                  <BeforeAfter {...item} />
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center lg:hidden">
          <ArrowLink href={INSTAGRAM_URL} external>
            {transformations.cta}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
