import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Reading from '@/features/tarot/pages/Reading';

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
  document.body.style.overflow = '';
  document.body.classList.remove('nav-panel-open');
});

function openFirstCardDetails() {
  render(
    <Reading
      request={{ question: 'What should I see?', intention: 'General', spreadId: 'three-card' }}
      onNavigate={vi.fn()}
    />,
  );

  act(() => vi.advanceTimersByTime(2_500));
  const card = screen.getAllByRole('button', { name: /turn this card/i })[0];
  expect(card.tagName).toBe('BUTTON');
  expect(card.getAttribute('type')).toBe('button');
  fireEvent.click(card);

  const trigger = screen.getByRole('button', { name: /open details/i });
  expect(trigger).toBe(card);
  fireEvent.click(trigger);
  return trigger;
}

describe('tarot card details dialog', () => {
  it('labels the modal, traps focus in both directions, closes on Escape, and restores the exact card trigger', async () => {
    vi.useFakeTimers();
    const trigger = openFirstCardDetails();
    vi.useRealTimers();
    const user = userEvent.setup();

    const dialog = screen.getByRole('dialog', { name: /card details/i });
    const controls = within(dialog);
    const close = controls.getByRole('button', { name: /close card details/i });
    const previous = controls.getByRole('button', { name: /previous card/i });
    const next = controls.getByRole('button', { name: /next card/i });
    const labelledBy = dialog.getAttribute('aria-labelledby');

    expect(screen.getByTestId('card-dialog-backdrop').parentElement).toBe(document.body);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy ?? '')?.textContent).toMatch(/card details/i);
    expect(dialog.className).toContain('h-[100dvh]');
    expect(dialog.className).toContain('md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]');
    expect(dialog.className).not.toContain('sm:grid-cols-');
    for (const control of [close, previous, next]) {
      expect(control.className).toContain('min-h-[44px]');
      expect(control.className).toContain('min-w-[44px]');
    }
    expect(close.className).toContain('top-[max(0.75rem,env(safe-area-inset-top))]');
    expect(close.className).toContain('right-[max(0.75rem,env(safe-area-inset-right))]');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(close);

    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    expect(first).toBe(close);
    expect(last).toBeTruthy();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await user.tab();
    expect(document.activeElement).toBe(first);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /card details/i })).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);
  });

  it('preserves card navigation, ignores inside clicks, and dismisses only from the backdrop', () => {
    vi.useFakeTimers();
    const trigger = openFirstCardDetails();
    const dialog = screen.getByRole('dialog', { name: /card details/i });
    const initialHeading = within(dialog).getByRole('heading', { level: 2 }).textContent;

    fireEvent.click(within(dialog).getByRole('button', { name: /next card/i }));
    expect(within(dialog).getByRole('heading', { level: 2 }).textContent).not.toBe(initialHeading);
    fireEvent.click(within(dialog).getByRole('button', { name: /previous card/i }));
    expect(within(dialog).getByRole('heading', { level: 2 }).textContent).toBe(initialHeading);

    fireEvent.click(dialog);
    expect(screen.getByRole('dialog', { name: /card details/i })).toBeTruthy();
    fireEvent.click(screen.getByTestId('card-dialog-backdrop'));
    expect(screen.queryByRole('dialog', { name: /card details/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('recovers the Tab loop when card navigation disables the focused boundary control', () => {
    vi.useFakeTimers();
    openFirstCardDetails();
    const dialog = screen.getByRole('dialog', { name: /card details/i });
    const controls = within(dialog);
    const close = controls.getByRole('button', { name: /close card details/i });
    const previous = controls.getByRole('button', { name: /previous card/i }) as HTMLButtonElement;
    const next = controls.getByRole('button', { name: /next card/i }) as HTMLButtonElement;

    next.focus();
    fireEvent.click(next);
    fireEvent.click(next);
    expect(next.disabled).toBe(true);
    expect(document.activeElement).toBe(next);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    previous.focus();
    fireEvent.click(previous);
    fireEvent.click(previous);
    expect(previous.disabled).toBe(true);
    expect(document.activeElement).toBe(previous);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(next);
  });

  it('contains mobile and desktop scrolling while retaining safe-area values through the sm breakpoint', () => {
    vi.useFakeTimers();
    openFirstCardDetails();
    const dialog = screen.getByRole('dialog', { name: /card details/i });
    const close = within(dialog).getByRole('button', { name: /close card details/i });
    const scrollContent = dialog.lastElementChild as HTMLElement;

    expect(dialog.className).toContain('overscroll-contain');
    expect(scrollContent.className).toContain('md:overscroll-contain');
    expect(close.className).not.toMatch(/sm:(?:right|top)-/);
    expect(close.className).toContain('md:right-5');
    expect(close.className).toContain('md:top-5');
    expect(scrollContent.className).toContain('pb-[max(2rem,env(safe-area-inset-bottom))]');
    expect(scrollContent.className).not.toMatch(/sm:pb-/);
    expect(scrollContent.className).toContain('md:pb-10');
  });
});
