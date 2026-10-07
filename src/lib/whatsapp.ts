import { site } from '../data/content';

/** General booking message for pages that are not about one service. */
export const bookingWhatsappHref = `${site.whatsappHref}?text=${encodeURIComponent('Hi XING, I’d like to book an appointment.')}`;

/** WhatsApp link with a prefilled message; goes to the central booking number unless a salon's link is given. */
export const whatsappLink = (text: string, base: string = site.whatsappHref) => `${base}?text=${encodeURIComponent(text)}`;
