'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Eye, Loader2, Save, Sparkles, X } from '../icons';
import { DEFAULT_DECK, SPREADS } from '../constants';
import SpreadLayout from '../components/SpreadLayout';
import TarotCardFace from '../components/TarotCardFace';
import TarotShell from '../components/TarotShell';
import { generateInterpretation, TarotInterpretationError } from '../services/geminiService';
import { getDecks, getSettings, saveReading } from '../services/storageService';
import { DrawnCard, Interpretation, Reading as ReadingType, ReadingRequest, SpreadType, TarotView } from '../types';

type ReadingStage = 'shuffling' | 'drawing' | 'interpreting' | 'complete';

interface ReadingProps {
  request: ReadingRequest | null;
  onNavigate: (view: TarotView) => void;
}

const Reading: React.FC<ReadingProps> = ({ request, onNavigate }) => {
  const spreadId: SpreadType = request?.spreadId ?? 'one-card';
  const question = request?.question ?? '';
  const intention = request?.intention ?? 'General';
  const spread = SPREADS[spreadId];

  const [stage, setStage] = useState<ReadingStage>('shuffling');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!request) {
      onNavigate('home');
    }
  }, [request, onNavigate]);

  useEffect(() => {
    if (stage !== 'shuffling') return;

    const timer = window.setTimeout(() => {
      const settings = getSettings();
      const decks = getDecks();
      const activeDeck = decks.find((deck) => deck.id === settings.activeDeckId) || DEFAULT_DECK;
      const deckCards = [...activeDeck.cards];

      for (let i = deckCards.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [deckCards[i], deckCards[randomIndex]] = [deckCards[randomIndex], deckCards[i]];
      }

      const cardsNeeded = spread.positions.length;
      const drawn: DrawnCard[] = deckCards.slice(0, cardsNeeded).map((card, idx) => ({
        ...card,
        isReversed: settings.reversalsEnabled ? Math.random() > 0.5 : false,
        positionId: spread.positions[idx].id,
      }));

      setDrawnCards(drawn);
      setStage('drawing');
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [spread.positions, stage]);

  const handlePrevCard = (event: React.MouseEvent) => {
    event.stopPropagation();
    const currentIndex = drawnCards.findIndex((card) => card.id === selectedCardId);
    if (currentIndex > 0) {
      setSelectedCardId(drawnCards[currentIndex - 1].id);
    }
  };

  const handleNextCard = (event: React.MouseEvent) => {
    event.stopPropagation();
    const currentIndex = drawnCards.findIndex((card) => card.id === selectedCardId);
    if (currentIndex < drawnCards.length - 1) {
      setSelectedCardId(drawnCards[currentIndex + 1].id);
    }
  };

  const triggerInterpretation = async () => {
    setIsLoadingAI(true);
    setApiError(null);
    setApiKeyMissing(false);

    const apiKey = getSettings().apiKey?.trim();

    try {
      const result = await generateInterpretation({
        question,
        intention,
        spread,
        cards: drawnCards,
        apiKey: apiKey || undefined,
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
        interpretation: result,
      };
      saveReading(newReading);
    } catch (error) {
      if (error instanceof TarotInterpretationError && error.needsPersonalKey) {
        setApiKeyMissing(true);
        setApiError(error.message);
        return;
      }

      const message = error instanceof Error ? error.message : 'Unknown interpretation error.';
      let userMessage = 'The spirits are quiet. Please try again.';

      if (message.includes('429')) {
        userMessage = 'Gemini is currently overloaded. Please retry in a moment.';
      } else if (message.includes('403') || message.includes('401')) {
        userMessage = 'Authentication failed. Please check your API key.';
      } else if (message.toLowerCase().includes('api key')) {
        userMessage = 'The API key looks invalid.';
      }

      setApiError(userMessage);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const selectedCard = drawnCards.find((card) => card.id === selectedCardId);
  const activePosition = selectedCard ? spread.positions.find((position) => position.id === selectedCard.positionId) : null;

  return (
    <TarotShell>
      <nav className="sticky top-0 z-50 border-b border-[color:var(--copper)]/14 bg-[rgba(4,7,13,0.84)] px-6 py-5 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[color:var(--copper)]/18 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            <ArrowLeft size={14} /> Return
          </button>
          <div className="text-center">
            <p className="font-ritual text-2xl text-[color:var(--bone)] sm:text-3xl">{spread.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">Awareness Session</p>
          </div>
          <div className="w-[92px]" />
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center overflow-x-hidden px-4 py-8 sm:px-8 lg:px-12">
        {stage === 'shuffling' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 animate-pulse-slow">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border border-[color:var(--gilt)]/25 animate-spin-slow" />
              <div className="flex h-56 w-40 items-center justify-center border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.86)]">
                <Sparkles className="text-[color:var(--gilt)] animate-bounce" size={24} />
              </div>
            </div>
            <p className="font-ritual text-2xl tracking-[0.18em] text-[color:var(--gilt)]">Shuffling the symbolic field</p>
          </div>
        )}

        {stage !== 'shuffling' && (
          <>
            <div className="mb-16 mt-4 w-full border border-[color:var(--copper)]/14 bg-[rgba(6,11,19,0.64)] px-4 py-6 sm:px-6 sm:py-8">
              <div className="mb-6 grid gap-6 border-b border-[color:var(--copper)]/10 pb-6 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Question</p>
                  <p className="font-ritual text-3xl leading-snug text-[color:var(--bone)] sm:text-4xl">
                    {question || 'A general reading'}
                  </p>
                </div>
                <div className="space-y-3 border-l border-[color:var(--copper)]/12 pl-0 lg:pl-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Intention</p>
                  <p className="text-base leading-relaxed text-[color:#D5D0C6] sm:text-lg">{intention}</p>
                </div>
              </div>
              <SpreadLayout type={spreadId} cards={drawnCards} revealedCount={drawnCards.length} onCardClick={(card) => setSelectedCardId(card.id)} />
            </div>

            {!interpretation && !apiKeyMissing && !apiError && (
              <div className="fixed bottom-10 z-40 animate-fade-in">
                <button
                  onClick={triggerInterpretation}
                  disabled={isLoadingAI}
                  className="inline-flex min-h-[56px] items-center gap-4 rounded-full border border-[color:var(--gilt)]/55 bg-[rgba(6,11,19,0.94)] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[color:var(--gilt)] transition hover:bg-[rgba(184,155,94,0.12)] hover:text-[color:var(--bone)] disabled:opacity-50"
                >
                  {isLoadingAI ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
                  {isLoadingAI ? 'Channeling...' : 'Reveal Guidance'}
                </button>
              </div>
            )}

            {(apiKeyMissing || apiError) && (
              <div className="fixed bottom-10 z-40 max-w-md animate-fade-in border border-[rgba(140,70,70,0.4)] bg-[rgba(6,11,19,0.96)] p-6 text-center shadow-xl">
                <div className="mb-4 text-[rgba(187,103,103,0.85)]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="font-ritual text-2xl text-[color:var(--bone)]">{apiKeyMissing ? 'Personal Key Needed' : 'Connection Interrupted'}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                  {apiError || 'Shared free usage is unavailable right now. Add your personal Gemini key in Settings to continue.'}
                </p>
                <button
                  onClick={() => onNavigate('settings')}
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)] px-6 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] transition hover:bg-[rgba(184,155,94,0.14)] hover:text-[color:var(--bone)]"
                >
                  Enter Personal Key
                </button>
                <button onClick={() => {
                  setApiKeyMissing(false);
                  setApiError(null);
                }} className="mt-3 block w-full text-xs text-[color:var(--mist)]/72 underline">
                  Dismiss
                </button>
              </div>
            )}

            {interpretation && (
              <div className="relative mb-20 w-full max-w-5xl animate-fade-in border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.9)] p-8 md:p-14 shadow-2xl">

                <div className="text-center space-y-6">
                  <div className="mb-4 inline-block rounded-full border border-[color:var(--gilt)]/25 p-2">
                    <Sparkles size={16} className="text-[color:var(--gilt)]" />
                  </div>
                  <p className="font-ritual text-3xl leading-snug text-[color:var(--bone)] md:text-5xl">&quot;{interpretation.mirrorStatement}&quot;</p>
                </div>

                <div className="grid grid-cols-1 gap-12 border-y border-[color:var(--copper)]/12 py-12 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.28em] text-[color:var(--gilt)]">Archetype & Shadow</h3>
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-[color:#D5D0C6]">{interpretation.archetypeShadow}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.28em] text-[color:var(--gilt)]">Alchemical Phase</h3>
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-[color:#D5D0C6]">{interpretation.alchemicalPhase}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-center text-xs uppercase tracking-[0.28em] text-[color:var(--mist)]">Practical Integration</h3>
                  <ul className="grid gap-4">
                    {interpretation.practicalGuidance.map((guidance, index) => (
                      <li key={`guidance-${index}`} className="flex items-center gap-6 border border-[color:var(--copper)]/12 bg-[rgba(4,7,13,0.64)] p-4">
                        <span className="font-ritual text-3xl text-[color:var(--gilt)]/55">0{index + 1}</span>
                        <span className="text-[color:#D5D0C6]">{guidance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.28em] text-[color:var(--mist)]">Journal Inquiries</h3>
                    <div className="space-y-6">
                      {interpretation.journalPrompts.map((prompt, index) => (
                        <div key={`prompt-${index}`} className="border-l border-[color:var(--gilt)]/22 pl-6 font-ritual text-xl italic text-[color:#D5D0C6]">
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-center border border-[color:var(--copper)]/12 bg-[rgba(4,7,13,0.72)] p-8 text-center">
                    <h3 className="mb-4 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)]">Mantra</h3>
                    <p className="font-ritual text-3xl text-[color:var(--gilt)]">{interpretation.mantra}</p>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button onClick={() => onNavigate('journal')} className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[color:var(--mist)] transition hover:text-[color:var(--gilt)]">
                    <Save size={14} /> Saved to Journal
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04070d]/96 p-4 backdrop-blur-xl" onClick={() => setSelectedCardId(null)}>
          <div className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.96)] shadow-2xl md:flex-row" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setSelectedCardId(null)} className="absolute right-6 top-6 z-20 p-2 text-[color:var(--mist)] transition hover:text-[color:var(--bone)]">
              <X size={24} />
            </button>

            <div className="relative flex h-1/2 items-center justify-center border-r border-[color:var(--copper)]/10 bg-[#050810] p-10 md:h-full md:w-1/2">
              <div className={`w-[min(100%,22rem)] aspect-[2/3] ${selectedCard.isReversed ? 'rotate-180' : ''}`}>
                <TarotCardFace card={selectedCard} className="shadow-[0_0_40px_rgba(0,0,0,0.4)]" />
              </div>

              <div className="absolute inset-x-0 bottom-6 flex justify-center gap-12 md:hidden">
                <button onClick={handlePrevCard} className="text-[color:var(--bone)] disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === 0}>
                  <ChevronLeft size={32} />
                </button>
                <button onClick={handleNextCard} className="text-[color:var(--bone)] disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}>
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>

            <div className="relative h-1/2 overflow-y-auto bg-[rgba(6,11,19,0.92)] p-12 md:h-full md:w-1/2">
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="rounded-full border border-[color:var(--gilt)]/30 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[color:var(--gilt)]">
                      Position {activePosition?.id}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[color:var(--mist)]">{activePosition?.name}</span>
                  </div>

                  <h2 className="mb-4 font-ritual text-5xl text-[color:var(--bone)]">{selectedCard.name}</h2>

                  <div className="text-sm font-ritual italic text-[color:var(--mist)]">
                    {selectedCard.isReversed ? 'Inverted Energy (Reversed)' : 'Direct Energy (Upright)'}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[color:var(--mist)]">Interpretation</h3>
                  <p className="font-ritual text-2xl leading-relaxed text-[color:#D5D0C6]">
                    {selectedCard.isReversed ? selectedCard.meaningReversed : selectedCard.meaningUpright}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12 border-t border-[color:var(--copper)]/10 pt-8">
                  <div>
                    <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-[color:var(--gilt)]">The Shadow</span>
                    <p className="text-sm leading-relaxed text-[color:var(--mist)]">{selectedCard.shadow}</p>
                  </div>
                  <div>
                    <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-[color:var(--gilt)]">The Gift</span>
                    <p className="text-sm leading-relaxed text-[color:var(--mist)]">{selectedCard.gift}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {selectedCard.keywords.map((keyword) => (
                      <span key={keyword} className="border border-[color:var(--copper)]/16 bg-[#050810] px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-[color:var(--mist)]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-16 hidden justify-between border-t border-[color:var(--copper)]/10 pt-8 md:flex">
                <button
                  onClick={handlePrevCard}
                  disabled={drawnCards.indexOf(selectedCard) === 0}
                  className="flex items-center gap-3 text-xs uppercase tracking-widest text-[color:var(--mist)] transition hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={handleNextCard}
                  disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}
                  className="flex items-center gap-3 text-xs uppercase tracking-widest text-[color:var(--mist)] transition hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-20"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TarotShell>
  );
};

export default Reading;
