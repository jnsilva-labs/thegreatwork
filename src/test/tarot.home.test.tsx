import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Home from '@/features/tarot/pages/Home';

describe('tarot reading entry', () => {
  it('selects one card by default and only submits a trimmed, non-blank question', async () => {
    const user = userEvent.setup();
    const onStartReading = vi.fn();

    render(<Home onNavigate={vi.fn()} onStartReading={onStartReading} />);

    const focus = screen.getByRole('button', { name: /focus/i });
    const trinity = screen.getByRole('button', { name: /trinity/i });

    expect(focus.getAttribute('aria-pressed')).toBe('true');
    expect(trinity.getAttribute('aria-pressed')).toBe('false');

    await user.click(trinity);
    expect(trinity.getAttribute('aria-pressed')).toBe('true');
    expect(onStartReading).not.toHaveBeenCalled();

    const reveal = screen.getByRole('button', { name: /reveal/i });
    await user.click(reveal);
    expect(screen.getByRole('alert').textContent).toMatch(/question/i);
    expect(onStartReading).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/the question/i), '  What needs attention?  ');
    await user.click(reveal);

    expect(onStartReading).toHaveBeenCalledWith({
      question: 'What needs attention?',
      intention: 'General',
      spreadId: 'three-card',
    });
  });
});
