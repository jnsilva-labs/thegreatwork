// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as sceneShell from '@/components/scene/SceneShell';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('scene theme color lifecycle', () => {
  it('reads computed semantic colors after mount and only when the selected theme changes', () => {
    type ThemeName = 'obsidian' | 'abyssal' | 'crimson';
    const useSceneColors = (
      sceneShell as typeof sceneShell & {
        useSceneColors?: (theme: ThemeName) => {
          background: string;
          ambient: string;
          key: string;
          fill: string;
        };
      }
    ).useSceneColors;

    expect(useSceneColors).toBeTypeOf('function');
    if (!useSceneColors) return;

    const values: Record<string, string> = {
      '--bg': '#101820',
      '--muted': '#c0cad4',
      '--accent': '#8fb9d8',
      '--border': '#355268',
    };
    const getComputedStyle = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => ({
        getPropertyValue: (name: string) => values[name] ?? '',
      }) as CSSStyleDeclaration);
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

    const { result, rerender } = renderHook(
      ({ theme }) => useSceneColors(theme),
      { initialProps: { theme: 'obsidian' as ThemeName } },
    );

    expect(result.current.background).toBe('#0b0c10');
    expect(getComputedStyle).not.toHaveBeenCalled();
    act(() => frames.shift()?.(0));
    expect(result.current.background).toBe('#101820');
    expect(getComputedStyle).toHaveBeenCalledTimes(1);

    rerender({ theme: 'obsidian' });
    expect(getComputedStyle).toHaveBeenCalledTimes(1);

    values['--bg'] = '#0a0f16';
    rerender({ theme: 'abyssal' });
    expect(getComputedStyle).toHaveBeenCalledTimes(1);
    act(() => frames.shift()?.(0));
    expect(result.current.background).toBe('#0a0f16');
    expect(getComputedStyle).toHaveBeenCalledTimes(2);
  });
});
