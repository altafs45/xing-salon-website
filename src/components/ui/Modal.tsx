import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]';

const layouts = {
  center: {
    wrapper: 'items-end justify-center sm:items-center sm:p-4',
    panel: 'max-h-modal w-full max-w-modal overflow-y-auto rounded-t-card bg-cream shadow-lift sm:rounded-card',
    motion: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } },
  },
  drawer: {
    wrapper: 'justify-end',
    panel: 'h-full w-full overflow-y-auto bg-cream shadow-lift sm:max-w-drawer',
    motion: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  },
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name: pass the id of a visible heading, or a plain label. */
  labelledBy?: string;
  label?: string;
  layout?: keyof typeof layouts;
  children: ReactNode;
}

/** Accessible dialog: focus trap, Esc / backdrop to close, scroll lock, focus restore. */
export function Modal({ open, onClose, labelledBy, label, layout = 'center', children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const config = layouts[layout];

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    document.body.style.overflow = 'hidden';
    panel?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex', config.wrapper)}>
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={label}
            tabIndex={-1}
            className={cn('relative outline-none', config.panel)}
            {...config.motion}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
