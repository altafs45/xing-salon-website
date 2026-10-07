import { useCallback, useEffect, useState } from 'react';
import { Navigation, Phone, X } from 'lucide-react';
import { locations, site } from '../../data/content';
import { cn } from '../../lib/cn';
import { WhatsAppIcon } from '../ui/Decor';
import { Modal } from '../ui/Modal';

const ITEM = 'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium';

/**
 * Phones: WhatsApp, Call and Directions stay one tap away on every page.
 * The bar steps aside once the closing CTA band or the footer is on screen, so it never covers them.
 */
export function MobileStickyBar({
  whatsappHref,
  phoneHref = site.phoneHref,
  directionsHref,
}: {
  whatsappHref: string;
  phoneHref?: string;
  /** One venue's map link; without it, Directions asks which salon. */
  directionsHref?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  useEffect(() => {
    const inView = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? inView.add(entry.target) : inView.delete(entry.target)));
      setHidden(inView.size > 0);
    });
    document.querySelectorAll('[aria-labelledby="cta-title"], footer').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="Quick actions"
        // Removed from the tab order and from screen readers while it is off screen.
        {...(hidden && { inert: '' })}
        className={cn(
          'safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream shadow-lift transition-transform duration-300 motion-reduce:transition-none md:hidden',
          hidden && 'translate-y-full',
        )}
      >
        <div className="flex h-action-bar items-stretch">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={cn(ITEM, 'bg-berry text-cream active:bg-berrydark')}>
            <WhatsAppIcon className="size-5" />
            WhatsApp
          </a>
          <a href={phoneHref} className={cn(ITEM, 'text-ink active:bg-blush')}>
            <Phone aria-hidden className="size-5 text-berry" />
            Call
          </a>
          {directionsHref ? (
            <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={cn(ITEM, 'border-l border-ink/10 text-ink active:bg-blush')}>
              <Navigation aria-hidden className="size-5 text-berry" />
              Directions
            </a>
          ) : (
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setPickerOpen(true)}
              className={cn(ITEM, 'border-l border-ink/10 text-ink active:bg-blush')}
            >
              <Navigation aria-hidden className="size-5 text-berry" />
              Directions
            </button>
          )}
        </div>
      </nav>

      <Modal open={pickerOpen} onClose={closePicker} labelledBy="directions-title">
        <div className="safe-bottom p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="directions-title" className="font-display text-2xl font-medium text-ink">
              Directions to which salon?
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={closePicker}
              className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush hover:text-berry"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ul className="mt-4 divide-y divide-ink/10">
            {locations.map((loc) => (
              <li key={loc.id}>
                <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 py-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-berry">
                    <Navigation aria-hidden className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{loc.name}</span>
                    <span className="block text-xs leading-relaxed text-muted">{loc.address}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
}
