// The Offers, Gifts and Salons menus, for the desktop header and the mobile drawer.
import { locations, salonsPath } from './branches';
import type { Img } from './content';
import { membershipPath } from './membershipLinks';
import type { BranchId } from './offers';
import { salonOfferPages, type OfferPageId } from './staticOfferPages';


export interface NavMenuItem {
  label: string;
  note?: string;
  href: string;
  highlight?: boolean;
  /** A small tag beside the label. */
  pill?: string;
  /** A rule above this item. */
  divider?: boolean;
  /** Smaller links under the item, e.g. a salon's three offer pages. */
  links?: { label: string; href: string }[];
}

export interface NavMenu {
  title: string;
  items: NavMenuItem[];
  /** A last link under the items, e.g. "Compare all salons". */
  viewAll?: { label: string; href: string };
  /** The big card at the top of the drawer's panel. */
  feature?: { image: Img; title: string; button: string; href: string };
}

/** Under Offers whether or not a campaign is running. */
const GIFT_ITEMS: NavMenuItem[] = [
  { label: 'Membership Offers', href: `${membershipPath}#membership`, divider: true },
  { label: 'Gift Cards', href: `${membershipPath}#gift-cards` },
];

const OFFER_LINKS: { id: OfferPageId; label: string }[] = [
  { id: 'hair-colour', label: 'Hair colour' },
  { id: 'hair-treatment', label: 'Hair treatment' },
  { id: 'skin-care', label: 'Skin care' },
];

/** One item per salon, straight to its offer pages: the name opens hair colour, and the three links under it open each page. */
export const offersMenu = (): NavMenu => ({
  title: 'Offers',
  items: [
    ...locations.map((salon) => {
      const pages = salonOfferPages[salon.id as BranchId];
      return { label: `Xing ${salon.name}`, href: pages['hair-colour'], links: OFFER_LINKS.map((offer) => ({ label: offer.label, href: pages[offer.id] })) };
    }),
    ...GIFT_ITEMS,
  ],
});

export const salonsMenu: NavMenu = {
  title: 'Salons',
  items: locations.map((salon) => ({ label: `Xing ${salon.name}`, note: salon.area, href: salon.path })),
  viewAll: { label: 'Compare all salons', href: salonsPath },
};
