import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateInterpretation } from '@/features/tarot/services/geminiService';
import { DrawnCard, SpreadDefinition } from '@/features/tarot/types';

const spread: SpreadDefinition = {
  id: 'one-card',
  name: 'The Focal Point',
  description: 'A single point of clarity.',
  positions: [{ id: 1, name: 'The Insight', description: 'What requires attention.' }],
};

const cards: DrawnCard[] = [
  {
    id: 'm0',
    name: 'The Fool',
    number: 0,
    suit: 'major',
    arcana: 'major',
    keywords: ['beginning'],
    meaningUpright: 'Begin.',
    meaningReversed: 'Pause.',
    shadow: 'Fear.',
    gift: 'Trust.',
    isReversed: true,
    positionId: 1,
  },
];

const interpretation = {
  mirrorStatement: 'Begin.',
  archetypeShadow: 'Fear.',
  alchemicalPhase: 'Nigredo',
  practicalGuidance: ['Take one step.'],
  journalPrompts: ['What begins?'],
  mantra: 'I begin.',
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('tarot shared interpretation client', () => {
  it('sends only the minimal shared interpretation payload', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(interpretation), { status: 200 }));
    globalThis.fetch = fetch;

    await generateInterpretation({ question: 'What is beginning?', intention: 'Clarity', spread, cards });

    expect(fetch).toHaveBeenCalledWith(
      '/api/tarot/interpret',
      expect.objectContaining({
        body: JSON.stringify({
          question: 'What is beginning?',
          intention: 'Clarity',
          spreadId: 'one-card',
          cards: [{ id: 'm0', reversed: true, position: 1 }],
        }),
      }),
    );
  });

  it('requires Settings before interpreting a custom deck without a personal key', async () => {
    await expect(
      generateInterpretation({ question: '', intention: 'General', spread, cards, isCustomDeck: true }),
    ).rejects.toMatchObject({
      code: 'CUSTOM_DECK_REQUIRES_PERSONAL_KEY',
      needsPersonalKey: true,
    });
  });

  it('tells an out-of-readings visitor to return tomorrow or use BYOK', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'SHARED_QUOTA_EXCEEDED',
          error: 'Your 10 shared Tarot readings for today are complete. Return tomorrow or add a personal Gemini key in Settings.',
        }),
        { status: 429 },
      ),
    );
    globalThis.fetch = fetch;

    await expect(generateInterpretation({ question: '', intention: 'General', spread, cards })).rejects.toMatchObject({
      code: 'SHARED_QUOTA_EXCEEDED',
      needsPersonalKey: true,
      message: 'Your 10 shared Tarot readings for today are complete. Return tomorrow or add a personal Gemini key in Settings.',
    });
  });

  it('uses the personal key directly for a custom deck', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: JSON.stringify(interpretation) }] } }],
        }),
        { status: 200 },
      ),
    );
    globalThis.fetch = fetch;

    await generateInterpretation({
      question: '',
      intention: 'General',
      spread,
      cards,
      isCustomDeck: true,
      apiKey: 'personal-key',
    });

    expect(fetch.mock.calls[0][0]).toContain('generativelanguage.googleapis.com');
  });
});
