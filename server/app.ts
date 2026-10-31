// The Express app: the lead endpoint, and (in production, given `staticDir`) the built site from /dist.
import { existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import compression from 'compression';
import express, { type ErrorRequestHandler } from 'express';
import { redirects } from '../src/data/services';
import { handleLead, type LeadDeps } from './handler';
import { log } from './log';

export const LEAD_PATH = '/api/leads/gift-membership';

export function createApp(deps: LeadDeps, staticDir?: string) {
  const app = express();
  // Behind a proxy (Nginx, Render, Railway…) the client's IP comes from X-Forwarded-For.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.post(LEAD_PATH, express.json({ limit: '20kb' }), async (req, res) => {
    const result = await handleLead(req.body, req.ip ?? 'unknown', deps);
    res.status(result.status).set('Cache-Control', 'no-store').json(result.body);
  });
  app.all(LEAD_PATH, (_req, res) => {
    res.status(405).set('Allow', 'POST').json({ ok: false, code: 'method_not_allowed' });
  });

  if (staticDir && existsSync(staticDir)) {
    // Retired addresses (src/data/services.ts) move permanently to their replacements, keeping any query string.
    app.get(/.*/, (req, res, next) => {
      const to = redirects[req.path.replace(/\/+$/, '') || '/'];
      if (!to) return next();
      const query = req.originalUrl.indexOf('?');
      res.redirect(301, query === -1 ? to : to + req.originalUrl.slice(query));
    });
    // Gzip the site's HTML, scripts and styles (about a third of their size); images are already compressed.
    app.use(compression());
    // Every route is its own HTML file (see vite.config.ts). /offers is served from offers.html rather than
    // redirected to /offers/, so the address matches each page's canonical URL.
    const root = resolve(staticDir);
    app.get(/^[^.]*$/, (req, res, next) => {
      const path = req.path.replace(/\/+$/, '');
      const file = resolve(root, `.${path}.html`);
      if (!path || extname(path) || !file.startsWith(root + sep) || !existsSync(file)) return next();
      res.set('Cache-Control', 'public, max-age=3600').sendFile(file);
    });
    app.use(express.static(root, { maxAge: '1h' }));
    app.use((_req, res) => res.status(404).sendFile(join(root, '404', 'index.html')));
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
