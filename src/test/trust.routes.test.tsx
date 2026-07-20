import { render, screen, within } from '@testing-library/react';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/analytics/TrackedLink', () => ({
  TrackedLink: ({ children, ...props }: React.ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));
vi.mock('@/components/ui/SocialLinks', () => ({ SocialLinks: () => <div aria-label="Social links" /> }));

import { Footer } from '@/components/ui/Footer';
import { INDEXABLE_STATIC_ROUTES } from '@/lib/seo/site';

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('global trust architecture', () => {
  it('places a skip link immediately inside body and owns the only global main landmark', () => {
    const layout = readSource('src/app/layout.tsx');
    const bodyMarkup = layout.slice(layout.indexOf('<body'), layout.indexOf('</body>'));

    expect(bodyMarkup).toMatch(/<body[^>]*>\s*<a[^>]*href="#main-content"[^>]*>\s*Skip to content\s*<\/a>/s);
    expect(layout.match(/<main\b/g)).toHaveLength(1);
    expect(layout).toMatch(/<main[^>]*id="main-content"[^>]*tabIndex=\{-1\}/s);
    expect(readSource('src/app/page.tsx')).not.toMatch(/<\/?main\b/);
    expect(readSource('src/app/ripley-scroll/page.tsx')).not.toMatch(/<\/?main\b/);
  });

  it('renders four editorial footer zones with trust routes and an AI-assistance disclosure', () => {
    render(<Footer />);

    for (const zone of ['Purpose', 'Explore', 'Practice', 'Trust']) {
      expect(screen.getByRole('heading', { name: zone })).toBeTruthy();
    }

    const footer = screen.getByRole('contentinfo');
    for (const [name, href] of [
      ['About', '/about'],
      ['Method', '/method'],
      ['Sources', '/sources'],
      ['Privacy', '/privacy'],
    ] as const) {
      expect(within(footer).getByRole('link', { name }).getAttribute('href')).toBe(href);
    }
    expect(within(footer).getByText(/interpretations are AI-assisted reflective guidance/i)).toBeTruthy();

    for (const link of within(footer).getAllByRole('link')) {
      expect(link.className).toContain('min-h-[44px]');
    }
  });

  it('registers every new public trust route for indexing', () => {
    expect(INDEXABLE_STATIC_ROUTES).toEqual(
      expect.arrayContaining(['/about', '/method', '/sources', '/privacy']),
    );
  });

  it.each([
    ['about', ['/method', '/sources']],
    ['method', ['/sources', '/privacy']],
    ['sources', ['/method', '/privacy']],
    ['privacy', ['/method', '/sources']],
  ])('provides one visible h1 and useful trust links on /%s', (route, expectedLinks) => {
    const relativePath = `src/app/${route}/page.tsx`;
    const exists = existsSync(resolve(process.cwd(), relativePath));
    expect(exists).toBe(true);
    if (!exists) return;

    const source = readSource(relativePath);
    expect(source.match(/<h1\b/g)).toHaveLength(1);
    expect(source).toMatch(new RegExp(`>${route[0].toUpperCase()}${route.slice(1)}<`, 'i'));
    for (const href of expectedLinks) {
      expect(source).toContain(`href="${href}"`);
    }
  });

  it('states the real reading data flow and scope of AI-assisted guidance without a retention promise', () => {
    const relativePath = 'src/app/privacy/page.tsx';
    const exists = existsSync(resolve(process.cwd(), relativePath));
    expect(exists).toBe(true);
    if (!exists) return;

    const privacy = readSource(relativePath);
    expect(privacy).toMatch(/Tarot questions.*cards.*processed.*service/is);
    expect(privacy).toMatch(/birth.*chart data.*processed.*services/is);
    expect(privacy).toMatch(/enter only.*needed/i);
    expect(privacy).toMatch(/AI-assisted reflective guidance/i);
    expect(privacy).toMatch(/not medical, legal, financial, or other professional advice/i);
    expect(privacy).not.toMatch(/raw birth data (?:is|are) never (?:stored|retained)/i);
  });
});
