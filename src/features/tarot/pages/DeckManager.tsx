'use client';

import React, { useState } from 'react';
import { ArrowLeft, Check, Info, Link, Plus, X } from '../icons';
import TarotShell from '../components/TarotShell';
import { DEFAULT_DECK } from '../constants';
import { getDecks, getSettings, saveCustomDeck, saveSettings } from '../services/storageService';
import { Card, Deck, TarotView } from '../types';

interface DeckManagerProps {
  onNavigate: (view: TarotView) => void;
}

const DeckManager: React.FC<DeckManagerProps> = ({ onNavigate }) => {
  const [decks, setDecks] = useState<Deck[]>(getDecks());
  const [activeDeckId, setActiveDeckId] = useState(getSettings().activeDeckId);

  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckBaseUrl, setNewDeckBaseUrl] = useState('');

  const handleActivate = (id: string) => {
    const settings = getSettings();
    settings.activeDeckId = id;
    saveSettings(settings);
    setActiveDeckId(id);
  };

  const handleCreateDeck = () => {
    if (!newDeckName || !newDeckBaseUrl) return;

    const newCards: Card[] = DEFAULT_DECK.cards.map((card) => {
      const filename = card.imageUrl?.split('/').pop();
      return {
        ...card,
        imageUrl: `${newDeckBaseUrl}/${filename}`,
      };
    });

    const newDeck: Deck = {
      id: `custom-${Date.now()}`,
      name: newDeckName,
      description: 'Custom imported deck.',
      cards: newCards,
      isCustom: true,
    };

    saveCustomDeck(newDeck);
    setDecks(getDecks());
    setIsCreating(false);
    setNewDeckName('');
    setNewDeckBaseUrl('');
  };

  return (
    <TarotShell>
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
        <header className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[color:var(--copper)]/18 px-3 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--gilt)]">Deck library</p>
            <h1 className="font-ritual text-4xl text-[color:var(--bone)]">Tarot decks</h1>
          </div>
        </header>

        <div className="grid gap-6">
          {decks.map((deck) => (
            <div key={deck.id} className={`relative overflow-hidden border p-6 transition-all ${activeDeckId === deck.id ? 'border-[color:var(--gilt)]/45 bg-[rgba(184,155,94,0.06)] shadow-[0_0_15px_rgba(184,155,94,0.08)]' : 'border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.68)]'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="mb-2 font-ritual text-2xl text-[color:var(--bone)]">{deck.name}</h2>
                  <p className="mb-4 text-sm text-[color:var(--mist)]">{deck.description}</p>
                  <div className="text-xs font-bold uppercase tracking-widest text-[color:var(--mist)]">{deck.cards.length} Cards</div>
                </div>
                {activeDeckId === deck.id ? (
                  <div className="flex items-center gap-1 rounded-full border border-[color:var(--gilt)] bg-[rgba(184,155,94,0.14)] px-3 py-1 text-xs font-bold text-[color:var(--bone)]">
                    <Check size={12} /> ACTIVE
                  </div>
                ) : (
                  <button onClick={() => handleActivate(deck.id)} className="rounded-full border border-[color:var(--copper)]/18 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
                    USE THIS DECK
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[color:var(--copper)]/16 pt-8">
          {!isCreating ? (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[color:var(--bone)]">Library</h3>
              <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 rounded-full border border-[color:var(--copper)]/18 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
                <Plus size={14} /> Import Deck
              </button>
            </div>
          ) : (
            <div className="space-y-4 border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.78)] p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-ritual text-2xl text-[color:var(--bone)]">Import Custom Deck</h3>
                <button onClick={() => setIsCreating(false)}>
                  <X size={20} className="text-[color:var(--mist)] hover:text-[color:var(--bone)]" />
                </button>
              </div>

              <div className="flex gap-3 border border-[color:var(--gilt)]/12 bg-[rgba(184,155,94,0.06)] p-4 text-xs text-[color:var(--mist)]">
                <Info className="flex-shrink-0" size={16} />
                <div>
                  <p className="font-bold mb-1">Power User Tip:</p>
                  <p className="mb-2">To use external decks like <strong>Sola Busca</strong> or <strong>Etteilla</strong>:</p>
                  <ol className="list-decimal list-inside space-y-1 opacity-80">
                    <li>Host the images online (e.g., GitHub Pages, S3).</li>
                    <li>Ensure filenames match the standard format (e.g., <code>ar00.jpg</code> for Fool, <code>wa01.jpg</code> for Ace of Wands).</li>
                    <li>Paste the base URL folder below.</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-[color:var(--mist)]">Deck Name</label>
                <input
                  type="text"
                  className="w-full border border-[color:var(--copper)]/16 bg-[#050810] p-3 text-[color:#D5D0C6] outline-none transition focus:border-[color:var(--gilt)]/45"
                  value={newDeckName}
                  onChange={(event) => setNewDeckName(event.target.value)}
                  placeholder="e.g. Sola Busca Tarot"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-[color:var(--mist)]">Image Base URL</label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 text-[color:var(--mist)]/72" size={16} />
                  <input
                    type="text"
                    className="w-full border border-[color:var(--copper)]/16 bg-[#050810] p-3 pl-10 text-[color:#D5D0C6] outline-none transition focus:border-[color:var(--gilt)]/45"
                    value={newDeckBaseUrl}
                    onChange={(event) => setNewDeckBaseUrl(event.target.value)}
                    placeholder="https://your-host.com/tarot-images"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateDeck}
                className="w-full border border-[color:var(--gilt)]/45 bg-[rgba(6,11,19,0.86)] py-3 text-sm uppercase tracking-[0.28em] text-[color:var(--gilt)] transition hover:bg-[rgba(184,155,94,0.12)] hover:text-[color:var(--bone)]"
              >
                Save Deck
              </button>
            </div>
          )}

          <div className="mt-8 border border-dashed border-[color:var(--copper)]/18 p-6 text-center">
            <p className="mb-2 text-sm text-[color:var(--mist)]">Want to generate a deck with AI?</p>
            <button disabled className="border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.42)] px-4 py-2 text-xs text-[color:var(--mist)]/72 opacity-50">
              Nano Banana Integration Coming Soon
            </button>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="mt-6 w-full rounded-full border border-[color:var(--copper)]/18 px-4 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            Return to Tarot Home
          </button>
        </div>
      </div>
    </TarotShell>
  );
};

export default DeckManager;
