import { useEffect, useState } from 'react';
import { openingMinutes, site } from '../data/content';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: site.hours.timeZone,
});

const isOpen = () => {
  const [hours, minutes] = timeFormat.format(new Date()).split(':').map(Number);
  const now = hours * 60 + minutes;
  return now >= openingMinutes.open && now < openingMinutes.close;
};

/** Whether the salons are open right now, in salon local time. Re-checks every minute. */
export function useOpenNow() {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    const id = window.setInterval(() => setOpen(isOpen()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return open;
}
