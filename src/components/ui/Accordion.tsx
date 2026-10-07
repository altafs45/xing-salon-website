import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface AccordionProps {
  items: ReadonlyArray<{ q: string; a: string }>;
  /** Prefix for the button/panel ids, unique per accordion on the page. */
  idPrefix: string;
}

/** Question-and-answer list where one answer is open at a time. */
export function Accordion({ items, idPrefix }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={`${idPrefix}-button-${i}`}
                aria-expanded={expanded}
                aria-controls={`${idPrefix}-panel-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="group flex w-full items-center gap-3 py-4 text-left text-sm font-medium text-ink hover:text-berry"
              >
                <ArrowRight
                  aria-hidden
                  className={cn(
                    'size-4 shrink-0 text-berry transition-transform duration-300 motion-reduce:transition-none',
                    expanded && 'rotate-90',
                  )}
                />
                <span className="flex-1">{item.q}</span>
                {expanded ? (
                  <Minus aria-hidden className="size-4 shrink-0 text-berry" />
                ) : (
                  <Plus aria-hidden className="size-4 shrink-0 text-berry" />
                )}
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={`${idPrefix}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${idPrefix}-button-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 pl-7 pr-8 text-sm leading-relaxed text-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
