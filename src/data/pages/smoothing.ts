// Smoothing & straightening: Keratin Treatment, Hair Smoothening and Hair Straightening, one page each. They share
// the gallery, comparison, Acai oil offer and aftercare; each has its own intro, steps and FAQs. No prices.
import { footer, img, workPhotos } from '../content';
import { h1For, seoFor } from './catalogue';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

const compare = (current: string): ServicePageContent['compare'] => ({
  title: 'Keratin vs Smoothening vs Straightening',
  columns: ['Treatment', 'Finish', 'Best for', 'How it wears', 'Maintenance'],
  rows: [
    { name: 'Keratin', slug: 'keratin-treatment', cells: ['Smooth with natural volume', 'Frizzy hair, keeping volume', 'Gradually softens over time', 'Repeat as it wears off'] },
    { name: 'Smoothening', slug: 'hair-smoothening', cells: ['Soft, straight, natural fall', 'Wavy or frizzy hair', 'Lasts longer; regrowth shows natural texture', 'Touch-up as hair grows'] },
    {
      name: 'Straightening',
      slug: 'hair-straightening',
      cells: ['Sleek, poker-straight', 'Curly or very wavy hair, straightest result', 'Treated hair stays straight; regrowth shows natural texture', 'Touch-up as hair grows'],
    },
  ].map((row) => ({ ...row, current: row.slug === current })),
});

const shared = {
  whatsappSuffix: '. My hair length is ___',
  gallery: {
    eyebrow: 'Our Work',
    title: 'Smooth, Frizz-Free Results',
    text: 'Real results from our smoothing treatments, on our own clients.',
    items: workPhotos(['Keratin & Botox']),
    more: { href: instagram.href, label: 'See more on Instagram @xingpremiumsalons' },
  },
  benefits: {
    title: 'Why Choose a Professional Hair Treatment',
    items: [
      { icon: 'wind', title: 'Frizz-free in humid weather' },
      { icon: 'clock', title: 'Faster daily styling' },
      { icon: 'sparkles', title: 'Glossy, smoother hair' },
      { icon: 'users', title: 'Expert consultation for your hair type' },
    ],
  },
  combo: {
    badge: 'Included',
    title: 'Complimentary Acai Oil Treatment',
    text: 'Every keratin, smoothening and straightening treatment at Xing comes with a complimentary Acai oil treatment to nourish and add shine.',
    includes: ['Included with all hair treatments', 'Every hair length', 'Men & women'],
    cta: 'Book my treatment',
  },
  aftercare: {
    title: 'Aftercare for Longer-Lasting Results',
    tips: [
      'Follow your stylist’s advice on when to wash your hair for the first time.',
      'Use a sulphate-free shampoo and conditioner.',
      'Avoid tight ponytails, clips and tucking hair behind your ears in the first few days.',
      'Use a heat protectant whenever you style.',
      'Book a hair spa every few weeks to keep treated hair nourished.',
      'Tell your stylist about any recent colouring, scalp sensitivity or pregnancy before treatment.',
    ],
  },
  offerBand: {
    title: 'Hair Treatment Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  order: ['intro', 'gallery', 'menu', 'audience', 'process', 'compare', 'combo', 'benefits', 'aftercare', 'offers', 'locations', 'faq', 'related'],
} satisfies Partial<ServicePageContent>;

const chips: ServicePageContent['hero']['chips'] = [
  { icon: 'award', label: '10K+ hair treatments delivered' },
  { icon: 'offer', label: 'Free Acai oil treatment' },
  { icon: 'users', label: 'Hair analysis before we start' },
];

export const keratinTreatment: ServicePageContent = {
  ...shared,
  slug: 'keratin-treatment',
  seo: seoFor('keratin-treatment', { serviceType: 'Keratin Hair Treatment' }),
  hero: {
    eyebrow: 'Hair Care · Smoothing & Straightening',
    h1: h1For('keratin-treatment'),
    sub: 'Frizz-free, glossy, manageable hair that keeps its natural body and movement, for months.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: {
      src: '/images/keratin-hair-treatment-bangalore.webp',
      srcSet: '/images/keratin-hair-treatment-bangalore-480.webp 480w, /images/keratin-hair-treatment-bangalore.webp 800w',
      alt: 'Glass-smooth, frizz-free hair after a smoothing treatment at Xing Premium Salon Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like a keratin treatment consultation at Xing',
  intro: {
    eyebrow: 'Keratin Treatment',
    title: 'Keratin Treatment in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'A keratin treatment in Bangalore is the answer to frizz that humidity, pollution and heat styling make worse. Keratin smooths the hair’s surface, seals in shine and makes your hair easier to blow dry, while keeping its natural body and movement. You get soft, glossy, manageable hair, not a flat, poker-straight look.',
      'Every keratin treatment at our Sarjapur Road, HSR Layout and Brookfield salons starts with a hair analysis. Your stylist checks your texture, porosity and chemical history, then tailors the treatment to your hair. With more than 10,000 hair treatments delivered and a complimentary Acai oil treatment included, you’re in experienced hands. Our salons are easy to reach from Koramangala, Bellandur, Whitefield and Marathahalli, and the treatment is done in a single visit.',
    ],
  },
  menu: {
    eyebrow: 'Keratin',
    title: 'Professional Keratin Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure keratin is right for your hair? Send us a photo on WhatsApp.',
    moreLink: { slug: 'hair-smoothening', text: 'Want straighter hair than keratin gives?', label: 'Hair Smoothening', also: [{ slug: 'hair-straightening', label: 'Hair Straightening' }] },
  },
  audience: {
    title: 'Who Keratin Is For',
    items: ['Frizzy or puffy hair that won’t behave in humid weather', 'Anyone who wants smooth, shiny hair but likes their natural volume', 'Busy mornings: faster blow drying and easier everyday styling'],
    note: 'Pregnant, or coloured your hair in the last two weeks? Speak to your stylist before booking.',
  },
  compare: compare('keratin-treatment'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Clarifying cleanse' },
      { title: 'Keratin applied section by section' },
      { title: 'Blow dry, seal & aftercare guidance' },
    ],
  },
  locationsTitle: 'Keratin Treatment Near You in Bangalore',
  faqTitle: 'Keratin Treatment FAQs',
  faqs: [
    {
      q: 'How long does a keratin treatment last?',
      a: 'A keratin treatment usually stays smooth and frizz-free for a few months, softening gradually rather than stopping suddenly. How long it lasts depends on your hair type, how often you wash and your aftercare. Sulphate-free shampoo and regular hair spas help your results last longer.',
    },
    {
      q: 'Will keratin make my hair completely straight?',
      a: 'No, keratin mainly removes frizz and adds shine while keeping your hair’s natural body and movement. Wavy hair becomes smoother and easier to style, but not poker-straight. If you want straight hair, ask your stylist about hair smoothening or hair straightening instead.',
    },
    {
      q: 'Is keratin treatment good for frizzy hair in Bangalore?',
      a: 'Yes, keratin is one of the best options for frizzy hair in Bangalore’s humid weather. It seals the hair’s surface so it resists humidity, dries faster and stays smoother through the day. Your stylist analyses your hair first to confirm keratin is the right fit for you.',
    },
    {
      q: 'Where can I get a keratin treatment in HSR Layout?',
      a: 'At Xing Premium Unisex Salon on 24th Main Road, HSR Layout, and at our Sarjapur Road and Brookfield salons. Book a free consultation on WhatsApp or visit the salon; your stylist analyses your hair and confirms the price before starting.',
    },
  ],
  related: {
    title: 'More Smoothing & Straightening',
    items: [
      { slug: 'hair-smoothening', text: 'Softer, sleeker hair with natural movement.' },
      { slug: 'hair-straightening', text: 'Pin-straight, long-lasting results.' },
      { slug: 'nanoplastia-cysteine', text: 'Silky smoothing with a natural finish.' },
    ],
  },
  cta: 'Ready for smooth, frizz-free hair? Book your keratin consultation at Xing today.',
};

export const hairSmoothening: ServicePageContent = {
  ...shared,
  slug: 'hair-smoothening',
  seo: seoFor('hair-smoothening', { serviceType: 'Hair Smoothening' }),
  hero: {
    eyebrow: 'Hair Care · Smoothing & Straightening',
    h1: h1For('hair-smoothening'),
    sub: 'Waves and frizz relaxed into softer, sleeker, straighter hair with a natural fall that’s easy to style.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: img('work-smoothing-1', 'Sleek, frizz-free lengths at Xing Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a hair smoothening consultation at Xing',
  intro: {
    eyebrow: 'Hair Smoothening',
    title: 'Hair Smoothening in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Hair smoothening in Bangalore relaxes waves, curls and frizz into softer, straighter hair with natural movement. It goes further than keratin, so your hair dries smooth and stays manageable, yet it still falls softly instead of looking stiff. Treated hair stays smooth, and new growth comes in with your natural texture.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every smoothening starts with a consultation and hair analysis. Your stylist checks your texture, density and chemical history, then chooses the right strength for your hair. A complimentary Acai oil treatment is included, and we confirm the price before we start. Bring a photo of the finish you like, and your stylist will tell you honestly whether smoothening or keratin suits you better. Clients come from Koramangala, Bellandur, Whitefield and Marathahalli.',
    ],
  },
  menu: {
    eyebrow: 'Smoothening',
    title: 'Professional Hair Smoothening',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure smoothening is right for you? Send us a photo on WhatsApp.',
    moreLink: { slug: 'keratin-treatment', text: 'Want frizz control but more volume?', label: 'Keratin Treatment', also: [{ slug: 'hair-straightening', label: 'Hair Straightening' }] },
  },
  audience: {
    title: 'Who Hair Smoothening Is For',
    items: ['Wavy or frizzy hair that takes too long to blow dry', 'Anyone who wants straighter hair that still moves naturally', 'Thick hair that feels heavy, puffy or hard to manage'],
    note: 'Recently coloured, bleached or pregnant? Tell your stylist before your appointment.',
  },
  compare: compare('hair-smoothening'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Cleanse & smoothening cream applied' },
      { title: 'Rinse, blow dry & flat iron' },
      { title: 'Neutralise, finish & aftercare guidance' },
    ],
  },
  locationsTitle: 'Hair Smoothening Near You in Bangalore',
  faqTitle: 'Hair Smoothening FAQs',
  faqs: [
    {
      q: 'What is the difference between smoothening and keratin?',
      a: 'Smoothening relaxes waves and curls into straighter hair, while keratin mainly removes frizz and adds shine and keeps your natural volume. Smoothening gives a sleeker, more lasting change to your texture. Your stylist will recommend the right one after checking your hair at Xing.',
    },
    {
      q: 'How long does hair smoothening last?',
      a: 'Hair smoothening lasts on the treated hair until it grows out or is cut, while new growth comes in with your natural texture. Most people book a root touch-up every four to six months. Sulphate-free shampoo and regular hair spas keep smoothened hair soft.',
    },
    {
      q: 'Does hair smoothening damage hair?',
      a: 'Smoothening is a chemical treatment, so it is done carefully and only on hair that can take it. Your stylist analyses your hair first and chooses the right strength. Good aftercare, a heat protectant and regular hair spas keep your hair healthy and glossy after smoothening.',
    },
    {
      q: 'Where can I get hair smoothening in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist will check your hair, explain what to expect and confirm the price before starting. Clients visit from across Bangalore.',
    },
  ],
  related: {
    title: 'More Smoothing & Straightening',
    items: [
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
      { slug: 'hair-straightening', text: 'Pin-straight, long-lasting results.' },
      { slug: 'nanoplastia-cysteine', text: 'Silky smoothing with a natural finish.' },
    ],
  },
  cta: 'Ready for softer, sleeker hair? Book your smoothening consultation at Xing today.',
};

export const hairStraightening: ServicePageContent = {
  ...shared,
  slug: 'hair-straightening',
  seo: seoFor('hair-straightening', { serviceType: 'Permanent Hair Straightening' }),
  hero: {
    eyebrow: 'Hair Care · Smoothing & Straightening',
    h1: h1For('hair-straightening'),
    sub: 'Curly or very wavy hair transformed into sleek, pin-straight hair that stays straight, with expert care.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: img('work-smoothing-2', 'Glass-smooth straight hair at Xing Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a hair straightening consultation at Xing',
  intro: {
    eyebrow: 'Hair Straightening',
    title: 'Hair Straightening in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Permanent hair straightening in Bangalore gives you the sleekest, straightest result of all our treatments. It changes the structure of curly or very wavy hair so the treated lengths stay pin-straight, wash after wash, until they grow out. Mornings get simpler too: wash, dry and go, with no daily ironing.',
      'Because straightening is a strong treatment, every appointment at our Sarjapur Road, HSR Layout and Brookfield salons starts with a careful hair analysis. Your stylist checks your texture and colour history, protects your hair through the process and explains aftercare. A complimentary Acai oil treatment is included, and we confirm the price before we start. It suits clients across Koramangala, Bellandur, Whitefield and Marathahalli who want one long-lasting change rather than daily ironing.',
    ],
  },
  menu: {
    eyebrow: 'Straightening',
    title: 'Permanent Hair Straightening',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure straightening suits your hair? Send us a photo on WhatsApp.',
    moreLink: { slug: 'hair-smoothening', text: 'Prefer a softer, more natural fall?', label: 'Hair Smoothening' },
  },
  audience: {
    title: 'Who Hair Straightening Is For',
    items: ['Curly or very wavy hair that you want sleek and straight', 'Anyone tired of ironing their hair every day', 'A long-lasting change rather than a temporary blow-out'],
    note: 'Bleached, heavily coloured or pregnant? Tell your stylist first; they may suggest a gentler option.',
  },
  compare: compare('hair-straightening'),
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Straightening cream applied & processed' },
      { title: 'Rinse, blow dry & precise flat iron' },
      { title: 'Neutralise, finish & aftercare guidance' },
    ],
  },
  locationsTitle: 'Hair Straightening Near You in Bangalore',
  faqTitle: 'Hair Straightening FAQs',
  faqs: [
    {
      q: 'Is hair straightening permanent?',
      a: 'Yes, on the hair that is treated. Straightened lengths stay straight until they grow out or are cut, while new growth comes in with your natural texture. Most people book a root touch-up every four to six months to keep the roots and lengths matching.',
    },
    {
      q: 'What is the difference between straightening and smoothening?',
      a: 'Straightening gives the sleekest, poker-straight result and suits curly or very wavy hair, while smoothening gives a softer, straighter finish with more natural movement. Both change your hair’s texture permanently on the treated lengths. Your stylist will help you choose after a hair analysis.',
    },
    {
      q: 'Can I colour my hair after straightening?',
      a: 'Yes, but wait a couple of weeks after straightening before colouring, and tell your colourist about the treatment so they choose a suitable formula. Ammonia-free colour is a popular, gentler choice. Regular hair spas keep straightened and coloured hair soft and strong.',
    },
    {
      q: 'Where can I get hair straightening in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist will check your hair, explain the process and aftercare, and confirm the price before starting. Clients visit from across Bangalore.',
    },
  ],
  related: {
    title: 'More Smoothing & Straightening',
    items: [
      { slug: 'hair-smoothening', text: 'Softer, sleeker hair with natural movement.' },
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
      { slug: 'nanoplastia-cysteine', text: 'Silky smoothing with a natural finish.' },
    ],
  },
  cta: 'Ready for sleek, straight hair? Book your straightening consultation at Xing today.',
};
