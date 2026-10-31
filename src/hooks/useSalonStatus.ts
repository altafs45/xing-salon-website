import { useEffect, useState } from 'react';
import { SALON_HOURS, statusAt, type Salon } from '../data/branches';

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: SALON_HOURS.timeZone,
});

const status = (salon: Salon) => {
  const [hours, mins] = timeFormat.format(new Date()).split(':').map(Number);
  return statusAt(salon, hours * 60 + mins);
};

/** Whether this salon is open right now, in salon local time, and how long until that changes. Re-checks every minute. */
export function useSalonStatus(salon: Salon) {
  const [current, setCurrent] = useState(() => status(salon));

  useEffect(() => {
    setCurrent(status(salon));
    const id = window.setInterval(() => setCurrent(status(salon)), 60_000);
    return () => window.clearInterval(id);
  }, [salon]);

  return current;
}
