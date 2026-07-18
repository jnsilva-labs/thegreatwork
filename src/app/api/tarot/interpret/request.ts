import { DEFAULT_DECK, SPREADS } from '@/features/tarot/constants';
import { DrawnCard, SpreadDefinition, SpreadType } from '@/features/tarot/types';
import { normalizeTarotQuestion } from '@/lib/tarot/question';

const REQUEST_KEYS = ['question', 'intention', 'spreadId', 'cards'] as const;
const CARD_KEYS = ['id', 'reversed', 'position'] as const;
const MAX_QUESTION_LENGTH = 500;
const MAX_INTENTION_LENGTH = 80;

type MinimalCard = {
  id: string;
  reversed: boolean;
  position: number;
};

export type SharedInterpretationRequest = {
  question: string;
  intention: string;
  spread: SpreadDefinition;
  cards: DrawnCard[];
};

export class InvalidInterpretationRequest extends Error {
  constructor() {
    super('Invalid tarot interpretation request.');
    this.name = 'InvalidInterpretationRequest';
  }
}

const invalid = (): never => {
  throw new InvalidInterpretationRequest();
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasExactKeys = (value: Record<string, unknown>, expected: readonly string[]): boolean => {
  const keys = Object.keys(value);
  return keys.length === expected.length && keys.every((key) => expected.includes(key));
};

const parseMinimalCard = (value: unknown): MinimalCard => {
  if (!isRecord(value) || !hasExactKeys(value, CARD_KEYS)) {
    return invalid();
  }

  if (
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    value.id.length > 64 ||
    typeof value.reversed !== 'boolean' ||
    typeof value.position !== 'number' ||
    !Number.isSafeInteger(value.position)
  ) {
    return invalid();
  }

  return { id: value.id, reversed: value.reversed, position: value.position };
};

/**
 * Accepts only client-owned reading choices, then reconstructs all prompt
 * material from the canonical default deck and spread definitions.
 */
export function parseSharedInterpretationRequest(value: unknown): SharedInterpretationRequest {
  if (!isRecord(value) || !hasExactKeys(value, REQUEST_KEYS)) {
    return invalid();
  }

  if (
    typeof value.question !== 'string' ||
    value.question.length > MAX_QUESTION_LENGTH ||
    typeof value.intention !== 'string' ||
    value.intention.trim().length === 0 ||
    value.intention.length > MAX_INTENTION_LENGTH ||
    typeof value.spreadId !== 'string' ||
    !Array.isArray(value.cards)
  ) {
    return invalid();
  }

  const question = normalizeTarotQuestion(value.question);
  if (!question) {
    return invalid();
  }

  const spread = SPREADS[value.spreadId] as SpreadDefinition | undefined;
  if (!spread || spread.id !== value.spreadId) {
    return invalid();
  }

  if (value.cards.length !== spread.positions.length) {
    return invalid();
  }

  const cards = value.cards.map(parseMinimalCard);
  const expectedPositions = new Set(spread.positions.map(({ id }) => id));
  const providedPositions = new Set(cards.map(({ position }) => position));
  const providedCardIds = new Set(cards.map(({ id }) => id));
  if (
    providedPositions.size !== expectedPositions.size ||
    ![...expectedPositions].every((position) => providedPositions.has(position)) ||
    providedCardIds.size !== cards.length
  ) {
    return invalid();
  }

  const canonicalCards = new Map(DEFAULT_DECK.cards.map((card) => [card.id, card]));
  const reconstructedCards = cards.map(({ id, reversed, position }) => {
    const card = canonicalCards.get(id);
    if (!card) {
      return invalid();
    }

    return { ...card, isReversed: reversed, positionId: position };
  });

  return {
    question,
    intention: value.intention.trim(),
    spread: spread as SpreadDefinition & { id: SpreadType },
    cards: reconstructedCards,
  };
}
