// Lists everything in the project by what should happen to it and writes docs/cleanup/cleanup-plan.md. Moves nothing.
import { execFileSync } from 'node:child_process';
import { lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SKIP = new Set(['node_modules', '.git']);
const KEEP_DIRS = new Set(['content', 'docs', 'public', 'scripts', 'server', 'src', 'tests', 'cleanup', 'data', 'reports', '.vscode', '.claude']);
const KEEP_FILES = new Set(['.env', '.env.local', '.env.example', '.gitignore', 'index.html', 'package.json', 'package-lock.json', 'README.md', 'postcss.config.js', 'tailwind.config.ts', 'tsconfig.json', 'vite.config.ts', 'vitest.config.ts', 'tsconfig.tsbuildinfo']);
const REBUILD = new Set(['screenshots', 'dist', 'server-dist', 'coverage', '.vite', 'playwright-report', 'test-results']);
const DOCS = {};

const sizeOf = (path) => {
  const stat = lstatSync(path);
  if (!stat.isDirectory()) return { bytes: stat.size, files: 1 };
  return readdirSync(path).reduce((sum, name) => {
    const child = sizeOf(join(path, name));
    return { bytes: sum.bytes + child.bytes, files: sum.files + child.files };
  }, { bytes: 0, files: 0 });
};
const tracked = (path) => {
  try {
    return execFileSync('git', ['ls-files', '--', path], { encoding: 'utf8' }).trim() ? 'tracked' : 'ignored';
  } catch {
    return 'unknown';
  }
};

const groups = { 'DELETE: rebuildable/test output': [], 'DELETE: one-off reports': [], 'MOVE OUT: original media': [], 'MOVE IN: documentation': [], KEEP: [], 'CHECK BY HAND': [] };
for (const name of readdirSync('.')) {
  if (SKIP.has(name)) continue;
  const info = sizeOf(name);
  const row = { name, ...info, git: tracked(name) };
  const dir = lstatSync(name).isDirectory();
  if (dir && KEEP_DIRS.has(name)) groups.KEEP.push(row);
  else if (dir && REBUILD.has(name)) groups['DELETE: rebuildable/test output'].push(row);
  else if (dir) groups['MOVE OUT: original media'].push(row);
  else if (KEEP_FILES.has(name)) groups.KEEP.push(row);
  else if (/_PROMPT\.md$/.test(name)) groups['MOVE IN: documentation'].push({ ...row, to: 'docs/prompts' });
  else if (DOCS[name]) groups['MOVE IN: documentation'].push({ ...row, to: DOCS[name] });
  else if (/-(before|after)\.(txt|md)$|^seo-external-links\.txt$/.test(name)) groups['DELETE: one-off reports'].push(row);
  else if (/\.(png|jpe?g|webp|mp4|mov|pdf|docx?|zip)$/i.test(name)) groups['MOVE OUT: original media'].push(row);
  else if (/\.(log|tmp|bak|orig)$|^Thumbs\.db$|^desktop\.ini$|^\.DS_Store$|^~\$/.test(name)) groups['DELETE: rebuildable/test output'].push(row);
  else groups['CHECK BY HAND'].push(row);
}
const mb = (bytes) => (bytes / 1048576).toFixed(1);
const lines = ['# Cleanup plan', ''];
for (const [title, rows] of Object.entries(groups)) {
  const total = rows.reduce((sum, row) => ({ bytes: sum.bytes + row.bytes, files: sum.files + row.files }), { bytes: 0, files: 0 });
  lines.push(`## ${title}: ${rows.length} items, ${total.files} files, ${mb(total.bytes)} MB`, '', '| Path | MB | Files | Git | To |', '| --- | --- | --- | --- | --- |');
  for (const row of rows.sort((a, b) => b.bytes - a.bytes)) lines.push(`| \`${row.name}\` | ${mb(row.bytes)} | ${row.files} | ${row.git} | ${row.to ?? ''} |`);
  lines.push('');
  console.log(`${title}: ${rows.length} items, ${total.files} files, ${mb(total.bytes)} MB`);
}
mkdirSync('docs/cleanup', { recursive: true });
writeFileSync('docs/cleanup/cleanup-plan.md', lines.join('\n'));
