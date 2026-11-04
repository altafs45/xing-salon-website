import { Section } from '../components/service/SectionHeader';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { privacy } from '../data/privacy';
import { CTA } from '../data/style';
import { bookingWhatsappHref } from '../lib/whatsapp';

/** /privacy: what the site collects, in plain language. */
export default function PrivacyPage() {
  return (
    <div data-cta="privacy_page" className="pt-header-sm lg:pt-header">
      <Section tone="white" className="!pt-6" gallery>
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }]} current={privacy.crumb} />
        <h1 className="mt-2 font-display text-hero font-medium text-ink">{privacy.h1}</h1>
        <a href={bookingWhatsappHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-whatsapp px-5 text-sm font-semibold text-white">
          {CTA.whatsapp}
        </a>
        <div className="mt-6 max-w-2xl space-y-6">
          {privacy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-medium text-ink">{section.title}</h2>
              <p className="mt-1 text-base leading-relaxed text-muted">{section.text}</p>
            </section>
          ))}
        </div>
      </Section>
    </div>
  );
}
