import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, Link, X, Info } from 'lucide-react';
import { DEFAULT_DECK } from '../constants';
import { getDecks, saveCustomDeck, saveSettings, getSettings } from '../services/storageService';
import { Deck, Card } from '../types';

const DeckManager: React.FC = () => {
  const navigate = useNavigate();
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

    // Clone the default deck structure but replace images with the new base URL
    const newCards: Card[] = DEFAULT_DECK.cards.map(c => {
        // Extract filename from default RWS url to preserve mapping
        const filename = c.imageUrl?.split('/').pop(); 
        return {
            ...c,
            imageUrl: `${newDeckBaseUrl}/${filename}`
        };
    });

    const newDeck: Deck = {
        id: `custom-${Date.now()}`,
        name: newDeckName,
        description: 'Custom imported deck.',
        cards: newCards,
        isCustom: true
    };

    saveCustomDeck(newDeck);
    setDecks(getDecks());
    setIsCreating(false);
    setNewDeckName('');
    setNewDeckBaseUrl('');
  };

  return (
    <div className="min-h-screen bg-mystic-950 text-slate-200 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-mystic-900 rounded-full hover:bg-mystic-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-serif text-white">Deck Manager</h1>
        </header>

        <div className="grid gap-6">
            {decks.map(deck => (
                <div key={deck.id} className={`bg-mystic-900/50 border rounded-xl p-6 relative overflow-hidden transition-all ${activeDeckId === deck.id ? 'border-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-mystic-800'}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-serif text-white mb-2">{deck.name}</h2>
                            <p className="text-slate-400 text-sm mb-4">{deck.description}</p>
                            <div className="text-xs text-slate-600 font-bold uppercase tracking-widest">{deck.cards.length} Cards</div>
                        </div>
                        {activeDeckId === deck.id ? (
                             <div className="px-3 py-1 bg-mystic-gold text-mystic-950 text-xs font-bold rounded flex items-center gap-1">
                                <Check size={12} /> ACTIVE
                             </div>
                        ) : (
                            <button onClick={() => handleActivate(deck.id)} className="px-4 py-2 bg-mystic-800 hover:bg-mystic-700 text-slate-300 text-xs font-bold rounded transition-colors">
                                USE THIS DECK
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div className="border-t border-mystic-800 pt-8">
            {!isCreating ? (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-300">Library</h3>
                    <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 text-xs bg-mystic-800 hover:bg-mystic-700 px-4 py-2 rounded-lg transition-colors text-white">
                        <Plus size={14} /> Import Deck
                    </button>
                </div>
            ) : (
                <div className="bg-mystic-900 border border-mystic-700 rounded-xl p-6 space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-serif text-white">Import Custom Deck</h3>
                         <button onClick={() => setIsCreating(false)}><X size={20} className="text-slate-500 hover:text-white" /></button>
                    </div>
                    
                    <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded text-xs text-indigo-200 flex gap-3">
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
                        <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Deck Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-mystic-950 border border-mystic-800 rounded p-3 text-white focus:border-mystic-gold/50 outline-none" 
                            value={newDeckName}
                            onChange={e => setNewDeckName(e.target.value)}
                            placeholder="e.g. Sola Busca Tarot"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Image Base URL</label>
                        <div className="relative">
                            <Link className="absolute left-3 top-3 text-slate-600" size={16} />
                            <input 
                                type="text" 
                                className="w-full bg-mystic-950 border border-mystic-800 rounded p-3 pl-10 text-white focus:border-mystic-gold/50 outline-none" 
                                value={newDeckBaseUrl}
                                onChange={e => setNewDeckBaseUrl(e.target.value)}
                                placeholder="https://your-host.com/tarot-images"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCreateDeck}
                        className="w-full py-3 bg-mystic-gold text-mystic-950 font-bold rounded hover:bg-yellow-600 transition-colors"
                    >
                        Save Deck
                    </button>
                </div>
            )}
            
            <div className="mt-8 p-6 bg-mystic-900/30 border border-dashed border-mystic-800 rounded-xl text-center">
                <p className="text-slate-500 text-sm mb-2">Want to generate a deck with AI?</p>
                <button disabled className="opacity-50 text-xs px-4 py-2 bg-indigo-900/50 rounded text-indigo-200 border border-indigo-500/30">Nano Banana Integration Coming Soon</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeckManager;