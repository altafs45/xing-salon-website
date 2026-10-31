import type { BranchPageContent } from './types';

// HSR Layout, the flagship. Keywords: salon in HSR Layout, unisex salon HSR Layout, beauty salon HSR Layout;
// HSR sectors, 24th Main, Nail Bar, pedicure, kids' haircuts; Koramangala, BTM Layout and Agara only as "nearby".
export const hsrLayout: BranchPageContent = {
  id: 'hsr-layout',
  seo: {
    title: 'Unisex Salon in HSR Layout, Bangalore | Xing Premium Salon',
    description:
      'Xing HSR Layout on 24th Main: hair colour, keratin, hair spa, a Nail Bar, pedicure lounge and kids’ corner. Sectors 1–6. Open daily 10am–9:30pm.',
    keywords: [
      'salon in HSR Layout',
      'unisex salon HSR Layout',
      'beauty salon HSR Layout',
      'salon near 24th Main HSR',
      'nail bar HSR Layout',
      'pedicure HSR Layout',
      'kids haircut HSR Layout',
      'men’s salon HSR Layout',
    ],
  },
  hero: {
    h1: 'Premium Unisex Salon in HSR Layout, Bangalore',
    sub: 'Our flagship salon at GSR Arcade on 24th Main Road: pastel interiors, a dedicated Nail Bar, a pedicure lounge and a kids’ corner, for every sector of HSR.',
    photo: 0,
    photoAlt: 'Reception with the illuminated XING sign at Xing, a premium unisex salon in HSR Layout, Bangalore',
  },
  offers: {
    title: 'Offers at Xing HSR Layout',
    items: ['tuesday', 'hair-colour', 'keratin', 'hydra-facial', 'membership', 'gift-card'],
  },
  services: {
    title: 'Popular Services at Our HSR Layout Salon',
    text: 'From the Nail Bar to colour and smoothing, here’s what HSR books most.',
    items: [
      { slug: 'nail-extensions', label: 'Nail Bar: Extensions & Art', text: 'Extensions, overlays and nail art at our dedicated Nail Bar.' },
      { slug: 'manicure', label: 'Manicure & Pedicure', text: 'Relaxing mani-pedis in the pedicure lounge, from D-Lux to Detox.' },
      { slug: 'global-hair-color', label: 'Hair Colour & Balayage', text: 'Root touch-ups to full balayage, with a free colour consultation.' },
      { slug: 'keratin-treatment', label: 'Keratin & Smoothing', text: 'Keratin, cysteine and smoothening for frizz-free, glossy hair.' },
      { slug: 'nanoplastia-cysteine', label: 'Nanoplastia & Hair Botox', text: 'Repairing, gentler smoothing for softer, natural-looking hair.' },
      { slug: 'hair-spa', label: 'Hair Spa', text: 'Scalp and hair spas for dryness, dandruff and hair fall.' },
      { slug: 'kids-haircut', label: 'Kids’ Haircuts', text: 'Gentle, patient haircuts for children up to 10, near our kids’ corner.' },
      { slug: 'mens-haircut-beard-grooming', label: 'Men’s Salon', text: 'Fades, crops, beard shaping and men’s colour.' },
    ],
  },
  gallery: {
    title: 'Inside Xing HSR Layout',
    text: 'Pastel walls, gold-framed mirrors, the neon-lit Nail Bar and a pedicure lounge made for switching off.',
  },
  why: {
    title: 'Why HSR Layout Chooses Xing',
    items: [
      { icon: 'brush', title: 'A dedicated Nail Bar', text: 'Extensions, overlays and nail art have their own space, separate from the styling floor.' },
      { icon: 'heart', title: 'Pedicure lounge', text: 'Armchairs under the “Just Relax” sign for manicures, pedicures and foot care.' },
      { icon: 'smile', title: 'Kids’ corner', text: 'A corner for children, so family visits and first haircuts are easy.' },
      { icon: 'users', title: 'Free consultation, price first', text: 'We talk through your look and confirm the price before we start.' },
      { icon: 'droplets', title: 'Olaplex bond protection', text: 'An add-on for colour and lightening that helps protect your hair’s strength.' },
      { icon: 'sparkles', title: 'Hygiene & premium products', text: 'A clean station for every client and authentic professional products.' },
    ],
  },
  reviews: { title: 'Reviews from Our HSR Layout Clients' },
  reach: {
    title: 'How to Reach Xing HSR Layout',
    notes: [
      'We’re at 150/3, GSR Arcade, 9th Cross, 24th Main Road, HSR Layout.',
      'Search “Xing Premium Unisex Salon HSR Layout” in Google Maps to go straight to our pin.',
    ],
  },
  areas: {
    title: 'Your Salon Across HSR Layout’s Sectors',
    paragraphs: [
      'Xing HSR Layout is at GSR Arcade, at the corner of 9th Cross and 24th Main Road. Clients from Sectors 1, 2, 3, 4 and 6 drop in for a lunchtime threading appointment, a mani-pedi at the Nail Bar after work, or a weekend balayage.',
      'If you live in nearby Agara, BTM Layout or Koramangala and want a calm, family-friendly salon with a kids’ corner, this is the Xing for you. We’re open every day from 10 AM to 9:30 PM, and walk-ins are welcome.',
    ],
  },
  faqTitle: 'HSR Layout Salon FAQs',
  faqs: [
    {
      q: 'Where is Xing salon in HSR Layout?',
      a: 'At 150/3, GSR Arcade, 9th Cross, 24th Main Road, HSR Layout, Bengaluru 560102.',
    },
    {
      q: 'What are the timings of the HSR Layout salon?',
      a: 'We’re open every day, Monday to Sunday, from 10:00 AM to 9:30 PM.',
    },
    {
      q: 'Can I walk in, or should I book?',
      a: 'Walk-ins are welcome. For colour, smoothing treatments or nail extensions, a quick WhatsApp message first means your stylist or nail artist is ready when you arrive.',
    },
    {
      q: 'Is there a nail bar at Xing HSR Layout?',
      a: 'Yes. HSR Layout has a dedicated Nail Bar for extensions, overlays, refills and nail art, and a pedicure lounge for manicures, pedicures and foot care.',
    },
    {
      q: 'Do you cut kids’ hair in HSR Layout?',
      a: 'Yes. We cut hair for children up to 10, and the salon has a kids’ corner to keep little ones comfortable.',
    },
    {
      q: 'Which offers can I use at Xing HSR Layout?',
      campaign: true,
      a: 'Flat 25% off all services every Tuesday (minimum billing applies), savings on hair colour, a flat offer price on hair keratin for any length, a special offer price on the Hydra Facial, and memberships with up to 30% extra value. Your stylist confirms everything before starting.',
    },
    {
      q: 'Do you do balayage and highlights in HSR Layout?',
      a: 'Yes: balayage, highlights, global colour, ombre and fashion colours, plus ammonia-free root touch-ups. Each colour starts with a free consultation, and Olaplex can be added.',
    },
    {
      q: 'Which smoothing treatments do you offer in HSR Layout?',
      a: 'Keratin, nanoplastia, hair botox, cysteine, smoothening and straightening. Your stylist checks your hair’s condition first and recommends the one that suits it.',
    },
    {
      q: 'Is Xing HSR Layout a men’s salon too?',
      a: 'Yes, it’s a unisex salon. Men can book haircuts, creative cuts, beard trims, shaves, beard styling, beard colour and head massages.',
    },
    {
      q: 'Do you offer bridal hair in HSR Layout?',
      a: 'Yes. We style bridal hair and help you prepare with hair spas, treatments, facials and nails in the weeks before the wedding. Our bridal service is hair styling only.',
    },
  ],
  cta: 'Ready for your next look at Xing HSR Layout?',
};
