import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * A section's detail behind "Read more": the heading stays on show, the rest opens on a tap. It is a <details>,
 * so all of it stays in the HTML for search and AI answers, and opens by itself for find-in-page.
 */
export function Fold({ children, label = 'Read more' }: { children: ReactNode; label?: string }) {
  return (
    <details className="group mt-6">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium text-berry [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{label}</span>
        <span className="hidden group-open:inline">Show less</span>
        <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      {children}
    </details>
  );
}
