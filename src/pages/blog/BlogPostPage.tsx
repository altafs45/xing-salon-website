import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronRight, Clock, Link2 } from 'lucide-react';
import { posts } from 'virtual:blog-index';
import type { BlogPostBody, BlogPostMeta } from '../../blog/types';
import { BlogCard, formatDate } from '../../components/blog/BlogCard';
import { RelatedServiceCards } from '../../components/service/Sections';
import { Accordion } from '../../components/ui/Accordion';
import { Button } from '../../components/ui/Button';
import { WhatsAppIcon } from '../../components/ui/Decor';
import { Picture } from '../../components/ui/Primitives';
import { site } from '../../data/content';
import { servicePages } from '../../data/pages';
import { services } from '../../data/services';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { serviceHref } from '../../lib/route';
import { whatsappLink } from '../../lib/whatsapp';

interface Props {
  post: BlogPostMeta;
  body: BlogPostBody;
}

/** The service a post leads to, with a WhatsApp message that names the article. */
function useTarget(post: BlogPostMeta) {
  const slug = post.relatedServices[0];
  const service = slug ? services[slug] : undefined;
  return {
    label: service?.label,
    href: slug ? serviceHref(slug) : '/#services',
    whatsapp: whatsappLink(
      `Hi, I read your article “${post.title}” and I’d like to book ${service ? service.label : 'an appointment'} at Xing ___ (location).`,
    ),
  };
}

function CtaCard({ post, tone }: { post: BlogPostMeta; tone: 'light' | 'dark' }) {
  const target = useTarget(post);
  const dark = tone === 'dark';
  return (
    <aside
      aria-label="Book this service"
      className={
        dark
          ? 'on-dark svc-card my-12 border-0 bg-gradient-to-br from-berry to-berrydark p-6 text-cream shadow-lift sm:p-8'
          : 'svc-card my-10 bg-gradient-to-br from-blush via-cream to-mint p-6 sm:p-8'
      }
    >
      <p className={dark ? 'font-display text-2xl font-medium' : 'font-display text-xl font-medium text-ink'}>
        {dark ? `Ready to book ${target.label ?? 'your visit'}?` : `Want expert help with ${target.label ?? 'this'}?`}
      </p>
      <p className={dark ? 'mt-2 text-sm leading-relaxed text-cream/90' : 'mt-2 text-sm leading-relaxed text-muted'}>
        Our team at Xing will check your hair or skin and recommend what suits you, at our salons in Sarjapur Road, HSR Layout and
        Brookfield.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={target.whatsapp} external arrow={false} variant={dark ? 'light' : 'primary'} className="w-full sm:w-auto">
          <WhatsAppIcon className="size-4" />
          Book on WhatsApp
        </Button>
        {target.label && (
          <Button href={target.href} variant={dark ? 'outlineLight' : 'outline'} className="w-full sm:w-auto">
            Explore {target.label}
          </Button>
        )}
      </div>
    </aside>
  );
}

function Share({ post }: { post: BlogPostMeta }) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}/blog/${post.slug}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };
  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-8">
      <p className="mr-2 text-sm font-medium text-ink">Share this article</p>
      <Button href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} external variant="outline" arrow={false}>
        <WhatsAppIcon className="size-4" />
        WhatsApp
      </Button>
      <Button variant="outline" arrow={false} onClick={copy}>
        <Link2 aria-hidden className="size-4" />
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </Button>
    </div>
  );
}

/** One blog post, laid out in the order of the content brief. */
export function BlogPostPage({ post, body }: Props) {
  const wide = useMediaQuery('(min-width: 1024px)');
  const related = post.relatedPosts.map((slug) => posts.find((other) => other.slug === slug)).filter((other) => !!other);
  const updated = post.updatedDate !== post.publishDate;

  return (
    <article>
      <header className="bg-blush pb-10 pt-header-sm lg:pt-header">
        <div className="container-site max-w-3xl pt-3 lg:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-xs text-muted">
              {[
                ['Home', '/'],
                ['Blog', '/blog'],
                [post.category, `/blog/category/${post.categorySlug}`],
              ].map(([label, href]) => (
                <li key={href} className="flex shrink-0 items-center gap-1.5">
                  <a href={href} className="inline-flex min-h-11 items-center hover:text-berry">
                    {label}
                  </a>
                  <ChevronRight aria-hidden className="size-3" />
                </li>
              ))}
              <li aria-current="page" className="min-w-0 truncate text-ink">
                {post.title}
              </li>
            </ol>
          </nav>
          <a
            href={`/blog/category/${post.categorySlug}`}
            className="mt-2 inline-flex min-h-11 items-center rounded-full bg-cream px-4 text-xs font-semibold uppercase tracking-wide text-berry"
          >
            {post.category}
          </a>
          {post.draft && <span className="ml-2 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">Draft: not published</span>}
          <h1 className="mt-4 text-balance font-display text-hero font-medium text-ink">{post.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>By {post.author}</span>
            <span aria-hidden>·</span>
            <span>
              Published <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
            </span>
            {updated && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Updated <time dateTime={post.updatedDate}>{formatDate(post.updatedDate)}</time>
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-4 text-berry" />
              {post.readTime} min read
            </span>
          </p>
        </div>
      </header>

      <div className="container-site max-w-3xl pb-16">
        <Picture
          image={{ ...post.featuredImage, alt: post.featuredImageAlt }}
          eager
          sizes="(min-width: 1024px) 768px, 100vw"
          className="svc-card -mt-2 aspect-video w-full object-cover shadow-lift"
        />

        {body.toc.length > 0 && (
          <details open={wide || undefined} className="group svc-card mt-8 p-5 sm:p-6">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-xl font-medium text-ink [&::-webkit-details-marker]:hidden">
              In this article
              <ChevronDown aria-hidden className="size-5 text-berry transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ol className="mt-3 space-y-1 text-sm">
              {body.toc
                .filter((item) => item.level === 2)
                .map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="flex min-h-11 items-center text-ink hover:text-berry">
                      {item.text}
                    </a>
                  </li>
                ))}
            </ol>
          </details>
        )}

        <div className="prose-blog mt-10" dangerouslySetInnerHTML={{ __html: body.before }} />
        <CtaCard post={post} tone="light" />
        <div className="prose-blog" dangerouslySetInnerHTML={{ __html: body.after }} />

        {body.takeaways.length > 0 && (
          <aside aria-labelledby="takeaways" className="svc-card mt-12 border-2 border-dashed border-berry/30 bg-mint p-6 sm:p-8">
            <h2 id="takeaways" className="font-display text-2xl font-medium text-ink">
              Key Takeaways
            </h2>
            <ul className="mt-4 space-y-3">
              {body.takeaways.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-ink">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cream text-berry">
                    <Check aria-hidden className="size-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {body.faqs.length > 0 && (
          <section aria-labelledby="post-faqs" className="mt-14">
            <h2 id="post-faqs" className="heading text-ink">
              Frequently Asked Questions
            </h2>
            <div className="svc-card mt-6 px-5 sm:px-7">
              <Accordion items={body.faqs} idPrefix="post-faq" />
            </div>
          </section>
        )}

        <CtaCard post={post} tone="dark" />

        {post.relatedServices.length > 0 && (
          <section aria-labelledby="post-services">
            <h2 id="post-services" className="heading text-ink">
              Related Services
            </h2>
            <RelatedServiceCards
              items={post.relatedServices.map((slug) => ({
                href: serviceHref(slug),
                label: services[slug].label,
                text: `${servicePages[slug].hero.sub.split('. ')[0].replace(/\.$/, '')}.`,
                image: servicePages[slug].hero.image,
              }))}
            />
          </section>
        )}

        <Share post={post} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-posts" className="bg-blush py-14 lg:py-20">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-posts" className="heading text-ink">
                Keep Reading
              </h2>
              <a href="/blog" className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry">
                All articles
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </a>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug}>
                  <BlogCard post={other} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
