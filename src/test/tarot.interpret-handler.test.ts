import { createHash } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInterpretHandler, SHARED_TAROT_BURST_LIMIT } from '@/app/api/tarot/interpret/handler';
import { createBurstLimiter } from '@/lib/usage/burstLimit';
import { serializeDailyUsage, type DailyUsage } from '@/lib/usage/dailyUsage';

const SECRET = 'tarot-handler-test-secret';
const NOW = new Date('2030-04-05T12:00:00.000Z');
const originalSecret = process.env.DAILY_USAGE_COOKIE_SECRET;

const payload = {
  question: 'What deserves my attention?',
  intention: 'Clarity',
  spreadId: 'one-card',
  cards: [{ id: 'm0', reversed: false, position: 1 }],
};

const interpretation = {
  mirrorStatement: 'A beginning is asking for courage.',
  archetypeShadow: 'Avoiding the leap.',
  alchemicalPhase: 'Nigredo',
  practicalGuidance: ['Take one small step.'],
  journalPrompts: ['What would trust look like?'],
  mantra: 'I begin with attention.',
};

const dailyUsage = (tarotUsed: number): DailyUsage => ({
  v: 1,
  id: 'c447fccb-2ac5-4e5c-b156-55b6cbc2ba81',
  day: '2030-04-05',
  tarotUsed,
  natalUsed: 0,
});

const createRequest = (headers?: HeadersInit) =>
  new Request('https://example.test/api/tarot/interpret', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });

const createHandler = (generate = vi.fn().mockResolvedValue(interpretation)) => ({
  generate,
  handler: createInterpretHandler({
    generate,
    now: () => NOW,
    burstLimiter: createBurstLimiter({ windowMs: 60_000, maxAttempts: 2, maxEntries: 20 }),
  }),
});

beforeEach(() => {
  process.env.DAILY_USAGE_COOKIE_SECRET = SECRET;
});

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.DAILY_USAGE_COOKIE_SECRET;
  } else {
    process.env.DAILY_USAGE_COOKIE_SECRET = originalSecret;
  }
});

describe('tarot interpretation handler', () => {
  it('uses the reviewed two-attempt production burst policy', () => {
    expect(SHARED_TAROT_BURST_LIMIT.maxAttempts).toBe(2);
  });

  it('generates only from reconstructed canonical card data and signs usage on success', async () => {
    const { generate, handler } = createHandler();

    const response = await handler(createRequest({ 'x-forwarded-for': '198.51.100.1' }));

    expect(response.status).toBe(200);
    expect(generate).toHaveBeenCalledWith(
      expect.objectContaining({
        spread: expect.objectContaining({ id: 'one-card', name: 'The Focal Point' }),
        cards: [expect.objectContaining({ id: 'm0', name: 'The Fool', isReversed: false, positionId: 1 })],
      }),
    );
    expect(response.headers.get('set-cookie')).toMatch(
      /ap_daily_usage=.*; Path=\/; Expires=Sat, 06 Apr 2030 00:00:00 GMT; Secure; HttpOnly; SameSite=lax/,
    );
  });

  it('does not set a cookie when validation fails', async () => {
    const { handler } = createHandler();
    const request = new Request('https://example.test/api/tarot/interpret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, cards: [{ ...payload.cards[0], name: 'untrusted' }] }),
    });

    const response = await handler(request);

    expect(response.status).toBe(400);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('rejects a blank question before quota and burst reservations', async () => {
    const reserve = vi.fn(() => ({ allowed: true, retryAfter: 0, release: vi.fn() }));
    const generate = vi.fn().mockResolvedValue(interpretation);
    const handler = createInterpretHandler({ generate, now: () => NOW, burstLimiter: { reserve } });
    const request = new Request('https://example.test/api/tarot/interpret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, question: ' \n\t ' }),
    });

    const response = await handler(request);

    expect(response.status).toBe(400);
    expect(generate).not.toHaveBeenCalled();
    expect(reserve).not.toHaveBeenCalled();
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('returns the BYOK-eligible quota code once the daily tarot allowance is exhausted', async () => {
    const { generate, handler } = createHandler();
    const cookie = serializeDailyUsage(dailyUsage(10), NOW).value;

    const response = await handler(createRequest({ cookie: `ap_daily_usage=${cookie}` }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      code: 'SHARED_QUOTA_EXCEEDED',
      error: 'Your 10 shared Tarot readings for today are complete. Return tomorrow or add a personal Gemini key in Settings.',
    });
    expect(generate).not.toHaveBeenCalled();
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('returns a generic 503 without a quota secret', async () => {
    delete process.env.DAILY_USAGE_COOKIE_SECRET;
    const { generate, handler } = createHandler();

    const response = await handler(createRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      code: 'SHARED_SERVICE_UNAVAILABLE',
      error: 'The shared reading service is temporarily unavailable.',
    });
    expect(generate).not.toHaveBeenCalled();
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('applies the injected burst limiter before generation', async () => {
    const generate = vi.fn().mockResolvedValue(interpretation);
    const handler = createInterpretHandler({
      generate,
      now: () => NOW,
      burstLimiter: createBurstLimiter({ windowMs: 60_000, maxAttempts: 1, maxEntries: 20 }),
    });

    await handler(createRequest({ 'x-forwarded-for': '198.51.100.2' }));
    const response = await handler(createRequest({ 'x-forwarded-for': '198.51.100.2' }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({ code: 'SHARED_RATE_LIMITED' });
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('prefers a signed usage id over the forwarded IP for burst reservations', async () => {
    const reserve = vi.fn(() => ({ allowed: true, retryAfter: 0, release: vi.fn() }));
    const handler = createInterpretHandler({
      generate: vi.fn().mockResolvedValue(interpretation),
      now: () => NOW,
      burstLimiter: { reserve },
    });
    const cookie = serializeDailyUsage(dailyUsage(0), NOW).value;

    await handler(createRequest({ cookie: `ap_daily_usage=${cookie}`, 'x-forwarded-for': '198.51.100.9' }));

    expect(reserve).toHaveBeenCalledWith(dailyUsage(0).id, NOW);
  });

  it('uses a stable day-scoped hash of the first forwarded IP before a signed cookie exists', async () => {
    const reserve = vi.fn(() => ({ allowed: true, retryAfter: 0, release: vi.fn() }));
    const handler = createInterpretHandler({
      generate: vi.fn().mockResolvedValue(interpretation),
      now: () => NOW,
      burstLimiter: { reserve },
    });

    await handler(createRequest({ 'x-forwarded-for': '198.51.100.10, 203.0.113.20' }));

    const expectedKey = createHash('sha256').update('198.51.100.10:2030-04-05').digest('base64url');
    expect(reserve).toHaveBeenCalledWith(expectedKey, NOW);
  });
});
