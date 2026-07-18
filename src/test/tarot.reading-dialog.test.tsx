import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Reading from '@/features/tarot/pages/Reading';

afterEach(() => {
  vi.useRealTimers();
});

describe('tarot card details dialog', () => {
  it('moves focus into the real card dialog, cycles Tab in both directions, and restores the card trigger', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Reading
        request={{ question: 'What should I see?', intention: 'General', spreadId: 'three-card' }}
        onNavigate={vi.fn()}
      />,
    );

    act(() => vi.advanceTimersByTime(2_500));
    const card = screen.getAllByRole('button', { name: /turn this card/i })[0];
    fireEvent.click(card);
    const trigger = screen.getByRole('button', { name: /open details/i });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /card details/i });
    const close = screen.getByRole('button', { name: /close card details/i });
    expect(document.body.contains(dialog)).toBe(true);
    expect(document.activeElement).toBe(close);

    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    expect(first).toBeTruthy();
    expect(last).toBeTruthy();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await user.tab();
    expect(document.activeElement).toBe(first);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /card details/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
