// Single source of truth for the service list. Every service page, the Services dropdown
// and the Service schema render from this file. Prices are intentionally not shown on the site.
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

export interface Service {
  slug: string;
  /** Name used in the Services dropdown, breadcrumbs and related links. */
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

const list: Service[] = [
  {
    slug: 'mens-haircut-grooming',
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
        link: { slug: 'hair-color', label: 'See all hair colour services' },
        items: [
          { name: 'Global Color', icon: 'palette', tags: ['Grey coverage', 'Refresh'], text: 'All-over colour to cover greys or refresh your shade.' },
          { name: 'Global Color (Ammonia-Free)', icon: 'shield', tags: ['Gentler formula'], text: 'The same all-over colour, in an ammonia-free option.' },
          { name: 'Fashion Color', icon: 'flame', tags: ['Bold', 'Statement'], text: 'A bolder shade for when you want something different.' },
          { name: 'Highlights', icon: 'sun', tags: ['Dimension', 'Texture'], text: 'Lighter strands that add contrast and dimension.' },
        ],
      },
      {
        title: 'Add-ons',
        items: [
          { name: 'Head Massage', icon: 'smile', tags: ['Relax', 'Unwind'], text: 'A relaxing scalp massage to unwind after a long week.' },
          { name: 'Beard Color', icon: 'brush', tags: ['Even tone', 'Fuller look'], text: 'Even out greys or patchy tones for a fuller-looking beard.' },
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
            text: 'Soft waves or defined curls for parties, weddings, photoshoots and special occasions.',
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
    offers: ['spa3plus1', 'olaplexTopUp', 'tuesday', 'birthday'],
  },
  {
    slug: 'keratin-hair-treatment',
    label: 'Keratin, Smoothening & Straightening',
    group: 'hair',
    bookAs: 'Keratin Treatment',
    lists: [
      {
        title: 'Treatments',
        items: [
          {
            name: 'Keratin Treatment',
            icon: 'sparkles',
            tags: ['Frizz control', 'Natural volume', 'Shine'],
            text: 'Smooths frizz and adds glossy shine while keeping your hair’s natural body and movement. Ideal if you want manageable hair without a flat, poker-straight look.',
          },
          {
            name: 'Hair Smoothening',
            icon: 'waves',
            tags: ['Soft straight', 'Frizz-free', 'Easy styling'],
            text: 'Relaxes curls and waves into smoother, straighter hair with a soft, natural fall. Great for wavy or frizzy hair that takes too long to style.',
          },
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
  {
    slug: 'hair-botox-nanoplastia',
    label: 'Hair Botox, Cysteine & Nanoplastia',
    group: 'hair',
    bookAs: 'Hair Treatment',
    lists: [
      {
        title: 'Treatments',
        items: [
          {
            name: 'Hair Botox',
            icon: 'heart',
            tags: ['Deep repair', 'Shine', 'Softness'],
            text: 'An intensive conditioning treatment that helps fill and smooth damaged, dry hair for a fuller, glossier, softer finish. No injections. Hair botox is a hair-care treatment, not a cosmetic injection.',
          },
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
    slug: 'hair-color',
    label: 'Hair Color, Highlights & Balayage',
    group: 'hair',
    bookAs: 'Hair Color',
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
      {
        title: 'Highlights & Balayage',
        items: [
          {
            name: 'Balayage',
            icon: 'sun',
            tags: ['Soft', 'Sun-kissed', 'Low-maintenance'],
            text: 'Hand-painted colour that blends naturally from root to tip for a soft, lived-in look that grows out beautifully. Designed for you after consultation.',
          },
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
    offers: ['olaplexTopUp', 'tuesday', 'birthday', 'membership'],
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
    offers: ['hydra3plus1', 'tuesday', 'birthday', 'membership'],
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
    label: 'Threading & De-tan',
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
  {
    slug: 'manicure-pedicure',
    label: 'Manicure & Pedicure',
    group: 'nails',
    bookAs: 'Manicure & Pedicure',
    // TODO: confirm with the owner what each ritual includes; the descriptions present them as increasing levels of care.
    lists: [
      {
        title: 'Manicure & Pedicure',
        variants: [
          { label: 'Manicure', name: 'Manicure' },
          { label: 'Pedicure', name: 'Pedicure' },
          { label: 'Both', name: 'Manicure & Pedicure' },
        ],
        items: [
          {
            name: 'D-Lux', icon: 'sparkles', tags: ['Classic care', 'Quick refresh'],
            text: 'Our classic ritual: nail shaping, cuticle care, exfoliation, massage and polish for neat, refreshed hands and feet.',
          },
          {
            name: 'Crystal', icon: 'droplets', tags: ['Extra pampering', 'Softness'],
            text: 'A step up, with extra exfoliation and nourishment for visibly softer, smoother skin.',
          },
          {
            name: 'Alga', icon: 'waves', tags: ['Rejuvenating', 'Deep nourishment'],
            text: 'A rejuvenating ritual with deeper nourishment and a longer, relaxing massage.',
          },
          {
            name: 'Tango', icon: 'crown', tags: ['Indulgent', 'Premium'],
            text: 'An indulgent, premium ritual for complete relaxation and beautifully cared-for hands and feet.',
          },
          {
            name: 'Detox', icon: 'wind', tags: ['Deep-cleansing', 'Refreshing'],
            text: 'A deep-cleansing, refreshing ritual for tired, dull-looking hands and feet.',
          },
        ],
      },
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
      {
        title: 'Quick Nail Care',
        compact: true,
        items: [
          { name: 'Cut & File', icon: 'scissors', tags: ['Neat shape'], text: 'Clean, shaped nails in minutes.' },
          { name: 'Normal Polish', icon: 'brush', tags: ['Fresh colour'], text: 'A fresh coat of colour for hands or feet.' },
          { name: 'Cut, File & Polish', icon: 'star', tags: ['Quick & neat'], text: 'Shape and polish in one quick visit.' },
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

export const services: Record<string, Service> = Object.fromEntries(list.map((service) => [service.slug, service]));

/** Services dropdown: one column per group on desktop, one accordion per group on mobile. */
export const serviceGroups: Array<{ id: GroupId; label: string; services: Service[] }> = (
  [
    ['hair', 'Hair'],
    ['skin-body', 'Skin & Body'],
    ['nails', 'Nails'],
    ['tattoo', 'Tattoo'],
  ] as const
).map(([id, label]) => ({ id, label, services: list.filter((service) => service.group === id) }));

/** Where "Services" breadcrumbs and "All services" links point. Becomes '/services' once the hub page is built. */
export const servicesHubPath = '/#services';

/** Retired URLs and the page that replaced them. */
export const redirects: Record<string, string> = {
  // Blow dry, ironing and curls live on the women's haircut page, so only one page targets those searches.
  '/services/hair-styling': '/services/womens-haircut-styling',
};
