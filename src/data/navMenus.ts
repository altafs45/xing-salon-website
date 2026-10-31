// The Offers, Gifts and Salons menus, for the desktop header and the mobile drawer. Offers come straight from
// offers.ts, so a new offer appears here by itself.
import { locations, salonsPath } from './branches';
import { membershipPath } from './membershipLinks';
import { isCampaignLive, novemberCampaign, offersPath, promoHref, salonOffers, type SalonOfferId } from './offers';

export interface NavMenuItem {
  label: string;
  note?: string;
  href: string;
  highlight?: boolean;
}

export interface NavMenu {
  title: string;
  items: NavMenuItem[];
  viewAll: { label: string; href: string };
}

/** These two sit under Gifts. */
const NOT_IN_OFFERS: SalonOfferId[] = ['membership', 'gift-card'];

export const offersMenu = (): NavMenu => ({
  title: 'Offers',
  items: [
    ...(isCampaignLive() ? [{ label: 'November Hair Colour Offers', note: `ends ${novemberCampaign.endLabel}`, href: novemberCampaign.path, highlight: true }] : []),
    ...salonOffers.filter((offer) => !NOT_IN_OFFERS.includes(offer.id)).map((offer) => ({ label: offer.title, note: offer.badge, href: promoHref(offer.id) })),
  ],
  viewAll: { label: 'View all offers', href: offersPath },
});

export const giftsMenu: NavMenu = {
  title: 'Gifts',
  items: [
    { label: 'Gift Cards', href: `${membershipPath}#gift-cards` },
    { label: 'Membership Offers', href: `${membershipPath}#membership` },
    { label: 'Compare options', href: `${membershipPath}#compare` },
  ],
  viewAll: { label: 'View gift cards & membership', href: membershipPath },
};

export const salonsMenu: NavMenu = {
  title: 'Salons',
  items: locations.map((salon) => ({ label: `Xing ${salon.name}`, note: salon.area, href: salon.path })),
  viewAll: { label: 'Compare all salons', href: salonsPath },
};
