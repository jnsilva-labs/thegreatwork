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
  it('uses the menu trigger as the dialog restoration target and traps focus while open', async () => {
    const user = userEvent.setup();
    render(<NavBar />);

    const trigger = screen.getByRole('button', { name: /open menu/i });
    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const dialog = screen.getByRole('dialog', { name: /menu/i });
    const close = screen.getByRole('button', { name: /^close$/i });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.activeElement).toBe(close);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /menu/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
