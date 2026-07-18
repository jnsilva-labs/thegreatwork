import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/components/analytics/TrackedLink', () => ({
  TrackedLink: ({ children, ...props }: React.ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));

import { NavBar } from '@/components/ui/NavBar';

describe('navigation menu dialog', () => {
  it('moves focus into the real menu panel, cycles Tab in both directions, and restores its trigger', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    const trigger = screen.getByRole('button', { name: /open menu/i });
    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const dialog = screen.getByRole('dialog', { name: /menu/i });
    const close = screen.getByRole('button', { name: /^close$/i });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.activeElement).toBe(close);

    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    expect(first).toBeTruthy();
    expect(last).toBeTruthy();
    first.focus();
    expect(document.activeElement).toBe(first);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await user.tab();
    expect(document.activeElement).toBe(first);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /menu/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
