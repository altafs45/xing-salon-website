// Xing Fitness: the group's gym in AECS Layout, Brookfield. A separate business with its own website; the
// salon site only links to it (from the footer). Details as supplied by the owner.
// Keep this file free of React/asset imports, like the other data files.

const PHONE = '8970000122';

export const fitness = {
  name: 'Xing Fitness Club',
  /** Exactly as on its Google Business Profile. */
  fullName: 'Xing Fitness - Premium Gym in Brookfield, Whitefield',
  category: 'Gym (unisex)',
  phone: `+91 ${PHONE.slice(0, 5)} ${PHONE.slice(5)}`,
  phoneHref: `tel:+91${PHONE}`,
  whatsappHref: `https://wa.me/91${PHONE}`,
  email: 'xing.fitnessclub@gmail.com',
  street: '4th Floor No, VV Arcade, 1st Cross Rd, above Kanti Sweets, B Block, AECS Layout, Brookfield',
  city: 'Bengaluru',
  region: 'Karnataka',
  postalCode: '560037',
  website: 'https://www.xingfitness.in/',
  offersUrl: 'https://xingfitness.in/offers.html',
  instagram: { href: 'https://www.instagram.com/xing.fitnessclub', handle: '@xing.fitnessclub' },
  hours: 'Mon – Sat 5:30 AM – 10 PM; Sun 11 AM – 8 PM',
  // TODO (owner): the Google Maps link supplied (maps.app.goo.gl/nfXT59udL4KKSHCB6) is the Sarjapura Road
  // salon's link, so it is not used. Add the gym's own share link here.
  mapUrl: undefined as string | undefined,
  description:
    'Xing Fitness is a premium gym and fitness club in AECS Layout, Brookfield, Bangalore, offering a complete fitness experience for beginners and experienced members. Our modern gym features premium strength and cardio equipment, certified personal trainers and customized workout support to help you achieve your fitness goals. We offer strength training, weight loss programmes, personal training, HIIT, CrossFit, Zumba, Yoga, functional training and group fitness classes. Conveniently located for members from AECS Layout, Brookfield, Kundalahalli and nearby Whitefield, Xing Fitness combines expert trainers, quality equipment, motivating workouts and exceptional value.',
  /** Where it is, in a few words, for the card under the branches. */
  where: 'Premium gym at VV Arcade, AECS Layout, Brookfield',
  /** The footer link's text. */
  footerLabel: 'Xing Fitness Club: xingfitness.in',
};
