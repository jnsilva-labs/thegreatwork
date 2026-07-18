import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Reading from '@/features/tarot/pages/Reading';

afterEach(() => {
  vi.useRealTimers();
});

describe('tarot card details dialog', () => {
  it('opens from the revealed card trigger and restores focus after Escape', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <Reading
        request={{ question: 'What should I see?', intention: 'General', spreadId: 'one-card' }}
        onNavigate={vi.fn()}
      />,
    );

    act(() => vi.advanceTimersByTime(2_500));
    const card = screen.getByRole('button', { name: /turn this card/i });
    fireEvent.click(card);
    const trigger = screen.getByRole('button', { name: /open details/i });
    fireEvent.click(trigger);

    expect(document.body.contains(screen.getByRole('dialog', { name: /card details/i }))).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /close card details/i }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /card details/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
