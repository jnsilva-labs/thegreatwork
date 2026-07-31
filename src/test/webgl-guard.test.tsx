import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebGLGuard } from '@/components/ui/WebGLGuard';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('WebGLGuard', () => {
  it('keeps the static fallback mounted until WebGL support is confirmed', () => {
    let frame: FrameRequestCallback | null = null;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as GPUCanvasContext,
    );

    render(
      <WebGLGuard fallback={<div>Static engraving</div>}>
        <div>Living canvas</div>
      </WebGLGuard>,
    );

    expect(screen.getByText('Static engraving')).toBeTruthy();
    expect(screen.queryByText('Living canvas')).toBeNull();

    act(() => frame?.(0));
    expect(screen.getByText('Living canvas')).toBeTruthy();
  });
});
