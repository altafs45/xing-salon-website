// Shapes shared by the build-time blog loader (src/blog/build.ts) and the pages that show posts.

export interface BlogImage {
  src: string;
  width: number;
  height: number;
  srcSet?: string;
}

/** Everything the listing, cards, schema and <head> need. The post body is loaded separately. */
export interface BlogPostMeta {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  /** YYYY-MM-DD. A post is live only once this date has arrived. */
  publishDate: string;
  updatedDate: string;
  featuredImage: BlogImage;
  featuredImageAlt: string;
  readTime: number;
  wordCount: number;
  /** Service page slugs, most relevant first; the first is the main conversion target. */
  relatedServices: string[];
  /** Up to three live posts, chosen from the frontmatter and topped up from the same category. */
  relatedPosts: string[];
  /** Held back from production until approved. */
  draft: boolean;
}

/** The article itself, split where the mid-article CTA goes. */
export interface BlogPostBody {
  toc: Array<{ id: string; text: string; level: 2 | 3 }>;
  before: string;
  after: string;
  takeaways: string[];
  /** Kept with the body, not the shared index, so listing pages don't download every post's FAQs. */
  faqs: Array<{ q: string; a: string }>;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}
