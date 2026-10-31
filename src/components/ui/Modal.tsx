import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, m, useDragControls } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';

/** Dialogs open right now. Only the last one to close unlocks scrolling and restores focus. */
let openCount = 0;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]';

const layouts = {
  center: {
    wrapper: 'items-end justify-center sm:items-center sm:p-4',
    panel: 'max-h-modal w-full max-w-modal overflow-y-auto rounded-t-card bg-cream shadow-lift sm:rounded-card',
    motion: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } },
  },
  // Phones: fills the screen, so a long form scrolls inside it. Larger screens: the centred dialog.
  full: {
    wrapper: 'items-stretch justify-center sm:items-center sm:p-4',
    panel: 'h-dvh w-full max-w-modal overflow-y-auto bg-cream shadow-lift sm:h-auto sm:max-h-modal sm:rounded-card',
    motion: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } },
  },
  // Phones: a bottom sheet over at most 60% of the screen, so the page stays visible behind it.
  sheet: {
    wrapper: 'items-end justify-center sm:items-center sm:p-4',
    panel: 'max-h-[60svh] w-full overflow-y-auto rounded-t-card bg-cream shadow-lift sm:max-h-modal sm:max-w-[30rem] sm:rounded-card',
    motion: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 40 } },
  },
  // Phones: a bottom sheet over most of the screen, with a handle to swipe it down. Larger screens: a drawer on the right.
  panel: {
    wrapper: 'items-end justify-center md:items-stretch md:justify-end',
    panel: 'flex max-h-[90svh] w-full flex-col rounded-t-2xl bg-cream shadow-lift md:h-full md:max-h-none md:max-w-[30rem] md:rounded-none',
    motion: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 60 } },
  },
  // Phones: a bottom sheet up to 92% of the screen with a handle to swipe it down; it lays out its own scroll
  // area and sticky footer. Larger screens: a centred dialog.
  form: {
    wrapper: 'items-end justify-center md:items-center md:p-4',
    panel: 'flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-cream shadow-lift md:max-w-[35rem] md:rounded-3xl',
    motion: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 60 } },
  },
  // The site menu: full screen, sliding in from the right. It lays out its own scrolling panels.
  drawer: {
    wrapper: 'justify-end',
    panel: 'h-dvh w-full overflow-hidden bg-cream shadow-lift',
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
  const isWide = useMediaQuery('(min-width: 768px)');
  const dragControls = useDragControls();
  // The panel slides in from the right on larger screens, and can be swiped down on phones.
  const swipeable = (layout === 'panel' || layout === 'form') && !isWide;
  const motionProps =
    layout === 'panel' && isWide ? { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 60 } } : config.motion;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    openCount += 1;
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
      openCount -= 1;
      if (openCount > 0) return;
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex', config.wrapper)}>
          <m.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={label}
            tabIndex={-1}
            className={cn('relative outline-none', config.panel)}
            {...motionProps}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            {...(swipeable && {
              drag: 'y' as const,
              dragControls,
              dragListener: false,
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: { top: 0, bottom: 0.7 },
              onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
                if (info.offset.y > 110 || info.velocity.y > 600) onClose();
              },
            })}
          >
            {swipeable && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center"
                aria-hidden
              >
                <span className="h-1.5 w-10 rounded-full bg-ink/20" />
              </div>
            )}
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
