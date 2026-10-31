// Hair colour: Global Hair Colour, Highlights, Balayage and Fashion Colour, one page each. They share the gallery,
// the comparison, the Olaplex add-on and the aftercare; each has its own intro, steps and FAQs. No prices.
import { footer, img, workPhotos } from '../content';
import { h1For, seoFor } from './catalogue';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

/** The comparison table on all four pages, with this page's row highlighted. */
const compare = (current: string): ServicePageContent['compare'] => ({
  title: 'Global Colour vs Highlights vs Balayage',
  columns: ['Technique', 'Look', 'Best for', 'Grow-out', 'Maintenance'],
  rows: [
    { name: 'Global Colour', slug: 'global-hair-color', cells: ['One even shade', 'Grey coverage, full colour change', 'Visible root line, touch-ups needed', 'Root touch-ups'] },
    { name: 'Highlights', slug: 'highlights', cells: ['Brighter, defined strands', 'Adding dimension and brightness', 'Gradual', 'Regular refresh'] },
    { name: 'Balayage', slug: 'balayage', cells: ['Soft, blended, natural', 'Low-maintenance, lived-in colour', 'Softest, most blended grow-out', 'Fewer visits'] },
  ].map((row) => ({ ...row, current: row.slug === current })),
});

const shared = {
  whatsappSuffix: '',
  gallery: {
    eyebrow: 'Our Work',
    title: 'Hair Colour by Xing',
    text: 'Balayage, highlights, global and fashion colour on our own clients.',
    items: workPhotos(['Balayage', 'Highlights', 'Global Colour', 'Fashion Colours'], 3),
    more: { href: instagram.href, label: 'See more on Instagram @xingpremiumsalons' },
  },
  benefits: {
    title: 'Why Choose Xing for Hair Colour',
    items: [
      { icon: 'palette', title: 'Shades matched to your skin tone' },
      { icon: 'shield', title: 'Ammonia-free options' },
      { icon: 'layers', title: 'Olaplex care for stronger hair' },
      { icon: 'users', title: 'Consultation before every colour' },
    ],
  },
  combo: {
    badge: 'Add-on',
    title: 'Add Olaplex to Any Hair Colour',
    text: 'Colouring and lightening can weaken hair. Add an Olaplex top-up to your colour service to help protect, repair and strengthen your hair.',
    includes: ['Any colour service', 'All hair lengths', 'Men & women'],
    cta: 'Add Olaplex to my colour',
    linkTo: 'hair-spa',
  },
  aftercare: {
    title: 'How to Make Your Hair Colour Last',
    tips: [
      'Wait at least a couple of days before your first wash.',
      'Use a colour-safe, sulphate-free shampoo.',
      'Wash with cool or lukewarm water to reduce fading.',
      'Use a heat protectant before blow drying, ironing or curling.',
      'Protect your hair from strong sun and chlorinated water.',
      'Book a hair spa or Olaplex treatment to keep coloured hair healthy.',
      'First time colouring or have sensitive skin? Ask us about a patch test before your appointment.',
    ],
  },
  offerBand: {
    title: 'Hair Colour Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  order: ['intro', 'gallery', 'menu', 'audience', 'process', 'compare', 'combo', 'benefits', 'aftercare', 'offers', 'locations', 'faq', 'related'],
} satisfies Partial<ServicePageContent>;

const chips: ServicePageContent['hero']['chips'] = [
  { icon: 'palette', label: 'Known for our hair colour' },
  { icon: 'users', label: 'Free shade consultation' },
  { icon: 'shield', label: 'Price confirmed before we start' },
];

export const globalHairColor: ServicePageContent = {
  ...shared,
  slug: 'global-hair-color',
  seo: seoFor('global-hair-color', { serviceType: 'Global Hair Colouring' }),
  hero: {
    eyebrow: 'Hair Care · Hair Colour',
    h1: h1For('global-hair-color'),
    sub: 'One rich, even shade from roots to ends, for grey coverage, a fresh tone or a complete change, with ammonia-free options.',
    cta: 'Book a Colour Consultation on WhatsApp',
    chips,
    image: img('color-global', 'Client with copper global hair colour at Xing Salon Bangalore', 640, 480),
  },
  whatsappText: 'Hi, I’d like a global hair colour consultation at Xing',
  intro: {
    eyebrow: 'Global Hair Colour',
    title: 'Global Hair Colour in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Global hair colour in Bangalore is the simplest way to change your look: one even shade applied from roots to ends. It covers greys, revives faded or uneven colour and can take you warmer, cooler, richer or a few shades lighter. At Xing we offer both classic and ammonia-free global colour, plus root touch-ups to keep regrowth invisible between visits.',
      'Every appointment at our Sarjapur Road, HSR Layout and Brookfield salons starts with a shade consultation. Your colourist looks at your skin tone, natural base and colour history, then recommends a shade that flatters you and suits your routine. We confirm the price before we start, so you know exactly what to expect. It’s easy to reach from Koramangala, Bellandur, Whitefield and Marathahalli, and a colour refresh fits neatly into a weekend visit.',
    ],
  },
  menu: {
    eyebrow: 'Global Colour',
    title: 'Global Colour & Root Touch-ups',
    text: 'For all hair lengths, for women and men.',
    askText: 'Not sure which shade suits you? Send us a photo on WhatsApp.',
    moreLink: { slug: 'highlights', text: 'Want dimension instead of one shade?', label: 'Highlights', also: [{ slug: 'balayage', label: 'Balayage' }] },
  },
  audience: {
    title: 'Who Global Hair Colour Is For',
    items: ['Anyone covering greys from roots to ends', 'Faded, brassy or uneven colour that needs one fresh, even tone', 'A complete colour change, from soft brown to rich copper or burgundy'],
    note: 'Sensitive scalp or colouring for the first time? Ask for a patch test before your appointment.',
  },
  compare: compare('global-hair-color'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Shade consultation', text: 'Skin tone, base, colour history and the look you want.' },
      { title: 'Colour applied evenly', text: 'Roots first, then lengths and ends.' },
      { title: 'Process & rinse', text: 'With a colour-safe cleanse and conditioning.' },
      { title: 'Style & aftercare tips' },
    ],
  },
  locationsTitle: 'Global Hair Colour Near You in Bangalore',
  faqTitle: 'Global Hair Colour FAQs',
  faqs: [
    {
      q: 'What is global hair colour?',
      a: 'Global hair colour is one even shade applied to all of your hair, from the roots to the ends. It is the go-to choice for full grey coverage, refreshing faded colour or a complete colour change, and it suits every hair length for both women and men.',
    },
    {
      q: 'Do you have ammonia-free global hair colour in Bangalore?',
      a: 'Yes, Xing offers ammonia-free global colour and ammonia-free root touch-ups at all three salons in Sarjapur Road, HSR Layout and Brookfield. It is a popular, gentler option. Your colourist will tell you during the consultation whether it can reach the shade you want.',
    },
    {
      q: 'How often will I need a root touch-up after global colour?',
      a: 'Most people book a root touch-up every four to six weeks after global colour. It depends on how fast your hair grows and how visible greys or regrowth are against your shade. A touch-up only colours the new growth, so it is quicker than a full global colour.',
    },
    {
      q: 'How much does global hair colour cost at Xing?',
      a: 'The price depends on your hair length, density and whether you choose an ammonia-free formula, so we confirm it with you before we start. Send a photo of your hair on WhatsApp, or ask at the salon, and your colourist will give you a quote after a free consultation.',
    },
  ],
  related: {
    title: 'More Hair Colour Services',
    items: [
      { slug: 'highlights', text: 'Foil and freehand highlights for dimension.' },
      { slug: 'balayage', text: 'Soft, hand-painted, sun-kissed colour.' },
      { slug: 'fashion-color', text: 'Vivid pinks, blues, purples and pastels.' },
    ],
  },
  cta: 'Ready for a rich, even new shade? Book your global colour consultation at Xing today.',
};

export const highlights: ServicePageContent = {
  ...shared,
  slug: 'highlights',
  seo: seoFor('highlights', { serviceType: 'Hair Highlights' }),
  hero: {
    eyebrow: 'Hair Care · Hair Colour',
    h1: h1For('highlights'),
    sub: 'Brightness and dimension woven through your hair, from soft face-framing pieces to full, sun-lit highlights.',
    cta: 'Book a Colour Consultation on WhatsApp',
    chips,
    image: img('work-highlights-1', 'Golden blonde highlights at Xing Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a highlights consultation at Xing',
  intro: {
    eyebrow: 'Highlights',
    title: 'Hair Highlights in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Hair highlights in Bangalore add brightness, movement and dimension without changing your whole colour. Lighter strands are woven through your hair with foils, or painted freehand, so your natural base still shows through. Choose full highlights for an all-over lift, or a few targeted foils for face-framing pieces and subtle pops of colour.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every highlights appointment starts with a free shade consultation. Your colourist looks at your skin tone, base and colour history, then plans placement and tone, from soft caramel to golden blonde. Ask about Olaplex to protect lightened hair, and we confirm the price before we start. Our salons are close to Koramangala, Bellandur and Whitefield, so a refresh between visits is easy to fit in.',
    ],
  },
  menu: {
    eyebrow: 'Highlights',
    title: 'Full Highlights or Per Foil',
    text: 'For all hair lengths, for women and men. Pre-lightening may be needed for some shades.',
    askText: 'Have an inspiration photo? Send it to us on WhatsApp.',
    moreLink: { slug: 'balayage', text: 'Prefer a softer, blended look?', label: 'Balayage' },
  },
  audience: {
    title: 'Who Highlights Are For',
    items: ['Anyone who wants brightness and dimension without a full colour change', 'Flat or one-tone hair that needs movement and texture', 'Face-framing pieces or subtle pops of colour exactly where you want them'],
    note: 'Lightened recently, or had henna or keratin? Tell your colourist before the appointment.',
  },
  compare: compare('highlights'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Shade & placement consultation' },
      { title: 'Sectioning & foils', text: 'Or freehand painting for softer pieces.' },
      { title: 'Lighten, tone & rinse' },
      { title: 'Style & aftercare tips' },
    ],
  },
  locationsTitle: 'Hair Highlights Near You in Bangalore',
  faqTitle: 'Hair Highlights FAQs',
  faqs: [
    {
      q: 'What is the difference between highlights and balayage?',
      a: 'Highlights are lighter strands placed with foils for brighter, more defined dimension, while balayage is painted by hand for a softer, blended finish. Highlights look crisper and more even; balayage grows out more gradually. Your colourist can combine both if you want brightness with a soft root.',
    },
    {
      q: 'Can I get just a few highlights instead of a full head?',
      a: 'Yes, you can book highlights per foil at Xing. It is perfect for face-framing pieces, a few bright strands around the parting or a subtle pop of colour. Your colourist will suggest how many foils you need during your free consultation at Sarjapur Road, HSR Layout or Brookfield.',
    },
    {
      q: 'Do highlights damage your hair?',
      a: 'Any lightening can weaken hair, so highlights are done carefully, and we recommend adding Olaplex to protect the bonds inside the hair. Regular hair spas, colour-safe shampoo and a heat protectant keep highlighted hair soft and shiny. Your colourist checks your hair’s condition first.',
    },
    {
      q: 'How long do hair highlights last?',
      a: 'Highlights do not wash out; they grow out as your hair grows. Most people refresh them every two to three months to soften the regrowth line and brighten the tone. A toner or gloss between visits keeps blonde and caramel shades from looking brassy.',
    },
  ],
  related: {
    title: 'More Hair Colour Services',
    items: [
      { slug: 'balayage', text: 'Soft, hand-painted, sun-kissed colour.' },
      { slug: 'global-hair-color', text: 'Rich, even all-over colour and grey coverage.' },
      { slug: 'fashion-color', text: 'Vivid pinks, blues, purples and pastels.' },
    ],
  },
  cta: 'Ready for brighter, dimensional hair? Book your highlights consultation at Xing today.',
};

export const balayage: ServicePageContent = {
  ...shared,
  slug: 'balayage',
  seo: seoFor('balayage', { serviceType: 'Balayage Hair Colouring' }),
  hero: {
    eyebrow: 'Hair Care · Hair Colour',
    h1: h1For('balayage'),
    sub: 'Soft, hand-painted, sun-kissed colour that blends from root to tip and grows out beautifully.',
    cta: 'Book a Balayage Consultation on WhatsApp',
    chips,
    image: { src: '/images/balayage-hair-colour-bangalore.webp', alt: 'Blonde face-framing balayage hair colour at Xing Premium Salon Bangalore', width: 800, height: 600 },
  },
  whatsappText: 'Hi, I’d like a balayage consultation at Xing',
  intro: {
    eyebrow: 'Balayage',
    title: 'Balayage in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Balayage in Bangalore is one of our most requested colour services: lighter colour painted by hand onto the surface of your hair so it melts naturally from a deeper root into brighter lengths. The result looks soft and lived-in, never stripy, and it grows out without a harsh line, so you need fewer colour appointments.',
      'Every balayage at our Sarjapur Road, HSR Layout and Brookfield salons is designed for you. Your colourist studies your skin tone, base, haircut and the inspiration photos you love, then plans placement and tone, from caramel and honey to cool ash. Add Olaplex to protect lightened hair, and we confirm the price before we start. Clients visit from Koramangala, Bellandur, Whitefield and Marathahalli for balayage that still looks fresh months later.',
    ],
  },
  menu: {
    eyebrow: 'Balayage',
    title: 'Hand-Painted Balayage',
    text: 'For all hair lengths. Pre-lightening may be needed for lighter shades on dark hair.',
    askText: 'Send us your inspiration photo on WhatsApp and we’ll tell you what’s possible.',
    moreLink: { slug: 'highlights', text: 'Prefer brighter, more defined strands?', label: 'Highlights' },
  },
  audience: {
    title: 'Who Balayage Is For',
    items: ['Anyone who wants soft, natural-looking brightness', 'Busy schedules: it grows out gracefully with fewer touch-ups', 'Dark hair that wants caramel, honey or bronze tones without a stark contrast'],
    note: 'Had henna, box dye or keratin recently? Tell your colourist so they can plan the right approach.',
  },
  compare: compare('balayage'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Consultation & inspiration review' },
      { title: 'Hand-painted placement', text: 'Section by section, softer at the root.' },
      { title: 'Lighten, tone & rinse' },
      { title: 'Style & aftercare tips' },
    ],
  },
  locationsTitle: 'Balayage Near You in Bangalore',
  faqTitle: 'Balayage FAQs',
  faqs: [
    {
      q: 'How long does balayage last?',
      a: 'Balayage lasts a long time because it grows out softly, without a sharp regrowth line. Many clients refresh it only every three to four months. A toner between visits keeps the tone fresh, and colour-safe shampoo plus regular hair spas keep your lengths glossy and healthy.',
    },
    {
      q: 'Does balayage work on dark Indian hair?',
      a: 'Yes, balayage looks beautiful on dark Indian hair. Caramel, honey, chocolate and bronze tones blend naturally with a dark base. Your colourist will recommend a shade that suits your skin tone, and may suggest building lighter colour over two visits to keep your hair healthy.',
    },
    {
      q: 'Is balayage better than highlights?',
      a: 'Neither is better for everyone; it depends on the look you want. Balayage gives a softer, blended, low-maintenance result, while highlights give brighter, more defined strands from the root. During your free consultation at Xing, your colourist will help you choose, or combine both.',
    },
    {
      q: 'Where can I get balayage in Bangalore?',
      a: 'You can get balayage at Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon, bring an inspiration photo, and your colourist will plan the shade and confirm the price before starting.',
    },
  ],
  related: {
    title: 'More Hair Colour Services',
    items: [
      { slug: 'highlights', text: 'Foil and freehand highlights for dimension.' },
      { slug: 'global-hair-color', text: 'Rich, even all-over colour and grey coverage.' },
      { slug: 'fashion-color', text: 'Vivid pinks, blues, purples and pastels.' },
    ],
  },
  cta: 'Ready for soft, sun-kissed colour? Book your balayage consultation at Xing today.',
};

export const fashionColor: ServicePageContent = {
  ...shared,
  slug: 'fashion-color',
  seo: seoFor('fashion-color', { serviceType: 'Fashion Hair Colouring' }),
  hero: {
    eyebrow: 'Hair Care · Hair Colour',
    h1: h1For('fashion-color'),
    sub: 'Vivid pinks, blues, purples, reds and pastels, from a peek-a-boo strand to a bold statement, done with care.',
    cta: 'Book a Colour Consultation on WhatsApp',
    chips,
    image: img('color-fashion', 'Purple and lilac fashion colour streaks at Xing Salon Bangalore', 640, 480),
  },
  whatsappText: 'Hi, I’d like a fashion colour consultation at Xing',
  intro: {
    eyebrow: 'Fashion Colour',
    title: 'Fashion & Crazy Hair Colour in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Fashion hair colour in Bangalore is for anyone who wants their hair to make a statement. At Xing we create vivid and pastel shades, including electric blue, hot pink, lilac, teal, red and purple, as hidden peek-a-boo strands, face-framing streaks or bold sections. Colour is priced per foil, so you can start small or go all in.',
      'Bright shades usually need lightened hair to show true, so every fashion colour at our Sarjapur Road, HSR Layout and Brookfield salons begins with a consultation. Your colourist checks your hair’s condition, plans any pre-lightening and adds bond protection to keep hair strong. We confirm the price before we start. Many clients start with one hidden streak, then come back from Koramangala, Bellandur or Whitefield to add more.',
    ],
  },
  menu: {
    eyebrow: 'Fashion Colour',
    title: 'Vivid & Pastel Shades',
    text: 'Priced per foil, for all hair lengths. Pre-lightening is usually needed on dark hair.',
    askText: 'Have a shade in mind? Send us a photo on WhatsApp.',
    moreLink: { slug: 'highlights', text: 'Want something brighter but more natural?', label: 'Highlights' },
  },
  audience: {
    title: 'Who Fashion Colour Is For',
    items: ['Anyone who wants a bold, playful or creative look', 'First-timers who want to try a hidden peek-a-boo streak', 'Events, festivals and photoshoots that call for a statement'],
    note: 'Vivid shades fade faster than natural tones; your colourist will share tips to make them last.',
  },
  compare: compare(''),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Shade & placement consultation' },
      { title: 'Pre-lightening with bond protection', text: 'Only where the shade needs it.' },
      { title: 'Vivid colour applied & rinsed' },
      { title: 'Style & aftercare tips' },
    ],
  },
  locationsTitle: 'Fashion Hair Colour Near You in Bangalore',
  faqTitle: 'Fashion & Crazy Hair Colour FAQs',
  faqs: [
    {
      q: 'Do I need to bleach my hair for fashion colour?',
      a: 'Usually yes. Bright and pastel shades need lighter hair underneath to show true, especially on dark Indian hair. Your colourist pre-lightens only the sections that need it and adds bond protection, so your hair stays as strong as possible. Darker vivid shades sometimes need less lightening.',
    },
    {
      q: 'How long does crazy hair colour last?',
      a: 'Vivid and pastel colours fade faster than natural shades, often within four to eight weeks, depending on the shade and how often you wash. Wash with cool water, use a sulphate-free shampoo and avoid too much heat to keep the colour bright for longer.',
    },
    {
      q: 'Can I try fashion colour on just a few strands?',
      a: 'Yes. Fashion colour at Xing is priced per foil, so you can start with one or two hidden peek-a-boo streaks or face-framing pieces. It is a great way to try a bold shade without committing to a full head of colour. Ask for a free consultation first.',
    },
    {
      q: 'Where can I get fashion hair colour in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Send us your shade inspiration on WhatsApp or visit the salon for a free consultation, and your colourist will plan placement and lightening, then confirm the price before starting.',
    },
  ],
  related: {
    title: 'More Hair Colour Services',
    items: [
      { slug: 'highlights', text: 'Foil and freehand highlights for dimension.' },
      { slug: 'balayage', text: 'Soft, hand-painted, sun-kissed colour.' },
      { slug: 'global-hair-color', text: 'Rich, even all-over colour and grey coverage.' },
    ],
  },
  cta: 'Ready to go bold? Book your fashion colour consultation at Xing today.',
};
