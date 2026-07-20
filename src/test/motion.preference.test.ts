import { describe, expect, it } from 'vitest';
import { isMotionOk } from '../components/motion/useMotionPreference';

describe('isMotionOk', () => {
  it('allows motion only when nothing blocks it', () => {
    expect(isMotionOk(false, false, false)).toBe(true);
  });

  it('blocks motion when prefers-reduced-motion is set', () => {
    expect(isMotionOk(true, false, false)).toBe(false);
  });

  it('blocks motion when stillness mode is on', () => {
    expect(isMotionOk(false, true, false)).toBe(false);
  });

  it('blocks motion on genuinely low-power devices', () => {
    expect(isMotionOk(false, false, true)).toBe(false);
  });

  it('blocks motion when multiple signals combine', () => {
    expect(isMotionOk(true, true, true)).toBe(false);
  });

  it.each([
    [false, false, false, true],
    [true, false, false, false],
    [false, true, false, false],
    [false, false, true, false],
    [true, true, false, false],
    [true, false, true, false],
    [false, true, true, false],
    [true, true, true, false],
  ])('preserves the complete motion truth table for %s/%s/%s', (reduced, stillness, lowPower, expected) => {
    expect(isMotionOk(reduced, stillness, lowPower)).toBe(expected);
  });
});
