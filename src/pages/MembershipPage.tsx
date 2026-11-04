import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Comparison } from '../components/gift/Comparison';
import { Hero } from '../components/gift/Hero';
import { MembershipTiers } from '../components/gift/MembershipTiers';
import { OccasionGrid } from '../components/gift/OccasionGrid';
import { QuickChooser, type Choice } from '../components/gift/QuickChooser';
import { FaqSection, FinalCta, HowItWorks, Terms, Testimonials, VideoSlot } from '../components/gift/Sections';
import { LeadFormProvider, type LeadRequest } from '../components/gift/shared';
import { MobileStickyBar } from '../components/service/MobileStickyBar';
import { gmPage } from '../data/giftMembership';
import { useHasShell } from '../hooks/useHasShell';
import { whatsappLink } from '../lib/whatsapp';

const loadForm = () => import('../components/gift/LeadFormSheet');
const LeadFormSheet = lazy(loadForm);

/**
 * The hero. The build writes it into the page as plain HTML just before the app (#first-paint, see vite.config.ts),
 * so it paints before any script and stays put; this draws it only when that shell is missing.
 */
function HeroSlot() {
  return useHasShell() ? null : <Hero />;
}

/**
 * /membership-gift-cards: pick a membership tier or an occasion gift card, then send a request through the lead
 * form. No prices anywhere: value is shown only as bonus percentages and perks.
 */
export default function MembershipPage() {
  const [request, setRequest] = useState<LeadRequest | null>(null);
  const [formWanted, setFormWanted] = useState(false);
  // Which column the comparison recommends: membership until the visitor says they're gifting.
  const [recommended, setRecommended] = useState<Choice>('membership');

  const openForm = useCallback((next: LeadRequest) => {
    setFormWanted(true);
    setRequest(next);
  }, []);
  const closeForm = useCallback(() => setRequest(null), []);

  // Fetch the form's code once the page is idle, so the first tap opens it at once.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void loadForm());
    return () => cancel(handle);
  }, []);

  return (
    <LeadFormProvider value={openForm}>
      <HeroSlot />
      <QuickChooser onChoose={setRecommended} />
      <MembershipTiers />
      <OccasionGrid />
      <Comparison recommended={recommended} />
      <HowItWorks />
      <VideoSlot />
      <Testimonials />
      <FaqSection />
      <FinalCta />
      <Terms />

      {formWanted && (
        <Suspense fallback={null}>
          <LeadFormSheet request={request} onClose={closeForm} />
        </Suspense>
      )}
      <MobileStickyBar whatsappHref={whatsappLink(gmPage.whatsappText)} />
    </LeadFormProvider>
  );
}
