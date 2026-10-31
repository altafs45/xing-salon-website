// OWNER: legal review. A plain-language starting point, not legal advice.
import { GRIEVANCES } from './branches';

export const privacyPath = '/privacy';

export const privacy = {
  seo: {
    title: 'Privacy Policy – Xing Salon',
    description: 'How Xing Premium Unisex Salon handles analytics, session recordings and the details you share in our forms, and how to opt out at any time.',
  },
  h1: 'Privacy Policy',
  sections: [
    { title: 'What we collect', text: 'Anonymous analytics about how the site is used, session recordings with form fields masked, and the details you send us in a booking or gift card request.' },
    { title: 'Why we collect it', text: 'To improve the site, to reply to your request, and to arrange your appointment or gift card. We do not sell your details.' },
    { title: 'How long we keep it', text: 'We keep request details only as long as we need them to serve you and meet our legal duties. Analytics data follows the retention setting of each tool.' },
    { title: 'Your choices', text: 'Choose "Only essential" when asked, or clear this site’s data in your browser to be asked again. Analytics stays off unless you accept.' },
    { title: 'Grievances', text: `For any concern about your data, call ${GRIEVANCES.phone}.` },
  ],
};
