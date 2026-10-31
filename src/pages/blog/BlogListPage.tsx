import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon';
import { bookingWhatsappHref } from '../../lib/whatsapp';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as Crumb, Search } from 'lucide-react';
import { categories, posts } from 'virtual:blog-index';
import type { BlogCategory } from '../../blog/types';
import { BlogCard } from '../../components/blog/BlogCard';
import { Eyebrow } from '../../components/ui/Primitives';
import { cn } from '../../lib/cn';

const PER_PAGE = 12;
const LIST_H1 = 'Hair, Skin & Nail Care Blog';

/** The blog listing, or one category of it: chips, client-side search, cards and pagination (?page=2). */
export function BlogListPage({ category }: { category?: BlogCategory }) {
  const params = new URLSearchParams(window.location.search);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const basePath = category ? `/blog/category/${category.slug}` : '/blog';

  const inCategory = category ? posts.filter((post) => post.categorySlug === category.slug) : posts;
  const q = query.trim().toLowerCase();
  const matches = q
    ? inCategory.filter((post) =>
        [post.title, post.metaDescription, post.category, post.primaryKeyword, ...post.secondaryKeywords, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    : inCategory;
  const pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  // Searching shows every match on one page.
  const shown = q ? matches : matches.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pageHref = (n: number) => (n === 1 ? basePath : `${basePath}?page=${n}`);

  return (
    <>
      <section className="bg-blush pb-10 pt-header-sm lg:pb-14 lg:pt-header">
        <div className="container-site pt-3 lg:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-muted">
              <li>
                <a href="/" className="inline-flex min-h-11 min-w-11 items-center hover:text-berry">
                  Home
                </a>
              </li>
              <li aria-hidden>
                <Crumb className="size-3" />
              </li>
              {category ? (
                <>
                  <li>
                    <a href="/blog" className="inline-flex min-h-11 min-w-11 items-center hover:text-berry">
                      Blog
                    </a>
                  </li>
                  <li aria-hidden>
                    <Crumb className="size-3" />
                  </li>
                  <li aria-current="page" className="text-ink">
                    {category.name}
                  </li>
                </>
              ) : (
                <li aria-current="page" className="text-ink">
                  Blog
                </li>
              )}
            </ol>
          </nav>
          <Eyebrow className="mt-2">Xing Salon Blog</Eyebrow>
          <h1 className="mt-3 max-w-4xl text-balance font-display text-hero font-medium text-ink">
            {category ? `${category.name} Tips & Guides` : LIST_H1}
          </h1>
          <a href={bookingWhatsappHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white">
            <WhatsAppIcon className="size-4" />
            Book on WhatsApp
          </a>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Practical, honest advice from our team at Xing Premium Unisex Salon in Bangalore, on caring for your hair, skin
            and nails between salon visits.
          </p>

          <label className="mt-7 flex min-h-12 max-w-md items-center gap-3 rounded-full border border-ink/15 bg-white px-5 focus-within:border-berry">
            <Search aria-hidden className="size-4 shrink-0 text-berry" />
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, e.g. keratin, dandruff"
              className="w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-muted"
            />
          </label>

          <nav aria-label="Blog categories" className="mt-6">
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
              {[{ name: 'All', slug: '', count: posts.length }, ...categories].map((chip) => {
                const href = chip.slug ? `/blog/category/${chip.slug}` : '/blog';
                const current = (category?.slug ?? '') === chip.slug;
                return (
                  <li key={chip.name} className="shrink-0">
                    <a
                      href={href}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-11 min-w-11 items-center rounded-full border px-5 text-sm font-medium transition-colors',
                        current ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink hover:border-berry hover:text-berry',
                      )}
                    >
                      {chip.name}
                      <span className={cn('ml-2 text-xs', current ? 'text-cream' : 'text-muted')}>{chip.count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <section data-gallery className="bg-cream py-12 lg:py-16">
        <div className="container-site">
          <p aria-live="polite" className="text-sm text-muted">
            {q ? `${matches.length} ${matches.length === 1 ? 'article' : 'articles'} matching “${query.trim()}”` : null}
          </p>
          {shown.length > 0 ? (
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((post, i) => (
                <li key={post.slug}>
                  <BlogCard post={post} as="h2" eager={i === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-base text-ink">No articles match your search yet. Try another word, or browse a category above.</p>
          )}

          {!q && pages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {page > 1 && (
                <a href={pageHref(page - 1)} rel="prev" className="inline-flex min-h-11 min-w-11 items-center gap-1 rounded-full px-4 text-sm font-medium text-berry hover:bg-blush">
                  <ChevronLeft aria-hidden className="size-4" />
                  Newer
                </a>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? 'page' : undefined}
                  aria-label={`Page ${n}`}
                  className={cn(
                    'grid size-11 place-items-center rounded-full text-sm font-medium',
                    n === page ? 'bg-berry text-cream' : 'text-ink hover:bg-blush',
                  )}
                >
                  {n}
                </a>
              ))}
              {page < pages && (
                <a href={pageHref(page + 1)} rel="next" className="inline-flex min-h-11 min-w-11 items-center gap-1 rounded-full px-4 text-sm font-medium text-berry hover:bg-blush">
                  Older
                  <ChevronRight aria-hidden className="size-4" />
                </a>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
