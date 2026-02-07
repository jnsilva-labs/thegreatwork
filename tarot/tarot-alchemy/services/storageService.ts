import { Reading, AppSettings, Deck } from '../types';
import { DEFAULT_DECK } from '../constants';

const KEYS = {
  READINGS: 'tarot_alchemy_readings',
  SETTINGS: 'tarot_alchemy_settings',
  CUSTOM_DECKS: 'tarot_alchemy_decks'
};

export const saveReading = (reading: Reading): void => {
  const existing = getReadings();
  const updated = [reading, ...existing];
  localStorage.setItem(KEYS.READINGS, JSON.stringify(updated));
};

export const getReadings = (): Reading[] => {
  const data = localStorage.getItem(KEYS.READINGS);
  return data ? JSON.parse(data) : [];
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : { 
    reversalsEnabled: true, 
    activeDeckId: 'classic-rw',
    apiKey: '' 
  };
};

export const getDecks = (): Deck[] => {
  const customData = localStorage.getItem(KEYS.CUSTOM_DECKS);
  const customDecks: Deck[] = customData ? JSON.parse(customData) : [];
  return [DEFAULT_DECK, ...customDecks];
};

export const saveCustomDeck = (deck: Deck): void => {
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