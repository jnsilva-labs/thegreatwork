import { describe, expect, it } from 'vitest';
import { TAROT_QUESTION_REQUIRED_MESSAGE, normalizeTarotQuestion } from '@/lib/tarot/question';

describe('tarot question normalization', () => {
  it('trims a meaningful question', () => {
    expect(normalizeTarotQuestion('  What deserves my attention?  ')).toBe('What deserves my attention?');
  });

  it('rejects blank questions with the shared required-message constant', () => {
    expect(normalizeTarotQuestion(' \n\t ')).toBeNull();
    expect(TAROT_QUESTION_REQUIRED_MESSAGE).toBe('Ask a question before revealing the cards.');
  });
});
