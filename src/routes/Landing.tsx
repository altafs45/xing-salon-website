import { BranchesSection } from '../components/BranchesSection';
import { FaqAbout } from '../components/FaqAbout';
import { MapSection } from '../components/MapSection';
import { FromOurBlog } from '../components/blog/FromOurBlog';
import { CtaBand } from '../components/Footer';
import { Guides } from '../components/Guides';
import { HairColor } from '../components/HairColor';
import { Hero } from '../components/Hero';
import { MembershipBanner } from '../components/MembershipBanner';
import { OffersShowcase } from '../components/offers/OffersShowcase';
import { Reels } from '../components/Reels';
import { Reviews } from '../components/Reviews';
import { SalonGallery } from '../components/SalonGallery';
import { ServiceGallery } from '../components/ServiceGallery';
import { Services } from '../components/Services';
import { SignatureColor } from '../components/SignatureColor';
import { Transformations } from '../components/Transformations';
import { WhyChoose } from '../components/WhyChoose';

/** The landing page's sections. Loaded only on the home page, so other pages don't download them. */
export default function Landing() {
  return (
    <>
      <Hero />
      <Services />
      <SignatureColor />
      <Guides />
      <HairColor />
      <OffersShowcase variant="compact" />
      <BranchesSection id="branches" />
      <MapSection />
      <Transformations />
      <Reels />
      <ServiceGallery />
      <WhyChoose />
      <SalonGallery />
      <Reviews />
      <FaqAbout />
      <FromOurBlog />
      <MembershipBanner />
      <CtaBand />
    </>
  );
}
