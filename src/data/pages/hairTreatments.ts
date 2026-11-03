// What the Nanoplastia and Cysteine pages share: the comparison with keratin, the Acai oil offer, benefits,
// aftercare and section order. No prices.
import { footer } from '../content';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

export const compare = (current: string): ServicePageContent['compare'] => ({
  title: 'Keratin vs Cysteine vs Nanoplastia',
  columns: ['Treatment', 'Main goal', 'Finish', 'Best for', 'Texture change'],
  rows: [
    { name: 'Keratin', slug: 'keratin-treatment', cells: ['Frizz control & shine', 'Smooth with natural volume', 'Frizzy hair, keeping volume', 'Keeps natural volume'] },
    { name: 'Cysteine', slug: 'cysteine', cells: ['Frizz control & smoothness', 'Smooth with natural movement', 'Frizzy hair that should stay natural', 'Light smoothing'] },
    { name: 'Nanoplastia', slug: 'nanoplastia', cells: ['Smoother, straighter hair', 'Silky, straighter, natural-looking', 'Frizzy, wavy or curly hair', 'Noticeably straighter'] },
  ].map((row) => ({ ...row, current: row.slug === current })),
});

/** The gallery's "more" link. */
export const instagramMore = { href: instagram.href, label: 'See more on Instagram @xingpremiumsalons' };

export const shared = {
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
    text: 'Every cysteine and nanoplastia treatment at Xing includes a complimentary Acai oil treatment for extra nourishment and shine.',
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
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Hair analysis & consultation' },
      { title: 'Cleanse' },
      { title: 'Treatment applied section by section & processed' },
      { title: 'Blow dry, iron, finish & aftercare guidance' },
    ],
  },
  order: ['intro', 'gallery', 'menu', 'audience', 'process', 'compare', 'crossNote', 'combo', 'benefits', 'aftercare', 'offers', 'locations', 'faq', 'related'],
} satisfies Partial<ServicePageContent>;

export const chips: ServicePageContent['hero']['chips'] = [
  { icon: 'award', label: '10K+ hair treatments delivered' },
  { icon: 'offer', label: 'Free Acai oil treatment' },
  { icon: 'users', label: 'Hair analysis & free consultation' },
];

export const crossNoteLink = { slug: 'keratin-treatment', label: 'Compare keratin, smoothening & straightening' };
