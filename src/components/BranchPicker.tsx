import { useEffect, useState } from 'react';
import { ChevronRight, MapPin, Navigation, Phone, X } from 'lucide-react';
import { locations, type Salon } from '../data/branches';
import { getBranch, setBranch } from '../lib/branch';
import { fillBranch, PICK_CALL, PICK_DIRECTIONS, PICK_WHATSAPP, whatsappLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';

type Action = 'whatsapp' | 'call' | 'directions';

const TITLES: Record<Action, string> = {
  whatsapp: 'Which salon would you like to book?',
  call: 'Which salon would you like to call?',
  directions: 'Directions to which salon?',
};

const ICONS = { whatsapp: WhatsAppIcon, call: Phone, directions: Navigation };

/** Where an action sends the visitor for this salon. */
function target(salon: Salon, action: Action, text: string) {
  if (action === 'call') return { href: salon.phoneHref, external: false };
  if (action === 'directions') return { href: salon.directionsUrl, external: true };
  return { href: whatsappLink(fillBranch(text, salon.name), salon.whatsappHref), external: true };
}

/**
 * Bottom sheet that asks which salon, for every general booking, call or directions button on the site.
 * Buttons only need the markers from lib/whatsapp; clicks on them anywhere are caught here. The chosen salon
 * is remembered: the sheet lists it first, and the sticky bar then goes straight to it without asking.
 */
export function BranchPicker() {
  const [request, setRequest] = useState<{ action: Action; text: string } | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href') ?? '';
      let next: { action: Action; text: string } | null = null;
      if (href.startsWith(PICK_WHATSAPP)) next = { action: 'whatsapp', text: new URL(href).searchParams.get('text') ?? '' };
      else if (href === PICK_CALL) next = { action: 'call', text: '' };
      else if (href === PICK_DIRECTIONS) next = { action: 'directions', text: '' };
      if (!next) return;
      event.preventDefault();

      const remembered = locations.find((salon) => salon.id === getBranch());
      // The sticky bar is the one-tap shortcut: once a salon is chosen, it skips the question.
      if (remembered && link?.closest('nav[aria-label="Quick actions"]')) {
        const { href: to, external } = target(remembered, next.action, next.text);
        if (external) window.open(to, '_blank', 'noopener');
        else window.location.href = to;
        return;
      }
      setLastId(remembered?.id ?? null);
      setRequest(next);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const close = () => setRequest(null);
  const action = request?.action ?? 'whatsapp';
  const Icon = ICONS[action];

  return (
    <>
      {/* Targets for the "Call" and "Directions" marker links, so they point somewhere without JavaScript too. */}
      <span id={PICK_CALL.slice(1)} />
      <span id={PICK_DIRECTIONS.slice(1)} />
    <Modal open={!!request} onClose={close} labelledBy="branch-picker-title">
      <div className="safe-bottom p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="branch-picker-title" className="font-display text-2xl font-medium text-ink">
            {TITLES[action]}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush hover:text-berry"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <ul className="mt-4 divide-y divide-ink/10">
          {locations.map((salon) => {
            const { href, external } = target(salon, action, request?.text ?? '');
            return (
              <li key={salon.id}>
                <a
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  onClick={() => {
                    setBranch(salon.id);
                    close();
                  }}
                  className="group flex min-h-16 items-center gap-4 py-4"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-berry">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-ink">
                      Xing {salon.name}
                      {salon.id === lastId && (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">Last used</span>
                      )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin aria-hidden className="size-3.5 shrink-0" />
                      <span className="truncate">{salon.areasServed.slice(0, 3).join(', ')}</span>
                    </span>
                    {action === 'call' && <span className="mt-0.5 block text-sm text-ink">{salon.phone}</span>}
                  </span>
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-berry transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
    </>
  );
}
