import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { BranchPicker } from './components/BranchPicker';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { BookingProvider, useBooking } from './context/booking';
import { MobileStickyBar } from './components/service/MobileStickyBar';
import { OfferSheetsProvider } from './components/offers/OfferSheets';
import { trackContactClicks } from './lib/analytics';
import { blogRoute, currentCategory, currentPage, currentSalon, isAbout, isFaq, isMembership, isNotFound, isNovemberOffers, isOffers, isSalons, isServicesHub } from './lib/route';
import { bookingWhatsappHref } from './lib/whatsapp';

// Each page type is its own chunk, so a page downloads only its own code and content. The build also
// preloads the right chunk in each page's HTML, so it arrives alongside the main bundle.
const Landing = lazy(() => import('./routes/Landing'));
const ServicePage = lazy(() => import('./pages/ServicePage').then((module) => ({ default: module.ServicePage })));
const ServiceCategoryPage = lazy(() => import('./pages/ServiceCategoryPage'));
const ServicesHubPage = lazy(() => import('./pages/ServicesHubPage'));
const BlogRoutes = lazy(() => import('./pages/blog/BlogRoutes'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const NovemberOffersPage = lazy(() => import('./pages/NovemberOffersPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const SalonsPage = lazy(() => import('./pages/SalonsPage'));
const BranchPage = lazy(() => import('./pages/BranchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// Neither is needed to show a page, so both load later: the booking form on its first use, the offer popup
// once the page has settled.
const BookingModal = lazy(() => import('./components/BookingModal').then((module) => ({ default: module.BookingModal })));
const OfferPopup = lazy(() => import('./components/offers/OfferPopup'));

const POPUP_AFTER_MS = 3000;

/** Loads the booking form the first time a "Book" button asks for it. */
function BookingModalOnDemand() {
  const { isOpen } = useBooking();
  const [wanted, setWanted] = useState(false);
  useEffect(() => {
    if (isOpen) setWanted(true);
  }, [isOpen]);
  return wanted ? (
    <Suspense fallback={null}>
      <BookingModal />
    </Suspense>
  ) : null;
}

/** Loads the offer popup a few seconds after the page has finished loading. */
function OfferPopupWhenIdle() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    const start = () => (timer = window.setTimeout(() => setReady(true), POPUP_AFTER_MS));
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(timer);
    };
  }, []);
  return ready ? (
    <Suspense fallback={null}>
      <OfferPopup />
    </Suspense>
  ) : null;
}

export default function App() {
  // The page is rendered after load, so the browser cannot jump to a link's #section by itself
  // (e.g. /services/threading-detan#detan or /#offers). Jump once the section exists, and keep it in place
  // while late-loading fonts reflow the text above it, until the visitor scrolls or 2.5s pass.
  useEffect(() => {
    // A link may add a query after the anchor ("#branches?b=hsr-layout"): only the anchor is the section.
    const id = decodeURIComponent(window.location.hash.slice(1).split('?')[0]);
    if (!id) return;
    const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
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

  useEffect(() => trackContactClicks(), []);

  return (
    // reducedMotion="user" drops transform animations for visitors who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <OfferSheetsProvider>
        <a
          href="#main"
          className="sr-only z-50 items-center rounded-md bg-berry px-4 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-11 focus:min-w-11"
        >
          Skip to content
        </a>
        <Header />
        {/* The footer waits with the page, so it never shows first and then jumps down. Meanwhile a tinted
            block the height of the screen stands in for the hero, instead of a blank page. */}
        <Suspense fallback={<div aria-hidden className="min-h-svh bg-blush" />}>
          <main id="main">
            {currentPage ? (
              <ServicePage page={currentPage} />
            ) : currentCategory ? (
              <ServiceCategoryPage category={currentCategory} />
            ) : isServicesHub ? (
              <ServicesHubPage />
            ) : blogRoute ? (
              <BlogRoutes route={blogRoute} />
            ) : isAbout ? (
              <AboutPage />
            ) : isOffers ? (
              <OffersPage />
            ) : isNovemberOffers ? (
              <NovemberOffersPage />
            ) : isFaq ? (
              <FaqPage />
            ) : isMembership ? (
              <MembershipPage />
            ) : currentSalon ? (
              <BranchPage salon={currentSalon} />
            ) : isSalons ? (
              <SalonsPage />
            ) : isNotFound ? (
              <NotFoundPage />
            ) : (
              <Landing />
            )}
          </main>
          <Footer />
          <FloatingActions />
          {/* Service pages, salon pages, the offers page and the membership page render the buttons themselves,
              with their own prefilled message (and, on a salon's page, that salon's numbers). */}
          {!currentPage && !currentSalon && !isOffers && !isNovemberOffers && !isMembership && <MobileStickyBar whatsappHref={bookingWhatsappHref} />}
          {/* Not on the offers page, which already shows every offer, nor on the membership page, whose own
              form and the quick-actions bar are the only things allowed at the foot of the screen there. */}
          {!isOffers && !isNovemberOffers && !isFaq && !isNotFound && !isMembership && <OfferPopupWhenIdle />}
        </Suspense>
        <BookingModalOnDemand />
        {/* Asks which salon for every general WhatsApp, Call and Directions button. */}
        <BranchPicker />
        </OfferSheetsProvider>
      </BookingProvider>
    </MotionConfig>
  );
}
