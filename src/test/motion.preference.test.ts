import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isMotionOk } from '../components/motion/useMotionPreference';
import * as motionPreference from '../components/motion/useMotionPreference';
import * as scrollOrchestrator from '../components/ui/ScrollOrchestrator';
import * as sceneShell from '../components/scene/SceneShell';

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

describe('cross-site motion resolution', () => {
  it('uses native auto scrolling whenever the shared motion predicate is blocked', () => {
    const resolveScrollBehavior = (
      scrollOrchestrator as typeof scrollOrchestrator & {
        resolveScrollBehavior?: (motionOk: boolean) => ScrollBehavior;
      }
    ).resolveScrollBehavior;

    expect(resolveScrollBehavior).toBeTypeOf('function');
    if (!resolveScrollBehavior) return;

    expect(resolveScrollBehavior(true)).toBe('smooth');
    expect(resolveScrollBehavior(false)).toBe('auto');
  });

  it('keeps motion capability independent from the WebGL quality tier', () => {
    expect(isMotionOk(false, false, false)).toBe(true);
    expect(motionPreference.isMotionOk.toString()).not.toMatch(/quality/i);
  });

  it('resolves scene atmosphere from semantic CSS variables with safe fallbacks', () => {
    const resolveSceneColors = (
      sceneShell as typeof sceneShell & {
        resolveSceneColors?: (read: (name: string) => string) => {
          background: string;
          ambient: string;
          key: string;
          fill: string;
        };
      }
    ).resolveSceneColors;

    expect(resolveSceneColors).toBeTypeOf('function');
    if (!resolveSceneColors) return;

    const values: Record<string, string> = {
      '--bg': ' #101820 ',
      '--muted': ' #c0cad4 ',
      '--accent': ' #8fb9d8 ',
      '--border': ' #355268 ',
    };
    expect(resolveSceneColors((name) => values[name] ?? '')).toEqual({
      background: '#101820',
      ambient: '#c0cad4',
      key: '#8fb9d8',
      fill: '#355268',
    });
    expect(resolveSceneColors(() => '')).toEqual({
      background: '#0b0c10',
      ambient: '#c8c1b5',
      key: '#b89b5e',
      fill: '#2b6f6a',
    });
  });

  it('routes ordinary homepage and Tarot motion through the shared preference', () => {
    const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
    const ordinaryConsumers = [
      'src/components/ui/HomepageHero.tsx',
      'src/components/ui/HeroSigil.tsx',
      'src/components/ui/MagneticLink.tsx',
      'src/features/tarot/pages/Home.tsx',
      'src/features/tarot/pages/Reading.tsx',
      'src/features/tarot/components/CardVisual.tsx',
      'src/features/tarot/components/SpreadLayout.tsx',
    ].map(read);

    for (const source of ordinaryConsumers) {
      expect(source).toContain('useMotionPreference');
      expect(source).not.toContain('usePrefersReducedMotion');
    }
  });

  it('stops nested hero, theme, and spread transitions when motion becomes blocked', () => {
    const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
    const hero = read('src/components/ui/HeroSigil.tsx');
    const homepageHero = read('src/components/ui/HomepageHero.tsx');
    const globals = read('src/app/globals.css');
    const nav = read('src/components/ui/NavBar.tsx');
    const spread = read('src/features/tarot/components/SpreadLayout.tsx');

    expect(hero).toContain('data-motion={motionOk ? "on" : "off"}');
    expect(homepageHero).toContain('data-motion={motionOk ? "on" : "off"}');
    expect(globals).toContain('[data-motion="off"] .hero-sigil__drift');
    expect(globals).toContain('.homepage-hero[data-motion="off"] .hero-intro-row');
    expect(nav).toContain('root.classList.remove("theme-transition")');
    expect(spread).not.toContain('rotate-90 transition-[transform] duration-500');
    expect(spread).not.toContain('text-left transition-[opacity] duration-500');
  });
});
