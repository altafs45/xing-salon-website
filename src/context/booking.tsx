import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface BookingState {
  isOpen: boolean;
  /** Service to pre-select when the modal opens. */
  service: string;
  /** Salon to pre-select when the modal opens. */
  location: string;
  /** The exact menu item behind the booking, added to the WhatsApp message. */
  detail: string;
  open: (service?: string, location?: string, detail?: string) => void;
  close: () => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [detail, setDetail] = useState('');

  const open = useCallback((presetService = '', presetLocation = '', presetDetail = '') => {
    setService(presetService);
    setLocation(presetLocation);
    setDetail(presetDetail);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, service, location, detail, open, close }),
    [isOpen, service, location, detail, open, close],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
