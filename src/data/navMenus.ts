// The Offers, Gifts and Salons menus, for the desktop header and the mobile drawer.
import { locations, salonsPath } from './branches';
import type { Img } from './content';
import { membershipPath } from './membershipLinks';
import { fromLabel, offerPages, offerPagesNote } from './offerPages';

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

/** Each offer opens its full page (public/<slug>.html). Every page covers all three salons, so the menu is the same
 * for every visitor. */
export const offersMenu = (): NavMenu => ({
  title: 'Offers',
  items: [...offerPages.map((page) => ({ label: page.name, note: `${fromLabel(page)} · ${offerPagesNote}`, href: page.path })), ...GIFT_ITEMS],
});

export const salonsMenu: NavMenu = {
  title: 'Salons',
  items: locations.map((salon) => ({ label: `Xing ${salon.name}`, note: salon.area, href: salon.path })),
  viewAll: { label: 'Compare all salons', href: salonsPath },
};
