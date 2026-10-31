import type { ReactNode } from 'react';
import { ArrowRight, Instagram } from 'lucide-react';
import { guides as blogGuides } from 'virtual:blog-picks';
import { BridalCareSection } from '../components/BridalCareSection';
import { BlogCard } from '../components/blog/BlogCard';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { HeroSplit } from '../components/service/HeroSplit';
import { ICONS } from '../components/service/icons';
import { LocationCards, StudioCard } from '../components/service/LocationCards';
import { MobileStickyBar } from '../components/service/MobileStickyBar';
import { Section, SectionHeader, type Tone } from '../components/service/SectionHeader';
import {
  BenefitGrid,
  CompareCards,
  CTABand,
  OfferCards,
  ProcessStepper,
  RelatedServiceCards,
  TipGroups,
  TipsChecklist,
} from '../components/service/Sections';
import { FeaturedComboCard, ServiceCardGrid, ServiceCards } from '../components/service/ServiceCards';
import { ArrowLink } from '../components/ui/Button';
import { Picture, Reveal } from '../components/ui/Primitives';
import { ReelRow } from '../components/Reels';
import { SnapRow } from '../components/ui/SnapRow';
import { locationsSection } from '../data/content';
import { reels, reelsFor } from '../data/media';
import { combos, offers } from '../data/offers';
import { NovemberServiceLink } from '../components/offers/NovemberBits';
import { servicePages } from '../data/pages';
import type { SectionKey, ServicePageContent } from '../data/pages/types';
import { categoryOf, servicesHubPath, services } from '../data/services';
import { cn } from '../lib/cn';
import { hasPage, serviceHref } from '../lib/route';
import { whatsappLink } from '../lib/whatsapp';

/** Section order used by every page that does not set its own. */
const DEFAULT_ORDER: SectionKey[] = [
  'intro',
  'gallery',
  'menu',
  'lengthGuide',
  'compare',
  'crossNote',
  'benefits',
  'combo',
  'highlight',
  'audience',
  'goals',
  'occasions',
  'process',
  'aftercare',
  'bridal',
  'offers',
  'locations',
  'faq',
  'related',
];

/** Gallery columns from tablet up, so the photos fill whole rows. */
const GALLERY_COLUMNS: Record<number, string> = { 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4', 5: 'md:grid-cols-3 lg:grid-cols-5', 6: 'md:grid-cols-3', 8: 'md:grid-cols-4' };

/** One template for every service page: copy from data/pages, the service list from data/services. */
export function ServicePage({ page }: { page: ServicePageContent }) {
  const service = services[page.slug];
  const category = categoryOf(service);
  // The H1 comes from the services.ts catalogue where it has one.
  const hero = { ...page.hero, h1: service.h1 ?? page.hero.h1 };
  // Home › Services › Hair Care › this page. Tattoo's category page is this page, so it stops at Services.
  const trail = [{ label: 'Services', href: servicesHubPath }, ...(category.hasPage ? [{ label: category.title, href: category.path }] : [])];
  // A featured offer links to its entry on /offers; one that belongs to another service, to that service's page.
  const serviceOffers = service.offers.map((id) => {
    const offer: (typeof offers)[typeof id] & { page?: string; details?: string } = offers[id];
    const linked = offer.page && offer.page !== page.slug && hasPage(offer.page);
    return { ...offer, href: offer.details ?? (linked ? serviceHref(offer.page!) : undefined) };
  });
  const related = page.related.items.filter((item) => hasPage(item.slug));
  // Blog posts written for this service, best match first (the post's main service before its extras).
  const guides = blogGuides[page.slug] ?? [];

  // Prefilled WhatsApp messages. The client fills in the blanks; location cards send the salon name instead.
  // A page about a separate venue (e.g. the tattoo studio) sends every message to that venue instead.
  const { contact } = page;
  const wa = (text: string) => whatsappLink(text, contact?.whatsappHref);
  const opening = page.whatsappText ?? `Hi, I’d like to book ${service.label} at Xing`;
  const suffix = page.whatsappSuffix ?? '';
  const bookHref = wa(contact ? `${opening}${suffix}` : `${opening} ___ (location)${suffix}`);
  const phone = contact && { href: contact.phoneHref, label: contact.phone };
  // How a card's booking message names the place: the venue, or a blank for the salon.
  const where = contact ? `at ${contact.name}.` : 'at Xing. Location: ___';
  const askHref = wa(`Hi, I have a question about ${service.label} at Xing.`);

  const { benefits, lengthGuide, compare, miniCompare, crossNote, combo, highlight, audience, goals, occasions, gallery, picks } = page;
  const HighlightIcon = highlight && ICONS[highlight.icon];
  const clips = reelsFor(page.slug);

  // Every section a page can have. A page only gets the ones it has content for, in `page.order` or the default order.
  const blocks: Partial<Record<SectionKey, ((tone: Tone) => ReactNode) | false | undefined>> = {
    intro: (tone) => (
      <Section key="intro" tone={tone}>
        <SectionHeader eyebrow={page.intro.eyebrow ?? category.title} title={page.intro.title} align="center" />
        <Reveal className="mx-auto mt-6 max-w-3xl space-y-4 text-center">
          {page.intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted sm:text-base">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Section>
    ),
    videos:
      clips.length > 0 &&
      ((tone) => (
        <Section key="videos" tone={tone}>
          <SectionHeader eyebrow={reels.pageEyebrow} title={reels.pageTitle} />
          <div className="mt-10">
            <ReelRow items={clips} />
          </div>
        </Section>
      )),
    gallery:
      gallery &&
      ((tone) => (
        <Section key="gallery" tone={tone}>
          <SectionHeader eyebrow={gallery.eyebrow ?? 'Inspiration'} title={gallery.title} text={gallery.text} />
          {gallery.items.length > 0 && (
            <div className="mt-10">
              <SnapRow className={cn('md:gap-5', GALLERY_COLUMNS[gallery.items.length] ?? 'md:grid-cols-3 lg:grid-cols-4')}>
                {gallery.items.map((photo) => (
                  <figure key={photo.src} className="svc-card overflow-hidden">
                    <Picture image={photo} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 85vw" className="aspect-square w-full object-cover" />
                    <figcaption className="px-4 py-3 text-sm font-medium text-ink">{photo.design}</figcaption>
                  </figure>
                ))}
              </SnapRow>
            </div>
          )}
          <a
            href={gallery.more.href}
            target="_blank"
            rel="noopener noreferrer"
            className="svc-card svc-card-hover group mt-8 flex min-h-11 items-center justify-between gap-4 p-5 sm:p-6"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
                <Instagram aria-hidden className="size-6" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium text-berry sm:text-base">{gallery.more.label}</span>
            </span>
            <ArrowRight aria-hidden className="size-4 shrink-0 text-berry transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
          </a>
        </Section>
      )),
    picks:
      picks &&
      ((tone) => (
        <Section key="picks" tone={tone}>
          <SectionHeader eyebrow={picks.eyebrow} title={picks.title} />
          <div className="mt-10">
            <SnapRow className="md:grid-cols-3 md:gap-5 lg:grid-cols-5">
              {picks.items.map((item, i) => {
                const Icon = ICONS[item.icon];
                return (
                  <Reveal key={item.title} delay={i * 0.05} className="h-full">
                    {/* Points back up to the style cards. */}
                    <a href="#menu" className="svc-card svc-card-hover group flex h-full flex-col p-5">
                      <span className="grid size-12 place-items-center rounded-full bg-blush text-berry">
                        <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                      </span>
                      <h3 className="mt-4 font-display text-xl font-medium text-ink">{item.title}</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {item.styles.map((style) => (
                          <li key={style} className="rounded-full bg-blush px-3 py-1 text-xs text-berrydark">
                            {style}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-medium text-berry">
                        See styles
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </SnapRow>
          </div>
        </Section>
      )),
    menu: (tone) => (
      <Section key="menu" id="menu" tone={tone}>
        <SectionHeader eyebrow={page.menu.eyebrow ?? 'Services We Offer'} title={page.menu.title} text={page.menu.text} />
        <ServiceCards
          lists={service.lists}
          notes={service.notes}
          tone={tone}
          askHref={askHref}
          askText={page.menu.askText}
          askButton={page.menu.askButton}
          moreLink={
            page.menu.moreLink && {
              text: page.menu.moreLink.text,
              links: [{ ...page.menu.moreLink }, ...(page.menu.moreLink.also ?? [])]
                .filter((link) => hasPage(link.slug))
                .map((link) => ({ label: link.label, href: serviceHref(link.slug) + ('hash' in link ? (link.hash ?? '') : '') })),
            }
          }
          cta={page.cardCta ?? 'Book this'}
          large={page.theme === 'kids'}
          bookHref={(item) => wa(`Hi, I’d like to book ${item.name}${page.cardItemSuffix ?? ''} ${where}${suffix}`)}
        />
      </Section>
    ),
    lengthGuide:
      lengthGuide &&
      ((tone) => (
        <Section key="length" tone={tone}>
          <SectionHeader eyebrow="Length Guide" title={lengthGuide.title} text={lengthGuide.text} align="center" />
        </Section>
      )),
    compare:
      compare &&
      ((tone) => (
        <Section key="compare" tone={tone}>
          <SectionHeader eyebrow="Compare" title={compare.title} text={compare.text} />
          <CompareCards compare={compare} hrefFor={(slug) => (hasPage(slug) ? serviceHref(slug) : null)} />
          {compare.closing && <p className="mt-6 text-sm leading-relaxed text-muted">{compare.closing}</p>}
        </Section>
      )),
    miniCompare:
      miniCompare &&
      ((tone) => (
        <Section key="mini-compare" tone={tone}>
          <SectionHeader eyebrow="Good to Know" title={miniCompare.title} text={miniCompare.text} />
          <CompareCards compare={miniCompare} hrefFor={(slug) => (hasPage(slug) ? serviceHref(slug) : null)} />
        </Section>
      )),
    crossNote:
      crossNote &&
      ((tone) => (
        <Section key="cross-note" tone={tone}>
          <SectionHeader eyebrow="Good to Know" title={crossNote.title} text={crossNote.text} align="center">
            {hasPage(crossNote.link.slug) && <ArrowLink href={serviceHref(crossNote.link.slug)}>{crossNote.link.label}</ArrowLink>}
          </SectionHeader>
        </Section>
      )),
    benefits:
      benefits &&
      ((tone) => (
        <Section key="benefits" tone={tone}>
          <SectionHeader eyebrow="Benefits" title={benefits.title} text={benefits.text} />
          <BenefitGrid items={benefits.items} />
        </Section>
      )),
    combo:
      combo &&
      ((tone) => (
        <Section key="combo" id="combo" tone={tone}>
          <FeaturedComboCard
            title={combo.title}
            text={combo.text}
            badge={combo.badge}
            cta={combo.cta}
            includes={combo.id ? combos[combo.id].includes : (combo.includes ?? [])}
            links={[combo.linkTo ?? []].flat().filter(hasPage).map((slug) => ({ label: services[slug].label, href: serviceHref(slug) }))}
            actions={combo.actions
              ?.filter((action) => hasPage(action.slug))
              .map((action) => ({ label: action.label, href: serviceHref(action.slug) + (action.hash ?? '#combo') }))}
            bookHref={wa(
              combo.bookText ??
              (combo.id
                ? `Hi, I’d like to book the ${combos[combo.id].name} combo at Xing. Location: ___`
                : `Hi, I’d like to book this offer at Xing: ${combo.title}. Location: ___`),
            )}
          />
        </Section>
      )),
    highlight:
      highlight &&
      HighlightIcon &&
      ((tone) => (
        <Section key="highlight" tone={tone}>
          {/* Deliberately unlike the other sections: one tinted card with a large illustration. */}
          <Reveal className="svc-card grid items-center gap-8 border-2 border-dashed border-berry/30 bg-mint p-7 sm:p-10 md:grid-cols-3">
            <div className="grid aspect-square max-w-48 place-items-center rounded-full bg-cream text-berry">
              <HighlightIcon aria-hidden className="size-20" strokeWidth={1} />
            </div>
            <div className="md:col-span-2">
              <h2 className="heading text-balance text-ink">{highlight.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">{highlight.text}</p>
            </div>
          </Reveal>
        </Section>
      )),
    audience:
      audience &&
      ((tone) => (
        <Section key="audience" tone={tone}>
          <SectionHeader eyebrow="Who Is It For?" title={audience.title} />
          <TipsChecklist tips={audience.items} />
          <p className="mt-6 text-sm leading-relaxed text-muted">{audience.note}</p>
        </Section>
      )),
    goals:
      goals &&
      ((tone) => (
        <Section key="goals" tone={tone}>
          <SectionHeader eyebrow="Pick by Skin Goal" title={goals.title} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {goals.items.map((item, i) => (
              <li key={item.goal}>
                <Reveal delay={i * 0.04} className="h-full">
                  {/* Goes to the service's own page when it has one, otherwise back up to the cards. */}
                  <a
                    href={item.slug && hasPage(item.slug) ? serviceHref(item.slug) : '#menu'}
                    className="svc-card svc-card-hover group flex h-full min-h-14 items-center justify-between gap-4 p-5"
                  >
                    <span>
                      <span className="block text-sm text-muted">{item.goal}</span>
                      <span className="block text-base font-semibold text-ink">{item.service}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-4 shrink-0 text-berry transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">{goals.note}</p>
        </Section>
      )),
    occasions:
      occasions &&
      ((tone) => (
        <Section key="occasions" tone={tone}>
          <SectionHeader eyebrow={occasions.eyebrow ?? 'Perfect For'} title={occasions.title} />
          <ul
            className={cn(
              'mt-10 flex gap-3',
              occasions.scroll ? 'no-scrollbar -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0' : 'flex-wrap',
            )}
          >
            {occasions.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.label} className="shrink-0">
                  <Reveal delay={i * 0.04} className="svc-card flex min-h-12 items-center gap-3 rounded-full py-2 pl-2 pr-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-berry">
                      {/* Nail shapes only differ at the tip, so they are drawn larger to stay distinguishable. */}
                      {item.icon.startsWith('nail-') ? (
                        <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                      ) : (
                        <Icon aria-hidden className="size-4" />
                      )}
                    </span>
                    <span className="text-sm text-ink">{item.label}</span>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          {occasions.note && <p className="mt-6 text-sm leading-relaxed text-muted">{occasions.note}</p>}
        </Section>
      )),
    process:
      page.process &&
      ((tone) => (
        <Section key="process" tone={tone}>
          <SectionHeader eyebrow="Your Visit" title={page.process!.title} text={page.process!.text} />
          <ProcessStepper steps={page.process!.steps} />
          {page.process!.duration && <p className="mt-8 text-sm text-ink">{page.process!.duration}</p>}
        </Section>
      )),
    aftercare: (tone) => (
      <Section key="aftercare" tone={tone}>
        <SectionHeader eyebrow={page.aftercare.eyebrow ?? 'Aftercare'} title={page.aftercare.title} text={page.aftercare.text} />
        {page.aftercare.groups ? <TipGroups groups={page.aftercare.groups} /> : <TipsChecklist tips={page.aftercare.tips ?? []} />}
        {page.aftercare.closing && <p className="mt-6 text-sm leading-relaxed text-muted">{page.aftercare.closing}</p>}
      </Section>
    ),
    bridal:
      page.bridalCare &&
      ((tone) => (
        <Section key="bridal" id="bridal" tone={tone}>
          <BridalCareSection compact={!!page.bridalCare!.cards} cards={page.bridalCare!.cards} />
        </Section>
      )),
    offers: (tone) => (
      <Section key="offers" tone={tone}>
        <SectionHeader
          eyebrow="Current Offers"
          title={page.offerBand.title ?? `${serviceOffers[0].deal} on ${serviceOffers[0].title}`}
          text={page.offerBand.text}
        />
        <OfferCards
          offers={serviceOffers}
          badge={page.offerBand.badge}
          links={(page.offerBand.links ?? []).filter(hasPage).map((slug) => ({ label: services[slug].label, href: serviceHref(slug) }))}
        />
      </Section>
    ),
    locations: (tone) => (
      <Section key="locations" id="locations" tone={tone}>
        <SectionHeader eyebrow={contact ? 'Our Studio' : 'Our Salons'} title={page.locationsTitle ?? locationsSection.eyebrow} />
        {contact ? <StudioCard contact={contact} whatsappHref={bookHref} /> : <LocationCards whatsappText={opening} />}
      </Section>
    ),
    faq: (tone) => (
      <Section key="faq" id="faq" tone={tone}>
        <FAQAccordion title={page.faqTitle ?? `${service.label}: Your Questions Answered`} items={page.faqs} askHref={askHref} />
      </Section>
    ),
    guides:
      guides.length > 0 &&
      ((tone) => (
        <Section key="guides" tone={tone}>
          <SectionHeader eyebrow="Helpful Guides" title={`Read Before Your ${service.label} Visit`} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        </Section>
      )),
    related:
      related.length > 0 &&
      ((tone) => (
        <Section key="related" tone={tone}>
          <SectionHeader eyebrow="Related Services" title={page.related.title} />
          <RelatedServiceCards
            items={related.map((item) => ({
              href: serviceHref(item.slug) + (item.hash ?? ''),
              label: services[item.slug].label,
              text: item.text,
              image: servicePages[item.slug].hero.image,
            }))}
          />
          {category.hasPage && (
            <ArrowLink href={category.path} className="mt-6">
              All {category.title} services
            </ArrowLink>
          )}
        </Section>
      )),
  };

  // Services split into anchored sections, e.g. #threading and #detan, each with its own small stepper.
  for (const split of page.menuSections ?? []) {
    const list = service.lists.find((entry) => entry.title === split.list)!;
    blocks[`menu:${split.id}`] = (tone) => (
      <Section key={split.id} id={split.id} tone={tone}>
        <SectionHeader eyebrow={split.eyebrow} title={split.title} text={split.text} />
        <div className="mt-10">
          <ServiceCardGrid
            list={list}
            compact={split.compact}
            cta={page.cardCta ?? 'Book this'}
            bookHref={(item) => wa(`Hi, I’d like to book ${item.name}${page.cardItemSuffix ?? ''} ${where}${suffix}`)}
          />
        </div>
        {split.steps && (
          <div className="mt-12">
            <h3 className="font-display text-2xl font-medium text-ink">What to expect</h3>
            <ProcessStepper steps={split.steps.map((title) => ({ title }))} />
          </div>
        )}
      </Section>
    );
  }

  // Every page gets its guides strip just before Related, whatever its own order.
  const order: SectionKey[] = (page.order ?? DEFAULT_ORDER).filter((key) => key !== 'guides' && key !== 'videos');
  // Clips sit right after the photo gallery, or after the intro on a page without one.
  order.splice(Math.max(order.indexOf('gallery'), order.indexOf('intro')) + 1, 0, 'videos');
  const at = order.includes('related') ? order.indexOf('related') : order.length;
  order.splice(at, 0, 'guides');
  const sections = order.map((key) => blocks[key]).filter((block) => !!block);

  return (
    <div className="group/page" data-theme={page.theme}>
      <NovemberServiceLink slug={page.slug} />
      <HeroSplit page={{ hero }} label={service.label} trail={trail} whatsappHref={bookHref} phone={phone || undefined} />
      {/* Backgrounds alternate down the page, whichever sections it has. */}
      {sections.map((render, i) => render(i % 2 === 0 ? 'white' : 'tint'))}
      <CTABand title={page.cta} whatsappHref={bookHref} phone={phone || undefined} secondary={page.ctaSecondary} />
      <MobileStickyBar whatsappHref={bookHref} phoneHref={contact?.phoneHref} />
    </div>
  );
}
