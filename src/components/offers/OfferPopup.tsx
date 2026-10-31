import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { campaignPill, isCampaignOpen, novemberCampaign, offersPath, salonOfferById, sheetOfferById, type SheetOffer } from '../../data/offers';
import { track } from '../../lib/analytics';
import { getBranch } from '../../lib/branch';
import { isOfferToday } from '../../lib/offers';
import { Picture } from '../ui/Primitives';
import { useOfferSheets } from './OfferSheets';

/** Never sooner than this after landing. */
const QUIET_MS = 8_000;
/** Shows after this long on the page, at half-way down it, or when the mouse heads for the tabs (desktop). */
const AFTER_MS = 25_000;
const SCROLL_SHARE = 0.4;
const SHOWN_KEY = 'xing-popup-shown';
/** At most once per visitor in this long. */
const REST_MS = 3 * 24 * 60 * 60 * 1000;

// Storage can be blocked (private mode); the toast then shows at most once per page view.
const shownRecently = () => {
  try {
    return Date.now() - Number(localStorage.getItem(SHOWN_KEY) ?? 0) < REST_MS;
  } catch {
    return false;
  }
};
const markShown = () => {
  try {
    localStorage.setItem(SHOWN_KEY, String(Date.now()));
  } catch {
    // Not remembered; nothing else changes.
  }
};

/** True while showing the offer would interrupt: a dialog is open or the visitor is typing. */
const visitorBusy = () =>
  !!document.querySelector('[role="dialog"][aria-modal="true"]') || !!document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');

/**
 * One offer as a small toast at the foot of the screen (above the quick-actions bar on phones): Tuesday Happy
 * Hours on Tuesdays, the Hydra Facial otherwise, and the November colour offer while it runs. At most once in 3 days, never in the first 8 seconds, and
 * not on /offers (App.tsx leaves it out there).
 */
export default function OfferPopup() {
  const sheets = useOfferSheets();
  const [open, setOpen] = useState(false);
  const november = isCampaignOpen();
  const offer: SheetOffer = november ? sheetOfferById('nov-global-colour')! : salonOfferById(isOfferToday(salonOfferById('tuesday')!) ? 'tuesday' : 'hydra-facial')!;
  const params = { offer_id: offer.id, placement: 'popup', branch: getBranch() ?? 'none' };

  useEffect(() => {
    if (shownRecently()) return;
    let waiting = 0;
    const show = () => {
      cleanup();
      // performance.now() counts from the moment the page started loading.
      const wait = QUIET_MS - performance.now();
      // Too soon after landing, or the visitor is busy: try again shortly.
      if (wait > 0 || visitorBusy()) {
        waiting = window.setTimeout(show, Math.max(wait, 2000));
        return;
      }
      markShown();
      setOpen(true);
      track('popup_shown', params);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_SHARE) show();
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    // Phones only ever show it after scrolling; the timer is for desktop.
    const timer = window.matchMedia('(max-width: 767px)').matches ? 0 : window.setTimeout(show, AFTER_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    document.addEventListener('mouseout', onLeave);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    }
    return () => {
      cleanup();
      window.clearTimeout(waiting);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    track('popup_dismissed', params);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="offer-toast-title"
      className="fixed inset-x-3 bottom-[calc(theme(spacing.action-bar)+0.75rem+env(safe-area-inset-bottom))] z-40 max-h-[30svh] rounded-2xl bg-cream p-3 shadow-lift ring-1 ring-berry/15 motion-safe:animate-[toast-in_0.35s_ease-out] md:inset-x-auto md:bottom-5 md:left-5 md:max-h-none md:w-[24rem]"
    >
      <div className="flex items-center gap-3">
        <Picture image={november ? novemberCampaign.offers[0].thumb : offer.image} decorative sizes="120px" className="size-16 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-berry">{november ? offer.badge : isOfferToday(offer) ? `Today · ${offer.badge}` : offer.badge}</p>
          <p id="offer-toast-title" className="truncate font-display text-xl font-medium leading-tight text-ink">
            {offer.title}
          </p>
          {november && <p className="truncate text-xs text-muted">{offer.claimDetail} · {campaignPill()}</p>}
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                track('popup_claim', params);
                sheets.openClaim(offer.id, 'popup');
              }}
              className="inline-flex min-h-11 items-center rounded-full bg-berry px-4 text-sm font-semibold text-cream hover:bg-berrydark"
            >
              Claim
            </button>
            <a href={november ? novemberCampaign.path : offersPath} className="inline-flex min-h-11 items-center text-sm font-medium text-berry underline underline-offset-4">
              {november ? 'See all 3' : 'All offers'}
            </a>
          </div>
        </div>
        <button type="button" onClick={dismiss} aria-label="Close offer" className="grid size-11 shrink-0 self-start place-items-center rounded-full text-ink hover:bg-blush">
          <X aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
