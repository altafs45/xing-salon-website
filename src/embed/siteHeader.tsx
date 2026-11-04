// The site's own header, for the pages copied from xingsalons.com (public/offers.html and the six offer pages).
// Built as /embed/site-header.js and mounted into <div data-site-header> on each of them, inside a shadow root:
// the site's CSS styles the header and its menus, sheets and booking form, while the page's own CSS and the site's
// cannot reach each other. The same components as every other page, so the header never drifts.
import { lazy, StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, MotionConfig } from 'framer-motion';
import css from '../index.css?inline';
import { BranchPicker } from '../components/BranchPicker';
import { Header } from '../components/Header';
import { BookingProvider, useBooking } from '../context/booking';
import { trackContactClicks } from '../lib/analytics';

const BookingModal = lazy(() => import('../components/BookingModal').then((module) => ({ default: module.BookingModal })));

/** Loads the booking form the first time a "Book" button asks for it, as in the app. */
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

function SiteHeader() {
  useEffect(() => trackContactClicks(), []);
  return (
    <LazyMotion features={() => import('../lib/motionFeatures').then((module) => module.default)}>
      <MotionConfig reducedMotion="user">
        <BookingProvider>
          <Header />
          {/* The header is fixed: this keeps its place in the page, so nothing slides under it. */}
          <div aria-hidden className="h-header-sm lg:h-[calc(theme(spacing.header)+2rem)]" />
          <BookingModalOnDemand />
          <BranchPicker />
        </BookingProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

const host = document.querySelector<HTMLElement>('[data-site-header]');
if (host && !host.shadowRoot) {
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  // :root and html/body rules can't match inside a shadow root; the variables and base text style go on the host.
  style.textContent = `${css.replaceAll(':root', ':host')}
:host{display:block;font-family:Poppins,'Poppins Fallback',system-ui,sans-serif;color:#27151C;line-height:1.5;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}`;
  const mount = document.createElement('div');
  shadow.append(style, mount);
  createRoot(mount).render(
    <StrictMode>
      <SiteHeader />
    </StrictMode>,
  );
}
