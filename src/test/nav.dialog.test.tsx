import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/components/analytics/TrackedLink', () => ({
  TrackedLink: ({ children, ...props }: React.ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));

import { NavBar } from '@/components/ui/NavBar';

afterEach(() => {
  document.body.style.overflow = '';
  document.body.classList.remove('nav-panel-open');
});

describe('navigation menu dialog', () => {
  it('exposes a labelled modal relationship and focuses the close control', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    const trigger = screen.getByRole('button', { name: /open menu/i });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe('site-menu-dialog');

    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /^menu$/i });
    const close = within(dialog).getByRole('button', { name: /^close$/i });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(dialog.id).toBe('site-menu-dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(within(dialog).getByRole('link', { name: /awareness paradox home/i }).getAttribute('href')).toBe('/');
    expect(document.activeElement).toBe(close);
  });

  it('traps forward and backward Tab, locks scrolling, and restores focus and prior overflow on Escape', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'scroll';
    render(<NavBar />);

    const trigger = screen.getByRole('button', { name: /open menu/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /^menu$/i });
    expect(document.body.style.overflow).toBe('hidden');

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.closest('details:not([open])'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    first.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);

    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(first);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /^menu$/i })).toBeNull();
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes from the overlay and restores the menu trigger', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    const trigger = screen.getByRole('button', { name: /open menu/i });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /close menu overlay/i }));

    expect(screen.queryByRole('dialog', { name: /^menu$/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('keeps environment controls in a secondary disclosure with pressed state', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    const dialog = screen.getByRole('dialog', { name: /^menu$/i });
    const summary = within(dialog).getByText(/^environment$/i).closest('summary');
    expect(summary).toBeTruthy();
    await user.click(summary!);

    const environment = summary!.parentElement!;
    expect(within(environment).getByRole('combobox', { name: /theme/i })).toBeTruthy();
    for (const control of [
      within(environment).getByRole('button', { name: /play sound|mute sound/i }),
      within(environment).getByRole('button', { name: /^quality auto$/i }),
      within(environment).getByRole('button', { name: /^quality high$/i }),
      within(environment).getByRole('button', { name: /^quality low$/i }),
      within(environment).getByRole('button', { name: /^motion$/i }),
      within(environment).getByRole('button', { name: /^interface overlay$/i }),
    ]) {
      expect(control.hasAttribute('aria-pressed')).toBe(true);
    }
  });
});
