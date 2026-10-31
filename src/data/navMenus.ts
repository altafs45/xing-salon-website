// The Offers, Gifts and Salons menus, for the desktop header and the mobile drawer. Offers come straight from
// offers.ts, so a new offer appears here by itself.
import { locations, salonsPath } from './branches';
import type { Img } from './content';
import { membershipPath } from './membershipLinks';
import { campaignPill, formatPrice, fromPrice, isCampaignOpen, maxSavingRupees, novemberCampaign, offersPath, promoHref, salonOffers, type SalonOfferId } from './offers';

export interface NavMenuItem {
  label: string;
  note?: string;
  href: string;
  highlight?: boolean;
  /** A small tag beside the label. */
  pill?: string;
  /** A rule above this item. */
  divider?: boolean;
}

export interface NavMenu {
  title: string;
  items: NavMenuItem[];
  viewAll: { label: string; href: string };
  /** The big card at the top of the drawer's panel. */
  feature?: { image: Img; title: string; button: string; href: string };
}

/** These two are listed by name, as Membership Offers and Gift Cards. */
const NOT_IN_OFFERS: SalonOfferId[] = ['membership', 'gift-card'];

/** Under Offers whether or not a campaign is running. */
const GIFT_ITEMS: NavMenuItem[] = [
  { label: 'Membership Offers', href: `${membershipPath}#membership`, divider: true },
  { label: 'Gift Cards', href: `${membershipPath}#gift-cards` },
];

/** Where the Offers label goes: the campaign's page while it's open. */
export const offersHref = () => (isCampaignOpen() ? novemberCampaign.path : offersPath);

export const offersMenu = (): NavMenu => {
  if (!isCampaignOpen()) {
    return {
      title: 'Offers',
      items: [...salonOffers.filter((offer) => !NOT_IN_OFFERS.includes(offer.id)).map((offer) => ({ label: offer.title, note: offer.badge, href: promoHref(offer.id) })), ...GIFT_ITEMS],
      viewAll: { label: 'View all offers', href: offersPath },
    };
  }
  const [global, highlights] = novemberCampaign.offers;
  const { path } = novemberCampaign;
  return {
    title: 'Offers',
    feature: { image: global.thumb, title: `From ${formatPrice(fromPrice())} · Save up to ${formatPrice(maxSavingRupees())}`, button: 'See November offers', href: path },
    items: [
      { label: 'November Hair Colour Offers', note: `from ${formatPrice(fromPrice())}`, href: path, highlight: true, pill: campaignPill() },
      { label: global.title, note: formatPrice(global.lines[0].now), href: `${path}#nov-global-colour` },
      { label: 'Highlights', note: `${formatPrice(highlights.lines[0].now)}/streak`, href: `${path}#nov-highlights` },
      { label: 'Balayage & Crazy Colour', href: `${path}#nov-colour-menu` },
      ...GIFT_ITEMS,
      { label: 'All salon offers', href: offersPath },
    ],
    viewAll: { label: 'View November offers', href: path },
  };
};

export const salonsMenu: NavMenu = {
  title: 'Salons',
  items: locations.map((salon) => ({ label: `Xing ${salon.name}`, note: salon.area, href: salon.path })),
  viewAll: { label: 'Compare all salons', href: salonsPath },
};
