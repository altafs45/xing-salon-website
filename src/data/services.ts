// Single source of truth for the service catalogue: every service page, the Services menu, /services, the
// category pages and the Service schema render from this file. Prices are intentionally not shown on the site.
// Keep it free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import type { OfferId } from './offers';
import type { IconKey } from './pages/types';

export interface ServiceItem {
  name: string;
  /** One-line description shown under the name. */
  text?: string;
  /** Line icon for the card's visual panel. */
  icon?: IconKey;
  /** Two or three short tags shown as chips. */
  tags?: string[];
  /** Slug of this item's own service page: the card links there instead of booking, and the item is left out of this page's schema. */
  page?: string;
  /** Link text for a card with `page`, e.g. "Explore Hydra Facial". */
  cta?: string;
  /** Small pill on this card only. */
  badge?: string;
}

export interface ServiceList {
  title: string;
  items: ServiceItem[];
  /** Offered for every hair length: the page lists the lengths as plain information. */
  allLengths?: boolean;
  note?: string;
  /** Small pill on every card in the list, e.g. "Up to 10 years". */
  badge?: string;
  /** Link under the cards to a fuller service page; hidden until that page exists. */
  link?: { slug: string; label: string };
  /**
   * Each card offers these versions as a segmented control (e.g. Manicure | Pedicure | Both); the chosen
   * `name` is added after the card's name in the WhatsApp message, and the last one is used in the schema.
   */
  variants?: Array<{ label: string; name: string }>;
  /** Smaller cards, two per row from 390px wide. */
  compact?: boolean;
}

export const LENGTHS = ['Short', 'Shoulder', 'Below shoulder', 'Waist+'] as const;

export type GroupId = 'hair' | 'skin-body' | 'nails' | 'tattoo';

/** How a service appears in menus, listings and search results. Filled in from `catalogue` below. */
export interface ServiceCatalogue {
  /** Short name in the Services menu and on listing cards, e.g. "Men's Haircut & Beard". */
  menuLabel: string;
  /** One line under the name in menus and on listing cards; 70 characters or fewer. */
  blurb: string;
  /** Up to 60 characters; the page's own `seo.title` is used without it. */
  metaTitle?: string;
  /** Up to 155 characters; the page's own `seo.description` is used without it. */
  metaDesc?: string;
  /** The page's H1; the page's own `hero.h1` is used without it. */
  h1?: string;
  keywords?: string[];
  isNew?: boolean;
}

export interface Service extends ServiceCatalogue {
  slug: string;
  /** Full name, used in breadcrumbs, related links and booking messages. */
  label: string;
  group: GroupId;
  /** Small pill beside the name in the Services dropdown, e.g. "Bestseller". */
  badge?: string;
  /** Quiet note beside the name in the Services dropdown, e.g. "Women only". */
  tag?: string;
  /** Must match an entry in `booking.services` in content.ts. */
  bookAs: string;
  lists: ServiceList[];
  notes: string[];
  offers: OfferId[];
}

/** The five hand-and-foot rituals, named for the manicure or the pedicure page ("D-Lux Manicure"). */
const rituals = (kind: 'Manicure' | 'Pedicure'): ServiceItem[] => {
  const part = kind === 'Manicure' ? 'hands' : 'feet';
  return [
    {
      name: `D-Lux ${kind}`, icon: 'sparkles', tags: ['Classic care', 'Quick refresh'],
      text: `Our classic ritual: nail shaping, cuticle care, exfoliation, massage and polish for neat, refreshed ${part}.`,
    },
    {
      name: `Crystal ${kind}`, icon: 'droplets', tags: ['Extra pampering', 'Softness'],
      text: 'A step up, with extra exfoliation and nourishment for visibly softer, smoother skin.',
    },
    {
      name: `Alga ${kind}`, icon: 'waves', tags: ['Rejuvenating', 'Deep nourishment'],
      text: 'A rejuvenating ritual with deeper nourishment and a longer, relaxing massage.',
    },
    {
      name: `Tango ${kind}`, icon: 'crown', tags: ['Indulgent', 'Premium'],
      text: `An indulgent, premium ritual for complete relaxation and beautifully cared-for ${part}.`,
    },
    {
      name: `Detox ${kind}`, icon: 'wind', tags: ['Deep-cleansing', 'Refreshing'],
      text: `A deep-cleansing, refreshing ritual for tired, dull-looking ${part}.`,
    },
  ];
};

type ServiceEntry = Omit<Service, keyof ServiceCatalogue>;

const list: ServiceEntry[] = [
  {
    slug: 'mens-haircut-beard-grooming',
    label: 'Men’s Haircut & Beard Grooming',
    group: 'hair',
    bookAs: 'Men Grooming',
    lists: [
      {
        title: 'Haircuts',
        items: [
          {
            name: 'Haircut (without wash)', icon: 'scissors', tags: ['Fades', 'Crops', 'Classic'],
            text: 'A precise cut to your preferred length and style — fades, crops, side parts and classic cuts.',
          },
          {
            name: 'Haircut (with wash & styling)', icon: 'droplets', tags: ['Wash', 'Cut', 'Finish'],
            text: 'The same precise cut, with a wash and finish styling so you walk out ready.',
          },
          {
            name: 'Creative Haircut', icon: 'sparkles', tags: ['Textured', 'Trend-led', 'Reference look'],
            text: 'For textured, trend-led or detailed styles that need extra time and technique. Bring a reference photo and we’ll adapt it to your hair.',
          },
        ],
      },
      {
        title: 'Beard',
        items: [
          {
            name: 'Beard Trim', icon: 'scissors', tags: ['Clean lines', 'Even length'],
            text: 'Clean lines on the cheeks and neck, even length and a shape that balances your face.',
          },
          { name: 'Beard Shave', icon: 'zap', tags: ['Close', 'Clean-shaven'], text: 'A smooth, close shave for a fresh, clean-shaven look.' },
          {
            name: 'Beard Styling', icon: 'brush', tags: ['Sculpted', 'Defined shape'],
            text: 'Defined sculpting for a specific beard style — from a short boxed beard to a fuller shape.',
          },
        ],
      },
      {
        title: 'Colour',
        link: { slug: 'global-hair-color', label: 'See all hair colour services' },
        items: [
          { name: 'Global Colour', icon: 'palette', tags: ['Grey coverage', 'Refresh'], text: 'All-over colour to cover greys or refresh your shade.' },
          { name: 'Global Colour (Ammonia-Free)', icon: 'shield', tags: ['Gentler formula'], text: 'The same all-over colour, in an ammonia-free option.' },
          { name: 'Fashion Colour', icon: 'flame', tags: ['Bold', 'Statement'], text: 'A bolder shade for when you want something different.' },
          { name: 'Highlights', icon: 'sun', tags: ['Dimension', 'Texture'], text: 'Lighter strands that add contrast and dimension.' },
        ],
      },
      {
        title: 'Add-ons',
        items: [
          { name: 'Head Massage', icon: 'smile', tags: ['Relax', 'Unwind'], text: 'A relaxing scalp massage to unwind after a long week.' },
          { name: 'Beard Colour', icon: 'brush', tags: ['Even tone', 'Fuller look'], text: 'Even out greys or patchy tones for a fuller-looking beard.' },
        ],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership', 'kidsFree'],
  },
  {
    slug: 'womens-haircut-styling',
    label: 'Women’s Haircut & Styling',
    group: 'hair',
    bookAs: 'Haircut & Styling',
    lists: [
      {
        title: 'Haircuts',
        items: [
          {
            name: 'Basic Haircut', icon: 'scissors', tags: ['Trim', 'Shape refresh'],
            text: 'A clean, precise cut to refresh your shape or maintain your length. Finished with a wash or styling.',
          },
          {
            name: 'Get Styled Package', icon: 'crown', tags: ['Wash', 'Cut', 'Condition', 'Style'],
            text: 'Our complete salon experience: wash, haircut, conditioning and professional styling in one appointment.',
          },
          {
            name: 'Advanced Haircut', icon: 'sparkles', tags: ['Layers', 'Bobs', 'Bangs'],
            text: 'Layers, face-framing, bobs, lobs, bangs and statement transformations. Bring a reference photo and your stylist will adapt it to your hair type and face shape.',
          },
        ],
      },
      {
        title: 'Styling',
        allLengths: true,
        items: [
          {
            name: 'Wash & Blast Dry', icon: 'wind', tags: ['Natural', 'Quick'],
            text: 'A quick wash and rough dry for clean, fresh hair with natural movement.',
          },
          {
            name: 'Wash & Blow Dry', icon: 'sun', tags: ['Smooth', 'Volume'],
            text: 'A smooth, bouncy, round-brush blow dry with salon volume that lasts.',
          },
          {
            name: 'Moroccan/Defabulous Blow Dry', icon: 'droplets', tags: ['Shine', 'Frizz control'],
            text: 'A nourishing blow dry that adds shine and softness while taming frizz.',
          },
          { name: 'Ironing', icon: 'zap', tags: ['Sleek', 'Straight'], text: 'Sleek, straight, glossy hair for work, events or everyday polish.' },
          {
            name: 'Tongs (Curls & Waves)', icon: 'waves', tags: ['Waves', 'Curls'],
            text: 'Soft waves or defined curls for weddings, receptions, parties and photoshoots.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership', 'kidsFree'],
  },
  {
    slug: 'kids-haircut',
    label: 'Kids Haircut',
    group: 'hair',
    bookAs: 'Haircut & Styling',
    lists: [
      {
        title: 'Kids Haircut',
        badge: 'Up to 10 years',
        items: [
          {
            name: 'Boys Haircut',
            icon: 'smile',
            tags: ['School-ready', 'Crops', 'Gentle fades'],
            text: 'A neat, comfortable cut for school and play, from classic crops to gentle fades.',
          },
          {
            name: 'Girls Haircut',
            icon: 'star',
            tags: ['Trims', 'Bobs', 'Fringes'],
            text: 'Trims, bobs and fringes that look lovely and are easy to manage every day.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['kidsFree'],
  },
  {
    slug: 'hair-spa',
    label: 'Hair Spa',
    group: 'hair',
    bookAs: 'Hair Spa',
    lists: [
      {
        title: 'Nourish & Shine',
        items: [
          {
            name: 'Nourishing Hair Spa',
            icon: 'droplets',
            tags: ['Dry hair', 'Softness', 'Shine'],
            text: 'A deep-conditioning ritual that replenishes moisture and leaves dull, dry hair soft and glossy.',
          },
          {
            name: 'Moroccan Hair Spa',
            icon: 'sparkles',
            tags: ['Frizz control', 'Glossy finish'],
            text: 'An indulgent spa that helps tame frizz and adds silky shine and smoothness.',
          },
          {
            name: 'Tribond Hair Spa',
            icon: 'shield',
            tags: ['Strength', 'Weak hair'],
            text: 'A strengthening spa for weak, brittle or over-styled hair that needs extra care.',
          },
        ],
      },
      {
        title: 'Scalp Care',
        items: [
          {
            name: 'Anti-Dandruff Hair Spa',
            icon: 'wind',
            tags: ['Flaky scalp', 'Fresh feel'],
            text: 'A clarifying scalp treatment that helps reduce flakes and itchiness and leaves your scalp feeling clean and balanced.',
          },
          {
            name: 'Anti-Hairfall Hair Spa',
            icon: 'heart',
            tags: ['Root care', 'Breakage'],
            text: 'A scalp-focused spa that nourishes the roots and helps reduce breakage-related hair fall.',
          },
        ],
      },
      {
        title: 'Bond Repair',
        items: [
          {
            name: 'Olaplex Hair Spa',
            icon: 'layers',
            tags: ['Damage repair', 'Colour-treated'],
            text: 'Olaplex bond-building care that helps repair and strengthen hair damaged by colouring, bleaching or heat.',
          },
          {
            name: 'Olaplex Add-on',
            icon: 'zap',
            tags: ['Boost any spa'],
            text: 'Add Olaplex to any hair spa for extra repair and protection.',
          },
        ],
      },
      {
        title: 'Add-ons',
        items: [
          {
            name: 'Head Massage',
            icon: 'smile',
            tags: ['Relax', 'Unwind'],
            text: 'A calming scalp massage that relieves stress and leaves you refreshed.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['spa3plus1', 'tuesday', 'birthday'],
  },
  // ---------- Hair colour: one page per technique (these were one "Hair Colour, Highlights & Balayage" page).
  {
    slug: 'global-hair-color',
    label: 'Global Hair Colour',
    group: 'hair',
    bookAs: 'Global Hair Colour',
    lists: [
      {
        title: 'All-Over Colour',
        items: [
          {
            name: 'Global Hair Colour',
            icon: 'palette',
            tags: ['Full coverage', 'Rich tone', 'Grey coverage'],
            text: 'One even shade from roots to ends. Perfect for covering greys, refreshing faded colour or going a new shade.',
          },
          {
            name: 'Ammonia-Free Global Colour',
            icon: 'shield',
            tags: ['Gentler formula', 'Even tone'],
            text: 'Full, even colour with an ammonia-free formula, a popular choice if you prefer a gentler option.',
          },
          {
            name: 'Root Touch-up',
            icon: 'brush',
            tags: ['Regrowth', 'Greys', 'Quick refresh'],
            text: 'Colours new growth at the roots to blend with your existing shade and cover greys.',
          },
          {
            name: 'Ammonia-Free Root Touch-up',
            icon: 'heart',
            tags: ['Gentle', 'Regrowth'],
            text: 'Root regrowth coverage with an ammonia-free formula.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['colourOffer', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'highlights',
    label: 'Hair Highlights',
    group: 'hair',
    bookAs: 'Hair Colour',
    lists: [
      {
        title: 'Highlights',
        items: [
          {
            name: 'Full Highlights',
            icon: 'sparkles',
            tags: ['Dimension', 'Brightness', 'Texture'],
            text: 'Lighter strands woven through your hair for brightness, dimension and movement.',
          },
          {
            name: 'Highlights (Per Foil)',
            icon: 'star',
            tags: ['Face-framing', 'Subtle', 'Custom'],
            text: 'A few targeted highlights, such as face-framing pieces or subtle pops of colour, exactly where you want them.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['colourOffer', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'balayage',
    label: 'Balayage',
    group: 'hair',
    bookAs: 'Balayage',
    lists: [
      {
        title: 'Balayage',
        items: [
          {
            name: 'Balayage',
            icon: 'sun',
            tags: ['Soft', 'Sun-kissed', 'Low-maintenance'],
            text: 'Hand-painted colour that blends naturally from root to tip for a soft, lived-in look that grows out beautifully. Designed for you after consultation.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['colourOffer', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'fashion-color',
    label: 'Fashion Colour (Crazy Colour)',
    group: 'hair',
    bookAs: 'Fashion Colour',
    lists: [
      {
        title: 'Fashion Colours',
        items: [
          {
            name: 'Crazy/Fashion Colour (Per Foil)',
            icon: 'flame',
            tags: ['Bold', 'Pastel', 'Vivid'],
            text: 'Statement streaks in shades like blue, pink, purple, red or pastels, from a peek-a-boo strand to a bold look.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['colourOffer', 'tuesday', 'birthday', 'membership'],
  },
  // ---------- Smoothing & straightening: one page each (these were one "Keratin, Smoothening & Straightening" page).
  {
    slug: 'keratin-treatment',
    label: 'Keratin Treatment',
    group: 'hair',
    bookAs: 'Keratin Treatment',
    lists: [
      {
        title: 'Keratin',
        items: [
          {
            name: 'Keratin Treatment',
            icon: 'sparkles',
            tags: ['Frizz control', 'Natural volume', 'Shine'],
            text: 'Smooths frizz and adds glossy shine while keeping your hair’s natural body and movement. Ideal if you want manageable hair without a flat, poker-straight look.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['keratinFlat', 'acaiOil', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'hair-smoothening',
    label: 'Hair Smoothening',
    group: 'hair',
    bookAs: 'Hair Treatment',
    lists: [
      {
        title: 'Smoothening',
        items: [
          {
            name: 'Hair Smoothening',
            icon: 'waves',
            tags: ['Soft straight', 'Frizz-free', 'Easy styling'],
            text: 'Relaxes curls and waves into smoother, straighter hair with a soft, natural fall. Great for wavy or frizzy hair that takes too long to style.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['acaiOil', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'hair-straightening',
    label: 'Hair Straightening',
    group: 'hair',
    bookAs: 'Hair Treatment',
    lists: [
      {
        title: 'Straightening',
        items: [
          {
            name: 'Hair Straightening',
            icon: 'zap',
            tags: ['Sleek', 'Poker-straight', 'Long-lasting'],
            text: 'Transforms curly or wavy hair into sleek, straight hair. The straightened section stays straight and new growth comes in with your natural texture.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['acaiOil', 'tuesday', 'birthday', 'membership'],
  },
  // ---------- Hair treatments (Hair Botox, Cysteine and Nanoplastia were one page).
  {
    slug: 'hair-botox',
    label: 'Hair Botox',
    group: 'hair',
    bookAs: 'Hair Treatment',
    lists: [
      {
        title: 'Hair Botox',
        items: [
          {
            name: 'Hair Botox',
            icon: 'heart',
            tags: ['Deep repair', 'Shine', 'Softness'],
            text: 'An intensive conditioning treatment that helps fill and smooth damaged, dry hair for a fuller, glossier, softer finish. No injections. Hair botox is a hair-care treatment, not a cosmetic injection.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['acaiOil', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'nanoplastia-cysteine',
    label: 'Nanoplastia & Cysteine Treatment',
    group: 'hair',
    bookAs: 'Hair Treatment',
    lists: [
      {
        title: 'Treatments',
        items: [
          {
            name: 'Cysteine Treatment',
            icon: 'wind',
            tags: ['Smoothing', 'Frizz control', 'Natural look'],
            text: 'A smoothing treatment that reduces frizz and improves manageability while keeping your hair soft and natural-looking. Popular with people who want smoothness without a stiff, straight finish.',
          },
          {
            name: 'Nanoplastia',
            icon: 'waves',
            tags: ['Smooth', 'Straighter', 'Silky'],
            text: 'An advanced smoothing and straightening treatment for frizzy, wavy or curly hair. Gives a silky, straighter, natural-looking finish that’s easy to style.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['acaiOil', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'hydra-facial',
    label: '7-Step Hydra Facial',
    badge: 'Bestseller',
    group: 'skin-body',
    bookAs: 'Skin & Facial',
    lists: [
      {
        title: 'Signature Facial',
        badge: 'Bestseller',
        items: [
          {
            name: '7-Step Hydra Facial', icon: 'droplets', tags: ['Deep cleanse', 'Hydration', 'Instant glow'],
            text: 'Seven steps of deep cleansing, gentle exfoliation and hydration in one sitting.',
          },
        ],
      },
    ],
    notes: ['Best results: a minimum of 3 sessions, every 3–4 weeks.'],
    offers: ['hydraFlat', 'hydra3plus1', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'facial-cleanup',
    label: 'Facials & Clean-ups',
    group: 'skin-body',
    bookAs: 'Skin & Facial',
    // TODO: confirm with the owner what each tier includes; the descriptions present them as increasing levels of care.
    lists: [
      {
        title: 'Clean-ups',
        items: [
          {
            name: 'Masque Clean-up',
            icon: 'droplets',
            tags: ['Quick refresh', 'Cleanse', 'Mask'],
            text: 'A quick cleanse-and-mask clean-up that removes grime and leaves your skin fresh and clear. Ideal between facials.',
          },
          {
            name: 'Premium Clean-up',
            icon: 'layers',
            tags: ['Deeper cleanse', 'Fresh skin'],
            text: 'A more thorough clean-up for congested or tired-looking skin, leaving it cleaner, smoother and refreshed.',
          },
        ],
      },
      {
        title: 'Facials',
        items: [
          {
            name: 'Express Facial',
            icon: 'clock',
            tags: ['Fast glow', 'Busy days'],
            text: 'A time-saving facial that cleanses, nourishes and brightens. Perfect when you want a glow without a long session.',
          },
          {
            name: 'Premium Facial',
            icon: 'heart',
            tags: ['Nourish', 'Relax', 'Radiance'],
            text: 'A complete facial with deeper nourishment and a relaxing massage for soft, radiant-looking skin.',
          },
          {
            name: 'Ultra Facial',
            icon: 'crown',
            tags: ['Most indulgent', 'Intensive care'],
            text: 'Our most indulgent classic facial for intensive pampering and a visibly refreshed, glowing complexion.',
          },
          {
            name: '7-Step Hydra Facial',
            icon: 'sparkles',
            tags: ['Bestseller', 'Deep hydration'],
            text: 'Seven steps of deep cleansing, gentle exfoliation and hydration in one sitting.',
            page: 'hydra-facial',
            cta: 'Explore Hydra Facial',
            badge: 'Bestseller',
          },
        ],
      },
    ],
    notes: [],
    offers: ['hydra3plus1', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'body-polish',
    label: 'Body Polish',
    group: 'skin-body',
    tag: 'Women only',
    bookAs: 'Body Polish',
    lists: [
      {
        title: 'Body Polish',
        items: [
          {
            name: 'Full Body Polish', icon: 'crown', tags: ['Head-to-toe', 'Shower included', 'Free head massage'],
            text: 'The complete body polish experience for soft, glowing skin all over.',
          },
          {
            name: 'Full Arms', icon: 'sparkles', tags: ['Smooth', 'Even-looking'],
            text: 'Polish from shoulders to fingertips for smooth, soft arms. Perfect for sleeveless outfits.',
          },
          {
            name: 'Underarms', icon: 'droplets', tags: ['Smooth', 'Refreshed'],
            text: 'Gentle exfoliation and polish for smoother-feeling, refreshed underarms.',
          },
          {
            name: 'Back', icon: 'layers', tags: ['Hard-to-reach', 'Glow'],
            text: 'Care for the area you can’t reach yourself, ideal before backless outfits and events.',
          },
          { name: 'Half Legs', icon: 'heart', tags: ['Smooth', 'Soft'], text: 'Polish for the lower legs for soft, smooth skin.' },
          {
            name: 'Full Legs', icon: 'star', tags: ['Head-turning', 'Glow'],
            text: 'Full-length leg polish for smooth, glowing legs, ready for dresses and holidays.',
          },
        ],
      },
    ],
    notes: ['Body polish is available for female clients only.'],
    offers: ['polishMassage', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'waxing',
    label: 'Waxing',
    group: 'skin-body',
    bookAs: 'Waxing',
    lists: [
      {
        title: 'Arms & Legs',
        note: 'Flavored or roll-on cartridge wax.',
        items: [
          { name: 'Full Arms', icon: 'sparkles', tags: ['Shoulder to fingertips'], text: 'Smooth arms, perfect for sleeveless outfits.' },
          { name: 'Half Legs', icon: 'heart', tags: ['Knee down'], text: 'Quick, smooth lower legs for everyday confidence.' },
          { name: 'Full Legs', icon: 'star', tags: ['Thigh to toe'], text: 'Complete leg waxing for dresses, shorts and holidays.' },
        ],
      },
      {
        title: 'Body',
        items: [
          {
            name: 'Underarms', icon: 'droplets', tags: ['Flavored or stripless'],
            text: 'Clean, smooth underarms. Choose stripless for a gentler option.',
          },
          { name: 'Front / Back', icon: 'layers', tags: ['Chest', 'Back'], text: 'Smooth skin on the front or back for a clean, confident look.' },
          { name: 'Stomach', icon: 'smile', tags: ['Smooth midriff'], text: 'Waxing for a smooth stomach, ideal with crop tops and sarees.' },
          {
            name: 'Full Body', icon: 'crown', tags: ['Head-to-toe smooth'],
            text: 'Complete body waxing in one session, choice of flavored or cartridge wax.',
          },
        ],
      },
      {
        title: 'Face',
        items: [
          {
            name: 'Upper Lip / Lower Lip / Chin / Forehead', icon: 'brush', tags: ['Stripless', 'Quick'],
            text: 'Quick, gentle stripless waxing for precise facial areas.',
          },
          { name: 'Side Locks', icon: 'scissors', tags: ['Stripless', 'Clean edges'], text: 'Neat, defined side locks.' },
          {
            name: 'Full Face', icon: 'sun', tags: ['Stripless', 'Smooth finish'],
            text: 'Smooth, hair-free skin across the whole face. Great before makeup or a facial.',
          },
        ],
      },
      {
        title: 'Bikini',
        items: [
          {
            name: 'Bikini Wax', icon: 'shield', tags: ['Stripless', 'Delicate area'],
            text: 'Gentle stripless waxing for the bikini line, done with care and privacy.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['waxingCombo', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'threading-detan',
    label: 'Threading & De‑tan',
    group: 'skin-body',
    bookAs: 'Threading & De-tan',
    lists: [
      {
        title: 'Threading',
        items: [
          {
            name: 'Eyebrow Threading', icon: 'brush', tags: ['Shape', 'Define', 'Clean lines'],
            text: 'Precise brow shaping that suits your face, from natural and soft to sharp and defined.',
          },
          { name: 'Forehead', icon: 'sun', tags: ['Smooth', 'Clean'], text: 'Removes fine hair for a smooth forehead and a clean hairline.' },
          {
            name: 'Upper Lip / Lower Lip / Chin', icon: 'smile', tags: ['Quick', 'Precise'],
            text: 'Fast, precise threading for small facial areas.',
          },
          { name: 'Side Locks', icon: 'scissors', tags: ['Neat edges'], text: 'Tidy, defined side locks for a cleaner face frame.' },
          {
            name: 'Full Face', icon: 'sparkles', tags: ['Smooth all over', 'Makeup-ready'],
            text: 'Complete facial threading for smooth skin that’s ready for makeup or a facial.',
          },
        ],
      },
      {
        title: 'De-tan',
        items: [
          {
            name: 'Face & Neck De-tan', icon: 'sparkles', tags: ['Brighter-looking', 'Even tone'],
            text: 'Helps reduce the look of tan on your face and neck for a fresher, more even-looking complexion.',
          },
          { name: 'Underarm De-tan', icon: 'droplets', tags: ['Even-looking', 'Fresh'], text: 'Helps underarms look brighter and more even.' },
          {
            name: 'Arms De-tan (Half / Full)', icon: 'sun', tags: ['Sleeveless-ready'],
            text: 'Helps reduce the look of tan on your arms from daily sun exposure.',
          },
          {
            name: 'Legs De-tan (Half / Full)', icon: 'star', tags: ['Even-looking legs'],
            text: 'Helps reduce the look of tan on your legs, perfect after holidays.',
          },
          {
            name: 'Foot De-tan', icon: 'heart', tags: ['Sandal-ready', 'Fresh'],
            text: 'Helps reduce the look of tan lines on your feet from sandals and sun.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['threadingCombos', 'tuesday', 'birthday', 'membership'],
  },
  // ---------- Nail care (manicure, pedicure and the quick services were one "Manicure & Pedicure" page).
  // TODO: confirm with the owner what each ritual includes; the descriptions present them as increasing levels of care.
  {
    slug: 'manicure',
    label: 'Manicure',
    group: 'nails',
    bookAs: 'Manicure & Pedicure',
    lists: [{ title: 'Manicure Rituals', items: rituals('Manicure') }],
    notes: [],
    offers: ['manipediCombos', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'pedicure',
    label: 'Pedicure',
    group: 'nails',
    bookAs: 'Manicure & Pedicure',
    lists: [
      { title: 'Pedicure Rituals', items: rituals('Pedicure') },
      {
        title: 'Foot Treatments',
        items: [
          {
            name: 'Heel Peel Treatment', icon: 'layers', tags: ['Rough heels', 'Smoother feet'],
            text: 'A targeted treatment that helps soften and smooth rough, dry or cracked-looking heels.',
          },
          { name: 'Foot Massage', icon: 'smile', tags: ['Relax', 'Unwind'], text: 'A soothing foot massage that relieves tired feet after a long day.' },
        ],
      },
    ],
    notes: [],
    offers: ['manipediCombos', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'nail-extensions',
    label: 'Nail Extensions & Overlays',
    group: 'nails',
    bookAs: 'Nails',
    lists: [
      {
        title: 'Extensions',
        items: [
          {
            name: 'Acrylic Extensions with Gel Polish', icon: 'shield', tags: ['Strong', 'Durable', 'Long-lasting'],
            text: 'Classic, sturdy extensions finished with glossy gel polish. Ideal for length and dramatic shapes.',
          },
          {
            name: 'Poly Gel Extensions', icon: 'wind', tags: ['Lightweight', 'Natural feel'],
            text: 'A hybrid of acrylic and gel that’s strong yet lightweight, with a comfortable, natural feel.',
          },
          {
            name: 'UV Builder Hard Gel Extensions', icon: 'sun', tags: ['Glossy', 'Flexible strength'],
            text: 'Gel extensions cured under a lamp for a glossy, natural-looking finish.',
          },
          {
            name: 'Builder in a Bottle Extensions', icon: 'brush', tags: ['Smooth', 'Strong'],
            text: 'Brush-on builder gel extensions with a smooth, refined finish.',
          },
          {
            // TODO: confirm with the owner what kind of temporary extensions these are (e.g. press-on or glue-on tips).
            name: 'Temporary Extensions', icon: 'calendar', tags: ['Event-ready', 'Easy start'],
            text: 'An affordable, short-term option. Perfect for a party, wedding or trying extensions for the first time.',
          },
        ],
      },
      {
        title: 'Overlays',
        items: [
          {
            name: 'UV Builder Hard Gel Overlay', icon: 'sparkles', tags: ['Strength', 'Gloss'],
            text: 'A protective gel layer over your natural nails for strength and shine, with no added length.',
          },
          { name: 'Acrylic Overlay', icon: 'shield', tags: ['Extra strength'], text: 'Durable acrylic over natural nails for tough, chip-resistant strength.' },
          { name: 'Poly Gel Overlay', icon: 'wind', tags: ['Lightweight strength'], text: 'Lightweight reinforcement for natural nails.' },
          {
            name: 'Builder in a Bottle Overlay', icon: 'heart', tags: ['Grow-out support', 'Natural look'],
            text: 'A builder gel layer that strengthens natural nails and helps you grow them out.',
          },
          {
            name: 'Refilling', icon: 'layers', tags: ['Fresh set', 'Fill regrowth'],
            text: 'Fills the gap as your natural nails grow, keeping extensions and overlays looking fresh.',
          },
        ],
      },
      {
        title: 'Removal',
        items: [
          {
            name: 'Acrylic, Hard Poly Gel, Gel Paint & Temporary Extensions Removal', icon: 'heart', tags: ['Gentle', 'Protects natural nails'],
            text: 'Professional, careful removal that protects your natural nails. Don’t pick or peel them off at home.',
          },
        ],
      },
    ],
    notes: [],
    offers: ['tempExtensions', 'tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'nail-art',
    label: 'Nail Art',
    group: 'nails',
    bookAs: 'Nails',
    lists: [
      {
        title: 'Finishes',
        compact: true,
        items: [
          {
            name: 'Gel Polish', icon: 'droplets', tags: ['Glossy', 'Long-wearing'],
            text: 'Rich, glossy colour cured under a lamp for a long-wearing finish.',
          },
          {
            name: 'Chrome', icon: 'sparkles', tags: ['Mirror shine', 'Metallic'],
            text: 'A high-shine, mirror-like metallic finish, from silver and gold to pearl and rose.',
          },
          {
            name: 'Cat Eye', icon: 'star', tags: ['Magnetic shimmer', 'Depth'],
            text: 'A magnetic shimmer that moves with the light, creating a glowing cat-eye effect.',
          },
          { name: 'Galaxy', icon: 'sun', tags: ['Cosmic', 'Sparkle'], text: 'Deep, starry, multi-tone galaxy designs with sparkle.' },
          { name: 'Glitter', icon: 'zap', tags: ['Sparkle', 'Party-ready'], text: 'From subtle shimmer to full sparkle, perfect for celebrations.' },
        ],
      },
      {
        title: 'Classics',
        compact: true,
        items: [
          { name: 'French Tips', icon: 'crown', tags: ['Timeless', 'Elegant'], text: 'Clean, elegant tips, classic white or in any colour you choose.' },
          { name: 'Ombre', icon: 'palette', tags: ['Soft gradient', 'Blended'], text: 'A seamless colour fade, from subtle nude-to-white to bold gradients.' },
          { name: 'Liner Art', icon: 'brush', tags: ['Minimal', 'Detailed'], text: 'Fine lines, outlines and minimal patterns for a chic, modern look.' },
        ],
      },
      {
        title: 'Designer Art',
        compact: true,
        // TODO: add "Millers" once the owner confirms what it is (it is on the menu); hidden until then.
        items: [
          { name: 'Marble Art', icon: 'waves', tags: ['Luxe', 'Stone effect'], text: 'Elegant marble swirls for a sophisticated, luxe look.' },
          { name: '3D Art', icon: 'layers', tags: ['Textured', 'Statement'], text: 'Raised, sculpted designs that make your nails a statement.' },
          { name: 'Dry Flower', icon: 'heart', tags: ['Botanical', 'Delicate'], text: 'Real dried flowers set into your design for a soft, botanical touch.' },
          { name: 'Stone', icon: 'award', tags: ['Sparkle', 'Embellished'], text: 'Rhinestones and embellishments for added glamour.' },
          { name: 'Sticker Art', icon: 'smile', tags: ['Quick', 'Playful'], text: 'Fun, detailed designs applied quickly with nail stickers.' },
        ],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'nail-cutting-filing',
    label: 'Nail Cutting & Filing',
    group: 'nails',
    bookAs: 'Nails',
    lists: [
      {
        title: 'Cut & File',
        compact: true,
        items: [{ name: 'Cut & File', icon: 'scissors', tags: ['Neat shape'], text: 'Clean, shaped nails in minutes.' }],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'nail-polish',
    label: 'Nail Polish (Regular)',
    group: 'nails',
    bookAs: 'Nails',
    lists: [
      {
        title: 'Polish',
        compact: true,
        items: [{ name: 'Normal Polish', icon: 'brush', tags: ['Fresh colour'], text: 'A fresh coat of colour for hands or feet.' }],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'quick-nail-care',
    label: 'Quick Nail Care (Cut, File & Polish)',
    group: 'nails',
    // No duration is on record for this combo, so the badge says "Combo" rather than a time.
    badge: 'Combo',
    bookAs: 'Nails',
    lists: [
      {
        title: 'Quick Nail Care',
        compact: true,
        items: [{ name: 'Cut, File & Polish', icon: 'star', tags: ['Quick & neat'], text: 'Shape and polish in one quick visit.' }],
      },
    ],
    notes: [],
    offers: ['tuesday', 'birthday', 'membership'],
  },
  {
    slug: 'tattoo',
    label: 'Tattoo Studio',
    group: 'tattoo',
    bookAs: 'Tattoo',
    lists: [
      {
        title: 'Tattoo Styles',
        compact: true,
        items: [
          {
            name: 'Black & Grey Tattoos', icon: 'brush', tags: ['Timeless', 'Shading', 'Detail'],
            text: 'Classic black and grey work, from fine linework to rich shading and portraits.',
          },
          { name: 'Colour Tattoos', icon: 'palette', tags: ['Vibrant', 'Bold'], text: 'Bright, saturated colour tattoos that make a statement.' },
          {
            name: '3D & Photo-Realistic Tattoos', icon: 'layers', tags: ['Realism', 'Depth'],
            text: 'Lifelike 3D-style and photo-realistic tattoos with depth and detail.',
          },
          {
            name: 'Custom Designs', icon: 'sparkles', tags: ['Your story', 'One-of-a-kind'],
            text: 'Original artwork designed around your idea, placement and size.',
          },
          // The cards below come from xingtattoo.in (checked 7 Oct 2026), reworded; owner to approve.
          { name: 'Portrait Tattoos', icon: 'smile', tags: ['Likeness', 'Detail'], text: 'A face that matters to you, rendered with care and fine detail.' },
          {
            name: 'Minimalist & Fine-Line', icon: 'wind', tags: ['Subtle', 'Delicate'],
            text: 'Small, clean, understated pieces with precise lines. A popular first tattoo.',
          },
          { name: 'Geometric & Mandala', icon: 'star', tags: ['Symmetry', 'Pattern'], text: 'Balanced shapes and patterns built with crisp, exact linework.' },
          { name: 'Indian Traditional', icon: 'crown', tags: ['Heritage', 'Meaning'], text: 'Designs rooted in faith, culture and heritage, drawn for you.' },
          {
            name: 'Cover-ups & Rework', icon: 'shield', tags: ['Refresh', 'Rework'],
            text: 'Give an old or faded tattoo new life with a rework or a new design over it.',
          },
        ],
      },
    ],
    notes: [],
    offers: [],
  },
];

const LOCALITIES = 'Xing Sarjapur Road, HSR Layout & Brookfield';

/**
 * Menu labels, one-line blurbs and search-result copy, by slug. Every service needs an entry. Where `metaTitle`,
 * `metaDesc` or `h1` are left out, the service page's own copy in data/pages is used.
 */
const catalogue: Record<string, ServiceCatalogue> = {
  // Hair care: haircuts & styling
  'mens-haircut-beard-grooming': {
    menuLabel: 'Men’s Haircut & Beard',
    blurb: 'Precision cuts, fades and beard shaping by expert barbers.',
    metaTitle: 'Men’s Haircut & Beard Grooming in Bangalore – Xing Salon',
    metaDesc: `Sharp fades, classic cuts and beard shaping at ${LOCALITIES}. Free consultation. Walk-ins welcome.`,
    keywords: ['men’s haircut Bangalore', 'beard trim HSR Layout'],
  },
  'womens-haircut-styling': {
    menuLabel: 'Women’s Haircut & Styling',
    blurb: 'Cuts, layers and blow-dries designed for your face shape.',
    metaTitle: 'Women’s Haircut & Styling in Bangalore – Xing Salon',
    metaDesc: 'Layered cuts, bobs, fringes and blow-dry styling at Xing salons in Sarjapur Road, HSR Layout & Brookfield. Book a free consultation.',
    keywords: ['women’s haircut Sarjapur Road', 'women’s haircut Bangalore'],
  },
  'kids-haircut': {
    menuLabel: 'Kids Haircut',
    blurb: 'Gentle, patient haircuts for children up to 10 years.',
  },
  // Hair colour
  'global-hair-color': {
    menuLabel: 'Global Hair Colour',
    blurb: 'Rich, even all-over colour with ammonia-free options.',
    metaTitle: 'Global Hair Colour in Bangalore – Xing Salon',
    metaDesc: `Even, long-lasting global hair colour with shade consultation at ${LOCALITIES}. Price confirmed before we start.`,
    keywords: ['global hair colour Bangalore', 'grey coverage Bangalore'],
  },
  highlights: {
    menuLabel: 'Highlights',
    blurb: 'Dimension and brightness with foil or freehand highlights.',
    metaTitle: 'Hair Highlights in Bangalore – Xing Salon',
    metaDesc: 'Natural or bold hair highlights by expert colourists at Xing salons in Sarjapur Road, HSR Layout & Brookfield. Free shade consultation.',
    keywords: ['hair highlights Bangalore'],
    isNew: true,
  },
  balayage: {
    menuLabel: 'Balayage',
    blurb: 'Soft, hand-painted, sun-kissed colour that grows out beautifully.',
    metaTitle: 'Balayage Hair Colour in Bangalore – Xing Salon',
    metaDesc: `Hand-painted balayage with seamless, low-maintenance grow-out at ${LOCALITIES}. Book your consultation.`,
    keywords: ['balayage Bangalore'],
    isNew: true,
  },
  'fashion-color': {
    menuLabel: 'Fashion Colour (Crazy Colour)',
    blurb: 'Vivid pinks, blues, purples and pastels, done safely.',
    metaTitle: 'Fashion & Crazy Hair Colour in Bangalore – Xing Salon',
    metaDesc: 'Bold pastel, vivid and crazy hair colours with bond protection at Xing salons in Sarjapur Road, HSR Layout & Brookfield. Free consultation.',
    keywords: ['fashion hair colour Bangalore', 'crazy hair colour Bangalore'],
    isNew: true,
  },
  // Smoothing & straightening
  'keratin-treatment': {
    menuLabel: 'Keratin Treatment',
    blurb: 'Frizz-free, glossy, manageable hair for months.',
    metaTitle: 'Keratin Treatment in Bangalore – Xing Salon',
    metaDesc: `Smooth, frizz-free hair with professional keratin treatment at ${LOCALITIES}. Hair analysis before we start.`,
    keywords: ['keratin treatment HSR Layout', 'keratin treatment Bangalore'],
  },
  'hair-smoothening': {
    menuLabel: 'Hair Smoothening',
    blurb: 'Softer, sleeker hair with natural movement.',
    metaTitle: 'Hair Smoothening in Bangalore – Xing Salon',
    metaDesc: 'Sleek, soft, manageable hair with professional smoothening at Xing salons in Sarjapur Road, HSR Layout & Brookfield. Free consultation.',
    keywords: ['hair smoothening Bangalore'],
    isNew: true,
  },
  'hair-straightening': {
    menuLabel: 'Hair Straightening',
    blurb: 'Pin-straight, long-lasting results with care.',
    metaTitle: 'Hair Straightening in Bangalore – Xing Salon',
    metaDesc: `Long-lasting permanent hair straightening with expert care at ${LOCALITIES}. Price confirmed before we start.`,
    keywords: ['hair straightening Bangalore'],
    isNew: true,
  },
  // Hair treatments
  'hair-botox': {
    menuLabel: 'Hair Botox',
    blurb: 'Deep repair that restores shine, softness and strength.',
    metaTitle: 'Hair Botox Treatment in Bangalore – Xing Salon',
    metaDesc: 'Repair damaged, dull hair with Hair Botox at Xing salons in Sarjapur Road, HSR Layout & Brookfield. Hair analysis and free consultation.',
    keywords: ['hair botox Bangalore'],
    isNew: true,
  },
  'hair-spa': {
    menuLabel: 'Hair Spa',
    blurb: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex repair spas.',
  },
  'nanoplastia-cysteine': {
    menuLabel: 'Nanoplastia & Cysteine',
    blurb: 'Silky, smoother hair with a natural, easy-to-style finish.',
    metaTitle: 'Nanoplastia & Cysteine Treatment in Bangalore – Xing Salon',
    metaDesc: `Nanoplastia and cysteine smoothing for frizzy, wavy or curly hair at ${LOCALITIES}. Hair analysis and free consultation.`,
    keywords: ['nanoplastia Bangalore', 'cysteine treatment Bangalore'],
  },
  // Skin & body: names and order unchanged.
  'hydra-facial': { menuLabel: 'Hydra Facial', blurb: 'A 7-step deep-cleansing, hydrating facial for instant glow.' },
  'facial-cleanup': { menuLabel: 'Facials & Clean-ups', blurb: 'Clean-ups and facials for fresh, clear, radiant skin.' },
  'body-polish': { menuLabel: 'Body Polish', blurb: 'Full-body scrub and polish for soft, glowing skin.' },
  waxing: { menuLabel: 'Waxing', blurb: 'Flavoured, roll-on and stripless wax for face, body and bikini.' },
  'threading-detan': { menuLabel: 'Threading & De-tan', blurb: 'Brow shaping, face threading and de-tan for even skin.' },
  // Nail care
  manicure: {
    menuLabel: 'Manicure',
    blurb: 'Clean, shaped, nourished hands with a flawless finish.',
    metaTitle: 'Manicure in Bangalore – Xing Salon',
    metaDesc: `Classic, spa and gel manicures with hygienic, sterilised tools at ${LOCALITIES}. Walk-ins welcome.`,
    keywords: ['manicure Bangalore', 'manicure pedicure Brookfield'],
  },
  pedicure: {
    menuLabel: 'Pedicure',
    blurb: 'Relaxing foot care that softens, cleans and refreshes.',
    metaTitle: 'Pedicure in Bangalore – Xing Salon',
    metaDesc: `Spa and classic pedicures in our relaxing pedicure lounge at ${LOCALITIES}. Hygienic and safe.`,
    keywords: ['pedicure Bangalore', 'manicure pedicure Brookfield'],
    isNew: true,
  },
  'nail-extensions': {
    menuLabel: 'Nail Extensions',
    blurb: 'Gel and acrylic extensions in the length and shape you love.',
    metaTitle: 'Nail Extensions in Bangalore – Xing Salon',
    metaDesc: `Gel, acrylic and polygel nail extensions by trained nail artists at ${LOCALITIES}. Book now.`,
    keywords: ['nail extensions Bangalore'],
  },
  'nail-art': {
    menuLabel: 'Nail Art',
    blurb: 'Custom designs, chrome, French tips and 3D art.',
    metaTitle: 'Nail Art in Bangalore – Xing Salon',
    metaDesc: 'Custom nail art, French tips, chrome and bridal nail designs at Xing salons in Sarjapur Road, HSR Layout & Brookfield.',
    keywords: ['nail art HSR Layout', 'nail art Bangalore'],
  },
  'nail-cutting-filing': {
    menuLabel: 'Nail Cutting & Filing',
    blurb: 'Neat trimming and shaping in minutes.',
    metaTitle: 'Nail Cutting & Filing in Bangalore – Xing Salon',
    metaDesc: `Quick, hygienic nail cutting and shaping at ${LOCALITIES}. Walk-ins welcome.`,
    keywords: ['nail cutting Bangalore'],
    isNew: true,
  },
  'nail-polish': {
    menuLabel: 'Nail Polish (Regular)',
    blurb: 'A fresh coat of colour, neatly applied.',
    metaTitle: 'Nail Polish Application in Bangalore – Xing Salon',
    metaDesc: 'Neat regular nail polish application in your favourite shade at Xing salons in Sarjapur Road, HSR Layout & Brookfield.',
    keywords: ['nail polish Bangalore'],
    isNew: true,
  },
  'quick-nail-care': {
    menuLabel: 'Quick Nail Care Combo',
    blurb: 'Cut, file and polish in one quick session.',
    metaTitle: 'Quick Nail Care (Cut, File & Polish) | Xing Bangalore',
    metaDesc: `Cut, file and polish in one quick session — perfect between appointments. ${LOCALITIES}. Walk-ins welcome.`,
    keywords: ['quick nail care Bangalore'],
    isNew: true,
  },
  // Tattoo: unchanged.
  tattoo: { menuLabel: 'Tattoo Studio', blurb: 'Custom, fine-line and realistic tattoos at our Brookfield studio.' },
};

/** "Balayage Hair Colour in Bangalore" from "Balayage Hair Colour in Bangalore – Xing Salon". */
const h1From = (metaTitle?: string) => metaTitle?.split(/ \| | – /)[0];

export const services: Record<string, Service> = Object.fromEntries(
  list.map((entry) => {
    const copy = catalogue[entry.slug];
    if (!copy) throw new Error(`services.ts: no catalogue entry for "${entry.slug}"`);
    return [entry.slug, { ...entry, ...copy, h1: copy.h1 ?? h1From(copy.metaTitle) }];
  }),
);

// ---------- Categories: the Services menu, /services and the category pages all render from this.

export interface ServiceGroup {
  key: string;
  /** Null for a category shown as one plain list (Skin & Body, Nail Care, Tattoo). */
  title: string | null;
  /** Shorter name on the category page's chip bar; defaults to `title`. */
  chip?: string;
  services: Service[];
}

export interface ServiceCategory {
  key: GroupId;
  title: string;
  /** /services/<slug>. */
  slug: string;
  /** Where the category's "View all" links go. */
  path: string;
  /** Up to 40 words, on the category page and in its card on /services. */
  intro: string;
  /** Search-result description (155 characters or fewer). */
  metaDesc: string;
  icon: IconKey;
  groups: ServiceGroup[];
  /** False when the category is a single service with its own page (Tattoo): `path` is that page. */
  hasPage: boolean;
}

/** /services, the list of all categories. */
export const servicesHubPath = '/services';

const pick = (...slugs: string[]) => slugs.map((slug) => services[slug]);

export const categories: ServiceCategory[] = [
  {
    key: 'hair',
    title: 'Hair Care',
    slug: 'hair-care',
    path: '/services/hair-care',
    intro: 'Cuts, colour, smoothing and treatments by expert stylists at Xing Sarjapur Road, HSR Layout and Brookfield — with a free consultation and price confirmed before we start.',
    metaDesc: 'Haircuts, hair colour, keratin, smoothening and hair treatments at Xing Sarjapur Road, HSR Layout & Brookfield. Free consultation, price confirmed first.',
    icon: 'scissors',
    hasPage: true,
    groups: [
      // Kids Haircut was already in the menu; it stays here with the other haircuts.
      { key: 'haircuts', title: 'Haircuts & Styling', chip: 'Haircuts', services: pick('mens-haircut-beard-grooming', 'womens-haircut-styling', 'kids-haircut') },
      { key: 'hair-color', title: 'Hair Colour', services: pick('global-hair-color', 'highlights', 'balayage', 'fashion-color') },
      { key: 'smoothing', title: 'Smoothing & Straightening', services: pick('keratin-treatment', 'hair-smoothening', 'hair-straightening') },
      { key: 'treatments', title: 'Hair Treatments', chip: 'Treatments', services: pick('hair-botox', 'hair-spa', 'nanoplastia-cysteine') },
    ],
  },
  {
    key: 'skin-body',
    title: 'Skin & Body',
    slug: 'skin-body',
    path: '/services/skin-body',
    intro: 'Hydra facials, clean-ups, body polish, waxing, threading and de-tan by expert therapists at Xing Sarjapur Road, HSR Layout and Brookfield.',
    metaDesc: 'Hydra facials, clean-ups, body polish, waxing, threading and de-tan at Xing Sarjapur Road, HSR Layout & Brookfield. Free skin consultation.',
    icon: 'sparkles',
    hasPage: true,
    groups: [{ key: 'skin-body', title: null, services: pick('hydra-facial', 'facial-cleanup', 'body-polish', 'waxing', 'threading-detan') }],
  },
  {
    key: 'nails',
    title: 'Nail Care',
    slug: 'nail-care',
    path: '/services/nail-care',
    intro: 'Manicures, pedicures, extensions and nail art with hygienic, sterilised tools at all three Xing salons in Bangalore.',
    metaDesc: 'Manicures, pedicures, nail extensions, nail art and quick nail care with hygienic, sterilised tools at Xing Sarjapur Road, HSR Layout & Brookfield.',
    icon: 'nail-almond',
    hasPage: true,
    groups: [
      {
        key: 'nails',
        title: null,
        services: pick('manicure', 'pedicure', 'nail-extensions', 'nail-art', 'nail-cutting-filing', 'nail-polish', 'quick-nail-care'),
      },
    ],
  },
  {
    key: 'tattoo',
    title: 'Tattoo',
    slug: 'tattoo',
    // The studio is one service with its own page, which doubles as the category page.
    path: '/services/tattoo',
    intro: 'Custom, fine-line, realistic and cover-up tattoos by experienced artists at Xing Premium Tattoo Studio in Brookfield.',
    metaDesc: 'Custom, fine-line, realistic and cover-up tattoos at Xing Premium Tattoo Studio, Brookfield, Bangalore.',
    icon: 'flame',
    hasPage: false,
    groups: [{ key: 'tattoo', title: null, services: pick('tattoo') }],
  },
];

export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug && category.hasPage);
export const categoryOf = (service: Pick<Service, 'group'>) => categories.find((category) => category.key === service.group)!;
/** Every service in a category, in menu order. */
export const servicesIn = (category: ServiceCategory) => category.groups.flatMap((group) => group.services);

/** Retired URLs and the page that replaced them. The server answers each with a 301; the site also redirects. */
export const redirects: Record<string, string> = {
  // Blow dry, ironing and curls live on the women's haircut page, so only one page targets those searches.
  '/services/hair-styling': '/services/womens-haircut-styling',
  // Category addresses people may guess.
  '/services/hair': '/services/hair-care',
  '/services/nails': '/services/nail-care',
  // Pages renamed or split when the menu was restructured (Oct 2026).
  '/services/mens-haircut-grooming': '/services/mens-haircut-beard-grooming',
  '/services/hair-color': '/services/global-hair-color',
  '/services/keratin-hair-treatment': '/services/keratin-treatment',
  // Its main search term was "hair botox"; nanoplastia and cysteine moved to /services/nanoplastia-cysteine.
  '/services/hair-botox-nanoplastia': '/services/hair-botox',
  // Its main search term was "manicure"; the manicure page links straight to pedicure.
  '/services/manicure-pedicure': '/services/manicure',
};
