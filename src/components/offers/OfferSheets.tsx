import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { offerFromHash, offersPath, type CampaignOfferId, type SalonOfferId } from '../../data/offers';
import { track } from '../../lib/analytics';
import { getBranch } from '../../lib/branch';
import type { OfferPlacement } from '../../lib/offers';

// The sheet's code loads the first time an offer is opened.
const OfferSheet = lazy(() => import('./OfferSheet'));

export type SheetMode = 'details' | 'claim';
type SheetOfferId = SalonOfferId | CampaignOfferId;

export interface SheetState {
  id: SheetOfferId;
  mode: SheetMode;
  placement: OfferPlacement;
  /** A salon's own page fixes the salon; elsewhere the visitor's chosen salon is pre-selected. */
  branch?: string;
}

interface OfferSheetsValue {
  /** The open offer, or null. */
  current: SheetState | null;
  openDetails: (id: SheetOfferId, placement: OfferPlacement, branch?: string) => void;
  openClaim: (id: SheetOfferId, placement: OfferPlacement, branch?: string) => void;
  setMode: (mode: SheetMode) => void;
  close: () => void;
}

const Ctx = createContext<OfferSheetsValue | null>(null);

const onOffersPage = () => window.location.pathname.replace(/\/+$/, '') === offersPath;

/**
 * One offer sheet for the whole site: details, then claiming. Opening it adds "#<offer>" to the address, so the
 * Back button closes it, and /offers#keratin opens straight into the Keratin sheet.
 */
export function OfferSheetsProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<SheetState | null>(null);
  // The last offer stays rendered while the sheet slides away.
  const [last, setLast] = useState<SheetState | null>(null);
  // True when this sheet added the address entry, so closing should step back through it.
  const pushed = useRef(false);

  const show = useCallback((state: SheetState) => {
    setCurrent(state);
    setLast(state);
  }, []);

  const open = useCallback(
    (mode: SheetMode) => (id: SheetOfferId, placement: OfferPlacement, branch?: string) => {
      const params = { offer_id: id, placement, branch: branch ?? getBranch() ?? 'none' };
      track(mode === 'details' ? 'offer_details_open' : 'offer_claim_start', params);
      if (mode === 'details' && id.startsWith('nov-')) track('nov_offer_details', params);
      if (!pushed.current && window.location.hash !== `#${id}`) {
        history.pushState(history.state, '', `#${id}`);
        pushed.current = true;
      }
      show({ id, mode, placement, branch });
    },
    [show],
  );

  const close = useCallback(() => {
    if (pushed.current) {
      // The popstate handler below clears the sheet.
      history.back();
      return;
    }
    setCurrent(null);
    if (offerFromHash(window.location.hash)) history.replaceState(history.state, '', window.location.pathname + window.location.search);
  }, []);

  const setMode = useCallback((mode: SheetMode) => {
    setCurrent((state) => (state ? { ...state, mode } : state));
    setLast((state) => (state ? { ...state, mode } : state));
  }, []);

  useEffect(() => {
    // /offers#keratin: open that offer straight away.
    const linked = onOffersPage() ? offerFromHash(window.location.hash) : undefined;
    if (linked) {
      show({ id: linked.id, mode: 'details', placement: 'offers' });
      track('offer_details_open', { offer_id: linked.id, placement: 'offers', branch: getBranch() ?? 'none' });
    }
    const onPop = () => {
      pushed.current = false;
      const offer = offerFromHash(window.location.hash);
      if (offer && onOffersPage()) show({ id: offer.id, mode: 'details', placement: 'offers' });
      else setCurrent(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [show]);

  const value = useMemo(
    () => ({ current, openDetails: open('details'), openClaim: open('claim'), setMode, close }),
    [current, open, setMode, close],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {last && (
        <Suspense fallback={null}>
          <OfferSheet state={last} open={!!current} onClose={close} setMode={setMode} />
        </Suspense>
      )}
    </Ctx.Provider>
  );
}

export function useOfferSheets() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOfferSheets must be used inside <OfferSheetsProvider>');
  return ctx;
}
