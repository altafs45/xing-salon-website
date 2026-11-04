import type { Salon } from '../data/branches';
import { campaignState, type SheetOffer } from '../data/offers';

/** Where an offer was seen or claimed, for tracking. */
export type OfferPlacement = 'home' | 'offers' | 'popup' | 'sheet' | 'salon' | 'november';

export const CLAIM_DAYS = ['Today', 'Tomorrow', 'This weekend', 'Pick later'] as const;
export type ClaimDay = (typeof CLAIM_DAYS)[number];

/** The prefilled WhatsApp message for claiming an offer at one salon. */
export const claimText = (offer: SheetOffer, salon: Salon, day: ClaimDay) =>
  `Hi Xing ${salon.name}! I’d like to ${offer.campaign && campaignState() === 'upcoming' ? 'book for November:' : 'claim'} the *${offer.title}*${offer.campaign ? ' November' : ''} offer (${offer.claimDetail ?? offer.badge}). Preferred: ${day === 'Pick later' ? 'I’ll confirm the day' : day}. My name: `;
