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

  it('rejects visually blank format characters', () => {
    expect(normalizeTarotQuestion('\u200B')).toBeNull();
  });

  it.each([
    ['U+115F', '\u115F'],
    ['U+1160', '\u1160'],
    ['U+3164', '\u3164'],
    ['U+FFA0', '\uFFA0'],
  ])('rejects invisible Hangul filler %s', (_codePoint, filler) => {
    expect(normalizeTarotQuestion(filler)).toBeNull();
  });

  it('accepts visible Hangul content', () => {
    expect(normalizeTarotQuestion('  무엇을 알아야 할까요?  ')).toBe('무엇을 알아야 할까요?');
  });
});
