'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Eye, Loader2, Save, Sparkles, X } from '../icons';
import { DEFAULT_DECK, SPREADS } from '../constants';
import SpreadLayout from '../components/SpreadLayout';
import TarotCardFace from '../components/TarotCardFace';
import TarotShell from '../components/TarotShell';
import { PhaseArc } from '../components/PhaseArc';
import { generateInterpretation, TarotInterpretationError } from '../services/geminiService';
import { getDecks, getSettings, saveReading } from '../services/storageService';
import { DrawnCard, Interpretation, Reading as ReadingType, ReadingRequest, SpreadType, TarotView } from '../types';

type ReadingStage = 'shuffling' | 'drawing' | 'interpreting' | 'complete';

const LOADING_MESSAGES = [
  'Channeling...',
  'Reading the symbolic field...',
  'Distilling the archetypes...',
  'Setting words to the work...',
];

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
  const [flippedIds, setFlippedIds] = useState<ReadonlySet<string>>(new Set());
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoadingAI) {
      setLoadingMessageIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setLoadingMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isLoadingAI]);

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

  const allFlipped = drawnCards.length > 0 && drawnCards.every((card) => flippedIds.has(card.id));

  // The reveal is the ritual: the first tap turns a card; once it faces up,
  // tapping again opens its detail.
  const handleCardClick = (card: DrawnCard) => {
    if (!flippedIds.has(card.id)) {
      setFlippedIds((prev) => new Set(prev).add(card.id));
      return;
    }
    setSelectedCardId(card.id);
  };

  const turnAllCards = () => {
    setFlippedIds(new Set(drawnCards.map((card) => card.id)));
  };

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

    const settings = getSettings();
    const apiKey = settings.apiKey?.trim();
    const activeDeck = getDecks().find((deck) => deck.id === settings.activeDeckId) || DEFAULT_DECK;

    try {
      const result = await generateInterpretation({
        question,
        intention,
        spread,
        cards: drawnCards,
        apiKey: apiKey || undefined,
        isCustomDeck: activeDeck.isCustom,
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

      let userMessage = 'The spirits are quiet. Please try again.';

      if (error instanceof TarotInterpretationError) {
        switch (error.code) {
          case 'SHARED_QUOTA_EXCEEDED':
            userMessage = 'The reading service is busy right now. Please retry in a moment.';
            break;
          case 'SHARED_REQUEST_TIMEOUT':
            userMessage = 'The reading took too long to arrive. Please try again.';
            break;
          case 'BAD_RESPONSE_FORMAT':
          case 'EMPTY_RESPONSE':
            userMessage = 'The reading arrived garbled. Please try again.';
            break;
          case 'PERSONAL_KEY_REQUEST_FAILED':
            userMessage = 'Your personal key request failed. Please check the key in Settings.';
            break;
        }
      }

      setApiError(userMessage);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const selectedCard = drawnCards.find((card) => card.id === selectedCardId);
  const activePosition = selectedCard ? spread.positions.find((position) => position.id === selectedCard.positionId) : null;

  return (
    <TarotShell depth="reading">
      <nav className="sticky top-0 z-50 border-b border-[color:var(--copper)]/20 bg-[color:var(--bg)]/90 px-4 py-4 backdrop-blur sm:px-10 sm:py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex min-h-[44px] items-center gap-2 border-b border-[color:var(--copper)]/30 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] sm:tracking-[0.18em]"
          >
            <ArrowLeft size={14} /> Return
          </button>
          <div className="text-center">
            <p className="font-ritual text-2xl text-[color:var(--bone)] sm:text-3xl">{spread.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Awareness Session</p>
          </div>
          <div className="w-[92px]" />
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center overflow-x-hidden px-4 py-8 sm:px-8 lg:px-12">
        {stage === 'shuffling' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16 animate-pulse-slow">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border border-[color:var(--gilt)]/25 animate-spin-slow" />
              <div className="flex aspect-[7/12] w-36 items-center justify-center border border-[color:var(--copper)]/30 bg-[color:var(--panel)]">
                <Sparkles className="text-[color:var(--gilt)] animate-bounce" size={24} />
              </div>
            </div>
            <p className="font-ritual text-2xl tracking-[0.08em] text-[color:var(--gilt)] sm:tracking-[0.14em]">Shuffling the symbolic field</p>
          </div>
        )}

        {stage !== 'shuffling' && (
          <>
            <section aria-label="Reading table" className="mb-14 mt-4 w-full border-y border-[color:var(--copper)]/28 px-1 py-6 sm:px-6 sm:py-8">
              <div className="mb-6 grid gap-6 border-b border-[color:var(--copper)]/20 pb-6 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Question</p>
                  <p className="font-ritual text-3xl leading-snug text-[color:var(--bone)] sm:text-4xl">
                    {question || 'A general reading'}
                  </p>
                </div>
                <div className="space-y-3 border-t border-[color:var(--copper)]/16 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Intention</p>
                  <p className="text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">{intention}</p>
                </div>
              </div>
              <SpreadLayout type={spreadId} cards={drawnCards} revealedIds={flippedIds} onCardClick={handleCardClick} />
            </section>

            {!interpretation && !apiKeyMissing && !apiError && !allFlipped && (
              <div className="sticky bottom-4 z-40 mt-4 flex flex-col items-center gap-2 animate-fade-in pb-2 text-center">
                <p className="border-y border-[color:var(--copper)]/30 bg-[color:var(--bg)]/92 px-6 py-3 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:tracking-[0.18em]">
                  Turn each card when you are ready
                </p>
                <button
                  onClick={turnAllCards}
                  className="min-h-[44px] text-xs uppercase tracking-[0.1em] text-[color:var(--mist)]/72 underline underline-offset-4 transition-[color] hover:text-[color:var(--gilt)] sm:tracking-[0.14em]"
                >
                  Turn them all at once
                </button>
              </div>
            )}

            {!interpretation && !apiKeyMissing && !apiError && allFlipped && (
              <div className="sticky bottom-6 z-40 mt-4 flex justify-center animate-fade-in pb-2">
                <button
                  onClick={triggerInterpretation}
                  disabled={isLoadingAI}
                  className="inline-flex min-h-[56px] items-center gap-4 border border-[color:var(--gilt)]/60 bg-[color:var(--bg)]/95 px-8 py-4 text-sm uppercase tracking-[0.16em] text-[color:var(--gilt)] transition-[background-color,color] hover:bg-[color:var(--gilt)]/14 hover:text-[color:var(--bone)] disabled:opacity-50 sm:tracking-[0.22em]"
                >
                  {isLoadingAI ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
                  {isLoadingAI ? LOADING_MESSAGES[loadingMessageIndex] : 'Reveal Guidance'}
                </button>
              </div>
            )}

            {(apiKeyMissing || apiError) && (
              <div className="fixed bottom-10 z-40 max-w-md animate-fade-in border border-[color:var(--copper)]/60 bg-[color:var(--bg)]/95 p-6 text-center shadow-xl">
                <div className="mb-4 text-[color:var(--gilt)]">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="font-ritual text-2xl text-[color:var(--bone)]">{apiKeyMissing ? 'Personal Key Needed' : 'Connection Interrupted'}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                  {apiError || 'Shared free usage is unavailable right now. Add your personal Gemini key in Settings to continue.'}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setApiKeyMissing(false);
                      setApiError(null);
                      void triggerInterpretation();
                    }}
                    className="inline-flex min-h-[44px] items-center border border-[color:var(--gilt)] px-6 py-2 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)] transition-[background-color,color] hover:bg-[color:var(--gilt)]/14 hover:text-[color:var(--bone)]"
                  >
                    Try Again
                  </button>
                  {apiKeyMissing && (
                    <button
                      onClick={() => onNavigate('settings')}
                      className="inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/40 px-6 py-2 text-xs uppercase tracking-[0.14em] text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                    >
                      Enter Personal Key
                    </button>
                  )}
                </div>
                <button onClick={() => {
                  setApiKeyMissing(false);
                  setApiError(null);
                }} className="mt-3 block w-full min-h-[44px] text-xs text-[color:var(--mist)]/72 underline">
                  Dismiss
                </button>
              </div>
            )}

            {interpretation && (
              <article className="relative mb-20 w-full max-w-4xl animate-fade-in border-t border-[color:var(--copper)]/30 px-1 pt-14 sm:px-8 md:px-12">
                <header className="space-y-6 text-center">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gilt)]/35">
                    <Sparkles size={16} className="text-[color:var(--gilt)]" />
                  </div>
                  <p className="font-ritual text-3xl leading-snug text-[color:var(--bone)] md:text-5xl">&quot;{interpretation.mirrorStatement}&quot;</p>
                </header>

                <section className="mt-14 border-y border-[color:var(--copper)]/24 py-10">
                  <h3 className="mb-8 text-center text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Where You Stand in the Work</h3>
                  {interpretation.phase ? (
                    <PhaseArc phase={interpretation.phase} reason={interpretation.phaseReason} />
                  ) : (
                    <p className="mx-auto max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-[color:var(--mist)]">
                      {interpretation.alchemicalPhase}
                    </p>
                  )}
                </section>

                <section className="py-12">
                  <div className="mx-auto max-w-2xl space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Archetype & Shadow</h3>
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-[color:var(--mist)]">{interpretation.archetypeShadow}</p>
                  </div>
                </section>

                <section className="border-t border-[color:var(--copper)]/24 py-12">
                  <h3 className="mb-6 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:tracking-[0.18em]">Practical Integration</h3>
                  <ol className="divide-y divide-[color:var(--copper)]/20 border-y border-[color:var(--copper)]/20">
                    {interpretation.practicalGuidance.map((guidance, index) => (
                      <li key={`guidance-${index}`} className="flex items-start gap-5 py-5">
                        <span className="font-ritual text-3xl text-[color:var(--gilt)]/55">0{index + 1}</span>
                        <span className="pt-1 leading-relaxed text-[color:var(--mist)]">{guidance}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="grid grid-cols-1 gap-10 border-t border-[color:var(--copper)]/24 py-12 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:tracking-[0.18em]">Journal Inquiries</h3>
                    <div className="space-y-6">
                      {interpretation.journalPrompts.map((prompt, index) => (
                        <div key={`prompt-${index}`} className="border-l border-[color:var(--gilt)]/30 pl-6 font-ritual text-xl italic text-[color:var(--mist)]">
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-center border-l border-[color:var(--copper)]/24 p-8 text-center">
                    <h3 className="mb-4 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:tracking-[0.18em]">Mantra</h3>
                    <p className="font-ritual text-3xl text-[color:var(--gilt)]">{interpretation.mantra}</p>
                  </div>
                </section>

                <footer className="flex justify-center border-t border-[color:var(--copper)]/24 pt-8">
                  <button onClick={() => onNavigate('journal')} className="inline-flex min-h-[44px] items-center gap-3 border-b border-transparent text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--gilt)] sm:tracking-[0.18em]">
                    <Save size={14} /> Saved to Journal
                  </button>
                </footer>
              </article>
            )}
          </>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--bg)]/95 p-4 backdrop-blur-xl" onClick={() => setSelectedCardId(null)}>
          <div className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden border border-[color:var(--copper)]/24 bg-[color:var(--panel)] shadow-2xl md:flex-row" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setSelectedCardId(null)} className="absolute right-5 top-5 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center text-[color:var(--mist)] transition-[color] hover:text-[color:var(--bone)]">
              <X size={24} />
            </button>

            <div className="relative flex h-1/2 items-center justify-center border-r border-[color:var(--copper)]/16 bg-[color:var(--bg)] p-10 md:h-full md:w-1/2">
              <div className={`aspect-[7/12] w-[min(100%,19rem)] ${selectedCard.isReversed ? 'rotate-180' : ''}`}>
                <TarotCardFace card={selectedCard} className="shadow-2xl" />
              </div>

              <div className="absolute inset-x-0 bottom-6 flex justify-center gap-12 md:hidden">
                <button onClick={handlePrevCard} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[color:var(--bone)] disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === 0}>
                  <ChevronLeft size={32} />
                </button>
                <button onClick={handleNextCard} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[color:var(--bone)] disabled:opacity-20" disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}>
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>

            <div className="relative h-1/2 overflow-y-auto bg-[color:var(--panel)] p-12 md:h-full md:w-1/2">
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
                  <p className="font-ritual text-2xl leading-relaxed text-[color:var(--mist)]">
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
                      <span key={keyword} className="border border-[color:var(--copper)]/24 bg-[color:var(--bg)]/45 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-[color:var(--mist)]">
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
                  className="flex min-h-[44px] items-center gap-3 text-xs uppercase tracking-widest text-[color:var(--mist)] transition-[color] hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={handleNextCard}
                  disabled={drawnCards.indexOf(selectedCard) === drawnCards.length - 1}
                  className="flex min-h-[44px] items-center gap-3 text-xs uppercase tracking-widest text-[color:var(--mist)] transition-[color] hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-20"
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
