import { useEffect, useState } from 'react';
import { isPrerender } from '../lib/prerender';

const KEY = 'xing-consent';
const hasTags = !!(import.meta.env.VITE_GTM_ID || import.meta.env.VITE_GA4_ID || import.meta.env.VITE_CLARITY_ID);
const required = import.meta.env.VITE_CONSENT_REQUIRED === 'true';

type Choice = 'all' | 'essential';
interface TagWindow {
  gtag?: (...args: unknown[]) => void;
  xingLoadClarity?: (granted: boolean) => void;
}

const stored = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

function apply(choice: Choice) {
  const w = window as TagWindow;
  const granted = choice === 'all';
  if (granted) w.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
  w.xingLoadClarity?.(granted);
}

/** Asks once, with two equally easy buttons. Tags keep their denied defaults until someone accepts. */
export function ConsentBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasTags || isPrerender) return;
    const choice = stored();
    if (choice === 'all' || choice === 'essential') apply(choice);
    else if (required) setOpen(true);
    else apply('all');
  }, []);

  if (!open) return null;
  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      // Not remembered; the choice still applies to this visit.
    }
    apply(choice);
    setOpen(false);
  };

  return (
    <div role="region" aria-label="Privacy choices" className="fixed inset-x-3 bottom-[calc(theme(spacing.action-bar)+0.75rem+env(safe-area-inset-bottom))] z-40 rounded-2xl bg-cream p-4 shadow-lift ring-1 ring-berry/15 md:inset-x-auto md:bottom-5 md:left-5 md:w-[24rem]">
      <p className="text-sm text-ink">
        We use analytics to improve this site.{' '}
        <a href="/privacy" className="inline-flex min-h-11 items-center font-medium text-berry underline underline-offset-4">
          Privacy
        </a>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose('all')} className="min-h-11 rounded-full border border-berry px-4 text-sm font-semibold text-berry">
          Accept
        </button>
        <button type="button" onClick={() => choose('essential')} className="min-h-11 rounded-full border border-berry px-4 text-sm font-semibold text-berry">
          Only essential
        </button>
      </div>
    </div>
  );
}
