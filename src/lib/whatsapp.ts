// Booking links. Each salon has its own WhatsApp and phone, so a general "Book on WhatsApp" or "Call" button
// doesn't point at one number: it carries a marker that the branch picker (components/BranchPicker.tsx)
// intercepts, asks which salon, and then opens that salon's WhatsApp, phone or map.

/** Marker for a WhatsApp booking link; without JavaScript it still opens WhatsApp's own chooser. */
export const PICK_WHATSAPP = 'https://wa.me/?xing=pick';
/** Markers for "Call" and "Directions" buttons that should ask which salon first. */
export const PICK_CALL = '#call-a-salon';
export const PICK_DIRECTIONS = '#directions-to-a-salon';

/**
 * WhatsApp link with a prefilled message. With `base` (a salon's or the tattoo studio's wa.me link) it goes
 * straight there; without, the visitor picks a salon and "___ (location)" in the message becomes its name.
 */
export const whatsappLink = (text: string, base?: string) =>
  base ? `${base}?text=${encodeURIComponent(text)}` : `${PICK_WHATSAPP}&text=${encodeURIComponent(text)}`;

/** General booking message for pages that are not about one service. */
export const bookingWhatsappHref = whatsappLink('Hi Xing, I’d like to book an appointment at Xing ___ (location).');

/** Puts the chosen salon's name into a prefilled message. */
export const fillBranch = (text: string, branch: string) =>
  text.replace(/___ \(location\)/g, branch).replace(/Location: ___/g, `Location: ${branch}`);
