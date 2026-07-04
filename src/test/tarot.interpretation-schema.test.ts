import { describe, expect, it } from 'vitest';
import { interpretationSchema } from '../features/tarot/services/interpretationSchema';
import { coerceInterpretation } from '../features/tarot/services/interpretationHelpers';

const validPayload = {
  mirrorStatement: 'You are standing at a threshold you built yourself.',
  archetypeShadow: 'The Fool meets the Tower: appetite for beginnings shadowed by fear of collapse.',
  alchemicalPhase: 'Calcinatio. The old form burns so the essence can be seen.',
  practicalGuidance: ['Name the fear aloud.', 'Take one small irreversible step.', 'Rest before deciding.'],
  journalPrompts: ['What am I protecting?', 'What would I do if the tower already fell?', 'Who taught me this caution?'],
  mantra: 'I begin, and the ground holds.',
};

describe('interpretationSchema', () => {
  it('accepts a valid payload', () => {
    const result = interpretationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects payloads missing required keys', () => {
    const missingMantra: Partial<typeof validPayload> = { ...validPayload };
    delete missingMantra.mantra;
    expect(interpretationSchema.safeParse(missingMantra).success).toBe(false);
  });

  it('rejects wrong types', () => {
    expect(
      interpretationSchema.safeParse({ ...validPayload, practicalGuidance: 'do the thing' }).success,
    ).toBe(false);
  });

  it('rejects fewer than three guidance items', () => {
    expect(
      interpretationSchema.safeParse({ ...validPayload, practicalGuidance: ['only one'] }).success,
    ).toBe(false);
  });
});

describe('coerceInterpretation', () => {
  it('backfills defaults for missing fields', () => {
    const coerced = coerceInterpretation({});
    expect(coerced.mirrorStatement).toBeTruthy();
    expect(coerced.practicalGuidance).toHaveLength(3);
    expect(coerced.journalPrompts).toHaveLength(3);
    expect(coerced.mantra).toBeTruthy();
  });

  it('slices arrays to three items', () => {
    const coerced = coerceInterpretation({
      ...validPayload,
      practicalGuidance: ['a', 'b', 'c', 'd', 'e'],
    });
    expect(coerced.practicalGuidance).toHaveLength(3);
  });

  it('passes through a fully valid payload', () => {
    const coerced = coerceInterpretation(validPayload);
    expect(coerced.mirrorStatement).toBe(validPayload.mirrorStatement);
    expect(coerced.mantra).toBe(validPayload.mantra);
  });
});
