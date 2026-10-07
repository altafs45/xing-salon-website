import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. What "Temporary Extensions" are at Xing (press-on or glue-on tips, or something else). Adjust the card in
//      services.ts, the "Start With Temporary" card and the FAQ to match.
//   2. Are extensions and overlays offered to men (e.g. overlays for nail strength)? If yes, add the FAQ
//      "Are overlays available for men?" with the confirmed answer.
//   3. Tool hygiene practice. If confirmed, add a "Hygiene" benefit; until then, make no hygiene claim.
//   4. Real nail-work photos. When added, use the alts "Acrylic nail extensions at Xing Premium Salon Bangalore"
//      and "Gel nail overlays in HSR Layout nail salon".
export const nailExtensions: ServicePageContent = {
  slug: 'nail-extensions',
  order: [
    'intro',
    'menu',
    'compare',
    'miniCompare',
    'occasions',
    'combo',
    'benefits',
    'process',
    'aftercare',
    'offers',
    'locations',
    'faq',
    'related',
  ],
  seo: {
    title: 'Nail Extensions in Bangalore | Acrylic, Gel & Poly Gel | Xing',
    description:
      'Acrylic, poly gel & hard gel nail extensions, overlays, refills and safe removal at Xing Salon, HSR Layout, Brookfield & Sarjapura. Book on WhatsApp.',
    keyword: 'nail extensions Bangalore',
    serviceType: 'Nail Extensions and Overlays',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
    providerType: 'NailSalon',
  },
  hero: {
    eyebrow: 'Nails · Extensions & Overlays',
    h1: 'Nail Extensions & Overlays in Bangalore',
    sub: 'Longer, stronger, beautifully shaped nails with acrylic, poly gel, hard gel and builder gel extensions and overlays, plus refills and gentle removal.',
    cta: 'Book Nail Extensions on WhatsApp',
    chips: [
      { icon: 'sparkles', label: 'Acrylic · Gel · Poly Gel' },
      { icon: 'shield', label: 'Overlays for natural nails' },
      { icon: 'calendar', label: 'Temporary extensions available' },
    ],
    // The real Nail Bar at HSR; replace with a photo of nail work when available (see the TODO above).
    image: {
      src: '/images/loc-hsr-3.webp',
      alt: 'The Nail Bar at Xing Premium Salon in HSR Layout, Bangalore, where nail extensions and overlays are done',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book nail extensions/overlays (___) at Xing',
  whatsappSuffix: '. Preferred shape & length: ___',
  intro: {
    eyebrow: 'Nail Extensions',
    title: 'Nail Extension Salon in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Want long, elegant nails or simply stronger natural nails that don’t break? At Xing Premium Unisex Salon, our nail technicians create extensions and overlays that look natural, feel comfortable and are built to last with proper care. Choose your system: classic acrylic, lightweight poly gel, glossy UV hard gel or strengthening builder in a bottle. Then pick your shape and length.',
      'Trying extensions for the first time or just for an event? Temporary extensions are an easy, affordable start. We also offer refills to keep your set fresh, and careful removal to protect your natural nails. Find us at our salons across Bangalore.',
    ],
  },
  menu: {
    eyebrow: 'Nail Services',
    title: 'Extensions, Overlays & Removal',
    askText: 'Not sure which system suits you? Send us your inspiration on WhatsApp.',
    // Gel polish and designs have their own page; this page only points to it.
    moreLink: { slug: 'nail-art', text: 'Add designs, chrome, cat eye or French tips', label: 'Nail Art' },
  },
  compare: {
    title: 'Acrylic vs Poly Gel vs Hard Gel vs Builder in a Bottle',
    columns: ['System', 'Feel', 'Best for', 'Use as'],
    rows: [
      { name: 'Acrylic', cells: ['Sturdy', 'Length and bold shapes', 'Extension & overlay'] },
      { name: 'Poly Gel', cells: ['Lightweight', 'Natural feel with strength', 'Extension & overlay'] },
      { name: 'UV Hard Gel', cells: ['Glossy, slightly flexible', 'Glossy, natural look', 'Extension & overlay'] },
      { name: 'Builder in a Bottle', cells: ['Smooth, natural', 'Strengthening natural nails', 'Extension & overlay'] },
    ],
  },
  miniCompare: {
    title: 'Extensions vs Overlays — What’s the Difference?',
    columns: ['Option', 'What it does'],
    rows: [
      { name: 'Extensions', cells: ['Add length and shape beyond your natural nail'] },
      { name: 'Overlays', cells: ['Strengthen your natural nail without adding length'] },
    ],
  },
  occasions: {
    eyebrow: 'Choose Your Shape',
    title: 'Pick Your Shape & Length',
    scroll: true,
    items: [
      { icon: 'nail-square', label: 'Square' },
      { icon: 'nail-squoval', label: 'Squoval' },
      { icon: 'nail-round', label: 'Round' },
      { icon: 'nail-oval', label: 'Oval' },
      { icon: 'nail-almond', label: 'Almond' },
      { icon: 'nail-coffin', label: 'Coffin' },
      { icon: 'nail-stiletto', label: 'Stiletto' },
    ],
    note: 'Not sure? Your nail technician will suggest a shape that suits your hands and lifestyle.',
  },
  combo: {
    badge: 'First Time?',
    title: 'New to Extensions? Start With Temporary',
    text: 'Try temporary extensions for an event or a first experience. They’re quick, affordable and easy to remove. Love them? Upgrade to acrylic, poly gel or gel next time.',
    includes: ['Quick to apply', 'Affordable start', 'Easy to remove', 'Upgrade any time'],
    cta: 'Book temporary extensions',
    bookText: 'Hi, I’d like to book temporary nail extensions at Xing. Location: ___. Preferred shape & length: ___',
  },
  benefits: {
    title: 'Why Get Nail Extensions & Overlays',
    items: [
      { icon: 'sparkles', title: 'Instant length and shape' },
      { icon: 'shield', title: 'Stronger nails that break less' },
      { icon: 'layers', title: 'Polished look for weeks with refills' },
      { icon: 'brush', title: 'Perfect base for nail art' },
      { icon: 'heart', title: 'Ideal for weddings and events' },
    ],
  },
  process: {
    title: 'Your Nail Extension Appointment',
    steps: [
      { title: 'Consultation', text: 'System, shape and length.' },
      { title: 'Natural nail prep' },
      { title: 'Extension or overlay built & shaped' },
      { title: 'Cured & filed' },
      { title: 'Polish or nail art finish' },
    ],
  },
  aftercare: {
    title: 'Aftercare for Longer-Lasting Nails',
    tips: [
      'Use your fingertips, not your nails, as tools.',
      'Wear gloves for cleaning and washing dishes.',
      'Apply cuticle oil daily.',
      'Book a refill every 2–3 weeks as your nails grow.',
      'If a nail lifts or breaks, book a repair. Don’t glue it at home.',
      'Always get extensions professionally removed.',
      'Have a nail or skin infection? Let us know before your appointment.',
    ],
  },
  offerBand: {
    title: 'Nail Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Nail Extensions Near You in Bangalore',
  faqTitle: 'Nail Extension FAQs',
  faqs: [
    {
      q: 'Which is better: acrylic, gel or poly gel?',
      a: 'Acrylic is the sturdiest and great for length, poly gel is lightweight with a natural feel, and hard gel gives a glossy, natural look. Your nail technician will help you choose based on your lifestyle.',
    },
    {
      q: 'What’s the difference between extensions and overlays?',
      a: 'Extensions add length and shape beyond your natural nail. Overlays strengthen your natural nails without adding length.',
    },
    {
      q: 'How long do nail extensions last?',
      a: 'With proper care, extensions typically stay looking good for a few weeks. Book a refill every 2–3 weeks as your nails grow.',
    },
    {
      q: 'Do nail extensions damage natural nails?',
      a: 'Professional application and removal help protect your natural nails. Avoid picking or peeling extensions off. Always book a professional removal.',
    },
    {
      q: 'Can I get extensions just for a wedding or party?',
      a: 'Yes. Our temporary extensions are an easy, affordable option for events or first-timers.',
    },
    {
      q: 'Do you remove extensions done elsewhere?',
      a: 'Yes. We offer careful removal for acrylic, hard poly gel, gel polish and temporary extensions.',
    },
    // TODO: add "Are overlays available for men?" here once the owner confirms the answer.
    {
      q: 'How is pricing decided?',
      a: 'It depends on the system, length and any nail art. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get nail extensions in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Complete Your Nail Look',
    items: [
      { slug: 'nail-art', text: 'From French tips and chrome to 3D art.' },
      { slug: 'manicure-pedicure', text: 'Five manicure and pedicure rituals, plus heel peel treatment.' },
      { slug: 'waxing', text: 'Flavored, roll-on and stripless wax for face, body and bikini.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
    ],
  },
  cta: 'Ready for your dream nails? Book your extensions at Xing today.',
};
