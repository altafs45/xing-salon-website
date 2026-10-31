import { locations, SALON_HOURS, salonById, type Salon } from '../data/branches';
import { campaignState, type SalonOffer, type SheetOffer } from '../data/offers';
import { useBranch } from './branch';
import { isPrerender } from './prerender';
import { PICK_WHATSAPP } from './whatsapp';

/** Where an offer was seen or claimed, for tracking. */
export type OfferPlacement = 'home' | 'offers' | 'popup' | 'sheet' | 'salon' | 'november';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Today's weekday in salon time (Asia/Kolkata), 0 = Sunday. */
export const salonWeekday = () =>
  WEEKDAYS.indexOf(new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: SALON_HOURS.timeZone }).format(new Date()));

/** True on the day an offer runs (Tuesday Happy Hours on Tuesdays). */
export const isOfferToday = (offer: Pick<SalonOffer, 'weekday'>) => !isPrerender && offer.weekday != null && offer.weekday === salonWeekday();

/** The visitor's chosen salon, if any (shared with the branch picker, salon tabs and the sticky bar). */
export const useChosenSalon = (): Salon | undefined => salonById(useBranch() ?? '');

/** "Valid at Brookfield", or at every salon when none is chosen. */
export const validAt = (offer: SalonOffer, salon?: Salon) =>
  salon && offer.branches.includes(salon.id as SalonOffer['branches'][number])
    ? `Valid at ${salon.name}`
    : offer.branches.length === locations.length
      ? 'Valid at all 3 salons'
      : `Valid at ${locations.filter((loc) => offer.branches.includes(loc.id as SalonOffer['branches'][number])).map((loc) => loc.name).join(', ')}`;

export const CLAIM_DAYS = ['Today', 'Tomorrow', 'This weekend', 'Pick later'] as const;
export type ClaimDay = (typeof CLAIM_DAYS)[number];

/** The prefilled WhatsApp message for claiming an offer at one salon. */
export const claimText = (offer: SheetOffer, salon: Salon, day: ClaimDay) =>
  `Hi Xing ${salon.name}! I’d like to ${offer.campaign && campaignState() === 'upcoming' ? 'book for November:' : 'claim'} the *${offer.title}*${offer.campaign ? ' November' : ''} offer (${offer.claimDetail ?? offer.badge}). Preferred: ${day === 'Pick later' ? 'I’ll confirm the day' : day}. My name: `;

/** WhatsApp for claiming any offer: straight to the chosen salon, or through the salon picker. */
export const generalClaimHref = (salon?: Salon) => {
  const text = `Hi Xing ${salon?.name ?? '___ (location)'}! I’d like to claim one of your current offers. My name: `;
  return salon ? `${salon.whatsappHref}?text=${encodeURIComponent(text)}` : `${PICK_WHATSAPP}&text=${encodeURIComponent(text)}`;
};
