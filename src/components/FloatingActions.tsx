import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { primaryLocation, site } from '../data/content';
import { currentPage } from '../lib/route';
import { WhatsAppIcon } from './ui/Decor';

const SHOW_TOP_AFTER_PX = 600;

/** Back-to-top button, plus the WhatsApp bubble on larger screens. Phones use the sticky action bar instead. */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > SHOW_TOP_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col items-center gap-3 md:bottom-5 md:right-5">
      <AnimatePresence>
        {showTop && (
          <motion.a
            href="#home"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileTap={{ scale: 0.9 }}
            className="grid size-11 place-items-center rounded-full bg-cream text-berry shadow-lift ring-1 ring-berry/20 transition-colors hover:bg-berry hover:text-cream"
          >
            <ArrowUp aria-hidden className="size-5" />
          </motion.a>
        )}
      </AnimatePresence>
      <motion.a
        href={currentPage?.contact?.whatsappHref ?? primaryLocation.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${site.name} on WhatsApp`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="hidden size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift md:grid"
      >
        <WhatsAppIcon className="size-7" />
      </motion.a>
    </div>
  );
}
