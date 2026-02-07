export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';

export interface Card {
  id: string;
  name: string;
  number: number;
  suit: Suit;
  arcana: 'major' | 'minor';
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  shadow: string; // The shadow aspect/blocked energy
  gift: string; // The medicine/wisdom
  imageUrl?: string;
  element?: string;
}

export type SpreadType = 'one-card' | 'three-card' | 'celtic-cross';
export type TarotView = 'home' | 'reading' | 'journal' | 'decks' | 'settings';

export interface ReadingRequest {
  question: string;
  intention: string;
  spreadId: SpreadType;
}

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
}

export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export interface DrawnCard extends Card {
  isReversed: boolean;
  positionId: number; // Matches SpreadPosition.id
}

export interface Interpretation {
  mirrorStatement: string;
  archetypeShadow: string;
  alchemicalPhase: string;
  practicalGuidance: string[];
  journalPrompts: string[];
  mantra: string;
}

export interface Reading {
  id: string;
  date: number; // Timestamp
  question: string;
  intention: string;
  spreadId: SpreadType;
  cards: DrawnCard[];
  interpretation?: Interpretation;
  tags?: string[];
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  isCustom: boolean;
}

export interface AppSettings {
  reversalsEnabled: boolean;
  activeDeckId: string;
  apiKey?: string; // New field for BYOK
}

export const INTENTIONS = [
  'General', 'Love', 'Career', 'Creativity', 'Money', 
  'Healing', 'Spiritual Path', 'Relationships', 'Decision', 'Shadow Work'
];
