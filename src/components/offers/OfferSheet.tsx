import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Phone, X } from 'lucide-react';
import { useBooking } from '../../context/booking';
import { locations, salonById } from '../../data/branches';
import { formatPrice, savingPercent, sheetOfferById, SHOW_PRICES, type SheetOffer } from '../../data/offers';
import { track } from '../../lib/analytics';
import { getBranch, setBranch } from '../../lib/branch';
import { cn } from '../../lib/cn';
import { CLAIM_DAYS, claimText, type ClaimDay } from '../../lib/offers';
import { PICK_CALL } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/Decor';
import { Modal } from '../ui/Modal';
import { Picture } from '../ui/Primitives';
import type { SheetMode, SheetState } from './OfferSheets';

const PILL = 'inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors duration-150';
const PILL_ON = 'border-berry bg-berry text-cream';
const PILL_OFF = 'border-ink/15 bg-white text-ink hover:border-berry hover:text-berry';
const MAIN = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-150 active:scale-[0.98] motion-reduce:active:scale-100';

interface OfferSheetProps {
  state: SheetState;
  open: boolean;
  onClose: () => void;
  setMode: (mode: SheetMode) => void;
}

/** An offer in full (details) and the two-tap claim (salon, day, send). Bottom sheet on phones, drawer on desktop. */
export default function OfferSheet({ state, open, onClose, setMode }: OfferSheetProps) {
  const offer = sheetOfferById(state.id)!;
  const titleId = `offer-sheet-${offer.id}`;
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} layout="panel">
      {state.mode === 'details' ? (
        <Details offer={offer} titleId={titleId} onClose={onClose} onClaim={() => setMode('claim')} />
      ) : (
        <Claim offer={offer} titleId={titleId} state={state} onClose={onClose} onBack={() => setMode('details')} />
      )}
    </Modal>
  );
}

function SheetHeader({ offer, titleId, title, onClose, onBack }: { offer: SheetOffer; titleId: string; title: string; onClose: () => void; onBack?: () => void }) {
  return (
    <div className="flex shrink-0 items-start gap-3 border-b border-ink/10 px-5 pb-4 pt-1 md:pt-6">
      {onBack && (
        <button type="button" onClick={onBack} aria-label="Back to offer details" className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush">
          <ArrowLeft aria-hidden className="size-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="offer-badge-text text-xs font-bold uppercase tracking-wider text-berry">{offer.badge}</p>
        <h2 id={titleId} className="mt-1 font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
          {title}
        </h2>
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush">
        <X aria-hidden className="size-5" />
      </button>
    </div>
  );
}

function Details({ offer, titleId, onClose, onClaim }: { offer: SheetOffer; titleId: string; onClose: () => void; onClaim: () => void }) {
  const photos = [offer.image, ...offer.gallery].slice(0, 3);
  return (
    <>
      <SheetHeader offer={offer} titleId={titleId} title={offer.title} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
        <ul className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
          {photos.map((photo, i) => (
            <li key={photo.src} className="w-[78%] shrink-0 snap-start">
              <Picture image={photo} eager={i === 0} sizes="(min-width: 768px) 360px, 78vw" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            </li>
          ))}
        </ul>

        <p className="mt-5 font-display text-xl font-medium text-berry">{offer.hook}</p>
        <p className="mt-1 text-base leading-relaxed text-ink">{offer.sub}</p>

        {offer.options && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Choose from">
            {offer.options.map((option) => (
              <li key={option.name} className="rounded-full bg-blush px-3 py-1.5 text-sm text-ink">
                {option.name} <span className="font-semibold text-berry">· {option.saving}</span>
              </li>
            ))}
          </ul>
        )}

        {(SHOW_PRICES || offer.showPrices) && offer.prices && (
          <dl className="mt-4 divide-y divide-ink/10 rounded-2xl bg-white px-4 text-sm shadow-soft">
            {offer.prices.map((price) => (
              <div key={price.label} className="flex items-center justify-between gap-3 py-2.5">
                <dt className="text-ink">{price.label}</dt>
                <dd className="flex items-baseline gap-2">
                  <span className="font-semibold text-berry">Now {formatPrice(price.now)}</span>
                  <s className="text-xs text-muted">Was {formatPrice(price.was)}</s>
                  <span className="text-xs text-success">Save {savingPercent(price)}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {offer.answer && <p className="mt-4 text-sm leading-relaxed text-ink">{offer.answer}</p>}
        {offer.details && (
          <dl className="mt-3 space-y-3 text-sm">
            {offer.details.map((block) => (
              <div key={block.title}>
                <dt className="font-semibold text-ink">{block.title}</dt>
                <dd className="text-muted">{block.text}</dd>
              </div>
            ))}
          </dl>
        )}

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-berry">What you get</h3>
        <ul className="mt-2 space-y-2">
          {offer.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-berry">Ideal for</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {offer.idealFor.map((item) => (
            <li key={item} className="rounded-full border border-berry/20 px-3 py-1 text-sm text-ink">
              {item}
            </li>
          ))}
        </ul>
        {offer.duration && <p className="mt-4 text-sm text-muted">Takes about {offer.duration}.</p>}

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-berry">How it works</h3>
        <ol className="mt-2 space-y-3">
          {offer.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-ink">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-berry text-xs font-semibold text-cream">{i + 1}</span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-berry">Terms</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {offer.terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>

        <div className="mt-6 divide-y divide-ink/10 rounded-2xl bg-white px-4 shadow-soft">
          {offer.faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown aria-hidden className="size-4 shrink-0 text-berry transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>

        {offer.serviceLink && (
          <a href={offer.serviceLink} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline">
            More about {offer.title}
            <ArrowRight aria-hidden className="size-4" />
          </a>
        )}
      </div>
      <div className="shrink-0 border-t border-ink/10 bg-cream px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button type="button" onClick={onClaim} className={cn(MAIN, 'bg-berry text-cream hover:bg-berrydark')}>
          Claim this offer
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </>
  );
}

function Claim({ offer, titleId, state, onClose, onBack }: { offer: SheetOffer; titleId: string; state: SheetState; onClose: () => void; onBack: () => void }) {
  const booking = useBooking();
  const fixed = state.branch;
  const [salonId, setSalonId] = useState<string | undefined>(fixed ?? getBranch() ?? undefined);
  const [day, setDay] = useState<ClaimDay>('Pick later');
  const salon = salonById(salonId ?? '');
  const params = { offer_id: offer.id, branch: salonId ?? 'none', placement: state.placement };

  useEffect(() => setSalonId(fixed ?? getBranch() ?? undefined), [offer.id, fixed]);

  const choose = (id: string) => {
    setSalonId(id);
    setBranch(id);
    track('branch_select', { ...params, branch: id });
  };

  return (
    <>
      <SheetHeader offer={offer} titleId={titleId} title={`Claim ${offer.title}`} onClose={onClose} onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-ink">Which salon?</legend>
          <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                role="radio"
                aria-checked={salonId === loc.id}
                onClick={() => choose(loc.id)}
                className={cn(PILL, 'px-2 text-[0.8125rem] leading-tight', salonId === loc.id ? PILL_ON : PILL_OFF)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="flex items-center gap-2 text-sm font-semibold text-ink">
            <CalendarDays aria-hidden className="size-4 text-berry" />
            When would you like to come?
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
            {CLAIM_DAYS.map((option) => (
              <button key={option} type="button" role="radio" aria-checked={day === option} onClick={() => setDay(option)} className={cn(PILL, day === option ? PILL_ON : PILL_OFF)}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="mt-4 text-xs leading-relaxed text-muted">Your salon confirms the time, and the price before starting. Nothing is charged online.</p>
      </div>

      <div className="shrink-0 space-y-2 border-t border-ink/10 bg-cream px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {salon ? (
          <a
            href={`${salon.whatsappHref}?text=${encodeURIComponent(claimText(offer, salon, day))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track('offer_claim_whatsapp', params);
              if (offer.campaign) track('nov_offer_claim', params);
            }}
            className={cn(MAIN, 'bg-whatsapp text-white hover:brightness-105')}
          >
            <WhatsAppIcon className="size-5" />
            Send on WhatsApp
          </a>
        ) : (
          <p role="status" className={cn(MAIN, 'cursor-default bg-ink/10 text-muted')}>
            Choose a salon to send
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={salon?.phoneHref ?? PICK_CALL}
            onClick={() => track('offer_claim_call', params)}
            className={cn(PILL, 'gap-2 border-berry text-berry hover:bg-berry hover:text-cream')}
          >
            <Phone aria-hidden className="size-4" />
            Call salon
          </a>
          <button
            type="button"
            onClick={() => {
              track('offer_claim_book', params);
              if (offer.campaign) track('nov_offer_book', params);
              onClose();
              booking.open(offer.bookingService, salon?.name ?? '', '', `${offer.title} (${offer.claimDetail ?? offer.badge})`);
            }}
            className={cn(PILL, 'gap-2 border-berry text-berry hover:bg-berry hover:text-cream')}
          >
            <CalendarDays aria-hidden className="size-4" />
            Book a Slot
          </button>
        </div>
      </div>
    </>
  );
}
