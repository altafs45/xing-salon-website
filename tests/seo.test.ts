import { describe, expect, it } from 'vitest';
import { robotsMeta, robotsTxt } from '../src/data/seo';

describe('a preview build can never be indexed', () => {
  it('marks every page noindex,nofollow', () => {
    expect(robotsMeta({}, true)).toBe('noindex,nofollow');
    expect(robotsMeta({ noindex: true }, true)).toBe('noindex,nofollow');
  });

  it('blocks everything in robots.txt', () => {
    expect(robotsTxt('User-agent: *\nAllow: /\n', 'https://example.com/sitemap.xml', true)).toBe('User-agent: *\nDisallow: /\n');
  });
});

describe('a live build', () => {
  it('indexes pages except those marked noindex', () => {
    expect(robotsMeta({})).toBe('index,follow');
    expect(robotsMeta({ noindex: true })).toBe('noindex,follow');
  });

  it('keeps robots.txt and adds the sitemap', () => {
    const text = robotsTxt('User-agent: *\nAllow: /\nDisallow: /api/\n', 'https://example.com/sitemap.xml');
    expect(text).toContain('Disallow: /api/');
    expect(text).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(text).not.toMatch(/Disallow: \/\n/);
  });
});
