import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import { useBooking } from '../context/booking';
import { hairColor } from '../data/content';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { ArrowLink, Button } from './ui/Button';
import { Picture, Reveal, SectionIntro } from './ui/Primitives';

export function HairColor() {
  const booking = useBooking();
  const [active, setActive] = useState(0);
  const option = hairColor.options[active];

  return (
    <section id="hair-color" className="section bg-blush">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
        <SectionIntro eyebrow={hairColor.eyebrow} title={hairColor.title} text={hairColor.text} className="lg:col-span-4">
          <ArrowLink href="#transformations">{hairColor.cta}</ArrowLink>
        </SectionIntro>

        <Reveal className="lg:col-span-8">
          <div role="tablist" aria-label="Hair color options" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {hairColor.options.map((entry, i) => {
              const selected = i === active;
              return (
                <button
                  key={entry.name}
                  type="button"
                  role="tab"
                  id={`color-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="color-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i, hairColor.options.length, setActive)}
                  className="group flex flex-col items-center rounded-card text-center"
                >
                  <span
                    className={cn(
                      'block size-28 overflow-hidden rounded-full ring-2 ring-offset-4 ring-offset-blush transition duration-300 md:size-32',
                      selected ? 'ring-berry' : 'ring-transparent group-hover:ring-berry/40',
                    )}
                  >
                    <Picture
                      image={entry.image}
                      decorative
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>
                  <span className={cn('mt-4 text-sm font-semibold', selected ? 'text-berry' : 'text-ink')}>
                    {entry.name}
                  </span>
                  <span className="mt-1 max-w-40 text-xs leading-relaxed text-muted">{entry.caption}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="color-panel"
            aria-labelledby={`color-tab-${active}`}
            tabIndex={0}
            className="mt-8 overflow-hidden rounded-card bg-cream shadow-soft"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid gap-5 p-5 sm:p-6 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-6">
                  <h3 className="font-display text-2xl font-medium text-ink">{option.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{option.description}</p>
                </div>
                <dl className="space-y-3 text-sm md:col-span-4">
                  <div>
                    <dt className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
                      <Heart aria-hidden className="size-4 shrink-0 text-berry" />
                      Ideal for
                    </dt>
                    <dd className="pl-7 text-ink">{option.idealFor}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
                      <Clock aria-hidden className="size-4 shrink-0 text-berry" />
                      Duration
                    </dt>
                    <dd className="pl-7 text-ink">{option.duration}</dd>
                  </div>
                </dl>
                <div className="md:col-span-2 md:justify-self-end">
                  <Button size="sm" onClick={() => booking.open(option.bookAs)}>
                    Book this
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
