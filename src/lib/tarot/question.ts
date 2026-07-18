export const TAROT_QUESTION_REQUIRED_MESSAGE = 'Ask a question before revealing the cards.';

export const normalizeTarotQuestion = (value: string): string | null => {
  const question = value.trim();
  const visibleQuestion = question.replace(/[\u115F\u1160\u3164\uFFA0]/gu, '');
  return /[\p{L}\p{N}\p{P}\p{S}]/u.test(visibleQuestion) ? question : null;
};
