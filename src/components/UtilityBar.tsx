import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { locations } from '../data/branches';
import { cn } from '../lib/cn';

/**
 * Desktop only: every salon's number, fixed above the header (Header renders it, so it is prerendered and styled with
 * the page). It slides away once the page scrolls, like the header shrinks. Body keeps its 32px from 1024px up
 * (index.css), so nothing sits under it. On a desktop a tel: link opens an "open with" dialog, so each number is
 * plain, selectable text with a Copy button; touch screens get the call link instead.
 */
export function UtilityBar({ hidden = false }: { hidden?: boolean }) {
  const [copied, setCopied] = useState('');
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(''), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async (id: string, phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(id);
    } catch {
      // Clipboard blocked: the number is still selectable text.
    }
  };

  return (
    <div
      data-utility-bar
      className={cn(
        'fixed inset-x-0 top-0 z-40 hidden h-8 items-center bg-berrydark text-xs text-cream transition-transform duration-300 motion-reduce:transition-none lg:flex',
        hidden && '-translate-y-full',
      )}
    >
      <ul className="container-site flex list-none items-center justify-end gap-6">
        {locations.map((loc) => (
          <li key={loc.id} className="flex items-center gap-1.5">
            <a href={loc.path} className="hover:underline">
              {loc.name}
            </a>
            <a href={loc.phoneHref} className="hidden font-medium hover:underline [@media(pointer:coarse)]:inline">
              {loc.phone}
            </a>
            <span className="select-all font-medium [@media(pointer:coarse)]:hidden">{loc.phone}</span>
            <button
              type="button"
              onClick={() => copy(loc.id, loc.phone)}
              aria-label={`Copy Xing ${loc.name}’s number`}
              title="Copy number"
              className="grid size-6 place-items-center rounded text-cream/80 hover:bg-white/10 hover:text-cream [@media(pointer:coarse)]:hidden"
            >
              {copied === loc.id ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
            </button>
          </li>
        ))}
        <li>Open daily</li>
      </ul>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Number copied' : ''}
      </span>
    </div>
  );
}
