'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CircleDot, ExternalLink, Infinity, Triangle } from '../icons';
import { INTENTIONS, ReadingRequest, SpreadType, TarotView } from '../types';
import TarotShell from '../components/TarotShell';
import { useMotionPreference } from '@/components/motion/useMotionPreference';
import { normalizeTarotQuestion, TAROT_QUESTION_REQUIRED_MESSAGE } from '@/lib/tarot/question';

interface HomeProps {
  onNavigate: (view: TarotView) => void;
  onStartReading: (request: ReadingRequest) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onStartReading }) => {
  const [question, setQuestion] = useState('');
  const [intention, setIntention] = useState('General');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('one-card');
  const [questionError, setQuestionError] = useState('');
  const { motionOk } = useMotionPreference();

  const startReading = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuestion = normalizeTarotQuestion(question);

    if (!normalizedQuestion) {
      setQuestionError(TAROT_QUESTION_REQUIRED_MESSAGE);
      return;
    }

    setQuestionError('');
    onStartReading({ question: normalizedQuestion, intention, spreadId: selectedSpread });
  };

  return (
    <TarotShell>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-12 px-6 py-20 text-center sm:px-10">
        <header className={`space-y-6 ${motionOk ? 'animate-fade-in' : ''}`}>
          <div className="inline-flex flex-col items-center gap-3">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-[color:var(--gilt)] to-transparent opacity-50" />
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--mist)] sm:tracking-[0.28em]">Tarot Oracle</p>
          </div>

          <h1 className="font-ritual text-5xl leading-none text-[color:var(--bone)] sm:text-6xl md:text-7xl">
            Tarot <span className="text-[color:var(--gilt)]">Alchemy</span>
          </h1>

          <p className="mx-auto max-w-xl border-b border-[color:var(--copper)]/20 pb-6 text-sm leading-relaxed tracking-[0.04em] text-[color:var(--mist)] sm:text-base">
            The mirror does not show you what you look like.
            <br />
            It shows you who you are becoming through attention.
          </p>
        </header>

        <section className={`relative w-full max-w-3xl border-y border-[color:var(--copper)]/30 bg-[color:var(--panel)]/55 text-left ${motionOk ? 'animate-fade-in' : ''}`}>
          <div className="pointer-events-none absolute left-0 top-0 h-12 w-px bg-[color:var(--gilt)]/60" />
          <div className="pointer-events-none absolute right-0 top-0 h-px w-12 bg-[color:var(--gilt)]/60" />

          <form className="space-y-9 px-5 py-8 sm:px-10 sm:py-10" onSubmit={startReading}>
            <div className="space-y-3">
              <label htmlFor="tarot-question" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)] sm:tracking-[0.2em]">
                <CircleDot size={12} /> The question
              </label>
              <textarea
                id="tarot-question"
                name="question"
                rows={2}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (questionError) setQuestionError('');
                }}
                placeholder="What is seeking awareness?"
                autoComplete="off"
                aria-describedby={`tarot-question-helper${questionError ? ' tarot-question-error' : ''}`}
                aria-invalid={Boolean(questionError)}
                className="min-h-[96px] w-full resize-none border border-[color:var(--gilt)]/45 bg-[color:var(--bone)] px-4 py-4 font-ritual text-xl leading-snug text-[color:var(--bg)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--bg)]/55 focus:border-[color:var(--gilt)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--gilt)_18%,transparent)] sm:px-5 sm:text-2xl"
              />
              <p id="tarot-question-helper" className="max-w-[58ch] text-xs leading-relaxed text-[color:var(--mist)]">
                Hold one clear question. A sentence or two is enough; the reading will follow the attention you bring.
              </p>
              {questionError && <p id="tarot-question-error" role="alert" className="text-sm text-red-200">{questionError}</p>}
            </div>

            <fieldset className="space-y-3 border-0 p-0">
              <legend className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)] sm:tracking-[0.2em]">
                <Triangle size={12} className="rotate-180" /> Intention
              </legend>
              <div className="flex flex-wrap gap-x-1 gap-y-2">
                {INTENTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setIntention(option)}
                    aria-pressed={intention === option}
                    className={`inline-flex min-h-[44px] items-center border-b px-3 py-2 text-xs uppercase tracking-[0.1em] transition-[border-color,color] sm:tracking-[0.14em] ${
                      intention === option
                        ? 'border-[color:var(--gilt)] text-[color:var(--bone)]'
                        : 'border-transparent text-[color:var(--mist)] hover:border-[color:var(--copper)] hover:text-[color:var(--bone)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3 border-0 p-0">
              <legend className="text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)] sm:tracking-[0.2em]">Choose the spread</legend>
              <div className="grid grid-cols-1 border-y border-[color:var(--copper)]/28 md:grid-cols-3">
                {[
                  { id: 'one-card', name: 'Focus', desc: 'Single insight', icon: CircleDot },
                  { id: 'three-card', name: 'Trinity', desc: 'Context · center · outcome', icon: Triangle },
                  { id: 'celtic-cross', name: 'Celtic', desc: 'A complete field', icon: Infinity },
                ].map((spread, index) => (
                  <button
                    key={spread.id}
                    type="button"
                    onClick={() => setSelectedSpread(spread.id as SpreadType)}
                    aria-pressed={selectedSpread === spread.id}
                    className={`group/btn flex min-h-[88px] items-center gap-4 border-[color:var(--copper)]/22 px-4 py-4 text-left transition-[background-color,color] md:border-l ${index === 0 ? 'md:border-l-0' : ''} ${
                      selectedSpread === spread.id
                        ? 'bg-[color:var(--gilt)]/12 text-[color:var(--bone)]'
                        : 'text-[color:var(--mist)] hover:bg-[color:var(--bone)]/5 hover:text-[color:var(--bone)]'
                    }`}
                  >
                    <spread.icon size={18} className="shrink-0 text-[color:var(--gilt)] transition-colors group-hover/btn:text-[color:var(--bone)]" />
                    <span>
                      <span className="block font-ritual text-2xl text-[color:var(--bone)]">{spread.name}</span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.1em] text-[color:var(--mist)] sm:tracking-[0.14em]">{spread.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className="flex min-h-[52px] w-full items-center justify-center border border-[color:var(--gilt)]/70 bg-[color:var(--gilt)]/16 px-6 py-3 text-sm uppercase tracking-[0.16em] text-[color:var(--bone)] transition-[background-color,border-color] hover:border-[color:var(--gilt)] hover:bg-[color:var(--gilt)]/24 sm:tracking-[0.22em]"
            >
              Reveal the cards
            </button>
          </form>
        </section>

        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:gap-8 sm:tracking-[0.18em]">
            <button type="button" onClick={() => onNavigate('journal')} className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Journal
            </button>
            <button type="button" onClick={() => onNavigate('decks')} className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Decks
            </button>
            <button type="button" onClick={() => onNavigate('settings')} className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Settings
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 border-b border-[color:var(--copper)]/30 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] sm:tracking-[0.18em]"
          >
            <ExternalLink size={12} /> Return to Awareness Paradox
          </Link>
        </div>
      </div>
    </TarotShell>
  );
};

export default Home;
