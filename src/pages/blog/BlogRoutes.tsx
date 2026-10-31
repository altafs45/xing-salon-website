import { lazy } from 'react';
import { categories, loaders, posts } from 'virtual:blog-index';
import type { BlogPostMeta } from '../../blog/types';
import type { BlogRoute } from '../../lib/route';
import { BlogListPage } from './BlogListPage';
import { BlogPostPage } from './BlogPostPage';

// The route is fixed for the page's lifetime, so one lazy component per post is enough. It waits for the
// post's HTML before rendering, so the article and footer appear together without shifting.
const cache = new Map<string, ReturnType<typeof lazy>>();
function postComponent(post: BlogPostMeta) {
  if (!cache.has(post.slug)) {
    cache.set(
      post.slug,
      lazy(async () => {
        const body = (await loaders[post.slug]()).default;
        return { default: () => <BlogPostPage post={post} body={body} /> };
      }),
    );
  }
  return cache.get(post.slug)!;
}

/** /blog, /blog/category/<category> and /blog/<post>. */
export default function BlogRoutes({ route }: { route: BlogRoute }) {
  if (route.kind === 'list') return <BlogListPage category={categories.find((category) => category.slug === route.category)} />;
  const Post = postComponent(posts.find((post) => post.slug === route.slug)!);
  return <Post />;
}
