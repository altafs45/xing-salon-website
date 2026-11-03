// Hair treatments: Nanoplastia. No prices.
import { img, workPhotos } from '../content';
import { h1For, seoFor } from './catalogue';
import { chips, compare, crossNoteLink, instagramMore, shared } from './hairTreatments';
import type { ServicePageContent } from './types';

export const nanoplastia: ServicePageContent = {
  ...shared,
  slug: 'nanoplastia',
  seo: seoFor('nanoplastia', { serviceType: 'Nanoplastia Hair Treatment' }),
  hero: {
    eyebrow: 'Hair Care · Hair Treatments',
    h1: h1For('nanoplastia'),
    sub: 'Next-level smoothing for frizzy, wavy or curly hair, with silky, straighter results that still look natural.',
    cta: 'Book a Consultation on WhatsApp',
    chips,
    image: img('work-nanoplastia-1', 'Sleek V-cut lengths at Xing Salon Bangalore', 600, 800),
  },
  whatsappText: 'Hi, I’d like a nanoplastia consultation at Xing',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Nanoplastia',
    title: 'Nanoplastia in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Nanoplastia in Bangalore is for anyone who wants smoother, shinier hair without a flat, over-processed look. It gives frizzy, wavy or curly hair a silky, noticeably straighter finish that is easy to style. Results usually last a few months, and new growth comes in with your natural texture.',
      'At our Sarjapur Road, HSR Layout and Brookfield salons, every treatment starts with a hair analysis. Your stylist checks your texture, damage level and chemical history, then confirms nanoplastia matches your goals. A complimentary Acai oil treatment is included, and we confirm the price before we start. Not sure which you need? Your stylist will compare nanoplastia, cysteine and keratin for your hair, and clients from Koramangala, Bellandur and Whitefield often pair it with a hair spa.',
    ],
  },
  gallery: {
    eyebrow: 'Our Work',
    title: 'Nanoplastia Results',
    text: 'Real results from our advanced hair treatments, on our own clients.',
    items: workPhotos(['Nanoplastia'], 4),
    more: instagramMore,
  },
  menu: {
    eyebrow: 'Nanoplastia',
    title: 'Nanoplastia Smoothing Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure nanoplastia suits you? Send us a photo of your hair on WhatsApp.',
    moreLink: { slug: 'cysteine', text: 'Want to keep more natural movement?', label: 'Cysteine Treatment' },
  },
  audience: {
    title: 'Who Nanoplastia Is For',
    items: ['Wavy or curly hair you want silkier and straighter', 'Frizzy hair that should be easier to style', 'Anyone who wants smoothness without a stiff, poker-straight finish'],
    note: 'Recent colouring, scalp sensitivity or pregnancy? Tell your stylist before treatment.',
  },
  compare: compare('nanoplastia'),
  crossNote: {
    title: 'How Does Nanoplastia Compare to Keratin?',
    text: 'Keratin focuses on frizz control with natural volume. Nanoplastia gives a smoother, straighter finish. Not sure which is right? Your stylist will help you decide.',
    link: crossNoteLink,
  },
  locationsTitle: 'Nanoplastia Near You in Bangalore',
  faqTitle: 'Nanoplastia FAQs',
  faqs: [
    {
      q: 'Is nanoplastia better than keratin?',
      a: 'Neither is better for everyone. Nanoplastia gives a smoother, noticeably straighter finish, while keratin keeps more of your natural volume and mainly controls frizz. During a free consultation at Xing, your stylist looks at your texture and goals and recommends the one that suits your hair.',
    },
    {
      q: 'What is the difference between nanoplastia and cysteine?',
      a: 'Cysteine tames frizz and improves manageability while keeping your natural movement. Nanoplastia goes further, giving frizzy, wavy or curly hair a silky, noticeably straighter finish that is easy to style. Your stylist checks your hair first and recommends the option that matches your goals.',
    },
    {
      q: 'How long do nanoplastia results last?',
      a: 'Nanoplastia results usually last a few months, depending on your hair type, growth and aftercare. New growth comes in with your natural texture. Using sulphate-free shampoo, a heat protectant and regular hair spas helps your hair stay smooth and silky for longer.',
    },
    {
      q: 'Where can I get nanoplastia in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book a free consultation on WhatsApp or at the salon; your stylist will analyse your hair, confirm nanoplastia suits it and confirm the price before starting. Our salons are easy to reach from Bellandur and Whitefield.',
    },
  ],
  related: {
    title: 'More Hair Treatments',
    items: [
      { slug: 'cysteine', text: 'Smoothing that tames frizz and keeps hair natural.' },
      { slug: 'hair-spa', text: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex spas.' },
      { slug: 'keratin-treatment', text: 'Frizz-free, glossy hair that keeps its volume.' },
    ],
  },
  cta: 'Ready for silky, smoother hair? Book your consultation at Xing today.',
};
