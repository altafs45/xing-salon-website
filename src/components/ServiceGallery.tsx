import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { serviceGallery } from '../data/media';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

const GRID_SIZES = '(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw';
const ARROW = 'absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-ink shadow-soft hover:text-berry';
/** A sideways swipe shorter than this is treated as a tap. */
const SWIPE_PX = 40;

/**
 * Photos of the salon's work, filtered by service. Each tab starts with a few photos and "Show more" adds
 * the rest; a photo opens larger, with arrows, arrow keys and swipe to move through its tab.
 */
export function ServiceGallery() {
  const { categories, initial } = serviceGallery;
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  // The photo stays in place while the dialog closes, so it doesn't empty mid-animation.
  const [shown, setShown] = useState(0);
  const touchX = useRef<number | null>(null);

  const items = categories[active].items;
  const visible = expanded ? items : items.slice(0, initial);
  const photo = items[shown] ?? items[0];

  const show = (index: number) => {
    setShown(index);
    setOpen(index);
  };
  const step = (by: number) => show((shown + by + items.length) % items.length);
  const pick = (index: number) => {
    setActive(index);
    setExpanded(false);
  };

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <section id="our-work" className="section bg-blush">
      <div className="container-site">
        <Reveal>
          <Eyebrow>{serviceGallery.eyebrow}</Eyebrow>
          <h2 className="heading mt-3 text-ink">{serviceGallery.title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{serviceGallery.text}</p>

          <div role="tablist" aria-label="Gallery categories" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0">
            {categories.map((entry, i) => {
              const selected = i === active;
              return (
                <button
                  key={entry.label}
                  type="button"
                  role="tab"
                  id={`work-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="work-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i, categories.length, pick)}
                  className={cn(
                    'min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200',
                    selected ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-cream text-ink hover:border-berry hover:text-berry',
                  )}
                >
                  {entry.label}
                  <span className="sr-only">, {entry.items.length} photos</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div role="tabpanel" id="work-panel" aria-labelledby={`work-tab-${active}`}>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {visible.map((item, i) => (
            <li key={item.src}>
              <button type="button" onClick={() => show(i)} aria-haspopup="dialog" className="group block w-full overflow-hidden rounded-card shadow-soft">
                <Picture
                  image={item}
                  sizes={GRID_SIZES}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="sr-only">View larger</span>
              </button>
            </li>
          ))}
        </ul>
        </div>

        {!expanded && items.length > initial && (
          <div className="mt-8 text-center">
            <Button variant="outline" arrow={false} onClick={() => setExpanded(true)}>
              {serviceGallery.moreLabel}
              <span className="sr-only"> {categories[active].label} photos</span> ({items.length - initial})
            </Button>
          </div>
        )}
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} label={`${photo.caption}, photo ${shown + 1} of ${items.length}`}>
        <figure
          className="relative"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const moved = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX);
            if (Math.abs(moved) > SWIPE_PX) step(moved < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {/* `touch-pinch-zoom` keeps two-finger zoom working on the photo. */}
          <Picture image={photo} eager sizes="(min-width: 640px) 544px, 100vw" className="max-h-[78dvh] w-full touch-pinch-zoom bg-ink object-contain" />
          <button type="button" aria-label="Close photo" onClick={() => setOpen(null)} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-cream/90 text-ink shadow-soft hover:text-berry">
            <X aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={cn(ARROW, 'left-3')}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)} className={cn(ARROW, 'right-3')}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
            <span className="font-medium text-ink">{photo.caption}</span>
            <span className="shrink-0 text-muted">
              {shown + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
      </Modal>
    </section>
  );
}
