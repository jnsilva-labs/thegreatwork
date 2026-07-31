import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { ScrollOrchestrator } from '@/components/ui/ScrollOrchestrator';

const motionState = vi.hoisted(() => ({ motionOk: true }));

vi.mock('@/components/motion/useMotionPreference', () => ({
  useMotionPreference: () => ({ motionOk: motionState.motionOk }),
}));

describe('motion lifecycle cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    motionState.motionOk = true;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, '', '/');
  });

  it('does not restore a stale magnetic offset when motion is re-enabled', () => {
    const view = render(
      <MagneticLink href="/study" location="test" label="Study">Study</MagneticLink>,
    );
    let link = screen.getByRole('link', { name: 'Study' });
    vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 40,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.mouseMove(link, { clientX: 100, clientY: 40 });
    expect(link.style.transform).not.toBe('');

    motionState.motionOk = false;
    view.rerender(<MagneticLink href="/study" location="test" label="Study">Study</MagneticLink>);
    link = screen.getByRole('link', { name: 'Study' });
    expect(link.style.transform).toBe('');

    motionState.motionOk = true;
    view.rerender(<MagneticLink href="/study" location="test" label="Study">Study</MagneticLink>);
    link = screen.getByRole('link', { name: 'Study' });
    expect(link.style.transform).toBe('translate3d(0px, 0px, 0)');
  });

  it('cancels a pending initial-hash scroll when the orchestrator unmounts', () => {
    motionState.motionOk = false;
    window.history.replaceState(null, '', '/#chapter');
    const chapter = document.createElement('section');
    chapter.id = 'chapter';
    chapter.scrollIntoView = vi.fn();
    document.body.appendChild(chapter);

    const view = render(<ScrollOrchestrator slugs={['chapter']} />);
    view.unmount();
    act(() => vi.advanceTimersByTime(50));

    expect(chapter.scrollIntoView).not.toHaveBeenCalled();
    chapter.remove();
  });
});
