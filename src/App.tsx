import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { BookingModal } from './components/BookingModal';
import { Bridal } from './components/Bridal';
import { FaqAbout } from './components/FaqAbout';
import { FloatingActions } from './components/FloatingActions';
import { CtaBand, Footer } from './components/Footer';
import { Guides } from './components/Guides';
import { HairColor } from './components/HairColor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Locations } from './components/Locations';
import { Offers } from './components/Offers';
import { Reviews } from './components/Reviews';
import { SalonGallery } from './components/SalonGallery';
import { Services } from './components/Services';
import { Transformations } from './components/Transformations';
import { WhyChoose } from './components/WhyChoose';
import { BookingProvider } from './context/booking';
import { MobileStickyBar } from './components/service/MobileStickyBar';
import { currentPage } from './lib/route';
import { bookingWhatsappHref } from './lib/whatsapp';
import { ServicePage } from './pages/ServicePage';

export default function App() {
  // The page is rendered after load, so the browser cannot jump to a link's #section by itself
  // (e.g. /services/threading-detan#detan or /#offers). Jump once the sections exist, and keep the section
  // in place while late-loading fonts reflow the text above it, until the visitor scrolls or 2.5s pass.
  useEffect(() => {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return;
    const jump = () => target.scrollIntoView({ behavior: 'instant' });
    const observer = new ResizeObserver(jump);
    const stop = () => {
      observer.disconnect();
      clearTimeout(timer);
      for (const type of ['wheel', 'touchstart', 'keydown'] as const) removeEventListener(type, stop);
    };
    const timer = setTimeout(stop, 2500);
    for (const type of ['wheel', 'touchstart', 'keydown'] as const) addEventListener(type, stop, { passive: true });
    observer.observe(document.body);
    return stop;
  }, []);

  return (
    // reducedMotion="user" drops transform animations for visitors who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-berry px-4 py-2 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          {currentPage ? (
            <ServicePage page={currentPage} />
          ) : (
            <>
          <Hero />
          <Services />
          <Guides />
          <HairColor />
          <Offers />
          <Transformations />
          <WhyChoose />
          <SalonGallery />
          <Bridal />
          <Reviews />
          <Locations />
          <FaqAbout />
          <CtaBand />
            </>
          )}
        </main>
        <Footer />
        <FloatingActions />
        {/* Service pages render the bar themselves, with their own prefilled message. */}
        {!currentPage && <MobileStickyBar whatsappHref={bookingWhatsappHref} />}
        <BookingModal />
      </BookingProvider>
    </MotionConfig>
  );
}
