import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Reading from '@/features/tarot/pages/Reading';

const motionState = vi.hoisted(() => ({ motionOk: true }));

vi.mock('@/components/motion/useMotionPreference', () => ({
  useMotionPreference: () => ({ motionOk: motionState.motionOk }),
}));

const request = {
  question: 'What should I notice?',
  intention: 'General',
  spreadId: 'one-card' as const,
};

describe('Tarot reading motion status', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    motionState.motionOk = true;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('keeps one live status mounted through the normal shuffling delay and ready state', () => {
    render(<Reading request={request} onNavigate={vi.fn()} />);
    const status = screen.getByRole('status');

    expect(status.textContent).toMatch(/shuffling the symbolic field/i);
    act(() => vi.advanceTimersByTime(2_499));
    expect(screen.queryByRole('button', { name: /turn this card/i })).toBeNull();
    act(() => vi.advanceTimersByTime(1));

    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toMatch(/cards ready/i);
    expect(screen.getByRole('button', { name: /turn this card/i })).toBeTruthy();
  });

  it('keeps the live node mounted when blocked motion advances directly to ready', () => {
    motionState.motionOk = false;
    render(<Reading request={request} onNavigate={vi.fn()} />);
    const status = screen.getByRole('status');

    expect(status.textContent).toMatch(/shuffling the symbolic field/i);
    act(() => vi.runOnlyPendingTimers());

    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toMatch(/cards ready/i);
  });

  it('cancels the long delay and announces ready when motion becomes blocked mid-shuffle', () => {
    const view = render(<Reading request={request} onNavigate={vi.fn()} />);
    const status = screen.getByRole('status');
    act(() => vi.advanceTimersByTime(800));

    motionState.motionOk = false;
    view.rerender(<Reading request={request} onNavigate={vi.fn()} />);
    act(() => vi.runOnlyPendingTimers());

    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toMatch(/cards ready/i);
    expect(screen.getByRole('button', { name: /turn this card/i })).toBeTruthy();
  });
});
