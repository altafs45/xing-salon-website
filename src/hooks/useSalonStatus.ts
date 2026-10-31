import { useEffect, useState } from 'react';
import { openingMinutes, site } from '../data/content';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: site.hours.timeZone,
});

/** How close to opening or closing time counts as "soon", in minutes. */
const SOON = 60;
const DAY = 24 * 60;

export interface SalonStatus {
  /** `closing` and `opening` are the last hour before the doors close or open. */
  state: 'open' | 'closing' | 'opening' | 'closed';
  /** Minutes until the salons close (when open) or open (when closed). */
  minutes: number;
  /** How far through the opening hours it is, from 0 to 1. 0 while closed. */
  progress: number;
}

const status = (): SalonStatus => {
  const [hours, mins] = timeFormat.format(new Date()).split(':').map(Number);
  const now = hours * 60 + mins;
  const { open, close } = openingMinutes;
  if (now >= open && now < close) {
    const minutes = close - now;
    return { state: minutes <= SOON ? 'closing' : 'open', minutes, progress: (now - open) / (close - open) };
  }
  // Before opening today, or after closing: the next opening is tomorrow's.
  const minutes = now < open ? open - now : open + DAY - now;
  return { state: minutes <= SOON ? 'opening' : 'closed', minutes, progress: 0 };
};

/** Whether the salons are open right now, in salon local time, and how long until that changes. Re-checks every minute. */
export function useSalonStatus() {
  const [current, setCurrent] = useState(status);

  useEffect(() => {
    const id = window.setInterval(() => setCurrent(status()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return current;
}
