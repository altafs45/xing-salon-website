import { Navigation, Phone } from 'lucide-react';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { PICK_CALL, PICK_DIRECTIONS } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/Decor';

const BUTTON =
  'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors duration-150 active:bg-ink/5 motion-reduce:transition-none';

interface MobileStickyBarProps {
  whatsappHref: string;
  phoneHref?: string;
  directionsHref?: string;
  /** The salon every button goes to, for tracking; left out when the buttons ask which salon. */
  branch?: string;
  /** Replaces the WhatsApp button's label with a longer one, e.g. a campaign's. */
  whatsappLabel?: string;
}

/**
 * Phones: a bar fixed to the foot of every page with WhatsApp, Call and Directions. On a salon's page all three
 * go to that salon; elsewhere they open the branch picker (or go straight to the visitor's remembered salon).
 * It steps aside while the hair colour section shows its own booking bar (which sets `data-bookbar`), and while
 * the gift form sheet is open (`data-sheet-open`). The
 * footer leaves room for it (`clear-action-bar`), so it never covers the end of the page.
 */
export function MobileStickyBar({ whatsappHref, phoneHref = PICK_CALL, directionsHref = PICK_DIRECTIONS, branch, whatsappLabel }: MobileStickyBarProps) {
  const external = (href: string) => href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <nav
      aria-label="Quick actions"
      data-cta="sticky_bar"
      data-branch={branch}
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 shadow-[0_-6px_20px_-12px_rgb(28_20_22/0.25)] backdrop-blur-md transition duration-300 motion-reduce:transition-none md:hidden',
        '[[data-bookbar]_&]:pointer-events-none [[data-bookbar]_&]:translate-y-full [[data-bookbar]_&]:opacity-0',
        // Hidden while the gift card / membership form sheet is open over it.
        '[[data-sheet-open]_&]:hidden',
      )}
    >
      <ul className="flex h-action-bar items-stretch divide-x divide-ink/10">
        <li className={cn('flex', whatsappLabel ? 'flex-[2.2]' : 'flex-1')}>
          <a href={whatsappHref} {...external(whatsappHref)} onClick={() => track('sticky_cta_click', { placement: 'sticky_bar', branch: branch ?? 'none', page: location.pathname })} className={cn(BUTTON, 'px-1 text-center text-whatsapp')}>
            <WhatsAppIcon className={whatsappLabel ? 'size-5' : 'size-6'} />
            <span className="leading-tight text-ink">{whatsappLabel ?? 'WhatsApp'}</span>
          </a>
        </li>
        <li className="flex flex-1">
          <a href={phoneHref} className={cn(BUTTON, 'text-berry')}>
            <Phone aria-hidden className="size-5" />
            <span className="text-ink">Call</span>
          </a>
        </li>
        <li className="flex flex-1">
          <a href={directionsHref} {...external(directionsHref)} className={cn(BUTTON, 'text-berry')}>
            <Navigation aria-hidden className="size-5" />
            <span className="text-ink">Directions</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
