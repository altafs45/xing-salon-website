import { bodyPolish } from './body-polish';
import { tattoo } from './tattoo';
import { threadingDetan } from './threading-detan';
import { waxing } from './waxing';
import { facialCleanup } from './facial-cleanup';
import { hairBotox, nanoplastiaCysteine } from './hair-botox';
import { balayage, fashionColor, globalHairColor, highlights } from './hair-color';
import { hairSpa } from './hair-spa';
import { hydraFacial } from './hydra-facial';
import { kidsHaircut } from './kids-haircut';
import { manicure, nailCuttingFiling, nailPolish, pedicure, quickNailCare } from './nail-care';
import { nailArt } from './nail-art';
import { nailExtensions } from './nail-extensions';
import { mensHaircutBeardGrooming } from './mens-haircut-beard-grooming';
import { hairSmoothening, hairStraightening, keratinTreatment } from './smoothing';
import type { ServicePageContent } from './types';
import { womensHaircutStyling } from './womens-haircut-styling';

/** Published service pages, keyed by slug. A service without an entry here has no page yet. */
export const servicePages: Record<string, ServicePageContent> = Object.fromEntries(
  [
    mensHaircutBeardGrooming,
    womensHaircutStyling,
    kidsHaircut,
    globalHairColor,
    highlights,
    balayage,
    fashionColor,
    keratinTreatment,
    hairSmoothening,
    hairStraightening,
    hairBotox,
    hairSpa,
    nanoplastiaCysteine,
    hydraFacial,
    facialCleanup,
    bodyPolish,
    waxing,
    threadingDetan,
    manicure,
    pedicure,
    nailExtensions,
    nailArt,
    nailCuttingFiling,
    nailPolish,
    quickNailCare,
    tattoo,
  ].map((page) => [page.slug, page]),
);

export type { ServicePageContent } from './types';
