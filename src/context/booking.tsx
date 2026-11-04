import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface BookingState {
  isOpen: boolean;
  /** Service to pre-select when the modal opens. */
  service: string;
  /** Salon to pre-select when the modal opens. */
  location: string;
  /** The exact menu item behind the booking, added to the WhatsApp message. */
  detail: string;
  /** The offer being claimed, shown in the form and added to the WhatsApp message. */
  offer: string;
  open: (service?: string, location?: string, detail?: string, offer?: string) => void;
  close: () => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [detail, setDetail] = useState('');
  const [offer, setOffer] = useState('');

  const open = useCallback((presetService = '', presetLocation = '', presetDetail = '', presetOffer = '') => {
    setService(presetService);
    setLocation(presetLocation);
    setDetail(presetDetail);
    setOffer(presetOffer);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, service, location, detail, offer, open, close }),
    [isOpen, service, location, detail, offer, open, close],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
