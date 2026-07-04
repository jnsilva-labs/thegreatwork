import { describe, expect, it } from 'vitest';
import { interpretationSchema, toInterpretation } from '../features/tarot/services/interpretationSchema';
import { coerceInterpretation } from '../features/tarot/services/interpretationHelpers';

const validPayload = {
  mirrorStatement: 'You are standing at a threshold you built yourself.',
  archetypeShadow: 'The Fool meets the Tower: appetite for beginnings shadowed by fear of collapse.',
  phase: 'nigredo' as const,
  phaseReason: 'The old structure is breaking down so its parts can be seen.',
  practicalGuidance: ['Name the fear aloud.', 'Take one small irreversible step.', 'Rest before deciding.'],
  journalPrompts: ['What am I protecting?', 'What would I do if the tower already fell?', 'Who taught me this caution?'],
  mantra: 'I begin, and the ground holds.',
};

describe('interpretationSchema', () => {
  it('accepts a valid payload', () => {
    expect(interpretationSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects an unknown phase', () => {
    expect(
      interpretationSchema.safeParse({ ...validPayload, phase: 'calcination' }).success,
    ).toBe(false);
  });

  it('rejects payloads missing required keys', () => {
    const missingMantra: Partial<typeof validPayload> = { ...validPayload };
    delete missingMantra.mantra;
    expect(interpretationSchema.safeParse(missingMantra).success).toBe(false);
  });

  it('rejects fewer than three guidance items', () => {
    expect(
      interpretationSchema.safeParse({ ...validPayload, practicalGuidance: ['only one'] }).success,
    ).toBe(false);
  });
});

describe('toInterpretation', () => {
  it('carries the canonical phase and builds legacy prose', () => {
    const interpretation = toInterpretation(validPayload);
    expect(interpretation.phase).toBe('nigredo');
    expect(interpretation.phaseReason).toBe(validPayload.phaseReason);
    expect(interpretation.alchemicalPhase).toContain('Nigredo');
    expect(interpretation.alchemicalPhase).toContain(validPayload.phaseReason);
  });

  it('slices long arrays to three items', () => {
    const interpretation = toInterpretation({
      ...validPayload,
      practicalGuidance: ['a', 'b', 'c', 'd', 'e'],
    });
    expect(interpretation.practicalGuidance).toHaveLength(3);
  });
});

describe('coerceInterpretation', () => {
  it('backfills defaults for missing fields', () => {
    const coerced = coerceInterpretation({});
    expect(coerced.mirrorStatement).toBeTruthy();
    expect(coerced.practicalGuidance).toHaveLength(3);
    expect(coerced.journalPrompts).toHaveLength(3);
    expect(coerced.mantra).toBeTruthy();
    expect(coerced.phase).toBeUndefined();
  });

  it('adopts canonical phase fields from BYOK responses', () => {
    const coerced = coerceInterpretation({ phase: 'albedo', phaseReason: 'Clarity is rinsing the ash.' });
    expect(coerced.phase).toBe('albedo');
    expect(coerced.alchemicalPhase).toContain('Albedo');
    expect(coerced.alchemicalPhase).toContain('Clarity is rinsing the ash.');
  });

  it('ignores invalid phase values', () => {
    const coerced = coerceInterpretation({ phase: 'separatio' });
    expect(coerced.phase).toBeUndefined();
  });

  it('keeps legacy prose when present', () => {
    const coerced = coerceInterpretation({ alchemicalPhase: 'You are in Calcination.' });
    expect(coerced.alchemicalPhase).toBe('You are in Calcination.');
  });
});
