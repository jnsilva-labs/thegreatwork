export const TAROT_QUESTION_REQUIRED_MESSAGE = 'Ask a question before revealing the cards.';

export const normalizeTarotQuestion = (value: string): string | null => {
  const question = value.trim();
  return /[\p{L}\p{N}\p{P}\p{S}]/u.test(question) ? question : null;
};
