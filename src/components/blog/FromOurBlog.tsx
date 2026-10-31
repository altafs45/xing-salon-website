import { latest } from 'virtual:blog-picks';
import { ArrowLink } from '../ui/Button';
import { Reveal } from '../ui/Primitives';
import { SectionHeader } from '../service/SectionHeader';
import { BlogCard } from './BlogCard';

/** Landing page: the three newest posts. Hidden until the first post is live. */
export function FromOurBlog() {
  if (latest.length === 0) return null;
  return (
    <section id="blog" aria-labelledby="from-our-blog" className="bg-cream py-section">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="From Our Blog" title="Hair, Skin & Nail Care Tips" />
          <ArrowLink href="/blog">View all articles</ArrowLink>
        </div>
        <ul data-swipe className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {latest.map((post, i) => (
            <li key={post.slug} className="w-[80%] shrink-0 snap-start sm:w-auto">
              <Reveal delay={i * 0.05} className="h-full">
                <BlogCard post={post} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
