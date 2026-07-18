import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';

function IncompleteDialog({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open details</button>
      {open ? (
        <div role="dialog" aria-modal="true" aria-label="Card details">
          <button type="button" onClick={() => { setOpen(false); onClose(); }}>Close details</button>
          <button type="button">Next card</button>
        </div>
      ) : null}
    </>
  );
}

describe('focus dialog contract', () => {
  it('moves focus, traps Tab navigation, closes on Escape, and restores the trigger', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<IncompleteDialog onClose={onClose} />);

    const trigger = screen.getByRole('button', { name: /open details/i });
    await user.click(trigger);

    const close = screen.getByRole('button', { name: /close details/i });
    expect(document.activeElement).toBe(close);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /next card/i }));
    await user.tab();
    expect(document.activeElement).toBe(close);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(trigger);
  });
});
