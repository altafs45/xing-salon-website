// Production entry: `npm run build && npm run build:api && npm start` serves the site and the lead API together.
// Env comes from the host, or from a .env file next to package.json.
import { resolve } from 'node:path';
import { createApp } from './app';
import { depsFromEnv } from './config';
import { log } from './log';

const port = Number(process.env.PORT) || 8787;
createApp(depsFromEnv(), resolve(process.env.STATIC_DIR || 'dist')).listen(port, () => log('info', 'server_started', { port }));
