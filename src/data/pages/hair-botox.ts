// Hair treatments: Hair Botox, and Nanoplastia & Cysteine (these were one "Hair Botox, Cysteine & Nanoplastia"
// page). They share the gallery, comparison, Acai oil offer and aftercare. No prices.
import { footer, img, workPhotos } from '../content';
import { h1For, seoFor } from './catalogue';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

const compare = (current: string): ServicePageContent['compare'] => ({
  title: 'Hair Botox vs Cysteine vs Nanoplastia',
  columns: ['Treatment', 'Main goal', 'Finish', 'Best for', 'Texture change'],
  rows: [
    { name: 'Hair Botox', slug: 'hair-botox', cells: ['Repair & shine', 'Fuller, glossy, soft', 'Dry, damaged or coloured hair', 'Minimal'] },
    { name: 'Cysteine', slug: 'nanoplastia-cysteine', cells: ['Frizz control & smoothness', 'Smooth with natural movement', 'Frizzy hair that should stay natural', 'Light smoothing'] },
    { name: 'Nanoplastia', slug: 'nanoplastia-cysteine', cells: ['Smoother, straighter hair', 'Silky, straighter, natural-looking', 'Frizzy, wavy or curly hair', 'Noticeably straighter'] },
  ].map((row) => ({ ...row, current: row.slug === current })),
});

const shared = {
  gallery: {
    eyebrow: 'Our Work',
    title: 'Nanoplastia & Hair Botox Results',
    text: 'Real results from our advanced hair treatments, on our own clients.',
    items: workPhotos(['Nanoplastia', 'Keratin & Botox'], 4),
    more: { href: instagram.href, label: 'See more on Instagram @xingpremiumsalons' },
  },
  crossNote: {
    title: 'How Do These Compare to Keratin?',
    text: 'Keratin focuses on frizz control with natural volume. Hair botox focuses more on repair and shine. Nanoplastia gives a smoother, straighter finish. Not sure which is right? Your stylist will help you decide.',
    link: { slug: 'keratin-treatment', label: 'Compare keratin, smoothening & straightening' },
  },
  benefits: {
    title: 'Benefits of Advanced Hair Treatments',
    items: [
      { icon: 'wind', title: 'Visibly smoother, frizz-free hair' },
      { icon: 'sparkles', title: 'Softer, shinier lengths' },
      { icon: 'clock', title: 'Easier everyday styling' },
      { icon: 'users', title: 'Personalised to your hair type' },
    ],
  },
  combo: {
    badge: 'Included',
    title: 'Complimentary Acai Oil Treatment',
    text: 'Every hair botox, cysteine and nanoplastia treatment at XING includes a complimentary Acai oil treatment for extra nourishment and shine.',
    includes: ['Included with all hair treatments', 'Every hair length', 'Men & women'],
    cta: 'Book my treatment',
  },
  aftercare: {
    title: 'Aftercare for Longer-Lasting Results',
    tips: [
      'Follow your stylist’s advice on when to wash your hair for the first time.',
      'Use a sulphate-free shampoo and a nourishing conditioner.',
      'Use a heat protectant whenever you blow dry, iron or curl.',
      'Avoid swimming in chlorinated water soon after your treatment.',
      'Book a hair spa every few weeks to keep lengths nourished.',
      'Tell your stylist about recent colouring, scalp sensitivity or pregnancy before treatment.',
    ],
  },
  offerBand: {
    title: 'Hair Treatment Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  order: ['intro', 'gallery', 'menu', 'audience', 'process', 'compare', 'crossNote', 'combo', 'benefits', 'aftercare', 'offers', 'locations', 'faq', 'related'],
} satisfies Partial<ServicePageContent>;

const chips: ServicePageContent['hero']['chips'] = [
  { icon: 'award', label: '10K+ hair treatments delivered' },
  { icon: 'offer', label: 'Free Acai oil treatment' },
  { icon: 'users', label: 'Hair analysis & free consultation' },
];

export const hairBotox: ServicePageContent = {
  ...shared,
  slug: 'hair-botox',
  seo: seoFor('hair-botox', { serviceType: 'Hair Botox Treatment' }),
  hero: {
    eyebrow: 'Hair Care · Hair Treatments',
    h1: h1For('hair-botox'),
    sub: 'Deep repair for dry, dull or damaged hair that restores shine, softness and strength, with no injections.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: { src: '/images/hair-botox-treatment-bangalore.webp', alt: 'Sleek, glossy hair after a hair treatment at XING Premium Salon Bangalore', width: 800, height: 600 },
  },
  whatsappText: 'Hi, I’d like a hair botox consultation at XING',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Hair Botox',
    title: 'Hair Botox Treatment in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Hair botox in Bangalore is a deep-conditioning repair treatment for hair that feels dry, rough, dull or damaged by colouring, heat and pollution. It fills and smooths the hair fibre from within, so your lengths look fuller, glossier and softer, with less frizz. Despite the name, it uses no injections: it is purely a hair-care treatment.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every hair botox starts with a hair analysis and free consultation. Your stylist checks your hair’s damage level and chemical history, then tailors the treatment. A complimentary Acai oil treatment is included, and we confirm the price before we start. Many clients book it after colouring or before a big event, from across Koramangala, Bellandur, Whitefield and Marathahalli.',
    ],
  },
  menu: {
    eyebrow: 'Hair Botox',
    title: 'Hair Botox Repair Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure hair botox is right for you? Send us a photo of your hair on WhatsApp.',
    moreLink: { slug: 'nanoplastia-cysteine', text: 'Want smoother, straighter hair too?', label: 'Nanoplastia & Cysteine' },
  },
  audience: {
    title: 'Who Hair Botox Is For',
    items: ['Dry, rough or brittle hair that has lost its shine', 'Coloured, bleached or heat-styled hair that needs repair', 'Anyone who wants softer, glossier hair without changing its texture'],
    note: 'Sensitive scalp, recent colouring or pregnancy? Tell your stylist before treatment.',
  },
  compare: compare('hair-botox'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Gentle cleanse' },
      { title: 'Botox treatment applied & processed' },
      { title: 'Blow dry, finish & aftercare guidance' },
    ],
  },
  locationsTitle: 'Hair Botox Near You in Bangalore',
  faqTitle: 'Hair Botox FAQs',
  faqs: [
    {
      q: 'Does hair botox use injections?',
      a: 'No. Hair botox is a deep-conditioning treatment applied to your hair, with no injections and no botulinum toxin. The name comes from its smoothing, filling effect on damaged hair. It is a hair-care treatment, done at the backwash and styling chair like a hair spa.',
    },
    {
      q: 'What is the difference between hair botox and keratin?',
      a: 'Hair botox focuses on repair and shine for dry, damaged hair with very little change to your texture. Keratin focuses on frizz control and smoother styling while keeping natural volume. If your hair is both frizzy and damaged, your stylist may suggest combining them over two visits.',
    },
    {
      q: 'How long does hair botox last?',
      a: 'Hair botox results usually last several weeks to a few months, depending on your hair’s condition, how often you wash and your aftercare. Sulphate-free shampoo, a heat protectant and regular hair spas help the softness and shine last longer between treatments.',
    },
    {
      q: 'Where can I get hair botox in Bangalore?',
      a: 'At XING Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist analyses your hair, recommends the right treatment and confirms the price before starting. It is easy to reach from Koramangala and Whitefield.',
    },
  ],
  related: {
    title: 'More Hair Treatments',
    items: [
      { slug: 'hair-spa', text: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex spas.' },
      { slug: 'nanoplastia-cysteine', text: 'Silky smoothing with a natural finish.' },
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
    ],
  },
  cta: 'Ready for softer, stronger, shinier hair? Book your hair botox consultation at XING today.',
};

export const nanoplastiaCysteine: ServicePageContent = {
  ...shared,
  slug: 'nanoplastia-cysteine',
  seo: seoFor('nanoplastia-cysteine', { serviceType: 'Nanoplastia and Cysteine Hair Treatment' }),
  hero: {
    eyebrow: 'Hair Care · Hair Treatments',
    h1: h1For('nanoplastia-cysteine'),
    sub: 'Next-level smoothing for frizzy, wavy or curly hair, with silky, straighter results that still look natural.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: img('work-nanoplastia-1', 'Sleek V-cut lengths at XING Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a consultation for nanoplastia/cysteine at XING',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Nanoplastia & Cysteine',
    title: 'Nanoplastia & Cysteine in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Nanoplastia and cysteine treatments in Bangalore are for anyone who wants smoother, shinier hair without a flat, over-processed look. Cysteine tames frizz and improves manageability while keeping your natural movement. Nanoplastia goes further, giving frizzy, wavy or curly hair a silky, noticeably straighter finish that is easy to style.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every treatment starts with a hair analysis. Your stylist checks your texture, damage level and chemical history, then recommends the option that matches your goals. A complimentary Acai oil treatment is included, and we confirm the price before we start. Not sure which you need? Your stylist will compare nanoplastia, cysteine and keratin for your hair, and clients from Koramangala, Bellandur and Whitefield often pair it with a hair spa.',
    ],
  },
  menu: {
    eyebrow: 'Treatments',
    title: 'Choose Nanoplastia or Cysteine',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure which one suits you? Send us a photo of your hair on WhatsApp.',
    moreLink: { slug: 'hair-botox', text: 'Looking for repair and shine instead?', label: 'Hair Botox' },
  },
  audience: {
    title: 'Who These Treatments Are For',
    items: ['Frizzy hair that should stay soft and natural (cysteine)', 'Wavy or curly hair you want silkier and straighter (nanoplastia)', 'Anyone who wants smoothness without a stiff, poker-straight finish'],
    note: 'Recent colouring, scalp sensitivity or pregnancy? Tell your stylist before treatment.',
  },
  compare: compare('nanoplastia-cysteine'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Cleanse' },
      { title: 'Treatment applied section by section & processed' },
      { title: 'Blow dry, iron, finish & aftercare guidance' },
    ],
  },
  locationsTitle: 'Nanoplastia & Cysteine Near You in Bangalore',
  faqTitle: 'Nanoplastia & Cysteine FAQs',
  faqs: [
    {
      q: 'What is a cysteine hair treatment?',
      a: 'Cysteine is a smoothing treatment that reduces frizz and makes hair easier to manage while keeping it soft and natural-looking. It suits people who want smoother hair without a straight, stiff finish. Your stylist will check your hair first to confirm cysteine is the right choice.',
    },
    {
      q: 'Is nanoplastia better than keratin?',
      a: 'Neither is better for everyone. Nanoplastia gives a smoother, noticeably straighter finish, while keratin keeps more of your natural volume and mainly controls frizz. During a free consultation at XING, your stylist looks at your texture and goals and recommends the one that suits your hair.',
    },
    {
      q: 'How long do nanoplastia results last?',
      a: 'Nanoplastia results usually last a few months, depending on your hair type, growth and aftercare. New growth comes in with your natural texture. Using sulphate-free shampoo, a heat protectant and regular hair spas helps your hair stay smooth and silky for longer.',
    },
    {
      q: 'Where can I get nanoplastia in Bangalore?',
      a: 'At XING Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist will analyse your hair, recommend nanoplastia or cysteine and confirm the price before starting. Our salons are easy to reach from Bellandur and Whitefield.',
    },
  ],
  related: {
    title: 'More Hair Treatments',
    items: [
      { slug: 'hair-botox', text: 'Deep repair for shine, softness and strength.' },
      { slug: 'hair-spa', text: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex spas.' },
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
    ],
  },
  cta: 'Ready for silky, smoother hair? Book your consultation at XING today.',
};
