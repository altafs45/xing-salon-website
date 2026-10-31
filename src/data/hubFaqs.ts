// Questions for /services and the category pages: the same words on the page and in the schema.
// Only facts already on these pages. Keep this file free of React/asset imports: vite.config.ts reads it.
export const hubFaqs = [
  { q: 'What services does Xing offer in Bangalore?', a: 'Xing offers hair care, skin and body care, nail care and tattoo in Bangalore. Hair, skin and nail services are available at our Sarjapur Road, HSR Layout and Brookfield salons, and the tattoo studio is in Brookfield. Each service has its own page.' },
  { q: 'Is the consultation at Xing free?', a: 'Yes. Your Xing stylist starts with a free consultation, talking through your hair or skin and what you want. The price is confirmed before we start, so you know what you will pay before any service begins at the salon.' },
  { q: 'How do I book a service at Xing?', a: 'You can book a Xing service on WhatsApp, by calling your nearest salon, or through the booking form on this site. Walk-ins are welcome at all three salons, though booking ahead helps for longer services such as colour or keratin.' },
  { q: 'Is Xing a unisex salon?', a: 'Yes. Xing is a unisex salon, offering haircuts, colour, treatments and grooming for women and men, as well as kids’ haircuts. Services are available at our Sarjapur Road, HSR Layout and Brookfield salons in Bangalore, so choose whichever is closest.' },
];

export const categoryFaqs: Record<string, Array<{ q: string; a: string }>> = {
  'hair-care': [
    { q: 'What hair services does Xing offer in Bangalore?', a: 'Xing offers haircuts and styling, hair colour, smoothing and straightening, and hair treatments in Bangalore. These include global colour, highlights, balayage, keratin, hair botox and hair spa, at our Sarjapur Road, HSR Layout and Brookfield salons, each starting with a free consultation.' },
    { q: 'Which hair treatment is right for me?', a: 'The right Xing hair treatment depends on your hair’s condition and the result you want. Your stylist checks your hair at a free consultation and recommends a treatment. Smoothing services tackle frizz, while a hair spa suits hair that needs care and softness.' },
    { q: 'Will my stylist confirm the price first?', a: 'Yes. At Xing the price of any hair service is confirmed at the consultation, before we start. It depends on your hair and the service you choose, so your stylist looks at your hair first and tells you the price.' },
    { q: 'Do you offer hair services for men and kids?', a: 'Yes. Xing is a unisex salon with men’s haircuts, beard grooming and kids’ haircuts alongside women’s hair services. You can book any of them at our Sarjapur Road, HSR Layout and Brookfield salons in Bangalore, on WhatsApp or by phone.' },
  ],
  'skin-body': [
    { q: 'What skin and body services does Xing offer?', a: 'Xing offers hydra facials, facials and clean-ups, body polish, waxing, threading and de-tan in Bangalore. These are available at our Sarjapur Road, HSR Layout and Brookfield salons, and your therapist checks your skin first and confirms the treatment suits it.' },
    { q: 'Which facial should I choose?', a: 'The right facial at Xing depends on your skin and what you want from it. A clean-up is a quicker treatment focused on cleansing, while a facial adds massage and nourishment. Your therapist looks at your skin and recommends one before starting.' },
    { q: 'Is the price confirmed before I start?', a: 'Yes. Xing confirms the price of every skin and body service before we start, after your therapist has looked at what you need. Nothing is charged online for a booking, and you pay at the salon after your treatment.' },
    { q: 'Can I walk in for waxing or threading?', a: 'Yes. Walk-ins are welcome at all three Xing salons in Bangalore for waxing and threading. Quick services are usually easy to fit in, but message your salon on WhatsApp first if you want a particular time during a busy period.' },
  ],
  'nail-care': [
    { q: 'What nail services does Xing offer in Bangalore?', a: 'Xing offers manicures, pedicures, nail extensions, nail art, cutting and filing, and nail polish in Bangalore. These are available at our Sarjapur Road, HSR Layout and Brookfield salons, and our HSR Layout salon has a dedicated Nail Bar and pedicure lounge.' },
    { q: 'Which is the quickest nail service?', a: 'Quick Nail Care is the quickest nail service at Xing: a cut, file and polish for tidy nails. It suits you before a meeting, a dinner or a family event, and you can walk in or message your salon on WhatsApp first.' },
    { q: 'Do you do nail extensions and nail art?', a: 'Yes. Xing offers nail extensions and nail art at our Bangalore salons. Your nail technician talks through the length, shape and design you want before starting, and confirms the price with you at that point, so there are no surprises at the end.' },
    { q: 'How do I book a nail appointment?', a: 'You can book a Xing nail appointment on WhatsApp, by calling your nearest salon, or through the booking form on this site. Walk-ins are welcome at all three salons, though booking ahead is the easiest way to get your preferred time.' },
  ],
};
