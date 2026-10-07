import { bodyPolish } from './body-polish';
import { tattoo } from './tattoo';
import { threadingDetan } from './threading-detan';
import { waxing } from './waxing';
import { facialCleanup } from './facial-cleanup';
import { hairBotoxNanoplastia } from './hair-botox-nanoplastia';
import { hairColor } from './hair-color';
import { hairSpa } from './hair-spa';
import { hydraFacial } from './hydra-facial';
import { keratinHairTreatment } from './keratin-hair-treatment';
import { kidsHaircut } from './kids-haircut';
import { manicurePedicure } from './manicure-pedicure';
import { nailArt } from './nail-art';
import { nailExtensions } from './nail-extensions';
import { mensHaircutGrooming } from './mens-haircut-grooming';
import type { ServicePageContent } from './types';
import { womensHaircutStyling } from './womens-haircut-styling';

/** Published service pages, keyed by slug. A service without an entry here has no page yet. */
export const servicePages: Record<string, ServicePageContent> = Object.fromEntries(
  [mensHaircutGrooming, womensHaircutStyling, kidsHaircut, hairSpa, keratinHairTreatment, hairBotoxNanoplastia, hairColor, hydraFacial, facialCleanup, bodyPolish, waxing, threadingDetan, manicurePedicure, nailExtensions, nailArt, tattoo].map((page) => [page.slug, page]),
);

export type { ServicePageContent } from './types';
