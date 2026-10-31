import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { site } from '../data/content';
import { bookingWhatsappHref } from '../lib/whatsapp';
import { currentPage } from '../lib/route';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { WhatsAppIcon } from './ui/Decor';

const SHOW_TOP_AFTER_PX = 600;

/**
 * Back-to-top button, plus the WhatsApp bubble on larger screens. On phones the quick-actions bar
 * (MobileStickyBar) runs along the foot of the screen, so the button sits just above it.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  // Phones: sections marked data-hide-fab (the offer cards) would sit under the button, so it steps aside.
  const [overCards, setOverCards] = useState(false);
  const isPhone = !useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > SHOW_TOP_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Checked again once the button is due, by when the lazily loaded page sections are in place.
    const targets = document.querySelectorAll('[data-hide-fab]');
    if (!isPhone || !targets.length) return setOverCards(false);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      setOverCards(visible.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [isPhone, showTop]);

  return (
    <div className="fixed bottom-[calc(theme(spacing.action-bar)+1rem+env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-center gap-3 md:bottom-5 md:right-5">
      <AnimatePresence>
        {showTop && !overCards && (
          <m.a
            href="#page-top"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileTap={{ scale: 0.9 }}
            className="grid size-11 place-items-center rounded-full bg-cream text-berry shadow-lift ring-1 ring-berry/20 transition-colors hover:bg-berry hover:text-cream"
          >
            <ArrowUp aria-hidden className="size-5" />
          </m.a>
        )}
      </AnimatePresence>
      <m.a
        href={currentPage?.contact?.whatsappHref ?? bookingWhatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${site.name} on WhatsApp`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift md:grid"
      >
        <WhatsAppIcon className="size-7" />
      </m.a>
    </div>
  );
}
