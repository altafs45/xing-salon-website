import type { ReactNode } from 'react';
import { ChevronDown, Clock, ExternalLink, Navigation, Phone, Star } from 'lucide-react';
import { ratingLabel, SALON_HOURS, type Salon } from '../data/branches';
import { cn } from '../lib/cn';
import { whatsappLink } from '../lib/whatsapp';
import { StatusChip } from './branch/StatusChip';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

interface SalonNapProps {
  salon: Salon;
  /** `full` on a salon's own page: today's hours, the week, rating and buttons. */
  variant?: 'compact' | 'full';
  tone?: 'light' | 'dark';
  /** Links the name to the salon's page. */
  linked?: boolean;
  className?: string;
  children?: ReactNode;
}

const ACTION = 'inline-flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium';

/**
 * A salon's name, address, phone and hours: the one place they are printed, so every page says exactly what the
 * Google Business Profile says. Plain text, so it is in the prerendered HTML.
 */
export function SalonNap({ salon, variant = 'compact', tone = 'light', linked = false, className, children }: SalonNapProps) {
  const dark = tone === 'dark';
  const full = variant === 'full';
  const name = dark ? 'text-cream' : 'text-ink';
  const soft = dark ? 'text-cream/70' : 'text-muted';
  return (
    <div className={cn('text-sm leading-relaxed', className)}>
      {linked ? (
        <a href={salon.path} className={cn('inline-flex min-h-11 items-center font-semibold transition-colors hover:text-gold lg:min-h-8', name)}>
          {salon.fullName}
        </a>
      ) : (
        <p className={cn('font-semibold', name)}>{salon.fullName}</p>
      )}
      <address className={cn('not-italic', soft)}>{salon.address}</address>
      <p className={cn('mt-1 flex items-center gap-2', soft)}>
        <Clock aria-hidden className={cn('size-3.5 shrink-0', dark ? 'text-gold' : 'text-berry')} />
        Open daily {salon.hours.label}
      </p>
      <a href={salon.phoneHref} className={cn('inline-flex min-h-11 items-center gap-2 transition-colors lg:min-h-8', soft, dark ? 'hover:text-gold' : 'hover:text-berry')}>
        <Phone aria-hidden className={cn('size-3.5 shrink-0', dark ? 'text-gold' : 'text-berry')} />
        {salon.phone}
      </a>

      {full && (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusChip salon={salon} />
            <a href={salon.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink underline-offset-4 hover:underline">
              <Star aria-hidden className="size-4 fill-gold text-gold" />
              {ratingLabel(salon.rating).replace(' ★', '')}
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </div>
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 font-medium text-berry [&::-webkit-details-marker]:hidden">
              See all hours
              <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <table className="w-full max-w-xs text-xs">
              <tbody>
                {SALON_HOURS.dayNames.map((day) => (
                  <tr key={day}>
                    <th scope="row" className="py-1 text-left font-normal">
                      {day}
                    </th>
                    <td className="py-1 text-right">{salon.hours.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          <div className="mt-2 flex flex-wrap gap-2">
            <a href={salon.phoneHref} className={cn(ACTION, 'border border-berry text-berry hover:bg-berry hover:text-cream')}>
              <Phone aria-hidden className="size-4" />
              Call
            </a>
            <a
              href={whatsappLink(`Hi Xing ${salon.name}! I’d like to book an appointment. Preferred day/time: `, salon.whatsappHref)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(ACTION, 'bg-whatsapp text-white hover:brightness-105')}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
            <a href={salon.directionsUrl} target="_blank" rel="noopener noreferrer" className={cn(ACTION, 'border border-berry text-berry hover:bg-berry hover:text-cream')}>
              <Navigation aria-hidden className="size-4" />
              Directions
            </a>
          </div>
          <p className="mt-2 text-xs text-muted">Plus code: {salon.plusCode}, Bengaluru</p>
        </>
      )}
      {children}
    </div>
  );
}
