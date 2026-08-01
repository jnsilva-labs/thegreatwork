'use client';

import React, { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusDialog } from '@/components/ui/useFocusDialog';
import { useMotionPreference } from '@/components/motion/useMotionPreference';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Eye, Loader2, Save, Sparkles, X } from '../icons';
import { DEFAULT_DECK, SPREADS } from '../constants';
import SpreadLayout from '../components/SpreadLayout';
import TarotCardFace from '../components/TarotCardFace';
import TarotShell from '../components/TarotShell';
import { PhaseArc } from '../components/PhaseArc';
import { generateInterpretation, TarotInterpretationError } from '../services/geminiService';
import { getDecks, getSettings, saveReading } from '../services/storageService';
import { DrawnCard, Interpretation, Reading as ReadingType, ReadingRequest, SpreadPosition, SpreadType, TarotView } from '../types';

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

interface CardDetailsDialogProps {
  card: DrawnCard;
  position?: SpreadPosition | null;
  currentIndex: number;
  cardCount: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  dialogRef: React.Ref<HTMLElement>;
  initialFocusRef: React.Ref<HTMLButtonElement>;
}

export function CardDetailsDialog({
  card,
  position,
  currentIndex,
  cardCount,
  onClose,
  onPrevious,
  onNext,
  dialogRef,
  initialFocusRef,
}: CardDetailsDialogProps) {
  const headingId = useId();

  return createPortal(
    <div
      data-testid="card-dialog-backdrop"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[color:var(--bg)]/92 backdrop-blur-xl md:items-center md:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="relative grid h-[100dvh] w-full overflow-y-auto overscroll-contain border border-[color:var(--copper)]/28 bg-[color:var(--panel)] shadow-2xl md:h-[min(85vh,52rem)] md:max-w-6xl md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:overflow-hidden"
      >
        <button
          ref={initialFocusRef}
          type="button"
          aria-label="Close card details"
          onClick={onClose}
          className="absolute right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex min-h-[44px] min-w-[44px] items-center justify-center border border-[color:var(--copper)]/30 bg-[color:var(--bg)]/80 text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] md:right-5 md:top-5"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="relative flex min-h-[19rem] items-center justify-center border-b border-[color:var(--copper)]/18 bg-[color:var(--bg)] px-6 pb-16 pt-14 md:min-h-0 md:border-b-0 md:border-r md:p-10">
          <div className={`aspect-[7/12] h-[min(34svh,17rem)] md:h-auto md:w-[min(68%,19rem)] ${card.isReversed ? 'rotate-180' : ''}`}>
            <TarotCardFace card={card} className="shadow-2xl" />
          </div>

          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-4 md:inset-x-8 md:bottom-6">
            <button
              type="button"
              aria-label="Previous card"
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-2 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] transition-[color] hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft size={18} aria-hidden="true" /> <span className="hidden lg:inline">Previous</span>
            </button>
            <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]" aria-live="polite">
              {currentIndex + 1} / {cardCount}
            </p>
            <button
              type="button"
              aria-label="Next card"
              onClick={onNext}
              disabled={currentIndex === cardCount - 1}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-2 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] transition-[color] hover:text-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <span className="hidden lg:inline">Next</span> <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-[color:var(--panel)] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-9 sm:px-10 sm:pt-12 md:overflow-y-auto md:overscroll-contain md:pb-10 lg:px-12">
          <div className="space-y-9">
            <header className="border-b border-[color:var(--copper)]/18 pb-7 pr-12">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {position && (
                  <span className="border border-[color:var(--gilt)]/30 px-3 py-1 text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)]">
                    Position {position.id}
                  </span>
                )}
                <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--mist)]">{position?.name}</span>
              </div>
              <h2 id={headingId} className="font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-5xl">
                {card.name}<span className="sr-only"> — Card details</span>
              </h2>
              <p className="mt-3 font-ritual text-sm italic text-[color:var(--mist)]">
                {card.isReversed ? 'Inverted Energy (Reversed)' : 'Direct Energy (Upright)'}
              </p>
            </header>

            <section className="space-y-3" aria-labelledby={`${headingId}-interpretation`}>
              <h3 id={`${headingId}-interpretation`} className="text-xs uppercase tracking-[0.16em] text-[color:var(--mist)]">Interpretation</h3>
              <p className="font-ritual text-2xl leading-relaxed text-[color:var(--mist)]">
                {card.isReversed ? card.meaningReversed : card.meaningUpright}
              </p>
            </section>

            <div className="grid gap-7 border-t border-[color:var(--copper)]/14 pt-7 sm:grid-cols-2 sm:gap-9">
              <section aria-labelledby={`${headingId}-shadow`}>
                <h3 id={`${headingId}-shadow`} className="mb-3 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">The Shadow</h3>
                <p className="text-sm leading-relaxed text-[color:var(--mist)]">{card.shadow}</p>
              </section>
              <section aria-labelledby={`${headingId}-gift`}>
                <h3 id={`${headingId}-gift`} className="mb-3 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">The Gift</h3>
                <p className="text-sm leading-relaxed text-[color:var(--mist)]">{card.gift}</p>
              </section>
            </div>

            <ul aria-label="Card keywords" className="flex flex-wrap gap-3 border-t border-[color:var(--copper)]/14 pt-7">
              {card.keywords.map((keyword) => (
                <li key={keyword} className="border border-[color:var(--copper)]/24 bg-[color:var(--bg)]/45 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

const Reading: React.FC<ReadingProps> = ({ request, onNavigate }) => {
  const spreadId: SpreadType = request?.spreadId ?? 'one-card';
  const question = request?.question ?? '';
  const intention = request?.intention ?? 'General';
  const spread = SPREADS[spreadId];
  const { motionOk } = useMotionPreference();

  const [stage, setStage] = useState<ReadingStage>('shuffling');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<ReadonlySet<string>>(new Set());
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const closeCardDialog = useCallback(() => setSelectedCardId(null), []);
  const {
    triggerRef: cardDialogTriggerRef,
    dialogRef: cardDialogRef,
    initialFocusRef: cardDialogInitialFocusRef,
  } = useFocusDialog({
    open: selectedCardId !== null,
    onClose: closeCardDialog,
  });

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
    }, motionOk ? 2500 : 0);

    return () => window.clearTimeout(timer);
  }, [motionOk, spread.positions, stage]);

  const allFlipped = drawnCards.length > 0 && drawnCards.every((card) => flippedIds.has(card.id));

  // The cards reveal themselves, one at a time, once they are dealt.
  // Larger spreads cascade a little faster so the Celtic Cross doesn't drag.
  useEffect(() => {
    if (stage !== 'drawing' || drawnCards.length === 0) return;

    if (!motionOk) {
      setFlippedIds(new Set(drawnCards.map((card) => card.id)));
      return;
    }

    const stagger = drawnCards.length > 5 ? 550 : 850;
    const timers = drawnCards.map((card, index) =>
      window.setTimeout(() => {
        setFlippedIds((prev) => new Set(prev).add(card.id));
      }, 900 + index * stagger),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage, drawnCards, motionOk]);

  // Tapping a card mid-cascade turns it early; once face-up, tapping opens
  // its detail.
  const handleCardClick = (card: DrawnCard) => {
    if (!flippedIds.has(card.id)) {
      setFlippedIds((prev) => new Set(prev).add(card.id));
      return;
    }
    setSelectedCardId(card.id);
  };

  const handlePrevCard = () => {
    const currentIndex = drawnCards.findIndex((card) => card.id === selectedCardId);
    if (currentIndex > 0) {
      setSelectedCardId(drawnCards[currentIndex - 1].id);
    }
  };

  const handleNextCard = () => {
    const currentIndex = drawnCards.findIndex((card) => card.id === selectedCardId);
    if (currentIndex < drawnCards.length - 1) {
      setSelectedCardId(drawnCards[currentIndex + 1].id);
    }
  };

  const rememberCardDialogTrigger = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLButtonElement &&
      target.getAttribute('aria-label')?.endsWith('open details')
    ) {
      cardDialogTriggerRef.current = target;
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
  const readingStatus = getReadingStatus(stage, isLoadingAI, loadingMessageIndex, allFlipped);

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
            <h1 className="font-ritual text-2xl text-[color:var(--bone)] sm:text-3xl">{spread.name}</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)] sm:tracking-[0.18em]">Awareness Session</p>
          </div>
          <div className="w-[92px]" />
        </div>
      </nav>

      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {readingStatus}
      </p>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center overflow-x-hidden px-4 py-8 sm:px-8 lg:px-12">
        {stage === 'shuffling' && (
          <div className={`flex flex-1 flex-col items-center justify-center gap-8 py-16 ${motionOk ? 'animate-pulse-slow' : ''}`}>
            <div className="relative">
              <div className={`absolute inset-0 rounded-full border border-[color:var(--gilt)]/25 ${motionOk ? 'animate-spin-slow' : ''}`} />
              <div className="flex aspect-[7/12] w-36 items-center justify-center border border-[color:var(--copper)]/30 bg-[color:var(--panel)]">
                <Sparkles className={`text-[color:var(--gilt)] ${motionOk ? 'animate-bounce' : ''}`} size={24} />
              </div>
            </div>
            <p className="font-ritual text-2xl tracking-[0.08em] text-[color:var(--gilt)] sm:tracking-[0.14em]">Shuffling the symbolic field</p>
          </div>
        )}

        {stage !== 'shuffling' && (
          <>
            <section
              aria-label="Reading table"
              className="mb-14 mt-4 w-full border-y border-[color:var(--copper)]/28 px-1 py-6 sm:px-6 sm:py-8"
              onClickCapture={rememberCardDialogTrigger}
            >
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

            {!interpretation && !apiKeyMissing && !apiError && allFlipped && (
              <div className={`sticky bottom-6 z-40 mt-4 flex justify-center pb-2 ${motionOk ? 'animate-fade-in' : ''}`}>
                <button
                  onClick={triggerInterpretation}
                  disabled={isLoadingAI}
                  className="inline-flex min-h-[56px] items-center gap-4 border border-[color:var(--gilt)]/60 bg-[color:var(--bg)]/95 px-8 py-4 text-sm uppercase tracking-[0.16em] text-[color:var(--gilt)] transition-[background-color,color] hover:bg-[color:var(--gilt)]/14 hover:text-[color:var(--bone)] disabled:opacity-50 sm:tracking-[0.22em]"
                >
                  {isLoadingAI ? <Loader2 className={motionOk ? 'animate-spin' : ''} /> : <Eye size={20} />}
                  <span>{isLoadingAI ? LOADING_MESSAGES[loadingMessageIndex] : 'Reveal Guidance'}</span>
                </button>
              </div>
            )}

            {(apiKeyMissing || apiError) && (
              <div className={`fixed bottom-10 z-40 max-w-md border border-[color:var(--copper)]/60 bg-[color:var(--bg)]/95 p-6 text-center shadow-xl ${motionOk ? 'animate-fade-in' : ''}`}>
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
                }} className="mt-3 block min-h-[44px] w-full text-xs text-[color:var(--mist)] underline">
                  Dismiss
                </button>
              </div>
            )}

            {interpretation && (
              <article className={`relative mb-20 w-full max-w-4xl border-t border-[color:var(--copper)]/30 px-1 pt-14 sm:px-8 md:px-12 ${motionOk ? 'animate-fade-in' : ''}`}>
                <header className="space-y-6 text-center">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gilt)]/35">
                    <Sparkles size={16} className="text-[color:var(--gilt)]" />
                  </div>
                  <h2 className="font-ritual text-3xl leading-snug text-[color:var(--bone)] md:text-5xl">&quot;{interpretation.mirrorStatement}&quot;</h2>
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
                    <div className="space-y-5">
                      {interpretation.archetypeShadow.split(/\n{2,}/).map((paragraph, index) => (
                        <p key={index} className="text-lg leading-relaxed text-[color:var(--mist)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
        <CardDetailsDialog
          card={selectedCard}
          position={activePosition}
          currentIndex={drawnCards.indexOf(selectedCard)}
          cardCount={drawnCards.length}
          onClose={closeCardDialog}
          onPrevious={handlePrevCard}
          onNext={handleNextCard}
          dialogRef={cardDialogRef}
          initialFocusRef={cardDialogInitialFocusRef}
        />
      )}
    </TarotShell>
  );
};

function getReadingStatus(stage: ReadingStage, isLoadingAI: boolean, loadingMessageIndex: number, allFlipped: boolean) {
  if (stage === 'shuffling') return 'Shuffling the symbolic field.';
  if (isLoadingAI) return LOADING_MESSAGES[loadingMessageIndex];
  if (stage === 'complete') return 'Guidance ready. Your interpretation is available.';
  if (allFlipped) return 'Cards ready. All cards have been revealed; guidance is available.';
  return 'Cards ready. The cards are revealing one at a time.';
}

export default Reading;
