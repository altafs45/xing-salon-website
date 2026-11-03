// Hair treatments: Cysteine. No prices.
import { img, workPhotos } from '../content';
import { h1For, seoFor } from './catalogue';
import { chips, compare, crossNoteLink, instagramMore, shared } from './hairTreatments';
import type { ServicePageContent } from './types';

export const cysteine: ServicePageContent = {
  ...shared,
  slug: 'cysteine',
  seo: seoFor('cysteine', { serviceType: 'Cysteine Hair Treatment' }),
  hero: {
    eyebrow: 'Hair Care · Hair Treatments',
    h1: h1For('cysteine'),
    sub: 'Smoothing that tames frizz and makes hair easier to manage, while keeping it soft and natural-looking.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: img('work-smoothing-5', 'Soft, natural-looking smoothness at Xing Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a cysteine treatment consultation at Xing',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Cysteine',
    title: 'Cysteine Treatment in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Cysteine treatments in Bangalore are for anyone who wants smoother, shinier hair without a flat, over-processed look. Cysteine tames frizz and improves manageability while keeping your natural movement, so hair stays soft and natural-looking. It suits people who want smoother hair without a straight, stiff finish.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every treatment starts with a hair analysis. Your stylist checks your texture, damage level and chemical history, then confirms cysteine matches your goals. A complimentary Acai oil treatment is included, and we confirm the price before we start. Not sure which you need? Your stylist will compare cysteine, nanoplastia and keratin for your hair, and clients from Koramangala, Bellandur and Whitefield often pair it with a hair spa.',
    ],
  },
  gallery: {
    eyebrow: 'Our Work',
    title: 'Cysteine Results',
    text: 'Real smoothing results on our own clients.',
    items: workPhotos(['Keratin & Smoothening'], 4),
    more: instagramMore,
  },
  menu: {
    eyebrow: 'Cysteine',
    title: 'Cysteine Smoothing Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure cysteine suits you? Send us a photo of your hair on WhatsApp.',
    moreLink: { slug: 'nanoplastia', text: 'Want smoother, straighter hair?', label: 'Nanoplastia' },
  },
  audience: {
    title: 'Who Cysteine Is For',
    items: ['Frizzy hair that should stay soft and natural', 'Hair that is hard to manage and style day to day', 'Anyone who wants smoothness without a stiff, poker-straight finish'],
    note: 'Recent colouring, scalp sensitivity or pregnancy? Tell your stylist before treatment.',
  },
  compare: compare('cysteine'),
  crossNote: {
    title: 'How Does Cysteine Compare to Keratin?',
    text: 'Keratin focuses on frizz control with natural volume. Cysteine tames frizz while keeping your natural movement. Not sure which is right? Your stylist will help you decide.',
    link: crossNoteLink,
  },
  locationsTitle: 'Cysteine Treatment Near You in Bangalore',
  faqTitle: 'Cysteine Treatment FAQs',
  faqs: [
    {
      q: 'What is a cysteine hair treatment?',
      a: 'Cysteine is a smoothing treatment that reduces frizz and makes hair easier to manage while keeping it soft and natural-looking. It suits people who want smoother hair without a straight, stiff finish. Your stylist will check your hair first to confirm cysteine is the right choice.',
    },
    {
      q: 'What is the difference between cysteine and nanoplastia?',
      a: 'Cysteine tames frizz and improves manageability while keeping your natural movement. Nanoplastia goes further, giving frizzy, wavy or curly hair a silky, noticeably straighter finish that is easy to style. Your stylist checks your hair first and recommends the option that matches your goals.',
    },
    {
      q: 'Is cysteine better than keratin?',
      a: 'Neither is better for everyone. Cysteine tames frizz and improves manageability while keeping your natural movement, while keratin mainly controls frizz and keeps more of your natural volume. During a free consultation at Xing, your stylist looks at your texture and goals and recommends the one that suits your hair.',
    },
    {
      q: 'Where can I get a cysteine treatment in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist will analyse your hair, confirm cysteine suits it and confirm the price before starting. Our salons are easy to reach from Bellandur and Whitefield.',
    },
  ],
  related: {
    title: 'More Hair Treatments',
    items: [
      { slug: 'nanoplastia', text: 'Silky smoothing with a natural finish.' },
      { slug: 'hair-spa', text: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex spas.' },
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
    ],
  },
  cta: 'Ready for silky, smoother hair? Book your consultation at Xing today.',
};
