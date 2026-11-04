import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

/** Phones: three lines, then "Read more". Desktop: everything. All of it stays in the HTML either way. */
export function ReadMore({ paragraphs, className = 'text-sm leading-relaxed text-muted sm:text-base' }: { paragraphs: readonly string[]; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={paragraph} className={cn(className, !open && (i === 0 ? 'max-sm:line-clamp-3' : 'max-sm:hidden'))}>
          {paragraph}
        </p>
      ))}
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry sm:hidden">
        {open ? 'Read less' : 'Read more'}
        <ChevronDown aria-hidden className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
    </>
  );
}
