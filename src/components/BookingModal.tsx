import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, CircleCheckBig, X } from 'lucide-react';
import { useBooking } from '../context/booking';
import { booking, locations, primaryLocation, site } from '../data/content';
import { cn } from '../lib/cn';
import { Button } from './ui/Button';
import { WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';

const EMPTY = { service: '', location: '', date: '', time: '', name: '', phone: '' };
type Form = typeof EMPTY;
type Errors = Partial<Record<keyof Form, string>>;

const SUCCESS_STEP = booking.steps.length;
const PHONE_PATTERN = /^(\+?91)?[6-9]\d{9}$/;
const MIN_NAME_LENGTH = 2;
const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

function validate(step: number, form: Form): Errors {
  const errors: Errors = {};
  if (step === 0 && !form.service) errors.service = 'Please choose a service.';
  if (step === 1) {
    if (!form.location) errors.location = 'Please choose a salon.';
    if (!form.date) errors.date = 'Please pick a date.';
    else if (form.date < today()) errors.date = 'Please pick today or a future date.';
    if (!form.time) errors.time = 'Please choose a time.';
  }
  if (step === 2) {
    if (form.name.trim().length < MIN_NAME_LENGTH) errors.name = 'Please enter your name.';
    if (!PHONE_PATTERN.test(form.phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a valid 10-digit mobile number.';
  }
  return errors;
}

interface ChoiceGroupProps {
  legend: string;
  name: keyof Form;
  options: readonly string[];
  value: string;
  error?: string;
  columns: string;
  onChange: (value: string) => void;
}

/** Radio group rendered as selectable chips. */
function ChoiceGroup({ legend, name, options, value, error, columns, onChange }: ChoiceGroupProps) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className={cn('mt-3 grid gap-2', columns)}>
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className="flex h-full items-center justify-center rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-center text-xs text-ink transition-colors hover:border-berry peer-checked:border-berry peer-checked:bg-berry peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-berry">
              {option}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs font-medium text-berry">
      {message}
    </p>
  );
}

export function BookingModal() {
  const { isOpen, service, location, detail, close } = useBooking();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Start fresh each time the modal opens, pre-filling whatever the CTA asked for.
  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...EMPTY, service, location });
    setErrors({});
    setStep(0);
  }, [isOpen, service, location]);

  // Announce each step change to keyboard and screen-reader users.
  useEffect(() => {
    if (isOpen && step > 0) headingRef.current?.focus();
  }, [isOpen, step]);

  const update = (field: keyof Form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(step + 1);
  };

  // Keep the exact menu item only while the client stays on the service it belongs to.
  const serviceLabel = detail && form.service === service ? `${form.service} (${detail})` : form.service;
  const whatsappText = `Hi ${site.name}, I'd like to book ${serviceLabel} at ${form.location} on ${form.date} at ${form.time}. Name: ${form.name.trim()}, Phone: ${form.phone.trim()}`;
  // The confirmation message goes to the salon the client picked.
  const salon = locations.find((loc) => loc.name === form.location) ?? primaryLocation;
  const summary = [
    ['Service', serviceLabel],
    ['Salon', form.location],
    ['When', `${form.date} · ${form.time}`],
    ['Name', form.name.trim()],
  ];

  return (
    <Modal open={isOpen} onClose={close} labelledBy="booking-title">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="booking-title" className="font-display text-3xl font-medium text-ink">
            {booking.title}
          </h2>
          <button
            type="button"
            aria-label="Close booking"
            onClick={close}
            className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush hover:text-berry"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        {step < SUCCESS_STEP && (
          <ol className="mt-5 flex items-center gap-2" aria-label="Booking progress">
            {booking.steps.map((label, i) => (
              <li key={label} aria-current={i === step ? 'step' : undefined} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium transition-colors',
                    i <= step ? 'bg-berry text-cream' : 'bg-blush text-muted',
                  )}
                >
                  {i < step ? <Check aria-hidden className="size-3.5" /> : i + 1}
                </span>
                <span className={cn('text-xs', i === step ? 'font-medium text-ink' : 'text-muted')}>{label}</span>
                {i < booking.steps.length - 1 && <span aria-hidden className="h-px flex-1 bg-ink/15" />}
              </li>
            ))}
          </ol>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {step === SUCCESS_STEP ? (
              <div className="text-center">
                <CircleCheckBig aria-hidden className="mx-auto size-14 text-success" strokeWidth={1.5} />
                <h3 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-2xl font-medium text-ink outline-none">
                  {booking.successTitle}
                </h3>
                <p className="mt-2 text-sm text-muted">{booking.successText}</p>
                <dl className="mt-5 space-y-2 rounded-card bg-blush p-4 text-left text-sm">
                  {summary.map(([term, detail]) => (
                    <div key={term} className="flex justify-between gap-4">
                      <dt className="text-muted">{term}</dt>
                      <dd className="text-right font-medium text-ink">{detail}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href={`${salon.whatsappHref}?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-success px-6 py-3 text-sm font-medium text-cream transition active:scale-95"
                  >
                    <WhatsAppIcon className="size-4" />
                    Confirm on WhatsApp
                  </a>
                  <Button variant="outline" arrow={false} onClick={close}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit}>
                <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                  Step {step + 1} of {booking.steps.length}: {booking.steps[step]}
                </h3>

                {step === 0 && (
                  <ChoiceGroup
                    legend="Which service would you like?"
                    name="service"
                    options={booking.services}
                    value={form.service}
                    error={errors.service}
                    columns="grid-cols-2 sm:grid-cols-3"
                    onChange={update('service')}
                  />
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <ChoiceGroup
                      legend="Choose your salon"
                      name="location"
                      options={locations.map((loc) => loc.name)}
                      value={form.location}
                      error={errors.location}
                      columns="sm:grid-cols-3"
                      onChange={update('location')}
                    />
                    <div>
                      <label htmlFor="booking-date" className="text-sm font-medium text-ink">
                        Preferred date
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        min={today()}
                        value={form.date}
                        onChange={(e) => update('date')(e.target.value)}
                        aria-invalid={Boolean(errors.date)}
                        aria-describedby={errors.date ? 'date-error' : undefined}
                        className="field mt-2"
                      />
                      <FieldError id="date-error" message={errors.date} />
                    </div>
                    <ChoiceGroup
                      legend="Preferred time"
                      name="time"
                      options={booking.slots}
                      value={form.time}
                      error={errors.time}
                      columns="grid-cols-3 sm:grid-cols-5"
                      onChange={update('time')}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="booking-name" className="text-sm font-medium text-ink">
                        Your name
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Riya Sharma"
                        value={form.name}
                        onChange={(e) => update('name')(e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className="field mt-2"
                      />
                      <FieldError id="name-error" message={errors.name} />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="text-sm font-medium text-ink">
                        Mobile number
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) => update('phone')(e.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className="field mt-2"
                      />
                      <FieldError id="phone-error" message={errors.phone} />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-2 rounded-md px-2 py-3 text-sm font-medium text-ink hover:text-berry"
                    >
                      <ArrowLeft aria-hidden className="size-4" />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit">{step === booking.steps.length - 1 ? 'Request Booking' : 'Continue'}</Button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}
