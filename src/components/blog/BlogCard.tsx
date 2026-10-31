import { Clock } from 'lucide-react';
import type { BlogPostMeta } from '../../blog/types';
import { cn } from '../../lib/cn';
import { Picture } from '../ui/Primitives';

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

interface BlogCardProps {
  post: BlogPostMeta;
  /** The first card on a listing is the likely LCP image. */
  eager?: boolean;
  /** Heading level inside the card, so the outline stays correct on each page. */
  as?: 'h2' | 'h3';
  className?: string;
}

/** Post card: 16:9 image, category, title, two-line excerpt and read time. The whole card is one link. */
export function BlogCard({ post, eager = false, as: Heading = 'h3', className }: BlogCardProps) {
  return (
    <article className={cn('svc-card svc-card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <Picture
        image={{ ...post.featuredImage, alt: post.featuredImageAlt }}
        eager={eager}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-video w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-eyebrow font-medium uppercase text-berry">{post.category}</p>
        <Heading className="mt-2 font-display text-xl font-medium leading-snug text-ink">
          {/* The link's ::after covers the card, so the whole card is one tap target. */}
          <a href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </a>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.metaDescription}</p>
        <p className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted">
          <Clock aria-hidden className="size-3.5 text-berry" />
          {post.readTime} min read
          {post.draft && <span className="ml-auto rounded-full bg-gold px-2 py-0.5 font-semibold text-ink">Draft</span>}
        </p>
      </div>
    </article>
  );
}
