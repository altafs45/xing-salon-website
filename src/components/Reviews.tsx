import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviews } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import { CountUp } from './ui/CountUp';
import { Eyebrow, Reveal } from './ui/Primitives';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;
const STARS = [0, 1, 2, 3, 4];

function Stars({ size }: { size: string }) {
  return (
    <span role="img" aria-label="5 out of 5 stars" className="flex gap-0.5 text-gold">
      {STARS.map((i) => (
        <Star key={i} aria-hidden className={cn('fill-current', size)} />
      ))}
    </span>
  );
}

export function Reviews() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const perView = isDesktop ? 3 : isTablet ? 2 : 1;
  const lastIndex = Math.max(0, reviews.items.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = Math.min(index, lastIndex);
  const canSlide = lastIndex > 0;

  useEffect(() => {
    if (!canSlide || paused || reduceMotion) return;
    const id = window.setInterval(() => setIndex((i) => (Math.min(i, lastIndex) + 1) % (lastIndex + 1)), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [canSlide, paused, reduceMotion, lastIndex]);

  const go = (delta: number) => setIndex(Math.min(lastIndex, Math.max(0, current + delta)));

  return (
    <section data-gallery id="reviews" className="section bg-cream">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal from="left" className="lg:col-span-3">
          <Eyebrow as="h2">{reviews.eyebrow}</Eyebrow>
          <div className="mt-4 flex items-center gap-4">
            <CountUp value={reviews.rating} decimals={1} className="text-stat font-semibold tabular-nums text-ink" />
            <div>
              <Stars size="size-5" />
              <p className="mt-1 text-sm text-muted">{reviews.ratingLabel}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-9">
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label="Client reviews"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            // A touch only holds the slides while the finger is down.
            onTouchEnd={() => setPaused(false)}
            onTouchCancel={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="overflow-hidden"
          >
            <motion.ul
              drag={canSlide ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD_PX) go(1);
                else if (info.offset.x > SWIPE_THRESHOLD_PX) go(-1);
              }}
              animate={{ x: `${(-100 / perView) * current}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              className={cn('flex', canSlide && 'cursor-grab touch-pan-y active:cursor-grabbing')}
            >
              {reviews.items.map((review, i) => (
                <li
                  key={review.name}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${reviews.items.length}`}
                  style={{ flexBasis: `${100 / perView}%` }}
                  className="shrink-0 p-2"
                >
                  <figure className="flex h-full flex-col rounded-card border border-ink/5 bg-white p-5 shadow-soft">
                    <Stars size="size-4" />
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">“{review.quote}”</blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-blush font-display text-xl text-berry">
                        {review.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{review.name}</span>
                        <span className="block text-xs text-muted">{reviews.source}</span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </motion.ul>

            {canSlide && (
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: lastIndex + 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show review ${i + 1}`}
                    aria-current={i === current ? 'true' : undefined}
                    onClick={() => setIndex(i)}
                    className="grid size-11 place-items-center md:size-6"
                  >
                    <span
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        i === current ? 'w-6 bg-berry' : 'w-2 bg-berry/30',
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
