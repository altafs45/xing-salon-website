import { salonById, sundayAnswer } from '../branches';
import type { BranchPageContent } from './types';

const salon = salonById('sarjapur-road')!;

// Sarjapura Road (Samvit Greens). Keywords: salon on Sarjapur Road, unisex salon Sarjapur Road, beauty salon
// Kasavanahalli; Kaikondrahalli, Sarjapur–Marathahalli Road; Bellandur and Haralur Road only as "nearby".
// The URL uses "sarjapur-road", the common search spelling; the copy says "Sarjapura" once for the variant.
export const sarjapurRoad: BranchPageContent = {
  id: 'sarjapur-road',
  seo: {
    title: 'Unisex Salon on Sarjapur Road, Bangalore – Xing Salon',
    description:
      'Xing at Samvit Greens, Sarjapur–Marathahalli Road, Kasavanahalli: hair colour, keratin, hair spa, nails & men’s grooming. Open daily till 9:30 PM.',
    keywords: [
      'salon on Sarjapur Road',
      'unisex salon Sarjapur Road',
      'beauty salon Kasavanahalli',
      'salon in Kaikondrahalli',
      'salon on Sarjapur–Marathahalli Road',
      'salon near Bellandur',
      'salon near Haralur Road',
    ],
  },
  hero: {
    h1: 'Premium Unisex Salon on Sarjapur Road, Bangalore',
    sub: 'Hair, skin, nails and grooming on the first floor of Samvit Greens, Kasavanahalli. Open till 9:30 PM every day, for weekday evenings and easy weekends.',
    photo: 3,
    photoAlt: 'Teal styling chairs and sculpted mirrors at Xing, a premium unisex salon on Sarjapur Road, Bangalore',
  },
  offers: {
    title: 'Offers at Xing Sarjapur Road',
    items: ['tuesday', 'hair-colour', 'keratin', 'hydra-facial', 'membership', 'gift-card'],
  },
  services: {
    title: 'Popular Services at Our Sarjapur Road Salon',
    text: 'Quick after-work favourites and longer weekend treatments, all under one roof.',
    items: [
      { slug: 'womens-haircut-styling', label: 'Haircuts & Blow-Dries', text: 'Layered cuts, trims and blow-dries that fit a weekday evening.' },
      { slug: 'global-hair-color', label: 'Hair Colour & Highlights', text: 'Global colour, highlights and balayage, after a free consultation.' },
      { slug: 'keratin-treatment', label: 'Keratin Treatment', text: 'Frizz-free, manageable hair for months, at a flat offer price for any length.' },
      { slug: 'nanoplastia-cysteine', label: 'Nanoplastia & Hair Botox', text: 'Gentler smoothing that leaves hair soft and natural-looking.' },
      { slug: 'hair-spa', label: 'Hair Spa', text: 'Spas for dry, frizzy or falling hair, with an Olaplex option.' },
      { slug: 'mens-haircut-beard-grooming', label: 'Men’s Grooming', text: 'Fades, beard trims and shaves, fitted around the working week.' },
      { slug: 'nail-extensions', label: 'Nail Extensions', text: 'Acrylic, poly gel and builder gel extensions, plus refills.' },
      { slug: 'hydra-facial', label: 'Hydra Facial', text: 'A deep cleanse and hydration that leaves skin fresh and glowing.' },
    ],
  },
  gallery: {
    title: 'Inside Xing Sarjapur Road',
    text: 'Teal chairs, sculpted mirrors on a navy-and-gold wall and a glass front looking out over Sarjapur Road.',
  },
  why: {
    title: 'Why Kasavanahalli & Kaikondrahalli Choose Xing',
    items: [
      { icon: 'clock', title: 'Open till 9:30 PM daily', text: 'Time for a cut or colour after work, any day of the week.' },
      { icon: 'pin', title: 'On Sarjapur–Marathahalli Road', text: 'First floor of Samvit Greens, close to the apartment communities around Kasavanahalli.' },
      { icon: 'users', title: 'Free consultation, price first', text: 'We agree the look and the price before we begin.' },
      { icon: 'droplets', title: 'Olaplex bond protection', text: 'Add it to colour or lightening to help keep hair strong.' },
      { icon: 'sparkles', title: 'Hygiene & premium products', text: 'A clean station for every client and authentic professional products.' },
      { icon: 'smile', title: 'Men, women and kids', text: 'One salon for the household, from kids’ cuts to beard styling.' },
    ],
  },
  reviews: { title: 'Reviews from Our Sarjapur Road Clients' },
  reach: {
    title: 'How to Reach Xing Sarjapur Road',
    notes: [
      'We’re on the first floor of Samvit Greens, on Sarjapur–Marathahalli Road in Kasavanahalli.',
      'The salon has a glass front facing the road, so look up for the Xing sign when you reach Samvit Greens.',
    ],
  },
  areas: {
    title: 'Your Salon on Sarjapur–Marathahalli Road',
    paragraphs: [
      'Xing Sarjapur Road is on the first floor of Samvit Greens in Kasavanahalli, right on the Sarjapur–Marathahalli Road. It’s a convenient stop for the apartment communities in Kasavanahalli and Kaikondrahalli and for anyone working in the tech parks along the road.',
      'If you’re in nearby Bellandur or off Haralur Road, come in for a weekday-evening haircut, a Tuesday Happy Hours mani-pedi or a weekend keratin. We’re open every day from 10 AM to 9:30 PM, and walk-ins are welcome.',
    ],
  },
  faqTitle: 'Sarjapur Road Salon FAQs',
  faqs: [
    {
      q: 'Where is Xing salon on Sarjapur Road?',
      a: `At ${salon.address}.`,
    },
    {
      q: 'What are the timings of the Sarjapur Road salon?',
      a: `We’re open every day, Monday to Sunday, from ${salon.hours.opensLabel} to ${salon.hours.closesLabel}, so weekday evenings and weekends both work.`,
    },
    {
      q: 'Is Xing Sarjapur Road open on Sunday?',
      a: sundayAnswer(salon),
    },
    {
      q: 'Can I come in after work without an appointment?',
      a: 'Yes, walk-ins are welcome until closing. For colour or smoothing treatments, which take a few hours, message us on WhatsApp first and we’ll suggest a start time.',
    },
    {
      q: 'Which offers are on at Xing Sarjapur Road?',
      campaign: true,
      a: 'Flat 25% off all services every Tuesday (minimum billing applies), savings on hair colour, a flat offer price on hair keratin for any length, a special offer price on the Hydra Facial, and memberships with up to 30% extra value. Your stylist confirms the details before starting.',
    },
    {
      q: 'Do you do hair colour and highlights on Sarjapur Road?',
      a: 'Yes: global colour, ammonia-free root touch-ups, highlights, balayage, ombre and fashion colours, all after a free consultation. Olaplex can be added to protect your hair.',
    },
    {
      q: 'Do you offer keratin and nanoplastia near Kasavanahalli?',
      a: 'Yes. We do keratin, nanoplastia, hair botox, cysteine and smoothening. Your stylist checks your hair first and recommends the right one.',
    },
    {
      q: 'Is there a hair spa at the Sarjapur Road salon?',
      a: 'Yes: nourishing, anti-dandruff, anti-hairfall, Moroccan and Olaplex hair spas, as well as head massages.',
    },
    {
      q: 'Do you do nail extensions on Sarjapur Road?',
      a: 'Yes. We do acrylic, poly gel and builder gel extensions, overlays, refills and nail art, as well as manicures and pedicures.',
    },
    {
      q: 'Is it a unisex salon with men’s grooming?',
      a: 'Yes. Men can book haircuts, creative cuts, beard trims, shaves, beard styling and colour, and we cut kids’ hair for children up to 10.',
    },
  ],
  cta: 'Ready for your next look at Xing Sarjapur Road?',
};
