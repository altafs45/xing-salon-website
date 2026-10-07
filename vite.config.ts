import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/data/content';
import { metaFor, routes, type PageMeta } from './src/data/seo';
import { redirects } from './src/data/services';

const SLOT = '<!--seo-->';
const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderHead(meta: PageMeta) {
  const url = `${site.url}${meta.path}`;
  const image = `${site.url}${meta.image.src}`;
  return [
    START,
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(`${site.name} ${site.tagline}`)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${meta.image.width}" />`,
    `<meta property="og:image:height" content="${meta.image.height}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="preload" as="image" href="${meta.preload.src}"${
      meta.preload.srcSet ? ` imagesrcset="${meta.preload.srcSet}" imagesizes="${meta.preload.sizes}"` : ''
    } fetchpriority="high" />`,
    // "<" is escaped so no string in the data can close the script tag early.
    `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`,
    END,
  ].join('\n    ');
}

// Fills each page's <head> (meta tags, canonical, JSON-LD) from the data files. The dev server does it per
// request; the build writes one HTML file per route plus sitemap.xml, so every page has its own static head.
function seoPlugin(): Plugin {
  let outDir = 'dist';

  return {
    name: 'xing-seo',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => html.replace(SLOT, renderHead(metaFor(ctx.originalUrl ?? '/'))),
    },
    async writeBundle() {
      const home = await readFile(join(outDir, 'index.html'), 'utf8');
      const start = home.indexOf(START);
      const end = home.indexOf(END) + END.length;

      for (const route of routes.filter((entry) => entry.path !== '/')) {
        const html = home.slice(0, start) + renderHead(route) + home.slice(end);
        const dir = join(outDir, route.path);
        await mkdir(dir, { recursive: true });
        // Written twice so the URL resolves with or without a trailing slash on any static host.
        await writeFile(join(dir, 'index.html'), html);
        await writeFile(`${dir}.html`, html);
      }

      for (const [from, to] of Object.entries(redirects)) {
        const html = `<!doctype html>\n<meta charset="UTF-8" />\n<title>Redirecting…</title>\n<link rel="canonical" href="${site.url}${to}" />\n<meta http-equiv="refresh" content="0; url=${to}" />\n<a href="${to}">Continue</a>\n`;
        const dir = join(outDir, from);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, 'index.html'), html);
        await writeFile(`${dir}.html`, html);
      }

      const urls = routes.map((route) => `  <url><loc>${site.url}${route.path}</loc></url>`).join('\n');
      await writeFile(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      const robots = await readFile(join(outDir, 'robots.txt'), 'utf8');
      await writeFile(join(outDir, 'robots.txt'), `${robots.trimEnd()}\n\nSitemap: ${site.url}/sitemap.xml\n`);
    },
  };
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
});
