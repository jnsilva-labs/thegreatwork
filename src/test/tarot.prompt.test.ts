import { describe, expect, it } from 'vitest';
import { buildPrompt } from '../features/tarot/services/interpretationHelpers';
import { DrawnCard, SpreadDefinition } from '../features/tarot/types';

const spread: SpreadDefinition = {
  id: 'one-card',
  name: 'One Card',
  description: 'A single focus card',
  positions: [{ id: 1, name: 'Essence', description: 'The core energy' }],
} as unknown as SpreadDefinition;

const card: DrawnCard = {
  id: 'major-0',
  name: 'The Fool',
  keywords: ['beginnings', 'trust'],
  meaningUpright: 'New beginnings',
  meaningReversed: 'Recklessness',
  isReversed: true,
  positionId: 1,
} as unknown as DrawnCard;

describe('buildPrompt', () => {
  it('includes the question, position, reversal state, and keywords', () => {
    const prompt = buildPrompt({
      question: 'What is unfolding?',
      intention: 'Clarity',
      spread,
      cards: [card],
    });

    expect(prompt).toContain('What is unfolding?');
    expect(prompt).toContain('Essence');
    expect(prompt).toContain('Reversed');
    expect(prompt).toContain('Recklessness');
    expect(prompt).toContain('beginnings');
  });
});
