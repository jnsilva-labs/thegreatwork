import { Reading, AppSettings, Deck } from '../types';
import { DEFAULT_DECK } from '../constants';

const KEYS = {
  READINGS: 'tarot_alchemy_readings',
  SETTINGS: 'tarot_alchemy_settings',
  CUSTOM_DECKS: 'tarot_alchemy_decks'
};

const hasStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const saveReading = (reading: Reading): void => {
  if (!hasStorage()) return;
  const existing = getReadings();
  const updated = [reading, ...existing];
  localStorage.setItem(KEYS.READINGS, JSON.stringify(updated));
};

export const getReadings = (): Reading[] => {
  if (!hasStorage()) return [];
  const data = localStorage.getItem(KEYS.READINGS);
  return data ? JSON.parse(data) : [];
};

export const saveSettings = (settings: AppSettings): void => {
  if (!hasStorage()) return;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  if (!hasStorage()) {
    return {
      reversalsEnabled: true,
      activeDeckId: 'classic-rw',
      apiKey: ''
    };
  }
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : { 
    reversalsEnabled: true, 
    activeDeckId: 'classic-rw',
    apiKey: '' 
  };
};

export const getDecks = (): Deck[] => {
  if (!hasStorage()) return [DEFAULT_DECK];
  const customData = localStorage.getItem(KEYS.CUSTOM_DECKS);
  const customDecks: Deck[] = customData ? JSON.parse(customData) : [];
  return [DEFAULT_DECK, ...customDecks];
};

export const saveCustomDeck = (deck: Deck): void => {
  if (!hasStorage()) return;
  const customData = localStorage.getItem(KEYS.CUSTOM_DECKS);
  const customDecks: Deck[] = customData ? JSON.parse(customData) : [];
  // Update if exists, else add
  const index = customDecks.findIndex(d => d.id === deck.id);
  if (index >= 0) {
    customDecks[index] = deck;
  } else {
    customDecks.push(deck);
  }
  localStorage.setItem(KEYS.CUSTOM_DECKS, JSON.stringify(customDecks));
};
