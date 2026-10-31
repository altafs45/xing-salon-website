// The gift card / membership request form: a bottom sheet on phones, a centred dialog on larger screens.
// Loaded on the first call to action (or when the browser is idle), so the page itself doesn't wait for it.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, CircleCheckBig, Loader2, Pencil, Phone, X } from 'lucide-react';
import {
  DELIVERY_METHODS,
  occasionBySlug,
  occasions,
  paymentOptions,
  salonByKey,
  salons,
  SERVICE_CHOICES,
  tierByKey,
  tiers,
  type SalonKey,
} from '../../data/giftMembership';
import { useHistoryClose } from '../../hooks/useHistoryClose';
import { track } from '../../lib/analytics';
import { getBranch } from '../../lib/branch';
import { cn } from '../../lib/cn';
import { makeLeadId, productLabel, whatsappText, whatsappUrl } from '../../shared/leadMessages';
import { fieldErrors, leadSchema, MESSAGE_MAX, todayIST, type Lead, type LeadType } from '../../shared/leadSchema';
import { WhatsAppIcon } from '../ui/Decor';
import { Modal } from '../ui/Modal';
import { GiftCardPreview } from './GiftCardPreview';
import { PRIMARY, Proof, SECONDARY, WHATSAPP, type LeadRequest } from './shared';

const ENDPOINT = '/api/leads/gift-membership';
const DRAFT_KEY = 'xing-gm-draft';
const PAYMENTS_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';

interface FormState {
  type: LeadType;
  product: string;
  name: string;
  phone: string;
  email: string;
  salon: SalonKey | '';
  users: 'me' | 'family';
  familyNames: [string, string];
  services: string[];
  startDate: string;
  recipientName: string;
  recipientPhone: string;
  message: string;
  deliveryDate: string;
  deliveryMethod: 'whatsapp' | 'email' | 'printed';
  company: string;
  cards: string;
  logo: 'yes' | 'no';
  gstin: string;
  payment: 'online' | 'salon' | 'call' | '';
  consent: boolean;
  company_website: string;
}

type Field = keyof FormState;

/** Which schema path each field's error comes from. */
const ERROR_KEY: Partial<Record<Field, string>> = {
  users: 'membership.users',
  familyNames: 'membership.familyNames',
  startDate: 'membership.startDate',
  services: 'membership.services',
  recipientName: 'gift.recipientName',
  recipientPhone: 'gift.recipientPhone',
  message: 'gift.message',
  deliveryDate: 'gift.deliveryDate',
  deliveryMethod: 'gift.deliveryMethod',
  company: 'corporate.company',
  cards: 'corporate.cards',
  gstin: 'corporate.gstin',
};
const errorKey = (field: Field) => ERROR_KEY[field] ?? field;

const STEP_ONE: Field[] = ['name', 'phone', 'email', 'salon', 'product', 'users', 'familyNames'];
const STEP_TWO: Record<LeadType, Field[]> = {
  gift: ['recipientName', 'recipientPhone', 'message', 'deliveryDate', 'deliveryMethod', 'payment', 'consent'],
  membership: ['services', 'startDate', 'payment', 'consent'],
  corporate: ['company', 'cards', 'gstin', 'payment', 'consent'],
};

/** Typed fields worth keeping if the page reloads. Consent is always asked again. */
const DRAFTED: Field[] = ['name', 'phone', 'email', 'salon', 'users', 'familyNames', 'services', 'startDate', 'recipientName', 'recipientPhone', 'message', 'deliveryMethod', 'company', 'cards', 'logo', 'gstin', 'payment'];

const SALON_FROM_BRANCH: Record<string, SalonKey> = Object.fromEntries(salons.map((salon) => [salon.locationId, salon.key]));

function blank(request: LeadRequest): FormState {
  return {
    type: request.type,
    product: request.product,
    name: '',
    phone: '',
    email: '',
    salon: SALON_FROM_BRANCH[getBranch() ?? ''] ?? '',
    users: 'me',
    familyNames: ['', ''],
    services: [],
    startDate: '',
    recipientName: '',
    recipientPhone: '',
    message: '',
    deliveryDate: todayIST(),
    deliveryMethod: 'whatsapp',
    company: '',
    cards: '',
    logo: 'yes',
    gstin: '',
    payment: '',
    consent: false,
    company_website: '',
  };
}

function readDraft(): Partial<FormState> {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}');
    return Object.fromEntries(DRAFTED.filter((field) => field in draft).map((field) => [field, draft[field]]));
  } catch {
    return {};
  }
}

function writeDraft(form: FormState | null) {
  try {
    if (form) localStorage.setItem(DRAFT_KEY, JSON.stringify(Object.fromEntries(DRAFTED.map((field) => [field, form[field]]))));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Private mode or blocked storage: the draft just isn't kept.
  }
}

const utmParams = () =>
  Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([key]) => key.startsWith('utm_')).map(([key, value]) => [key.slice(0, 40), value.slice(0, 120)]));

const deviceType = () => (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop');

/** The request as the shared schema expects it. */
function toPayload(form: FormState, formStartedAt: number) {
  const common = {
    name: form.name,
    phone: form.phone,
    email: form.email,
    salon: form.salon || undefined,
    payment: form.payment || undefined,
    consent: form.consent,
    company_website: form.company_website,
    formStartedAt,
    meta: { utm: utmParams(), pageUrl: window.location.href.slice(0, 500), device: deviceType() },
  };
  if (form.type === 'gift')
    return {
      ...common,
      type: 'gift',
      product: form.product,
      gift: {
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        occasion: form.product,
        message: form.message,
        deliveryDate: form.deliveryDate,
        deliveryMethod: form.deliveryMethod,
      },
    };
  if (form.type === 'membership') {
    const seats = tierByKey(form.product)?.familySeats ?? 0;
    return {
      ...common,
      type: 'membership',
      product: form.product,
      membership: {
        users: form.users,
        familyNames: form.users === 'family' ? form.familyNames.slice(0, Math.max(seats, 1)) : [],
        services: form.services,
        startDate: form.startDate,
      },
    };
  }
  return {
    ...common,
    type: 'corporate',
    product: form.product,
    corporate: { company: form.company, cards: form.cards, logo: form.logo === 'yes', gstin: form.gstin },
  };
}

const INPUT = 'field min-h-12 text-base';
const LABEL = 'block text-base font-medium text-ink md:text-sm';
const CHOICE =
  'flex min-h-12 h-full items-center justify-center rounded-xl border border-ink/20 bg-white px-2 text-center text-base leading-tight text-ink transition-colors peer-checked:border-berry peer-checked:bg-berry peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-berry peer-disabled:cursor-not-allowed peer-disabled:opacity-50 motion-reduce:transition-none md:text-sm';

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-berry">
      <span aria-hidden>⚠</span>
      {message}
    </p>
  );
}

function Fieldset({ legend, error, errorId, children, className }: { legend: string; error?: string; errorId: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn('min-w-0', className)} aria-describedby={error ? errorId : undefined}>
      <legend className={LABEL}>{legend}</legend>
      {children}
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

type View = 'form' | 'picker' | 'success' | 'fallback';

interface LeadFormSheetProps {
  request: LeadRequest | null;
  onClose: () => void;
}

export default function LeadFormSheet({ request, onClose }: LeadFormSheetProps) {
  const open = request !== null;
  const [form, setForm] = useState<FormState>(() => blank(request ?? { type: 'membership', product: 'gold' }));
  const [step, setStep] = useState<1 | 2>(1);
  const [view, setView] = useState<View>('form');
  const [touched, setTouched] = useState<Set<Field>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ leadId: string; whatsappUrl: string } | null>(null);
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // A fresh form for each call to action, prefilled with what it asked for and anything typed before a reload.
  useEffect(() => {
    if (!request) return;
    setForm({ ...blank(request), ...readDraft(), type: request.type, product: request.product });
    setStep(1);
    setView('form');
    setTouched(new Set());
    setShowAll(false);
    setNotice('');
    setServerErrors({});
    setResult(null);
    startedAt.current = Date.now();
    track('gm_form_open', { type: request.type, product: request.product });
  }, [request]);

  // Only one bar at the foot of the screen: the quick-actions bar steps aside while the sheet is open.
  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.sheetOpen = '';
    return () => {
      delete document.documentElement.dataset.sheetOpen;
    };
  }, [open]);

  const dirty = view === 'form' && !!(form.name || form.phone || form.email || form.recipientName || form.message || form.company);

  // Esc and a tap on the backdrop ask first when something has been typed. Back always closes (the draft is kept).
  const requestClose = useCallback(() => {
    if (dirty && !window.confirm('Close this form? What you typed is kept on this device for next time.')) return;
    onClose();
  }, [dirty, onClose]);
  useHistoryClose(open, onClose);

  const allErrors = useMemo(() => {
    const parsed = leadSchema.safeParse(toPayload(form, 0));
    return parsed.success ? {} : fieldErrors(parsed.error);
  }, [form]);

  const errorFor = (field: Field) => {
    const key = errorKey(field);
    const message = serverErrors[key] ?? allErrors[key];
    return message && (showAll || touched.has(field) || serverErrors[key]) ? message : undefined;
  };

  // Saved on each edit (not from an effect), so a draft is only ever overwritten by what the visitor typed.
  const update = <K extends Field>(field: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      writeDraft(next);
      return next;
    });
    if (serverErrors[errorKey(field)]) setServerErrors(({ [errorKey(field)]: _drop, ...rest }) => rest);
  };
  const blur = (field: Field) => () => setTouched((prev) => new Set(prev).add(field));

  const stepFields = step === 1 ? STEP_ONE : STEP_TWO[form.type];
  const stepErrors = stepFields.filter((field) => allErrors[errorKey(field)]);

  const goTo = (next: 1 | 2) => {
    setStep(next);
    setShowAll(false);
    setNotice('');
    track('gm_form_step', { step: next });
    scrollRef.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  /** Moves focus to the first field with an error. */
  const focusFirstError = (fields: Field[]) => {
    const first = fields.find((field) => allErrors[errorKey(field)] || serverErrors[errorKey(field)]);
    if (first) requestAnimationFrame(() => document.getElementById(`gm-${first}`)?.focus());
  };

  const salon = form.salon ? salonByKey(form.salon) : undefined;
  const firstName = form.name.trim().split(/\s+/)[0] ?? '';

  /** The WhatsApp link to the chosen salon, built here when the server couldn't be reached. */
  const fallbackLink = (leadId: string) => {
    const parsed = leadSchema.safeParse(toPayload(form, 0));
    const text = parsed.success ? whatsappText(parsed.data as Lead, leadId) : `Hi XING ${salon?.name ?? ''}! 💖 I'd like to know more about ${productLabel(form as Pick<Lead, 'type' | 'product'>)}. Request ID: ${leadId}`;
    return whatsappUrl(salon?.defaultWa ?? salons[0].defaultWa, text);
  };

  /** The server couldn't take it: the lead must never be lost, so the client sends it on WhatsApp instead. */
  const fallBack = (code: string) => {
    track('gm_form_submit_error', { code });
    const leadId = makeLeadId();
    setResult({ leadId, whatsappUrl: fallbackLink(leadId) });
    setView('fallback');
  };

  const submit = async () => {
    setSending(true);
    setNotice('');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toPayload(form, startedAt.current)) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        track('gm_form_submit_success', { type: form.type, product: form.product, salon: form.salon });
        writeDraft(null);
        setResult({ leadId: body.leadId, whatsappUrl: body.whatsappUrl || fallbackLink(body.leadId) });
        setView('success');
      } else if (body.code === 'invalid' && body.errors) {
        track('gm_form_submit_error', { code: 'invalid' });
        setServerErrors(body.errors);
        setShowAll(true);
        const onFirst = STEP_ONE.some((field) => body.errors[errorKey(field)]);
        if (onFirst) setStep(1);
        setNotice('Please check the highlighted details.');
        focusFirstError(onFirst ? STEP_ONE : STEP_TWO[form.type]);
      } else if (body.code === 'too_fast') {
        track('gm_form_submit_error', { code: 'too_fast' });
        setNotice('That was quick! Please check your details and tap send again.');
      } else {
        fallBack(body.code ?? `http_${res.status}`);
      }
    } catch {
      fallBack('network');
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (view === 'picker') return setView('form');
    if (stepErrors.length) {
      setShowAll(true);
      setNotice(`Please check ${stepErrors.length === 1 ? 'the highlighted field' : `the ${stepErrors.length} highlighted fields`}.`);
      focusFirstError(stepFields);
      return;
    }
    if (step === 1) goTo(2);
    else void submit();
  };

  const title =
    view === 'success' || view === 'fallback'
      ? 'Request received'
      : form.type === 'membership'
        ? `Get ${tierByKey(form.product)?.name ?? 'XING'} Membership`
        : form.type === 'corporate'
          ? 'Corporate Gift Cards'
          : 'Send a Gift Card';

  const occasion = occasionBySlug(form.product);
  const tier = tierByKey(form.product);

  // ---------- Pieces

  const text = (field: Field, label: string, props: { optional?: boolean; hint?: string; type?: string; autoComplete?: string; inputMode?: 'numeric' | 'email' | 'text'; maxLength?: number } = {}) => {
    const error = errorFor(field);
    const id = `gm-${field}`;
    const describedBy = [props.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
    return (
      <div>
        <label htmlFor={id} className={LABEL}>
          {label}
          {props.optional ? <span className="font-normal text-muted"> (optional)</span> : <span aria-hidden className="text-berry"> *</span>}
        </label>
        {props.hint && (
          <p id={`${id}-hint`} className="mt-0.5 text-sm text-muted">
            {props.hint}
          </p>
        )}
        <input
          id={id}
          type={props.type ?? 'text'}
          autoComplete={props.autoComplete ?? 'off'}
          inputMode={props.inputMode}
          maxLength={props.maxLength}
          required={!props.optional}
          value={form[field] as string}
          onChange={(e) => update(field, e.target.value as never)}
          onBlur={blur(field)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(INPUT, 'mt-2', error && 'border-berry')}
        />
        <FieldError id={`${id}-error`} message={error} />
      </div>
    );
  };

  const phoneInput = (field: 'phone' | 'recipientPhone', label: string, optional = false) => {
    const error = errorFor(field);
    const id = `gm-${field}`;
    return (
      <div>
        <label htmlFor={id} className={LABEL}>
          {label}
          {optional ? <span className="font-normal text-muted"> (optional)</span> : <span aria-hidden className="text-berry"> *</span>}
        </label>
        <div className="mt-2 flex">
          <span aria-hidden className="grid min-h-12 place-items-center rounded-l-lg border border-r-0 border-ink/20 bg-blush px-3 text-base text-ink">
            +91
          </span>
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete={field === 'phone' ? 'tel-national' : 'off'}
            required={!optional}
            value={form[field]}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              // A pasted "+91 98765 43210" or "098765 43210" keeps just the 10 digits.
              update(field, (digits.length > 10 ? digits.replace(/^(91|0)/, '') : digits).slice(0, 10));
            }}
            onBlur={blur(field)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(INPUT, 'rounded-l-none', error && 'border-berry')}
          />
        </div>
        <FieldError id={`${id}-error`} message={error} />
      </div>
    );
  };

  const radios = <K extends Field>(field: K, legend: string, options: ReadonlyArray<{ value: FormState[K]; label: string; note?: string; disabled?: boolean }>, columns: string, optional = false) => (
    <Fieldset legend={`${legend}${optional ? '' : ' *'}`} error={errorFor(field)} errorId={`gm-${field}-error`}>
      <div className={cn('mt-2 grid gap-2', columns)}>
        {options.map((option, i) => (
          <label key={String(option.value)} className="relative cursor-pointer">
            <input
              id={i === 0 ? `gm-${field}` : undefined}
              type="radio"
              name={`gm-${field}`}
              checked={form[field] === option.value}
              disabled={option.disabled}
              onChange={() => update(field, option.value)}
              onBlur={blur(field)}
              className="peer sr-only"
            />
            <span className={cn(CHOICE, 'flex-col py-1.5')}>
              {option.label}
              {option.note && <span className="text-xs opacity-80">{option.note}</span>}
            </span>
          </label>
        ))}
      </div>
    </Fieldset>
  );

  const salonChoice = radios(
    'salon',
    'Preferred salon',
    salons.map((entry) => ({ value: entry.key, label: entry.name })),
    'grid-cols-3',
  );

  const summary = (
    <div className="flex items-center gap-3 rounded-2xl border border-berry/20 bg-white p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-berry">
        <Check aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">Selected</p>
        <p className="text-base font-semibold leading-snug text-ink">{productLabel(form as Pick<Lead, 'type' | 'product'>)}</p>
      </div>
      <button type="button" onClick={() => setView('picker')} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-base font-medium text-berry hover:bg-blush md:text-sm">
        <Pencil aria-hidden className="size-4" />
        Change
      </button>
    </div>
  );

  const stepOne = (
    <div className="space-y-5">
      {summary}
      {text('name', 'Full name', { autoComplete: 'name', maxLength: 60 })}
      {phoneInput('phone', 'Mobile number')}
      {text('email', 'Email', { optional: true, type: 'email', inputMode: 'email', autoComplete: 'email', hint: 'For your confirmation & e-receipt', maxLength: 120 })}
      {salonChoice}
      {form.type === 'membership' && tier && (
        <>
          {radios(
            'users',
            'Who will use it?',
            [
              { value: 'me' as const, label: 'Just me' },
              { value: 'family' as const, label: 'Me + family', note: tier.familySeats ? `Up to ${tier.familySeats}` : 'Gold & Privé', disabled: tier.familySeats === 0 },
            ],
            'grid-cols-2',
          )}
          {form.users === 'family' && tier.familySeats > 0 && (
            <div className="space-y-3">
              {Array.from({ length: tier.familySeats }, (_, i) => (
                <div key={i}>
                  <label htmlFor={i === 0 ? 'gm-familyNames' : `gm-familyNames-${i}`} className={LABEL}>
                    Family member {tier.familySeats > 1 ? i + 1 : ''} name{i === 0 ? <span aria-hidden className="text-berry"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
                  </label>
                  <input
                    id={i === 0 ? 'gm-familyNames' : `gm-familyNames-${i}`}
                    type="text"
                    autoComplete="off"
                    maxLength={60}
                    value={form.familyNames[i]}
                    onChange={(e) => {
                      const names: [string, string] = [...form.familyNames];
                      names[i] = e.target.value;
                      update('familyNames', names);
                    }}
                    onBlur={blur('familyNames')}
                    aria-invalid={i === 0 && !!errorFor('familyNames')}
                    aria-describedby={i === 0 && errorFor('familyNames') ? 'gm-familyNames-error' : undefined}
                    className={cn(INPUT, 'mt-2')}
                  />
                </div>
              ))}
              <FieldError id="gm-familyNames-error" message={errorFor('familyNames')} />
            </div>
          )}
        </>
      )}
    </div>
  );

  const payment = radios(
    'payment',
    'How would you like to pay?',
    paymentOptions.map((option) => ({
      value: option.key,
      label: option.label,
      note: option.key === 'online' && !PAYMENTS_ENABLED ? 'Launching soon' : undefined,
      disabled: option.key === 'online' && !PAYMENTS_ENABLED,
    })),
    'grid-cols-1 xs:grid-cols-3',
  );

  const consent = (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl p-1">
        <input
          id="gm-consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update('consent', e.target.checked)}
          onBlur={blur('consent')}
          aria-invalid={!!errorFor('consent')}
          aria-describedby={errorFor('consent') ? 'gm-consent-error' : undefined}
          className="mt-0.5 size-6 shrink-0 accent-berry"
        />
        <span className="text-base text-ink md:text-sm">I agree to be contacted by XING on WhatsApp, call or email about this request. *</span>
      </label>
      <FieldError id="gm-consent-error" message={errorFor('consent')} />
    </div>
  );

  const giftStep = occasion && (
    <div className="space-y-5">
      <GiftCardPreview live theme={occasion.theme} label={occasion.cardLabel} recipient={form.recipientName.trim()} message={form.message.trim()} sender={firstName} className="mx-auto max-w-sm" />
      {text('recipientName', 'Recipient name', { maxLength: 60 })}
      {phoneInput('recipientPhone', 'Recipient mobile', true)}
      <div>
        <label htmlFor="gm-product" className={LABEL}>
          Occasion
        </label>
        <select id="gm-product" value={form.product} onChange={(e) => update('product', e.target.value)} className={cn(INPUT, 'mt-2')}>
          {occasions
            .filter((entry) => !entry.corporate)
            .map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.title}
              </option>
            ))}
        </select>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="gm-message" className={LABEL}>
            Personal message <span className="font-normal text-muted">(optional)</span>
          </label>
          <span aria-live="polite" className="text-sm text-muted">
            {form.message.length}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          id="gm-message"
          rows={3}
          maxLength={MESSAGE_MAX}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          onBlur={blur('message')}
          aria-invalid={!!errorFor('message')}
          aria-describedby={errorFor('message') ? 'gm-message-error' : 'gm-message-ideas'}
          className={cn(INPUT, 'mt-2')}
        />
        <FieldError id="gm-message-error" message={errorFor('message')} />
        <div id="gm-message-ideas" className="mt-2 flex flex-wrap gap-2">
          <span className="sr-only">Message ideas:</span>
          {occasion.messages.map((idea) => (
            <button key={idea} type="button" onClick={() => update('message', idea.slice(0, MESSAGE_MAX))} className="min-h-11 rounded-full border border-berry/25 bg-white px-3 text-left text-sm text-ink hover:border-berry">
              {idea}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="gm-deliveryDate" className={LABEL}>
          Delivery date <span aria-hidden className="text-berry">*</span>
        </label>
        <input
          id="gm-deliveryDate"
          type="date"
          min={todayIST()}
          value={form.deliveryDate}
          onChange={(e) => update('deliveryDate', e.target.value)}
          onBlur={blur('deliveryDate')}
          aria-invalid={!!errorFor('deliveryDate')}
          aria-describedby={errorFor('deliveryDate') ? 'gm-deliveryDate-error' : undefined}
          className={cn(INPUT, 'mt-2')}
        />
        <FieldError id="gm-deliveryDate-error" message={errorFor('deliveryDate')} />
      </div>
      {radios(
        'deliveryMethod',
        'Delivery',
        DELIVERY_METHODS.map((method) => ({ value: method.key, label: method.label })),
        'grid-cols-1 xs:grid-cols-3',
      )}
    </div>
  );

  const membershipStep = (
    <div className="space-y-5">
      <Fieldset legend="Services you’re most interested in (optional)" errorId="gm-services-error" error={errorFor('services')}>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICE_CHOICES.map((service, i) => (
            <label key={service} className="relative cursor-pointer">
              <input
                id={i === 0 ? 'gm-services' : undefined}
                type="checkbox"
                checked={form.services.includes(service)}
                onChange={(e) => update('services', e.target.checked ? [...form.services, service] : form.services.filter((entry) => entry !== service))}
                className="peer sr-only"
              />
              <span className={cn(CHOICE, 'rounded-full px-4')}>{service}</span>
            </label>
          ))}
        </div>
      </Fieldset>
      <div>
        <label htmlFor="gm-startDate" className={LABEL}>
          Preferred start date <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="gm-startDate"
          type="date"
          min={todayIST()}
          value={form.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          onBlur={blur('startDate')}
          aria-invalid={!!errorFor('startDate')}
          aria-describedby={errorFor('startDate') ? 'gm-startDate-error' : undefined}
          className={cn(INPUT, 'mt-2')}
        />
        <FieldError id="gm-startDate-error" message={errorFor('startDate')} />
      </div>
    </div>
  );

  const corporateStep = (
    <div className="space-y-5">
      {text('company', 'Company name', { autoComplete: 'organization', maxLength: 100 })}
      {text('cards', 'Number of cards', { inputMode: 'numeric', hint: 'Corporate orders start at 10 cards.', maxLength: 5 })}
      {radios(
        'logo',
        'Company logo on the e-card',
        [
          { value: 'yes' as const, label: 'Yes' },
          { value: 'no' as const, label: 'No' },
        ],
        'grid-cols-2',
      )}
      {text('gstin', 'GSTIN', { optional: true, maxLength: 15 })}
    </div>
  );

  const picker = (
    <div className="space-y-5">
      <div role="radiogroup" aria-label="What would you like?" className="grid grid-cols-2 rounded-full bg-white p-1 shadow-soft">
        {(['gift', 'membership'] as const).map((type) => {
          const active = type === 'gift' ? form.type !== 'membership' : form.type === 'membership';
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => !active && setForm((prev) => ({ ...prev, type, product: type === 'gift' ? 'value' : 'gold' }))}
              className={cn('min-h-11 rounded-full text-base font-semibold', active ? 'bg-berry text-cream' : 'text-ink')}
            >
              {type === 'gift' ? 'Gift Card' : 'Membership'}
            </button>
          );
        })}
      </div>
      <fieldset className="min-w-0">
        <legend className="sr-only">Choose one</legend>
        <ul className="space-y-2">
          {(form.type === 'membership'
            ? tiers.map((entry) => ({ value: entry.key, type: 'membership' as const, label: entry.name, note: `+${entry.bonus}% bonus value · ${entry.validityMonths} months` }))
            : occasions.map((entry) => ({ value: entry.slug, type: entry.corporate ? ('corporate' as const) : ('gift' as const), label: entry.title, note: entry.heading }))
          ).map((option) => (
            <li key={option.value}>
              <label className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="gm-pick"
                  checked={form.product === option.value}
                  onChange={() => {
                    setForm((prev) => ({ ...prev, type: option.type, product: option.value }));
                    setView('form');
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-white px-4 py-2 peer-checked:border-berry peer-checked:ring-1 peer-checked:ring-berry peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-berry">
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-ink">{option.label}</span>
                    <span className="block text-sm text-muted">{option.note}</span>
                  </span>
                  {form.product === option.value && <Check aria-hidden className="size-5 shrink-0 text-berry" />}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );

  const done = result && salon && (
    <div className="py-4 text-center" role="status" aria-live="polite">
      <CircleCheckBig aria-hidden className="mx-auto size-14 text-success" />
      {view === 'success' ? (
        <>
          <p className="mt-4 font-display text-3xl font-medium text-ink">Request received, {firstName}!</p>
          <p className="mt-2 text-base text-ink">
            Lead ID: <strong className="font-semibold tracking-wide">{result.leadId}</strong>
          </p>
          <p className="mx-auto mt-3 max-w-sm text-base text-muted">Our {salon.name} team will confirm on WhatsApp within 30 minutes during salon hours.</p>
        </>
      ) : (
        <>
          <p className="mt-4 font-display text-3xl font-medium text-ink">Almost there, {firstName}</p>
          <p className="mx-auto mt-3 max-w-sm text-base text-ink">We couldn’t send that automatically — tap below to send on WhatsApp instead.</p>
          <p className="mt-2 text-sm text-muted">
            Request ID: <strong className="font-semibold tracking-wide text-ink">{result.leadId}</strong>
          </p>
        </>
      )}
    </div>
  );

  const finished = view === 'success' || view === 'fallback';

  return (
    <Modal open={open} onClose={requestClose} labelledBy="lead-title" layout="form">
      <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-ink/10 px-5 pb-3 pt-1 md:pt-4">
          {view === 'picker' || (view === 'form' && step === 2) ? (
            <button type="button" onClick={() => (view === 'picker' ? setView('form') : goTo(1))} aria-label="Back" className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush">
              <ArrowLeft aria-hidden className="size-5" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 id="lead-title" ref={headingRef} tabIndex={-1} className="text-balance font-display text-xl font-medium leading-tight text-ink outline-none sm:text-2xl">
              {view === 'picker' ? 'Choose a gift card or plan' : title}
            </h2>
            {view === 'form' && <p className="text-sm text-muted">Step {step} of 2 · {step === 1 ? 'Your details' : form.type === 'gift' ? 'Personalise' : 'Preferences'}</p>}
          </div>
          <button type="button" onClick={requestClose} aria-label="Close" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush">
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
          <div aria-hidden className="sr-only">
            <label>
              Company website
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={(e) => update('company_website', e.target.value)} />
            </label>
          </div>

          {view === 'picker' && picker}
          {view === 'form' && step === 1 && stepOne}
          {view === 'form' && step === 2 && (
            <div className="space-y-6">
              {form.type === 'gift' ? giftStep : form.type === 'membership' ? membershipStep : corporateStep}
              {payment}
              {consent}
            </div>
          )}
          {finished && done}
        </div>

        <div className="shrink-0 border-t border-ink/10 bg-cream px-5 pt-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
          <p aria-live="assertive" className={cn('text-center text-sm font-medium text-berry', notice && 'mb-2')}>
            {notice}
          </p>
          {finished && result && salon ? (
            <div className="flex flex-col gap-2">
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-no-track
                onClick={() => track('gm_whatsapp_click', { salon: salon.key })}
                className={cn(WHATSAPP, 'w-full')}
              >
                <WhatsAppIcon className="size-5" />
                Send on WhatsApp
              </a>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <a href={salon.tel} data-no-track onClick={() => track('gm_call_click', { salon: salon.key })} className={cn(SECONDARY, 'whitespace-nowrap px-3')}>
                  <Phone aria-hidden className="size-4" />
                  Call {salon.name}
                </a>
                <button type="button" onClick={onClose} className={cn(SECONDARY, 'px-5')}>
                  Done
                </button>
              </div>
            </div>
          ) : view === 'picker' ? (
            <button type="submit" className={cn(PRIMARY, 'w-full')}>
              Done
            </button>
          ) : (
            <>
              <button type="submit" disabled={sending} aria-busy={sending} className={cn(PRIMARY, 'w-full disabled:opacity-70')}>
                {sending ? <Loader2 aria-hidden className="size-5 animate-spin motion-reduce:animate-none" /> : null}
                {sending ? 'Sending…' : step === 1 ? 'Continue' : 'Confirm & Send Request'}
                {!sending && step === 1 && <ArrowRight aria-hidden className="size-4" />}
              </button>
              <Proof className="mt-2" />
            </>
          )}
        </div>
      </form>
    </Modal>
  );
}
