import { afterEach, describe, expect, it, vi } from 'vitest';
import { APICallError } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import {
  ReadingConfigError,
  ReadingTimeoutError,
  ReadingUpstreamError,
  enforceCanonicalMentions,
  requestNatalReading,
  sanitizeStyle,
} from '../lib/anthropic/astroReading';
import type { AstroChart } from '../lib/astro/types';
import type { CanonicalBigThree } from '../lib/astro/derive';

const canonicalBigThree: CanonicalBigThree = {
  sun: 'Leo',
  moon: 'Pisces',
  rising: 'Virgo',
};

const chart = { meta: {}, points: {}, houses: null, aspects: [] } as unknown as AstroChart;

const readingFixture = {
  title: 'A reading — with drift',
  bigThree: { sun: 'Aries', moon: 'Aries', rising: 'Aries' },
  snapshot: 'Your Scorpio sun burns. This is not a small thing.',
  coreThemes: ['Theme one', 'Theme two', 'Theme three'],
  strengths: ['Strength one', 'Strength two', 'Strength three'],
  shadows: ['Shadow one', 'Shadow two', 'Shadow three'],
  relationships: 'Steady bonds.',
  careerCalling: 'Patient work.',
  growthKeys: [
    { label: 'Ground', practice: 'Walk daily — slowly.' },
    { label: 'Listen', practice: 'Keep a journal.' },
    { label: 'Rest', practice: 'Sleep early.' },
  ],
  paradox: { tension: "it's not simple.", gift: 'A quiet gift.' },
  mantra: 'I remain.',
  disclaimer: 'Reflective guidance only.',
};

function natalInput(model: MockLanguageModelV3, timeoutMs = 5000) {
  return {
    name: 'Test',
    chart,
    timeUnknown: false,
    houseSystem: 'wholeSign' as const,
    zodiac: 'tropical' as const,
    canonicalBigThree,
    placements: [],
    timeoutMs,
    model,
  };
}

function successModel(fixture: unknown) {
  return new MockLanguageModelV3({
    doGenerate: async () => ({
      finishReason: { unified: 'stop' as const, raw: 'stop' },
      usage: {
        inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 20, text: 20, reasoning: 0 },
      },
      content: [{ type: 'text' as const, text: JSON.stringify(fixture) }],
      warnings: [],
    }),
  });
}

describe('sanitizeStyle', () => {
  it('strips em dashes and banned contrast formulas', () => {
    expect(sanitizeStyle('a — b')).toBe('a , b');
    expect(sanitizeStyle("it's not fate")).toBe('It is less fate');
    expect(sanitizeStyle('This is not doom')).toBe('This is less doom');
  });
});

describe('enforceCanonicalMentions', () => {
  it('replaces drifted sign-role mentions with canonical signs', () => {
    const text = 'Your Scorpio sun and Aries moon meet a Taurus rising.';
    const result = enforceCanonicalMentions(text, canonicalBigThree, false);
    expect(result).toBe('Your Leo sun and Pisces moon meet a Virgo rising.');
  });

  it('leaves rising mentions alone when the birth time is unknown', () => {
    const text = 'A Taurus rising shapes the hour.';
    const result = enforceCanonicalMentions(text, canonicalBigThree, true);
    expect(result).toBe('A Taurus rising shapes the hour.');
  });
});

describe('requestNatalReading', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns a sanitized reading with the computed Big Three enforced', async () => {
    const reading = await requestNatalReading(natalInput(successModel(readingFixture)));

    expect(reading.bigThree).toEqual({ sun: 'Leo', moon: 'Pisces', rising: 'Virgo' });
    expect(reading.title).not.toContain('—');
    expect(reading.snapshot).toContain('Leo sun');
    expect(reading.snapshot).toContain('This is less');
    expect(reading.paradox.tension).toContain('It is less');
    expect(reading.growthKeys[0]?.practice).not.toContain('—');
  });

  it('nulls the rising sign when the birth time is unknown', async () => {
    const reading = await requestNatalReading({
      ...natalInput(successModel(readingFixture)),
      timeUnknown: true,
    });
    expect(reading.bigThree.rising).toBeNull();
  });

  it('wraps model API failures in ReadingUpstreamError', async () => {
    const failingModel = new MockLanguageModelV3({
      doGenerate: async () => {
        throw new APICallError({
          message: 'overloaded',
          url: 'https://api.anthropic.com/v1/messages',
          requestBodyValues: {},
          statusCode: 400,
        });
      },
    });

    await expect(requestNatalReading(natalInput(failingModel))).rejects.toBeInstanceOf(
      ReadingUpstreamError,
    );
  });

  it('wraps malformed model output in ReadingUpstreamError', async () => {
    await expect(
      requestNatalReading(natalInput(successModel({ nonsense: true }))),
    ).rejects.toBeInstanceOf(ReadingUpstreamError);
  });

  it('wraps deadline aborts in ReadingTimeoutError', async () => {
    const hangingModel = new MockLanguageModelV3({
      doGenerate: ({ abortSignal }) =>
        new Promise((_, reject) => {
          if (abortSignal?.aborted) {
            reject(abortSignal.reason);
            return;
          }
          abortSignal?.addEventListener('abort', () => reject(abortSignal.reason));
        }),
    });

    await expect(requestNatalReading(natalInput(hangingModel, 20))).rejects.toBeInstanceOf(
      ReadingTimeoutError,
    );
  });

  it('throws ReadingConfigError when no model is injected and the key is missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    const input = { ...natalInput(successModel(readingFixture)), model: undefined };
    await expect(requestNatalReading(input)).rejects.toBeInstanceOf(ReadingConfigError);
  });
});
