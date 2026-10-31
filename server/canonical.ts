// One address per page: https://www.xingsalons.com/<path>, no trailing slash, no .html. The same rules for a static
// host are in dist/_redirects (vite.config.ts) and public/_headers.
import type { NextFunction, Request, Response } from 'express';
import { site } from '../src/data/content';

const CANONICAL_HOST = new URL(site.url).host;
const BARE_HOST = CANONICAL_HOST.replace(/^www\./, '');
const YEAR = 31_536_000;
const WEEK = 604_800;

/** Where a request should go instead, or undefined if it is already right. Local and preview hosts keep their host. */
export function canonicalRedirect(request: { host: string; proto: string; url: string }, redirects: Record<string, string>) {
  const queryAt = request.url.indexOf('?');
  const path = queryAt === -1 ? request.url : request.url.slice(0, queryAt);
  const query = queryAt === -1 ? '' : request.url.slice(queryAt);
  const live = request.host === CANONICAL_HOST || request.host === BARE_HOST;

  let clean = path === '/index.html' ? '/' : path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  clean = redirects[clean] ?? clean;
  const wrongOrigin = live && (request.proto !== 'https' || request.host !== CANONICAL_HOST);
  if (clean === path && !wrongOrigin) return undefined;
  return `${wrongOrigin ? `https://${CANONICAL_HOST}` : ''}${clean}${query}`;
}

/** The Cache-Control value for a file, by its site path. */
export function headersFor(path: string) {
  if (/\.html$/.test(path) || path === '/sitemap.xml' || path === '/robots.txt') return 'no-cache';
  if (/^\/(assets|fonts)\//.test(path)) return `public, max-age=${YEAR}, immutable`;
  if (/^\/(images|videos|og)\//.test(path)) return `public, max-age=${WEEK}`;
  return 'public, max-age=3600';
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set({
    // No "preload" until the owner confirms every subdomain is on HTTPS.
    'Strict-Transport-Security': `max-age=${YEAR}; includeSubDomains`,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
}
