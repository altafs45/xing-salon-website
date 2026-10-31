import { footer, serviceHero, servicePhotos } from '../content';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

// TODO (owner to confirm before publishing):
//   1. What "Millers" is on the menu (a finish or design). Add its card to the Designer Art list in services.ts
//      once confirmed; it stays hidden until then.
//   2. Is nail art / gel polish offered to men? If yes, add the FAQ "Is nail art available for men?" with the
//      confirmed answer.
//   3. Real nail art photos for the gallery, from the salon or its Instagram, ~400px square WebP. Add them to
//      `gallery.items` with an alt naming the design and salon, e.g. "Chrome nail art at Xing Premium Salon
//      Bangalore". No stock photos presented as salon work, and no characters, logos or brand marks.
//   4. A real nail art photo for the hero.
export const nailArt: ServicePageContent = {
  slug: 'nail-art',
  order: ['intro', 'gallery', 'menu', 'picks', 'compare', 'combo', 'benefits', 'process', 'aftercare', 'bridal', 'offers', 'locations', 'faq', 'related'],
  bridalCare: { cards: ['hair-styling', 'glow', 'body-polish'] },
  seo: {
    title: 'Nail Art in Bangalore | Chrome, Cat Eye, French & Gel | Xing',
    description:
      'Chrome, cat eye, French, ombre, marble, 3D & gel polish nail art at Xing Salon, Sarjapur Road, HSR Layout & Brookfield. Bring your inspo and book on WhatsApp.',
    keyword: 'nail art Bangalore',
    serviceType: 'Nail Art and Gel Polish',
    areaServed: ['Bengaluru', 'Sarjapura', 'HSR Layout', 'Brookfield'],
    providerType: 'NailSalon',
  },
  hero: {
    eyebrow: 'Nails · Nail Art',
    h1: 'Nail Art in Bangalore — Designs, Gel Polish & More',
    sub: 'From glossy gel polish and classic French tips to chrome, cat eye, galaxy and 3D designs, nail art that matches your mood, outfit and occasion.',
    cta: 'Book Nail Art on WhatsApp',
    chips: [
      { icon: 'sparkles', label: '14+ nail art styles' },
      { icon: 'brush', label: 'On natural nails or extensions' },
      { icon: 'camera', label: 'Bring your inspo' },
    ],
    image: serviceHero('nail-art', 'Navy ombre nail art with silver detailing'),
  },
  whatsappText: 'Hi, I’d like to book nail art (___ design) at Xing',
  whatsappSuffix: '. I’ll share my inspiration photo.',
  cardItemSuffix: ' nail art',
  intro: {
    eyebrow: 'Nail Art',
    title: 'Nail Art Studio in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Your nails are the easiest way to express your style. At Xing Premium Unisex Salon, our nail artists create everything from clean, minimal looks to bold statement designs. Choose glossy gel polish, timeless French tips, soft ombre, mirror-like chrome, shimmering cat eye or dreamy galaxy nails. Or go detailed with marble, dry flower, stones and 3D art.',
      'Bring a photo from Pinterest or Instagram and we’ll recreate it or adapt it to suit your nail shape. Nail art works on natural nails, extensions and overlays, making it perfect for weddings, parties, festivals or simply treating yourself, at our salons across Bangalore.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Nail Art Inspiration',
    text: 'Bring a photo or pick a style. Your nail artist will match it to your nail shape.',
    items: servicePhotos('nail-art', [
      ['Leopard print', 'Brown nails with leopard print nail art'],
      ['Chrome swirl', 'Brown nails with gold chrome swirl art'],
      ['Heart ombre', 'Burgundy ombre nails with heart line art'],
      ['Bows & cherries', 'French tips with bow and cherry nail art'],
    ]),
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  menu: {
    eyebrow: 'Designs',
    title: 'Nail Art Styles',
    askText: 'Have a design in mind? Send us your inspiration photo on WhatsApp.',
    // Extensions and overlays have their own page; this page only points to it.
    moreLink: { slug: 'nail-extensions', text: 'Want longer nails first?', label: 'Nail Extensions & Overlays' },
  },
  picks: {
    eyebrow: 'Shop by Occasion',
    title: 'Nail Art for Every Occasion',
    items: [
      { icon: 'crown', title: 'Wedding & bridal', styles: ['French', 'Stone', 'Chrome'] },
      { icon: 'zap', title: 'Party night', styles: ['Glitter', 'Galaxy', 'Cat Eye'] },
      { icon: 'clock', title: 'Office-friendly', styles: ['Gel Polish', 'Ombre', 'Liner'] },
      { icon: 'sun', title: 'Festive', styles: ['Stone', 'Glitter', '3D'] },
      { icon: 'heart', title: 'Everyday chic', styles: ['French', 'Marble', 'Dry Flower'] },
    ],
  },
  compare: {
    title: 'Gel Polish vs Regular Polish',
    columns: ['Polish', 'How it sets', 'Finish', 'Changing it'],
    rows: [
      {
        name: 'Gel Polish',
        cells: ['Cured under a lamp', 'Glossy and long-wearing', 'Needs professional removal'],
        current: true,
        link: { slug: 'nail-extensions', label: 'About gel polish removal', hash: '#menu' },
      },
      {
        name: 'Regular Polish',
        cells: ['Air-dries', 'Quick and easy', 'Easy to change; wears off sooner'],
        link: { slug: 'quick-nail-care', label: 'Quick Nail Care (Cut, File & Polish)' },
      },
    ],
  },
  combo: {
    badge: 'Pair It',
    title: 'Extensions + Nail Art',
    text: 'Pair your nail art with acrylic, poly gel or gel extensions for longer nails and bigger designs.',
    includes: [],
    actions: [{ label: 'Explore nail extensions', slug: 'nail-extensions', hash: '' }],
  },
  benefits: {
    title: 'Why Choose Xing for Nail Art',
    items: [
      { icon: 'sparkles', title: 'Wide range of 14+ styles' },
      { icon: 'camera', title: 'Recreate your inspiration photos' },
      { icon: 'brush', title: 'Works on natural nails and extensions' },
      { icon: 'crown', title: 'Ideal for weddings, parties and festivals' },
    ],
  },
  process: {
    title: 'Your Nail Art Appointment',
    steps: [
      { title: 'Share inspiration & choose design' },
      { title: 'Nail prep & shaping' },
      { title: 'Base colour' },
      { title: 'Art, detailing & embellishments' },
      { title: 'Top coat & cure' },
    ],
  },
  aftercare: {
    title: 'Make Your Nail Art Last',
    tips: [
      'Apply cuticle oil daily.',
      'Wear gloves for cleaning and dishes.',
      'Avoid using your nails as tools.',
      'Don’t peel off gel polish. Book a professional removal.',
      'For events, book 1–2 days before.',
    ],
  },
  offerBand: {
    title: 'Nail Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Nail Art Near You in Bangalore',
  faqTitle: 'Nail Art FAQs',
  faqs: [
    {
      q: 'Can you recreate a nail design from Instagram or Pinterest?',
      a: 'Yes. Share your inspiration photo on WhatsApp or at your appointment, and our nail artist will recreate it or adapt it to your nail shape and length.',
    },
    {
      q: 'Can I get nail art on my natural nails?',
      a: 'Yes. Nail art works on natural nails, extensions and overlays.',
    },
    {
      q: 'What’s the difference between gel polish and regular polish?',
      a: 'Gel polish is cured under a lamp for a glossy, long-wearing finish and needs professional removal. Regular polish air-dries and is easier to change often.',
    },
    {
      q: 'What are chrome and cat eye nails?',
      a: 'Chrome nails have a mirror-like metallic shine. Cat eye nails use a magnetic shimmer that shifts with the light.',
    },
    {
      q: 'Which nail art is best for a wedding?',
      a: 'Popular bridal choices include French tips, chrome, and stone-embellished designs. Book 1–2 days before the event.',
    },
    // TODO: add "Is nail art available for men?" here once the owner confirms the answer.
    {
      q: 'How is pricing decided?',
      a: 'It depends on the design, the number of nails and the detailing. Message us on WhatsApp with your inspiration for a quick quote.',
    },
    {
      q: 'Where can I get nail art in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield.',
    },
  ],
  related: {
    title: 'Complete Your Nail Look',
    items: [
      { slug: 'nail-extensions', text: 'Acrylic, poly gel and hard gel extensions and overlays.' },
      { slug: 'manicure', text: 'Five manicure rituals, from D-Lux to Detox.' },
      { slug: 'quick-nail-care', text: 'Cut, file and polish in one quick session.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
      { slug: 'waxing', text: 'Flavored, roll-on and stripless wax for face, body and bikini.' },
    ],
  },
  cta: 'Ready to wear your style? Book your nail art at Xing today.',
};
