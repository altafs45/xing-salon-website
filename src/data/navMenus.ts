// The Offers, Gifts and Salons menus, for the desktop header and the mobile drawer.
import { locations, salonsPath } from './branches';
import type { Img } from './content';
import { membershipPath } from './membershipLinks';
import { offerCategories } from './offerCatalog';
import { categoryFromLabel } from './offerPages';
import { isCampaignOpen, novemberCampaign, offersPath, promoHref, salonOfferById } from './offers';

const TUESDAY = salonOfferById('tuesday')!;

export interface NavMenuItem {
  label: string;
  note?: string;
  href: string;
  highlight?: boolean;
  /** A small tag beside the label. */
  pill?: string;
  /** A rule above this item. */
  divider?: boolean;
  /** A small thumbnail in the drawer. */
  image?: Img;
}

export interface NavMenu {
  title: string;
  items: NavMenuItem[];
  viewAll: { label: string; href: string };
  /** The big card at the top of the drawer's panel. */
  feature?: { image: Img; title: string; button: string; href: string };
}

/** Under Offers whether or not a campaign is running. */
const GIFT_ITEMS: NavMenuItem[] = [
  { label: 'Membership Offers', href: `${membershipPath}#membership`, divider: true },
  { label: 'Gift Cards', href: `${membershipPath}#gift-cards` },
];

/** Where the Offers label goes: the offers hub, always. */
export const offersHref = () => offersPath;

/** The same for every visitor: the three offer pages (each valid at all three salons), then the extras. */
export const offersMenu = (): NavMenu => ({
  title: 'Offers',
  items: [
    ...offerCategories.map((category) => ({
      label: `${category.name} Offers`,
      note: categoryFromLabel(category.id),
      href: category.path,
      image: category.image,
      ...(category.id === 'hair-colour' && isCampaignOpen() && { pill: `Ends ${novemberCampaign.endLabel}` }),
    })),
    { label: TUESDAY.title, note: TUESDAY.badge, href: promoHref(TUESDAY.id) },
    ...GIFT_ITEMS,
  ],
  viewAll: { label: 'View all offers', href: offersPath },
});

export const salonsMenu: NavMenu = {
  title: 'Salons',
  items: locations.map((salon) => ({ label: `Xing ${salon.name}`, note: salon.area, href: salon.path })),
  viewAll: { label: 'Compare all salons', href: salonsPath },
};
