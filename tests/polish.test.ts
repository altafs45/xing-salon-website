import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { locations } from '../src/data/branches';
import { CTA, VOCABULARY, WRONG_CTA } from '../src/data/style';

const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : path.endsWith('.html') ? [path] : [];
});

describe('house style', () => {
  it('has one label for each action', () => {
    expect(CTA.book).toBe('Book Appointment');
    expect(CTA.whatsapp).toBe('Chat on WhatsApp');
    expect(new Set(Object.values(CTA)).size).toBe(Object.values(CTA).length);
    for (const wrong of WRONG_CTA) expect(Object.values(CTA)).not.toContain(wrong);
  });
});

describe.skipIf(!existsSync('dist/index.html'))('the built site', () => {
  const pages = walk('dist')
    .map((file) => ({ file, html: readFileSync(file, 'utf8') }))
    .filter(({ html }) => !/http-equiv="refresh"/.test(html) && /content="index,follow"/.test(html));
  const text = (html: string) => html.slice(html.search(/<div id="(first-paint|root)"/)).replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ');

  it('has no wrong vocabulary that the audit calls an error', () => {
    const brand = VOCABULARY.filter((rule) => ['brand', 'whatsapp', 'money'].includes(rule.check)).map((rule) => new RegExp(rule.wrong, rule.flags));
    for (const { file, html } of pages) for (const rule of brand) expect(rule.test(text(html)), `${rule} in ${file}`).toBe(false);
  });

  it('writes llms.txt with each salon exactly', () => {
    const llms = readFileSync('dist/llms.txt', 'utf8');
    for (const loc of locations) {
      expect(llms).toContain(loc.fullName);
      expect(llms).toContain(loc.phone);
      expect(llms).toContain(loc.address);
    }
    expect(existsSync('dist/llms-full.txt')).toBe(true);
  });

  it('welcomes AI crawlers, keeps them out of the API, and points at the sitemap index', () => {
    const robots = readFileSync('dist/robots.txt', 'utf8');
    for (const bot of ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'GPTBot']) expect(robots).toContain(`User-agent: ${bot}`);
    expect(robots).toContain('Sitemap: https://www.xingsalons.com/sitemap.xml');
    expect(readFileSync('dist/sitemap.xml', 'utf8')).toContain('<sitemapindex');
  });

  it('gives every page a WebPage node, and every page but home a visible breadcrumb', () => {
    for (const { file, html } of pages) {
      expect(html, file).toContain('"WebPage"');
      if (!/dist[\\/]index\.html$/.test(file)) expect(html.includes('aria-label="Breadcrumb"'), file).toBe(true);
    }
  });

  it('keeps each page within its gzip budget', () => {
    for (const { file, html } of pages) expect(gzipSync(html).length / 1024, file).toBeLessThanOrEqual(/dist[\\/]index\.html$/.test(file) ? 55 : 40);
  });
});
