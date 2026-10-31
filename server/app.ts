// The Express app: the lead endpoint, and (in production, given `staticDir`) the built site from /dist.
import { existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import compression from 'compression';
import express, { type ErrorRequestHandler } from 'express';
import { redirects } from '../src/data/services';
import { canonicalRedirect, headersFor, securityHeaders } from './canonical';
import { handleLead, type LeadDeps } from './handler';
import { log } from './log';

export const LEAD_PATH = '/api/leads/gift-membership';

export function createApp(deps: LeadDeps, staticDir?: string) {
  const app = express();
  // Behind a proxy (Nginx, Render, Railway…) the client's IP comes from X-Forwarded-For.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(securityHeaders);

  app.post(LEAD_PATH, express.json({ limit: '20kb' }), async (req, res) => {
    const result = await handleLead(req.body, req.ip ?? 'unknown', deps);
    res.status(result.status).set('Cache-Control', 'no-store').json(result.body);
  });
  app.all(LEAD_PATH, (_req, res) => {
    res.status(405).set('Allow', 'POST').json({ ok: false, code: 'method_not_allowed' });
  });

  if (staticDir && existsSync(staticDir)) {
    // One address per page, in one hop: https, www, no trailing slash, no .html, and retired addresses
    // (src/data/services.ts) moved to their replacements, keeping any query string.
    app.get(/.*/, (req, res, next) => {
      const to = canonicalRedirect({ host: req.hostname, proto: req.protocol, url: req.originalUrl }, redirects);
      if (!to) return next();
      res.redirect(301, to);
    });
    // Gzip the site's HTML, scripts and styles (about a third of their size); images are already compressed.
    app.use(compression());
    // Every route is its own HTML file (see vite.config.ts). /offers is served from offers.html rather than
    // redirected to /offers/, so the address matches each page's canonical URL.
    const root = resolve(staticDir);
    app.get(/^[^.]*$/, (req, res, next) => {
      const file = resolve(root, req.path === '/' ? 'index.html' : `.${req.path}.html`);
      if (extname(req.path) || !file.startsWith(root + sep) || !existsSync(file)) return next();
      res.set('Cache-Control', headersFor('/page.html')).sendFile(file);
    });
    app.use(express.static(root, { index: false, redirect: false, setHeaders: (res, file) => res.set('Cache-Control', headersFor(file.split(sep).join('/').slice(root.length))) }));
    app.use((_req, res) => res.status(404).set('Cache-Control', 'no-cache').sendFile(join(root, '404.html')));
  }

  // Malformed JSON and anything unexpected: a generic error for the client, the details in the log.
  const onError: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) return next(error);
    const status = (error as { status?: number }).status === 400 ? 400 : 500;
    log(status === 400 ? 'warn' : 'error', 'request_failed', { error: (error as Error).message });
    res.status(status).json({ ok: false, code: status === 400 ? 'bad_request' : 'server_error' });
  };
  app.use(onError);

  return app;
}
