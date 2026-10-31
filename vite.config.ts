import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import type { ReactElement } from 'react';
import type { OutputBundle, OutputChunk } from 'rollup';
import react from '@vitejs/plugin-react';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Hero as GiftHero } from './src/components/gift/Hero';
import { NovemberHero } from './src/components/offers/NovemberHero';
import { CategoryHero, HubHero } from './src/components/services/CatalogueHero';
import { CategoryBody } from './src/pages/ServiceCategoryPage';
import { BLOG_DIR, loadBlog } from './src/blog/build';
import { site } from './src/data/content';
import { servicePages } from './src/data/pages';
import { aboutMeta, blogRoutes, faqPageMeta, metaFor, membershipMeta, notFoundMeta, novemberOffersMeta, offersMeta, robotsMeta, robotsTxt, routes, type PageMeta } from './src/data/seo';
import { isCampaignOpen, novemberCampaign } from './src/data/offers';
import { categories, categoryOf, redirects, services, servicesHubPath } from './src/data/services';
import { membershipPath } from './src/data/membershipLinks';

const SLOT = '<!--seo-->';
const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface HeadOptions {
  /** A review build: every page is noindex. */
  preview?: boolean;
  /** Google Search Console's HTML-tag token (VITE_GSC_VERIFICATION). */
  verification?: string;
}

function renderHead(meta: PageMeta, preloads: string[] = [], options: HeadOptions = {}) {
  const url = `${site.url}${meta.path}`;
  const image = `${site.url}${meta.image.src}`;
  return [
    START,
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${robotsMeta(meta, options.preview)}" />`,
    ...(options.verification ? [`<meta name="google-site-verification" content="${esc(options.verification)}" />`] : []),
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${esc(site.fullName)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${meta.image.width}" />`,
    `<meta property="og:image:height" content="${meta.image.height}" />`,
    `<meta property="og:image:alt" content="${esc(meta.image.alt ?? meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(meta.preload
      ? [
          `<link rel="preload" as="image" href="${meta.preload.src}"${
            meta.preload.srcSet ? ` imagesrcset="${meta.preload.srcSet}" imagesizes="${meta.preload.sizes}"` : ''
          }${meta.preload.type ? ` type="${meta.preload.type}"` : ''} fetchpriority="high" />`,
        ]
      : []),
    // The code for this page type, fetched alongside the main bundle instead of after it.
    ...preloads.map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
    // "<" is escaped so no string in the data can close the script tag early.
    `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`,
    END,
  ].join('\n    ');
}

/**
 * First-paint shells: a page's opening section rendered to plain HTML at build time, placed just before the app's
 * root, so it paints before any script (the largest image and the H1 at once) and stays as it is. The app renders
 * the rest of the page after it, and draws the section itself only if the shell is missing (see HeroSlot in
 * MembershipPage.tsx). Nothing on the first screen is ever redrawn, so it never moves.
 */
const SHELLS: Record<string, () => ReactElement> = {
  [membershipPath]: () => createElement(GiftHero),
  [servicesHubPath]: () => createElement(HubHero),
  // Once the campaign has ended the page draws its "ended" hero itself.
  ...(isCampaignOpen() && { [novemberCampaign.path]: () => createElement(NovemberHero) }),
  // Category pages are all links and images: the whole page is written out, and script only adds the chip highlight.
  ...Object.fromEntries(
    categories
      .filter((category) => category.hasPage)
      .map((category) => [category.path, () => createElement(Fragment, null, createElement(CategoryHero, { category }), createElement(CategoryBody, { category }))]),
  ),
};

function withShell(html: string, path: string) {
  const shell = SHELLS[path];
  if (!shell) return html;
  return html.replace('<div id="root"></div>', `<div id="first-paint">${renderToStaticMarkup(shell())}</div>
    <div id="root"></div>`);
}

type Blog = ReturnType<typeof loadBlog>;

/** The blog categories that belong with each service category, and the fewest posts a service page should link to. */
const BLOG_CATEGORIES: Record<string, string[]> = { 'hair-care': ['hair-care', 'hair-colour', 'hair-treatments'], 'skin-body': ['skin-care'] };
const MIN_GUIDES = 2;

const INDEX_ID = 'virtual:blog-index';
const ROUTES_ID = 'virtual:blog-routes';
const PICKS_ID = 'virtual:blog-picks';
const POST_ID = 'virtual:blog-post/';

/**
 * Serves the blog to the app: `virtual:blog-routes` (live slugs only, for the router), `virtual:blog-index`
 * (every live post's metadata and a loader per post) and
 * `virtual:blog-post/<slug>` (one post's HTML, in its own chunk so a page only downloads the post it shows).
 */
function blogPlugin(state: { blog: Blog }, reload: () => void): Plugin {
  return {
    name: 'xing-blog',
    resolveId: (id) => (id === INDEX_ID || id === ROUTES_ID || id === PICKS_ID || id.startsWith(POST_ID) ? `\0${id}` : undefined),
    load(id) {
      // The few posts the landing page and service pages show, so they don't download the whole index.
      if (id === `\0${PICKS_ID}`) {
        // Published posts only: a draft is reviewed on its own page, never promoted from another one.
        const metas = state.blog.posts.map(({ meta }) => meta).filter((meta) => !meta.draft);
        // Per service: posts that list it, those with it as their main service first.
        const guides = Object.fromEntries(
          [...new Set(metas.flatMap((meta) => meta.relatedServices))].map((service) => [
            service,
            metas
              .filter((meta) => meta.relatedServices.includes(service))
              .sort((a, b) => a.relatedServices.indexOf(service) - b.relatedServices.indexOf(service))
              .slice(0, 3),
          ]),
        );
        // Service pages with too few posts of their own are topped up from the same category, when it has any.
        for (const slug of Object.keys(servicePages)) {
          const category = services[slug] && categoryOf(services[slug])?.path.split('/').pop();
          const own = (guides[slug] ??= []);
          for (const meta of metas) if (own.length < MIN_GUIDES && BLOG_CATEGORIES[category ?? '']?.includes(meta.categorySlug) && !own.includes(meta)) own.push(meta);
        }
        // The November page's reading list, in the order the page asks for it.
        const november = [...new Set(novemberCampaign.offers.flatMap((offer) => offer.relatedBlog))].flatMap((slug) => metas.filter((meta) => meta.slug === slug));
        return [`export const latest = ${JSON.stringify(metas.slice(0, 3))};`, `export const guides = ${JSON.stringify(guides)};`, `export const novemberPosts = ${JSON.stringify(november.slice(0, 4))};`].join('\n');
      }
      // Just the slugs, for the router in the main bundle; everything else stays in the lazy chunks.
      if (id === `\0${ROUTES_ID}`) {
        return [
          `export const postSlugs = ${JSON.stringify(state.blog.posts.map(({ meta }) => meta.slug))};`,
          `export const categorySlugs = ${JSON.stringify(state.blog.categories.map((category) => category.slug))};`,
        ].join('\n');
      }
      if (id === `\0${INDEX_ID}`) {
        const { posts, categories } = state.blog;
        const loaders = posts.map(({ meta }) => `  ${JSON.stringify(meta.slug)}: () => import(${JSON.stringify(POST_ID + meta.slug)}),`);
        return [
          `export const posts = ${JSON.stringify(posts.map((post) => post.meta))};`,
          `export const categories = ${JSON.stringify(categories)};`,
          `export const loaders = {\n${loaders.join('\n')}\n};`,
        ].join('\n');
      }
      if (id.startsWith(`\0${POST_ID}`)) {
        const post = state.blog.posts.find(({ meta }) => meta.slug === id.slice(POST_ID.length + 1));
        return `export default ${JSON.stringify(post?.body ?? null)};`;
      }
    },
    buildStart() {
      for (const { meta, warnings } of state.blog.posts) for (const warning of warnings) this.warn(`blog/${meta.slug}: ${warning}`);
    },
    configureServer(server) {
      server.watcher.add(BLOG_DIR);
      server.watcher.on('all', (_, file) => {
        if (!file.startsWith(BLOG_DIR)) return;
        reload();
        for (const mod of server.moduleGraph.idToModuleMap.values()) if (mod.id?.startsWith('\0virtual:blog')) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

/** The lazily loaded code a page type needs, plus the chunks that code imports. */
function routeChunks(bundle: OutputBundle) {
  const chunks = Object.values(bundle).filter((file): file is OutputChunk => file.type === 'chunk');
  const byFile = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const files = (test: (id: string) => boolean) => {
    const found = new Set<string>();
    const visit = (chunk: OutputChunk | undefined) => {
      if (!chunk || chunk.isEntry || found.has(chunk.fileName)) return;
      found.add(chunk.fileName);
      chunk.imports.forEach((file) => visit(byFile.get(file)));
    };
    // A page chunk that also shares code with another lazy chunk (the membership page and its form) has no
    // facade module, so it is found by the modules inside it instead.
    chunks.filter((chunk) => chunk.isDynamicEntry && (chunk.facadeModuleId ? test(chunk.facadeModuleId) : chunk.moduleIds.some(test))).forEach(visit);
    return [...found];
  };
  const landing = files((id) => id.endsWith('/src/routes/Landing.tsx'));
  const service = files((id) => id.endsWith('/src/pages/ServicePage.tsx'));
  const blog = files((id) => id.endsWith('/src/pages/blog/BlogRoutes.tsx'));
  const aboutPage = files((id) => id.endsWith('/src/pages/AboutPage.tsx'));
  const offersPage = files((id) => id.endsWith('/src/pages/OffersPage.tsx'));
  const novemberPage = files((id) => id.endsWith('/src/pages/NovemberOffersPage.tsx'));
  const faqPage = files((id) => id.endsWith('/src/pages/FaqPage.tsx'));
  const membershipPage = files((id) => id.endsWith('/src/pages/MembershipPage.tsx'));
  const notFoundPage = files((id) => id.endsWith('/src/pages/NotFoundPage.tsx'));
  const salonsPage = files((id) => id.endsWith('/src/pages/SalonsPage.tsx'));
  const branchPage = files((id) => id.endsWith('/src/pages/BranchPage.tsx'));
  const hubPage = files((id) => id.endsWith('/src/pages/ServicesHubPage.tsx'));
  const categoryPage = files((id) => id.endsWith('/src/pages/ServiceCategoryPage.tsx'));
  const categoryPaths = categories.filter((category) => category.hasPage).map((category) => category.path);
  return (path: string) => {
    if (path === '/') return landing;
    if (path === '/about') return aboutPage;
    if (path === '/offers') return offersPage;
    if (path === novemberCampaign.path) return novemberPage;
    if (path === '/faq') return faqPage;
    if (path === '/membership-gift-cards') return membershipPage;
    if (path === '/404') return notFoundPage;
    if (path === '/salons') return salonsPage;
    if (path.startsWith('/salons/')) return branchPage;
    if (path === servicesHubPath) return hubPage;
    if (categoryPaths.includes(path)) return categoryPage;
    if (path.startsWith('/services/')) return service;
    if (!path.startsWith('/blog')) return [];
    const post = path.match(/^\/blog\/([a-z0-9-]+)$/)?.[1];
    return post ? [...blog, ...files((id) => id === `\0${POST_ID}${post}`)] : blog;
  };
}

// Fills each page's <head> (meta tags, canonical, JSON-LD) from the data files. The dev server does it per
// request; the build writes one HTML file per route plus sitemap.xml, so every page has its own static head.
/** The last commit that touched a file, or nothing outside a git checkout. */
function lastCommit(paths: string[]) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}

/** The data file a route's content comes from, for its sitemap date. */
function contentFiles(path: string) {
  if (path === '/') return ['src/data/content.ts'];
  if (path === '/about') return ['src/data/about.ts'];
  if (path === '/offers') return ['src/data/offersPage.ts', 'src/data/offers.ts'];
  if (path === novemberCampaign.path) return ['src/data/novemberOffersPage.ts', 'src/data/offers.ts'];
  if (path === '/faq') return ['src/data/faqPage.ts'];
  if (path === membershipPath) return ['src/data/giftMembership.ts'];
  if (path === '/salons') return ['src/data/branchPages/index.ts', 'src/data/branches.ts'];
  if (path.startsWith('/salons/')) return [`src/data/branchPages${path.slice('/salons'.length)}.ts`, 'src/data/branches.ts'];
  if (path.startsWith('/blog')) return ['content/blog'];
  if (path.startsWith('/services/')) {
    const slug = path.slice('/services/'.length);
    const page = readdirSync('src/data/pages').find((file) => readFileSync(join('src/data/pages', file), 'utf8').includes(`slug: '${slug}'`));
    if (page) return [join('src/data/pages', page).replace(/\\/g, '/')];
  }
  return ['src/data/services.ts'];
}

function seoPlugin(state: { blog: Blog }, options: HeadOptions): Plugin {
  let outDir = 'dist';
  const extra = () => [aboutMeta, offersMeta, novemberOffersMeta, faqPageMeta, membershipMeta, notFoundMeta, ...blogRoutes(state.blog.posts.map((post) => ({ ...post.meta, faqs: post.body.faqs })), state.blog.categories)];

  return {
    name: 'xing-seo',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => {
        const meta = metaFor(ctx.originalUrl ?? '/', extra());
        return withShell(html.replace(SLOT, renderHead(meta, [], options)), meta.path);
      },
    },
    async writeBundle(_, bundle) {
      const chunksFor = routeChunks(bundle);
      const home = await readFile(join(outDir, 'index.html'), 'utf8');
      const start = home.indexOf(START);
      const end = home.indexOf(END) + END.length;
      const all = [...routes, ...extra()];

      for (const route of all) {
        const html = withShell(home.slice(0, start) + renderHead(route, chunksFor(route.path), options) + home.slice(end), route.path);
        if (route.path === '/') {
          await writeFile(join(outDir, 'index.html'), html);
          continue;
        }
        // One file per page, /offers.html: hosts serve it at /offers, with no trailing slash, matching the canonical URL.
        const file = join(outDir, `${route.path}.html`);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html);
      }

      for (const [from, to] of Object.entries(redirects)) {
        const html = `<!doctype html>\n<meta charset="UTF-8" />\n<title>Redirecting…</title>\n<meta name="robots" content="noindex,follow" />\n<link rel="canonical" href="${site.url}${to}" />\n<meta http-equiv="refresh" content="0; url=${to}" />\n<a href="${to}">Continue</a>\n`;
        const file = join(outDir, `${from}.html`);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html);
      }

      // Permanent redirects for hosts that read a _redirects file (Netlify, Cloudflare Pages). The bundled server
      // (server/app.ts) answers the same list with 301s, and the pages above refresh for any other host.
      // Forced (!): a host would otherwise serve the old address's stub file instead of redirecting. The bare domain
      // goes to www on hosts that take domain rules (Netlify); the others set that in their dashboard (README).
      const host = new URL(site.url).host;
      const bare = host.replace(/^www\./, '');
      const pages = all.filter((route) => route.path !== '/').map((route) => route.path);
      await writeFile(
        join(outDir, '_redirects'),
        `${[
          `http://${bare}/* https://${host}/:splat 301!`,
          `https://${bare}/* https://${host}/:splat 301!`,
          `http://${host}/* https://${host}/:splat 301!`,
          '/index.html / 301!',
          ...pages.map((path) => `${path}.html ${path} 301!`),
          ...Object.entries(redirects).flatMap(([from, to]) => [`${from} ${to} 301!`, `${from}.html ${to} 301!`]),
        ].join('\n')}\n`,
      );

      // The real last change: a post's own date, otherwise the last commit to the page's data file.
      const today = new Date().toISOString().slice(0, 10);
      const postDates = new Map(state.blog.posts.map((post) => [`/blog/${post.meta.slug}`, post.meta.updatedDate]));
      const seen = new Map<string, string | undefined>();
      const lastmod = (path: string) => {
        if (postDates.has(path)) return postDates.get(path)!;
        const key = contentFiles(path).join(' ');
        if (!seen.has(key)) seen.set(key, lastCommit(key.split(' ')));
        return seen.get(key) ?? today;
      };
      const urls = all
        .filter((route) => !route.noindex)
        .map((route) => {
          const image = `${site.url}${route.preload?.src ?? route.image.src}`;
          return `  <url><loc>${site.url}${route.path === '/' ? '' : route.path}</loc><lastmod>${lastmod(route.path)}</lastmod><image:image><image:loc>${esc(image)}</image:loc></image:image></url>`;
        })
        .join('\n');
      await writeFile(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`,
      );
      const robots = await readFile(join(outDir, 'robots.txt'), 'utf8');
      await writeFile(join(outDir, 'robots.txt'), robotsTxt(robots, `${site.url}/sitemap.xml`, options.preview));
    },
  };
}

/**
 * Dev only: serves the gift card / membership lead API (server/) from the Vite dev server, so `npm run dev` runs
 * the whole thing. In production, `npm start` (server/index.ts) serves the built site and the API together.
 */
function leadApiPlugin(env: Record<string, string>): Plugin {
  let app: ((req: unknown, res: unknown, next: () => void) => void) | undefined;
  return {
    name: 'xing-lead-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        if (!app) {
          const { createApp } = await server.ssrLoadModule('/server/app.ts');
          const { depsFromEnv } = await server.ssrLoadModule('/server/config.ts');
          app = createApp(depsFromEnv({ ...process.env, ...env }));
        }
        app!(req, res, next);
      });
    },
  };
}

// `npm run dev` and `npm run build:preview` include drafts and future-dated posts for review; `npm run build`
// publishes only approved posts whose publish date has arrived (so rebuild daily to release scheduled posts).
export default defineConfig(({ command, mode }) => {
  const preview = command === 'serve' || mode === 'blogpreview';
  const load = () => loadBlog({ preview, serviceSlugs: Object.keys(servicePages) });
  const state = { blog: load() };
  // Every variable from .env files, not only VITE_ ones: the lead API reads its SMTP and routing settings here.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), blogPlugin(state, () => (state.blog = load())), seoPlugin(state, { preview: mode === 'blogpreview', verification: env.VITE_GSC_VERIFICATION }), leadApiPlugin(env)],
    // The form enables "Pay online" only when the server takes payments.
    define: {
      'import.meta.env.VITE_PAYMENTS_ENABLED': JSON.stringify(String(env.PAYMENTS_ENABLED === 'true')),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
      __SERVICE_PAGE_SLUGS__: JSON.stringify(Object.keys(servicePages)),
    },
  };
});
