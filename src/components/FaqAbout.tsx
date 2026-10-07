import { about, faq } from '../data/content';
import { Accordion } from './ui/Accordion';
import { CountUp } from './ui/CountUp';
import { Eyebrow, Reveal } from './ui/Primitives';

function Faq() {
  return (
    <div id="faq" className="scroll-mt-header">
      <Eyebrow as="h2">{faq.eyebrow}</Eyebrow>
      <div className="mt-4">
        <Accordion items={faq.items} idPrefix="faq" />
      </div>
    </div>
  );
}

export function FaqAbout() {
  return (
    <section id="about" className="section bg-cream">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal from="left">
          <Faq />
        </Reveal>

        <Reveal from="right">
          <Eyebrow as="h2">{about.eyebrow}</Eyebrow>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-sm leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <dl className="mt-8 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-ink/10">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center text-center">
                <dt className="mt-1 text-xs text-muted">{stat.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums text-berry">
                  <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
