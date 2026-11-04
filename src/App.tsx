import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { BranchPicker } from './components/BranchPicker';
import { Boundary } from './components/ui/Boundary';
import { ConsentBar } from './components/ConsentBar';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { BookingProvider, useBooking } from './context/booking';
import { MobileStickyBar } from './components/service/MobileStickyBar';
import { OfferSheetsProvider } from './components/offers/OfferSheets';
import { trackContactClicks } from './lib/analytics';
import { blogRoute, currentCategory, currentPage, currentSalon, isAbout, isFaq, isHome, isPrivacy, isServicePage, loadCurrentPage, isMembership, isNotFound, isNovemberOffers, isOffers, isSalons, isServicesHub } from './lib/route';
import { whenHydrated } from './lib/hydration';
import { isPrerender, readyLazy, wasPrerendered } from './lib/prerender';
import { bookingWhatsappHref } from './lib/whatsapp';
import { isCampaignOpen } from './data/offers';

// Each page type is its own chunk, so a page downloads only its own code and content. The build also
// preloads the right chunk in each page's HTML, so it arrives alongside the main bundle.
const Landing = readyLazy(() => import('./routes/Landing'));
const ServicePage = readyLazy(() => import('./pages/ServicePage').then((module) => ({ default: module.ServicePage })));
const ServiceCategoryPage = readyLazy(() => import('./pages/ServiceCategoryPage'));
const ServicesHubPage = readyLazy(() => import('./pages/ServicesHubPage'));
const BlogRoutes = readyLazy(() => import('./pages/blog/BlogRoutes'));
const AboutPage = readyLazy(() => import('./pages/AboutPage'));
const OffersPage = readyLazy(() => import('./pages/OffersPage'));
const NovemberOffersPage = readyLazy(() => import('./pages/NovemberOffersPage'));
const FaqPage = readyLazy(() => import('./pages/FaqPage'));
const PrivacyPage = readyLazy(() => import('./pages/PrivacyPage'));
const MembershipPage = readyLazy(() => import('./pages/MembershipPage'));
const SalonsPage = readyLazy(() => import('./pages/SalonsPage'));
const BranchPage = readyLazy(() => import('./pages/BranchPage'));
const NotFoundPage = readyLazy(() => import('./pages/NotFoundPage'));
// Neither is needed to show a page, so both load later: the booking form on its first use, the offer popup
// once the page has settled.
const BookingModal = lazy(() => import('./components/BookingModal').then((module) => ({ default: module.BookingModal })));
const OfferPopup = lazy(() => import('./components/offers/OfferPopup'));

const loadMotion = () => import('./lib/motionFeatures').then((module) => module.default);
let motionFeatures: Awaited<ReturnType<typeof loadMotion>> | undefined;

/**
 * Loads this address's page before the app renders, and on a prerendered page the animation engine too: loaded
 * later, it would update every animated element while React is still hydrating them.
 */
export const preloadPage = () =>
  Promise.all([loadPage(), wasPrerendered && loadMotion().then((features) => (motionFeatures = features))]);

async function loadPage() {
  await loadCurrentPage();
  if (blogRoute) {
    await BlogRoutes.preload();
    const { preloadBlog } = await import('./pages/blog/BlogRoutes');
    return preloadBlog(blogRoute);
  }
  const page = isServicePage
    ? ServicePage
    : currentCategory
      ? ServiceCategoryPage
      : isServicesHub
        ? ServicesHubPage
        : isAbout
          ? AboutPage
          : isOffers
            ? OffersPage
            : isNovemberOffers
              ? NovemberOffersPage
              : isPrivacy
                ? PrivacyPage
              : isFaq
                ? FaqPage
                : isMembership
                  ? MembershipPage
                  : currentSalon
                    ? BranchPage
                    : isSalons
                      ? SalonsPage
                      : isNotFound
                        ? NotFoundPage
                        : Landing;
  return page.preload();
}

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
/** The page's place while its code loads: a blush hero with the heading's and buttons' outlines, softly pulsing. */
function PageSkeleton() {
  return (
    <div aria-hidden data-page-skeleton className="min-h-svh bg-gradient-to-b from-blush to-cream">
      <div className="container-site flex flex-col gap-4 pt-16 motion-safe:animate-pulse lg:pt-24">
        <div className="h-3 w-32 rounded-full bg-berry/15" />
        <div className="h-10 w-4/5 max-w-xl rounded-lg bg-berry/15 lg:h-14" />
        <div className="h-4 w-3/5 max-w-md rounded-full bg-berry/10" />
        <div className="mt-4 flex gap-3">
          <div className="h-12 w-40 rounded-full bg-berry/25" />
          <div className="h-12 w-32 rounded-full bg-berry/10" />
        </div>
      </div>
    </div>
  );
}

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

  // Once the page has hydrated, render again: now with the live time, salon and window size in place of the
  // snapshot's.
  const [, setHydrated] = useState(false);
  useEffect(() => whenHydrated(() => startTransition(() => setHydrated(true))), []);

  return (
    // reducedMotion="user" drops transform animations for visitors who prefer reduced motion.
    <LazyMotion features={motionFeatures ?? loadMotion}>
    <MotionConfig reducedMotion={isPrerender ? 'always' : 'user'}>
      <BookingProvider>
        <OfferSheetsProvider>
        <span id="page-top" className="absolute top-0" />
        <a
          href="#main"
          className="sr-only z-50 items-center rounded-md bg-berry px-4 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-11 focus:min-w-11"
        >
          Skip to content
        </a>
        <Header />
        {/* The footer waits with the page, so it never shows first and then jumps down. Meanwhile a branded
            placeholder stands in for the hero, instead of a blank page. */}
        <Boundary fallback={<PageSkeleton />}>
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
            ) : isPrivacy ? (
              <PrivacyPage />
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
          {!currentPage && !currentSalon && !isOffers && !isNovemberOffers && !isMembership && <MobileStickyBar whatsappHref={bookingWhatsappHref} whatsappLabel={isHome && isCampaignOpen() ? 'Claim Nov offer' : undefined} />}
          {/* Not on the offers page, which already shows every offer, nor on the membership page, whose own
              form and the quick-actions bar are the only things allowed at the foot of the screen there. */}
          {!isOffers && !isNovemberOffers && !isFaq && !isPrivacy && !isNotFound && !isMembership && !isPrerender && <OfferPopupWhenIdle />}
        </Boundary>
        <BookingModalOnDemand />
        {/* Asks which salon for every general WhatsApp, Call and Directions button. */}
        <BranchPicker />
        <ConsentBar />
        </OfferSheetsProvider>
      </BookingProvider>
    </MotionConfig>
    </LazyMotion>
  );
}
