// Build-time only (Node): reads /content/blog/*.md, checks each post and renders it to HTML.
// Used by vite.config.ts. Never import this from the app: it uses the file system.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { Marked, type Token, type Tokens } from 'marked';
import type { BlogCategory, BlogPostBody, BlogPostMeta } from './types';

export const BLOG_DIR = join(process.cwd(), 'content', 'blog');

export interface LoadedPost {
  meta: BlogPostMeta;
  body: BlogPostBody;
  /** Problems found while checking the post against the content rules. */
  warnings: string[];
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Today's date in Bengaluru, as YYYY-MM-DD. */
export const todayInIndia = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

// Markdown to plain words. Hyphens inside words stay, so "pre-event" still matches a keyword.
const plain = (markdown: string) =>
  markdown
    .replace(/^\|?[\s:|-]+\|?$/gm, ' ')
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/[#>*_`~]+/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

const countWords = (text: string) => (plain(text).match(/[A-Za-z0-9’']+/g) ?? []).length;

// Words the content rules ban outright. Neutral uses ("makeup-ready skin") are allowed, so "makeup" is
// only flagged when it reads like a service.
const BANNED = [
  /₹|\bRs\.?\s?\d/i,
  /\b(bridal|party|hd|airbrush|engagement|reception)\s+make-?up\b/i,
  /\bmake-?up (artist|service|package)s?\b/i,
  /\bcures?\b/i,
  /\bstops? hair ?fall\b/i,
  /\btreats? acne\b/i,
  // Skin-tone claims. Hair "lightening" (e.g. pre-lightening before balayage) is a normal colour term.
  /\b(whiten\w*|fairness)\b|\bskin[- ]lighten\w*/i,
  /\bin today'?s fast-paced world\b/i,
  /\b(delve|unlock|game-?changer|elevate)\b/i,
];

interface Frontmatter {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  category: string;
  tags?: string[];
  author?: string;
  publishDate: string | Date;
  updatedDate?: string | Date;
  featuredImage: { src: string; width: number; height: number; srcSet?: string };
  featuredImageAlt: string;
  relatedServices?: string[];
  relatedPosts?: string[];
  takeaways?: string[];
  faqs?: Array<{ q: string; a: string }>;
  draft?: boolean;
}

const isoDate = (value: string | Date) => (value instanceof Date ? value.toISOString().slice(0, 10) : String(value));

/** Renders one post. `isLive(slug)` decides whether a link to another post stays a link. */
function renderBody(
  markdown: string,
  takeaways: string[],
  faqs: BlogPostBody['faqs'],
  isLive: (slug: string) => boolean,
): BlogPostBody {
  const toc: BlogPostBody['toc'] = [];
  const used = new Set<string>();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (tokens: Token[]) => string } }, { tokens, depth, text }: Tokens.Heading) {
        const html = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${html}</h${depth}>\n`;
        let id = slugify(text);
        while (used.has(id)) id += '-2';
        used.add(id);
        toc.push({ id, text: text.replace(/\*\*/g, ''), level: depth });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link(this: { parser: { parseInline: (tokens: Token[]) => string } }, { href, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const post = href.match(/^\/blog\/([a-z0-9-]+)$/)?.[1];
        // A link to a post that is not live yet becomes plain text, so nothing points at a missing page.
        if (post && !isLive(post)) return text;
        if (/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
        return `<a href="${href}">${text}</a>`;
      },
      table(this: unknown, token: Tokens.Table) {
        // Default table markup, wrapped so wide tables scroll sideways on phones instead of the page.
        const inner = new Marked({ gfm: true }).parser([token as Token]);
        return `<div class="table-wrap">${inner}</div>\n`;
      },
    },
  });

  const tokens = marked.lexer(markdown);
  // The mid-article CTA goes before the first H2 that starts after about 40% of the text.
  const sizes = tokens.map((token) => ('raw' in token ? token.raw.length : 0));
  const total = sizes.reduce((sum, size) => sum + size, 0);
  let seen = 0;
  let split = tokens.length;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading' && (token as Tokens.Heading).depth === 2 && seen >= total * 0.4) {
      split = i;
      break;
    }
    seen += sizes[i];
  }
  const part = (slice: Token[]) => marked.parser(Object.assign(slice, { links: tokens.links }));
  const before = part(tokens.slice(0, split));
  const after = part(tokens.slice(split));
  return { toc, before, after, takeaways, faqs };
}

function check(fm: Frontmatter, markdown: string, file: string, services: Set<string>, allSlugs: Set<string>): string[] {
  const warnings: string[] = [];
  // The keyword's words in order. Small linking words may sit between them ("skin care tips for Bangalore"),
  // and hyphens or spaces are interchangeable ("clean-up" / "clean up"), as search engines treat them.
  const glue = '(?:[\\s-]+(?:for|in|at|the|a|an|of|to|and|with|your|on)\\b)*[\\s-]+';
  const kwPattern = new RegExp(
    fm.primaryKeyword
      .toLowerCase()
      .split(/[\s-]+/)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join(glue),
    'i',
  );
  const has = (text: string) => kwPattern.test(text.replace(/\*\*/g, ''));
  const firstWords = plain(markdown).split(/\s+/).filter(Boolean).slice(0, 100).join(' ');
  const h2s = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);
  const words = countWords(markdown);

  if (fm.slug !== file.replace(/\.md$/, '')) warnings.push(`file name should match slug "${fm.slug}"`);
  if (fm.metaTitle.length > 60) warnings.push(`metaTitle is ${fm.metaTitle.length} characters (max 60)`);
  if (fm.metaDescription.length < 140 || fm.metaDescription.length > 155)
    warnings.push(`metaDescription is ${fm.metaDescription.length} characters (140–155)`);
  for (const [where, text] of [
    ['title', fm.title],
    ['metaDescription', fm.metaDescription],
    ['featuredImageAlt', fm.featuredImageAlt],
  ] as const)
    if (!has(text)) warnings.push(`primary keyword missing from ${where}`);
  if (!has(firstWords)) warnings.push('primary keyword missing from the first 100 words');
  if (!h2s.some(has)) warnings.push('primary keyword missing from every H2');
  if (words < 1200 || words > 1800) warnings.push(`body is ${words} words (1,200–1,800)`);
  if (!fm.faqs || fm.faqs.length < 3 || fm.faqs.length > 5) warnings.push('needs 3–5 FAQs');
  for (const slug of fm.relatedServices ?? []) if (!services.has(slug)) warnings.push(`unknown service page "${slug}"`);
  for (const [, slug] of markdown.matchAll(/\]\(\/services\/([a-z0-9-]+)/g)) if (!services.has(slug)) warnings.push(`link to unknown service page "${slug}"`);
  for (const [, slug] of markdown.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)) if (!allSlugs.has(slug)) warnings.push(`link to post "${slug}", which has no file yet (shown as plain text)`);
  const everything = [fm.title, fm.metaDescription, markdown, ...(fm.faqs ?? []).flatMap((f) => [f.q, f.a]), ...(fm.takeaways ?? [])].join('\n');
  for (const pattern of BANNED) {
    const hit = everything.match(pattern);
    if (hit) warnings.push(`banned wording: "${hit[0]}"`);
  }
  return warnings;
}

/**
 * Loads every post. With `preview`, drafts and future-dated posts are included too (for review builds);
 * otherwise only approved posts whose publish date has arrived.
 */
export function loadBlog({ preview, serviceSlugs }: { preview: boolean; serviceSlugs: string[] }) {
  const services = new Set(serviceSlugs);
  // BLOG_TODAY=YYYY-MM-DD lets you check what a production build will publish on a given date.
  const today = process.env.BLOG_TODAY ?? todayInIndia();
  let files: string[] = [];
  try {
    files = readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));
  } catch {
    // No posts yet.
  }

  const parsed = files.map((file) => {
    const { data, content } = matter(readFileSync(join(BLOG_DIR, file), 'utf8'));
    return { file, fm: data as Frontmatter, markdown: content.trim() };
  });
  const allSlugs = new Set(parsed.map((p) => p.fm.slug));
  const isLive = (fm: Frontmatter) => preview || (!fm.draft && isoDate(fm.publishDate) <= today);
  const live = new Set(parsed.filter((p) => isLive(p.fm)).map((p) => p.fm.slug));

  const posts: LoadedPost[] = parsed
    .filter((p) => live.has(p.fm.slug))
    .map(({ file, fm, markdown }) => {
      const words = countWords(markdown);
      const meta: BlogPostMeta = {
        slug: fm.slug,
        title: fm.title,
        metaTitle: fm.metaTitle,
        metaDescription: fm.metaDescription,
        primaryKeyword: fm.primaryKeyword,
        secondaryKeywords: fm.secondaryKeywords ?? [],
        category: fm.category,
        categorySlug: slugify(fm.category),
        tags: fm.tags ?? [],
        author: fm.author ?? 'Xing Salon Team',
        publishDate: isoDate(fm.publishDate),
        updatedDate: isoDate(fm.updatedDate ?? fm.publishDate),
        featuredImage: fm.featuredImage,
        featuredImageAlt: fm.featuredImageAlt,
        readTime: Math.max(1, Math.ceil(words / 200)),
        wordCount: words,
        relatedServices: (fm.relatedServices ?? []).filter((slug) => services.has(slug)),
        relatedPosts: (fm.relatedPosts ?? []).filter((slug) => live.has(slug) && slug !== fm.slug),
        draft: Boolean(fm.draft),
      };
      return {
        meta,
        body: renderBody(markdown, fm.takeaways ?? [], fm.faqs ?? [], (slug) => live.has(slug)),
        warnings: check(fm, markdown, file, services, allSlugs),
      };
    })
    .sort((a, b) => b.meta.publishDate.localeCompare(a.meta.publishDate) || a.meta.title.localeCompare(b.meta.title));

  // Top up related posts to three from the same category, then the newest.
  for (const post of posts) {
    const picks = post.meta.relatedPosts;
    for (const other of [...posts.filter((p) => p.meta.categorySlug === post.meta.categorySlug), ...posts]) {
      if (picks.length >= 3) break;
      if (other.meta.slug !== post.meta.slug && !picks.includes(other.meta.slug)) picks.push(other.meta.slug);
    }
  }

  const categories: BlogCategory[] = [];
  for (const { meta } of posts) {
    const found = categories.find((c) => c.slug === meta.categorySlug);
    if (found) found.count++;
    else categories.push({ name: meta.category, slug: meta.categorySlug, count: 1 });
  }

  return { posts, categories };
}
