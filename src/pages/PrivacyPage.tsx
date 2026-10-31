import { Section } from '../components/service/SectionHeader';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { privacy } from '../data/privacy';

/** /privacy: what the site collects, in plain language. */
export default function PrivacyPage() {
  return (
    <div data-cta="privacy_page" className="pt-header-sm lg:pt-header">
      <Section tone="white" className="!pt-6">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }]} current={privacy.h1} />
        <h1 className="mt-2 font-display text-hero font-medium text-ink">{privacy.h1}</h1>
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
