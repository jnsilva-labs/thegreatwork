import { describe, expect, it } from 'vitest';
import { isMotionOk } from '../components/motion/useMotionPreference';

describe('isMotionOk', () => {
  it('allows motion only when nothing blocks it', () => {
    expect(isMotionOk(false, false, 'high')).toBe(true);
    expect(isMotionOk(false, false, 'medium')).toBe(true);
  });

  it('blocks motion when prefers-reduced-motion is set', () => {
    expect(isMotionOk(true, false, 'high')).toBe(false);
  });

  it('blocks motion when stillness mode is on', () => {
    expect(isMotionOk(false, true, 'high')).toBe(false);
  });

  it('blocks motion on the low quality tier', () => {
    expect(isMotionOk(false, false, 'low')).toBe(false);
  });

  it('blocks motion when multiple signals combine', () => {
    expect(isMotionOk(true, true, 'low')).toBe(false);
  });
});
