import { salonById, sundayAnswer } from '../branches';
import type { BranchPageContent } from './types';

const salon = salonById('brookfield')!;

// Brookfield (AECS Layout). Keywords: salon in Brookfield Bangalore, unisex salon Brookfield, beauty salon
// Brookfield; nearby searches for Whitefield, Kundalahalli, Marathahalli and ITPL.
export const brookfield: BranchPageContent = {
  id: 'brookfield',
  seo: {
    title: 'Unisex Salon in Brookfield, Bangalore – Xing Salon',
    description:
      'Premium hair, skin & nail salon in Brookfield, AECS Layout near Whitefield. Hair colour, keratin, hair spa & nails. Open daily 9 AM – 9:30 PM.',
    keywords: [
      'salon in Brookfield Bangalore',
      'unisex salon Brookfield',
      'beauty salon Brookfield',
      'salon in AECS Layout',
      'salon near Whitefield',
      'salon in Kundalahalli',
      'salon near Marathahalli',
      'salon near ITPL',
    ],
  },
  hero: {
    h1: 'Premium Unisex Salon in Brookfield, Bangalore',
    sub: 'Hair, skin, nails and bridal hair care on 60 Feet Road, AECS Layout, near DMart Ready. A short drive from Whitefield, Kundalahalli and Marathahalli.',
    photo: 5,
    photoAlt: 'Styling floor with a green plant wall at Xing, a premium unisex salon in Brookfield, Bangalore',
  },
  offers: {
    title: 'Offers at Xing Brookfield',
    items: ['hair-colour', 'keratin', 'hydra-facial', 'tuesday', 'membership', 'gift-card'],
  },
  services: {
    title: 'Popular Services at Our Brookfield Salon',
    text: 'What clients from AECS Layout, Kundalahalli and Whitefield book with us most.',
    items: [
      { slug: 'global-hair-color', label: 'Hair Colour & Balayage', text: 'Global colour, highlights and hand-painted balayage, matched to your skin tone.' },
      { slug: 'keratin-treatment', label: 'Keratin & Nanoplastia', text: 'Smooth, frizz-free hair, with the right treatment chosen for your hair type.' },
      { slug: 'hair-spa', label: 'Hair Spa', text: 'Nourishing, anti-dandruff, anti-hairfall and Olaplex spas for soft, healthy hair.' },
      { slug: 'womens-haircut-styling', label: 'Haircuts & Styling', text: 'Layers, face-framing cuts, blow-dries, ironing and curls.' },
      { slug: 'hydra-facial', label: 'Hydra Facial & Skin Care', text: 'Deep cleansing and hydration for fresh, glowing skin.' },
      { slug: 'nail-extensions', label: 'Nail Extensions & Nail Art', text: 'Acrylic, poly gel and builder gel extensions, with chrome, cat-eye and French art.' },
      { slug: 'mens-haircut-beard-grooming', label: 'Men’s Grooming', text: 'Fades, textured cuts, beard trims and styling, and men’s hair colour.' },
      { slug: 'womens-haircut-styling', hash: '#bridal', label: 'Bridal Hair', text: 'Wedding-day hair styling, plus the hair spas and treatments that lead up to it.' },
    ],
  },
  gallery: {
    title: 'Inside Xing Brookfield',
    text: 'Teal lounge seating, a green plant wall and a quiet treatment room on the first floor of SV Plaza.',
  },
  why: {
    title: 'Why Clients Near Whitefield & Kundalahalli Choose Xing',
    items: [
      { icon: 'users', title: 'Free consultation first', text: 'Talk through the look you want before any colour or treatment begins.' },
      { icon: 'shield', title: 'Price confirmed before we start', text: 'Your stylist agrees the price with you up front. No surprises at the counter.' },
      { icon: 'droplets', title: 'Olaplex bond protection', text: 'Add Olaplex to colour or lightening to help protect the strength of your hair.' },
      { icon: 'sparkles', title: 'Hygiene & premium products', text: 'Clean stations for every client and authentic professional products.' },
      { icon: 'smile', title: 'Men, women and kids', text: 'Haircuts for the whole family, from a first kids’ cut to men’s fades and beard work.' },
      { icon: 'brush', title: 'Tattoo studio in the same building', text: 'Xing Premium Tattoo Studio is in SV Plaza too, and Xing Fitness Club is nearby in AECS Layout.' },
    ],
  },
  reviews: { title: 'Reviews from Our Brookfield Clients' },
  reach: {
    title: 'How to Reach Xing Brookfield (AECS Layout)',
    notes: [
      'We’re on the first floor of SV Plaza on 60 Feet Road, AECS Layout.',
      'Look for DMart Ready: SV Plaza is the same building.',
      'Xing Premium Tattoo Studio is in the same building, so you’re in the right place when you see its sign.',
    ],
  },
  areas: {
    title: 'Your Salon Near Whitefield, Kundalahalli & AECS Layout',
    paragraphs: [
      'Xing Brookfield sits on the first floor of SV Plaza on 60 Feet Road in AECS Layout, close to DMart Ready. Clients come to us from Brookfield, Kundalahalli, Whitefield, ITPL and Marathahalli for hair colour and balayage, keratin and nanoplastia, hair spas, nail extensions and men’s grooming.',
      'Looking for a salon near you in Brookfield? Whether you need a quick weekday haircut after work or a full colour transformation at the weekend, we’re open every day from 9 AM to 9:30 PM, and walk-ins are welcome.',
    ],
  },
  faqTitle: 'Brookfield Salon FAQs',
  faqs: [
    {
      q: 'Where exactly is Xing salon in Brookfield?',
      a: `We’re at ${salon.address}, near DMart Ready. Xing Premium Tattoo Studio is in the same building.`,
    },
    {
      q: 'What are the timings of the Brookfield salon?',
      a: `Xing Brookfield is open every day, Monday to Sunday, from ${salon.hours.opensLabel} to ${salon.hours.closesLabel}.`,
    },
    {
      q: 'Is Xing Brookfield open on Sunday?',
      a: sundayAnswer(salon),
    },
    {
      q: 'Do I need an appointment, or can I walk in?',
      a: 'Walk-ins are welcome. For longer services such as hair colour, balayage, keratin or nanoplastia, message us on WhatsApp first so a stylist is free when you arrive.',
    },
    {
      q: 'Which offers are running at Xing Brookfield?',
      campaign: true,
      a: 'Flat 25% off all services every Tuesday (minimum billing applies), savings on hair colour, a flat offer price on hair keratin for any length, a special offer price on the Hydra Facial, and memberships with up to 30% extra value. Your stylist confirms the offer and the price before starting.',
    },
    {
      q: 'Do you do balayage and hair colour in Brookfield?',
      a: 'Yes. We do global colour, root touch-ups (including ammonia-free), highlights, balayage, ombre and fashion colours. Every colour starts with a free consultation, and you can add Olaplex bond protection.',
    },
    {
      q: 'Do you offer keratin and nanoplastia near Whitefield?',
      a: 'Yes. Our Brookfield salon in AECS Layout does keratin, nanoplastia, hair botox, cysteine, smoothening and straightening. Your stylist checks your hair first and recommends the treatment that suits it.',
    },
    {
      q: 'Do you have nail extensions and nail art?',
      a: 'Yes. We do acrylic, poly gel and builder gel extensions, overlays and refills, and nail art from chrome and cat-eye to French, ombre and 3D designs, along with manicures and pedicures.',
    },
    {
      q: 'Is it a unisex salon? Do you have men’s grooming and kids’ haircuts?',
      a: 'Yes, Xing is a unisex salon. Men can book haircuts, beard trims, shaves, beard styling and hair colour, and we cut kids’ hair for children up to 10.',
    },
    {
      q: 'Do you offer bridal hair?',
      a: 'Yes. We style bridal hair, from sleek blow-dries and ironed looks to soft curls, and help you prepare with hair spas, treatments and colour in the weeks before. Our bridal service is hair styling only.',
    },
  ],
  cta: 'Ready for your next look at Xing Brookfield?',
  sister: 'Make it a Xing day: salon, tattoo studio and gym, all in AECS Layout.',
};
