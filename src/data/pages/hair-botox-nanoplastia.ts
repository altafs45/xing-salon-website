import type { ServicePageContent } from './types';

export const hairBotoxNanoplastia: ServicePageContent = {
  slug: 'hair-botox-nanoplastia',
  seo: {
    title: 'Hair Botox & Nanoplastia in Bangalore | Cysteine | Xing Salon',
    description:
      'Advanced hair botox, cysteine & nanoplastia treatments for frizz-free, glossy hair at Xing Salon, HSR Layout, Brookfield & Sarjapura. Free Acai oil treatment.',
    keyword: 'hair botox Bangalore',
    serviceType: 'Hair Botox, Cysteine and Nanoplastia Treatment',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
  },
  hero: {
    eyebrow: 'Hair · Advanced Hair Treatments',
    h1: 'Hair Botox, Cysteine & Nanoplastia Treatment in Bangalore',
    sub: 'Next-level smoothing and repair for frizzy, dry and damaged hair, with soft, glossy results that still look natural.',
    cta: 'Book a Consultation on WhatsApp',
    chips: [
      { icon: 'award', label: '10K+ hair treatments delivered' },
      { icon: 'offer', label: 'Free Acai oil treatment' },
      { icon: 'sparkles', label: 'All hair lengths' },
    ],
    // Placeholder until a real photo is added as /images/hair-botox-treatment-bangalore.webp.
    image: {
      src: '/images/loc-sarjapur-3.webp',
      alt: 'Styling stations for a hair botox treatment at Xing Premium Salon Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like a consultation for hair botox/cysteine/nanoplastia at Xing',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Advanced Hair Treatments',
    title: 'Advanced Hair Treatments in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Want smoother, shinier hair but don’t want a flat, over-processed look? Advanced treatments like hair botox, cysteine and nanoplastia are some of the most requested hair treatments in Bangalore. They tame frizz, improve softness and make daily styling easier while keeping a natural feel.',
      'At Xing Premium Unisex Salon, every treatment starts with a consultation. Your stylist checks your hair texture, damage level and chemical history, then recommends the option that matches your goals. With more than 10,000 hair treatments delivered and a complimentary Acai oil treatment included, you’ll leave with hair that looks healthier and feels effortlessly smooth.',
    ],
  },
  menu: {
    eyebrow: 'Treatments',
    title: 'Choose Your Advanced Hair Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure which one suits you? Send us a photo of your hair on WhatsApp.',
    moreLink: {
      slug: 'keratin-hair-treatment',
      text: 'Looking for Keratin, Smoothening or Straightening?',
      label: 'Explore those treatments',
    },
  },
  compare: {
    title: 'Hair Botox vs Cysteine vs Nanoplastia',
    columns: ['Treatment', 'Main goal', 'Finish', 'Best for', 'Texture change'],
    rows: [
      {
        name: 'Hair Botox',
        cells: ['Repair & shine', 'Fuller, glossy, soft', 'Dry, damaged or coloured hair', 'Minimal'],
      },
      {
        name: 'Cysteine',
        cells: [
          'Frizz control & smoothness',
          'Smooth with natural movement',
          'Frizzy hair that should stay natural',
          'Light smoothing',
        ],
      },
      {
        name: 'Nanoplastia',
        cells: [
          'Smoother, straighter hair',
          'Silky, straighter, natural-looking',
          'Frizzy, wavy or curly hair',
          'Noticeably straighter',
        ],
      },
    ],
  },
  crossNote: {
    title: 'How Do These Compare to Keratin?',
    text: 'Keratin focuses on frizz control with natural volume. Hair botox focuses more on repair and shine. Nanoplastia gives a smoother, straighter finish. Not sure which is right? Your stylist will help you decide.',
    link: { slug: 'keratin-hair-treatment', label: 'Compare keratin, smoothening & straightening' },
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
    text: 'Every hair botox, cysteine and nanoplastia treatment at Xing includes a complimentary Acai oil treatment for extra nourishment and shine.',
    includes: ['Included with all hair treatments', 'Every hair length', 'Men & women'],
    cta: 'Book my treatment',
  },
  process: {
    title: 'How Your Treatment Works',
    steps: [
      { title: 'Consultation & hair assessment' },
      { title: 'Cleanse' },
      { title: 'Treatment applied section by section' },
      { title: 'Processing' },
      { title: 'Blow dry, finish & aftercare guidance' },
    ],
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
  locationsTitle: 'Hair Botox & Nanoplastia Near You in Bangalore',
  faqTitle: 'Hair Botox, Cysteine & Nanoplastia FAQs',
  faqs: [
    {
      q: 'Does hair botox use injections or Botox?',
      a: 'No. Hair botox is a deep-conditioning hair treatment applied to your hair. It uses no injections and no botulinum toxin. The name refers to its smoothing, “filling” effect on damaged hair.',
    },
    {
      q: 'What is the difference between hair botox and keratin?',
      a: 'Hair botox focuses on repairing and adding shine to dry, damaged hair with minimal texture change. Keratin focuses mainly on frizz control while keeping natural volume.',
    },
    {
      q: 'Is nanoplastia better than keratin?',
      a: 'Neither is better for everyone. Nanoplastia gives a smoother, straighter finish, while keratin keeps more natural volume. Your stylist will recommend the best option after checking your hair.',
    },
    {
      q: 'What is a cysteine hair treatment?',
      a: 'Cysteine is a smoothing treatment that reduces frizz and makes hair easier to manage while keeping a soft, natural look.',
    },
    {
      q: 'How long do the results last?',
      a: 'It depends on your hair type, growth and aftercare. Following our aftercare tips and regular hair spas help results last longer.',
    },
    {
      q: 'Are these treatments available for men?',
      a: 'Yes. Hair botox, cysteine and nanoplastia are available for men and women at all three Xing salons.',
    },
    {
      q: 'How is the price decided?',
      a: 'It depends on the treatment and your hair length and volume. Message us on WhatsApp with your hair length for a quick quote.',
    },
    {
      q: 'Where can I get hair botox or nanoplastia in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Explore More Hair Care',
    items: [
      { slug: 'keratin-hair-treatment', text: 'Keratin, smoothening and straightening for frizz-free hair.' },
      { slug: 'hair-spa', text: 'Nourishing, scalp-care and Olaplex spas.' },
      { slug: 'hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'womens-haircut-styling', text: 'Haircuts, blow dries, ironing and curls.' },
    ],
  },
  cta: 'Ready for smoother, glossier hair? Book your consultation at Xing today.',
};
