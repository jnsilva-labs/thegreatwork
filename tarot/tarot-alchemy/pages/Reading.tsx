import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SPREADS, DEFAULT_DECK } from '../constants';
import { DrawnCard, Reading as ReadingType, SpreadType } from '../types';
import { getSettings, getDecks, saveReading } from '../services/storageService';
import { generateInterpretation } from '../services/geminiService';
import SpreadLayout from '../components/SpreadLayout';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Save, Sparkles, X, Share2, Eye, Key, AlertTriangle } from 'lucide-react';

const Reading: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { question, intention, spreadId } = location.state as { question: string, intention: string, spreadId: SpreadType } || {};
  
  const [stage, setStage] = useState<'shuffling' | 'drawing' | 'interpreting' | 'complete'>('shuffling');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const spread = SPREADS[spreadId || 'one-card'];
  const settings = getSettings();
  
  useEffect(() => {
    if (!spreadId) navigate('/');
  }, [spreadId, navigate]);

  useEffect(() => {
    if (stage === 'shuffling') {
      const timer = setTimeout(() => {
        const decks = getDecks();
        const activeDeck = decks.find(d => d.id === settings.activeDeckId) || DEFAULT_DECK;
        const deckCards = [...activeDeck.cards];
        
        for (let i = deckCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deckCards[i], deckCards[j]] = [deckCards[j], deckCards[i]];
        }

        const cardsNeeded = spread.positions.length;
        const drawn: DrawnCard[] = deckCards.slice(0, cardsNeeded).map((c, idx) => ({
          ...c,
          isReversed: settings.reversalsEnabled ? Math.random() > 0.5 : false,
          positionId: spread.positions[idx].id
        }));

        setDrawnCards(drawn);
        setStage('drawing');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [stage, settings, spread]);

  const handleCardClick = (card: DrawnCard) => {
    setSelectedCardId(card.id);
  };

  const handlePrevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = drawnCards.findIndex(c => c.id === selectedCardId);
    if (currentIndex > 0) {
      setSelectedCardId(drawnCards[currentIndex - 1].id);
    }
  };

  const handleNextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = drawnCards.findIndex(c => c.id === selectedCardId);
    if (currentIndex < drawnCards.length - 1) {
      setSelectedCardId(drawnCards[currentIndex + 1].id);
    }
  };

  const triggerInterpretation = async () => {
    setIsLoadingAI(true);
    setApiError(null);
    setApiKeyMissing(false);
    
    // Safely retrieve API Key: Priority 1: User Settings, Priority 2: Env Var (if available)
    let envKey = '';
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        envKey = process.env.API_KEY;
      }
    } catch (e) {
      // Ignore process is not defined errors in static builds
    }

    const apiKey = settings.apiKey || envKey; 
    
    if (!apiKey) {
      setApiKeyMissing(true);
      setIsLoadingAI(false);
      return;
    }

    try {
      const result = await generateInterpretation({
        question,
        intention,
        spread,
        cards: drawnCards,
        apiKey
      });
      setInterpretation(result);
      setStage('complete');
      
      const newReading: ReadingType = {
        id: crypto.randomUUID(),
        date: Date.now(),
        question,
        intention,
        spreadId,
        cards: drawnCards,
        interpretation: result
      };
      saveReading(newReading);

    } catch (e: any) {
      console.error(e);
      let msg = "The Spirits are quiet. Please try again.";
      
      // Heuristic check for rate limits or auth errors
      if (e.message?.includes('429') || e.toString().includes('429')) {
        msg = "The shared energy source is currently overloaded.";
      } else if (e.message?.includes('403') || e.message?.includes('401')) {
        msg = "Authentication failed. The key may be invalid.";
      } else if (e.message?.includes('API key not valid')) {
        msg = "The API Key provided is invalid.";
      }
      
      setApiError(msg);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const selectedCard = drawnCards.find(c => c.id === selectedCardId);
  const activePosition = selectedCard ? spread.positions.find(p => p.id === selectedCard.positionId) : null;

  if (!spread) return null;

  return (
    <div className="min-h-screen bg-void-950 text-slate-300 flex flex-col relative font-sans overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-sacred-geo opacity-[0.05] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center bg-void-950/90 backdrop-blur z-50 sticky top-0 border-b border-void-800">
        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-alchemy-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
          <ArrowLeft size={14} /> Return
        </button>
        <div className="flex flex-col items-center">
            <span className="font-headers text-slate-200 text-lg">{spread.name}</span>
            <span className="text-[10px] text-alchemy-gold uppercase tracking-widest opacity-70">Awareness Session</span>
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 flex flex-col items-center relative">
        
        {stage === 'shuffling' && (
          <div className="flex-1 flex flex-col justify-center items-center gap-8 animate-pulse-slow">
            <div className="relative">
                <div className="absolute inset-0 border border-alchemy-gold/30 rounded-full animate-spin-slow"></div>
                <div className="w-40 h-60 bg-void-900 border border-void-700 rounded-sm flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-sacred-geo opacity-10"></div>
                    <Sparkles className="text-alchemy-gold animate-bounce" size={24} />
                </div>
            </div>
            <p className="text-alchemy-gold font-headers text-xl tracking-widest">Integrating Shadows...</p>
          </div>
        )}

        {stage !== 'shuffling' && (
          <>
            <div className="w-full max-w-7xl mb-16 mt-8">
              <SpreadLayout 
                type={spreadId} 
                cards={drawnCards} 
                revealedCount={drawnCards.length}
                onCardClick={handleCardClick}
              />
            </div>

            {!interpretation && !apiKeyMissing && !apiError && (
              <div className="fixed bottom-10 z-40 animate-fade-in">
                <button 
                  onClick={triggerInterpretation}
                  disabled={isLoadingAI}
                  className="bg-void-900 border border-alchemy-gold/50 text-alchemy-gold hover:bg-alchemy-gold hover:text-void-950 font-headers text-lg py-4 px-12 rounded-sm flex items-center gap-4 transition-all shadow-[0_0_20px_rgba(197,160,89,0.1)] disabled:opacity-50 tracking-widest uppercase"
                >
                  {isLoadingAI ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
                  {isLoadingAI ? 'Channeling...' : 'Reveal Guidance'}
                </button>
              </div>
            )}

            {(apiKeyMissing || apiError) && (
                <div className="fixed bottom-10 z-40 animate-fade-in bg-void-900 border border-alchemy-red/50 p-6 rounded-sm shadow-xl flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="text-alchemy-red"><AlertTriangle size={32} /></div>
                    <h3 className="text-white font-serif text-xl">
                      {apiError ? "Connection Interrupted" : "No Voice Found"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {apiError 
                        ? `${apiError} Ensure stability by adding your own Personal Key.` 
                        : "No shared key detected. Please add your own Gemini API key."}
                    </p>
                    <button 
                        onClick={() => navigate('/settings')}
                        className="bg-alchemy-gold text-void-950 px-6 py-2 rounded font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                    >
                        Enter Personal Key
                    </button>
                    <button onClick={() => { setApiKeyMissing(false); setApiError(null); }} className="text-xs text-slate-500 underline">Dismiss</button>
                </div>
            )}

            {interpretation && (
              <div className="w-full max-w-4xl bg-void-900/95 border border-void-800 p-8 md:p-16 rounded-sm shadow-2xl animate-fade-in space-y-12 mb-20 relative">
                
                {/* Decorative borders */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-alchemy-gold/30"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-alchemy-gold/30"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-alchemy-gold/30"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-alchemy-gold/30"></div>

                <div className="text-center space-y-6">
                   <div className="inline-block p-2 border border-alchemy-gold/20 rounded-full mb-4">
                       <Sparkles size={16} className="text-alchemy-gold" />
                   </div>
                   <p className="text-2xl md:text-4xl font-serif text-slate-100 leading-snug italic">
                    "{interpretation.mirrorStatement}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-void-800 py-12">
                  <div className="space-y-4">
                    <h3 className="text-alchemy-gold text-xs uppercase tracking-[0.2em] font-bold">Archetype & Shadow</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-lg whitespace-pre-wrap">{interpretation.archetypeShadow}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-alchemy-gold text-xs uppercase tracking-[0.2em] font-bold">Alchemical Phase</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-lg whitespace-pre-wrap">{interpretation.alchemicalPhase}</p>
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-center text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Practical Integration</h3>
                   <ul className="grid gap-4">
                     {interpretation.practicalGuidance.map((g: string, i: number) => (
                       <li key={i} className="flex items-center gap-6 p-4 border border-void-800 bg-void-950/50 rounded-sm">
                         <span className="text-alchemy-gold font-headers text-2xl opacity-50">0{i+1}</span> 
                         <span className="text-slate-300 font-light">{g}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="space-y-6">
                      <h3 className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">Journal Inquiries</h3>
                      <div className="space-y-6">
                        {interpretation.journalPrompts.map((p: string, i: number) => (
                          <div key={i} className="text-slate-400 font-serif italic text-lg pl-6 border-l border-alchemy-gold/20">
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center text-center p-8 bg-void-950 border border-void-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-sacred-geo opacity-5"></div>
                      <h3 className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold mb-4 z-10">Mantra</h3>
                      <p className="text-2xl font-headers text-alchemy-gold z-10">{interpretation.mantra}</p>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <button onClick={() => navigate('/journal')} className="flex items-center gap-3 text-xs uppercase tracking-widest text-slate-500 hover:text-alchemy-gold transition-colors">
                        <Save size={14} /> Saved to Journal
                    </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-[100] bg-void-950/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedCardId(null)}>
          <div className="bg-void-900 border border-void-700 max-w-6xl w-full h-[85vh] rounded-sm overflow-hidden relative flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setSelectedCardId(null)} className="absolute top-6 right-6 z-20 p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            
            {/* Image Side */}
            <div className="md:w-1/2 h-1/2 md:h-full bg-void-950 relative flex items-center justify-center p-12 border-r border-void-800">
                <div className="absolute inset-0 bg-sacred-geo opacity-5"></div>
                <img 
                  src={selectedCard.imageUrl} 
                  className={`max-h-full max-w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm border-8 border-void-900 ${selectedCard.isReversed ? 'rotate-180' : ''}`} 
                />
                
                {/* Mobile Nav */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-12 md:hidden">
                    <button onClick={handlePrevCard} className="text-white disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === 0}>
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={handleNextCard} className="text-white disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}>
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
            
            {/* Text Side */}
            <div className="md:w-1/2 h-1/2 md:h-full overflow-y-auto p-12 bg-void-900 relative">
               <div className="space-y-10">
                 <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-alchemy-gold text-[10px] uppercase tracking-[0.2em] font-bold border border-alchemy-gold/30 px-3 py-1 rounded-full">
                            Position {activePosition?.id}
                        </span>
                        <span className="text-slate-500 text-xs uppercase tracking-widest">{activePosition?.name}</span>
                    </div>
                    
                    <h2 className="text-5xl font-headers text-slate-100 mb-4">{selectedCard.name}</h2>
                    
                    <div className="text-sm font-serif italic text-slate-400">
                        {selectedCard.isReversed ? 'Inverted Energy (Reversed)' : 'Direct Energy (Upright)'}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-slate-600 font-bold">Interpretation</h3>
                    <p className="text-slate-300 leading-relaxed text-xl font-light font-serif">
                    {selectedCard.isReversed ? selectedCard.meaningReversed : selectedCard.meaningUpright}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-12 pt-8 border-t border-void-800">
                   <div>
                     <span className="text-alchemy-gold text-[10px] uppercase tracking-widest block mb-3 font-bold">The Shadow</span>
                     <p className="text-sm text-slate-400 leading-relaxed">{selectedCard.shadow}</p>
                   </div>
                   <div>
                     <span className="text-alchemy-gold text-[10px] uppercase tracking-widest block mb-3 font-bold">The Gift</span>
                     <p className="text-sm text-slate-400 leading-relaxed">{selectedCard.gift}</p>
                   </div>
                 </div>

                 <div className="pt-6">
                     <div className="flex flex-wrap gap-3">
                       {selectedCard.keywords.map(k => (
                         <span key={k} className="px-4 py-1.5 bg-void-950 border border-void-800 text-[10px] uppercase tracking-widest text-slate-500">{k}</span>
                       ))}
                     </div>
                 </div>
               </div>
               
               {/* Desktop Navigation */}
               <div className="hidden md:flex justify-between mt-16 pt-8 border-t border-void-800">
                   <button 
                     onClick={handlePrevCard} 
                     disabled={drawnCards.indexOf(selectedCard) === 0}
                     className="flex items-center gap-3 text-slate-500 hover:text-alchemy-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                   >
                       <ChevronLeft size={14} /> Previous
                   </button>
                   <button 
                     onClick={handleNextCard} 
                     disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}
                     className="flex items-center gap-3 text-slate-500 hover:text-alchemy-gold transition-colors disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                   >
                       Next <ChevronRight size={14} />
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reading;