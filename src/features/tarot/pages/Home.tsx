'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CircleDot, ExternalLink, Infinity, Triangle } from '../icons';
import { INTENTIONS, ReadingRequest, SpreadType, TarotView } from '../types';
import TarotShell from '../components/TarotShell';

interface HomeProps {
  onNavigate: (view: TarotView) => void;
  onStartReading: (request: ReadingRequest) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onStartReading }) => {
  const [question, setQuestion] = useState('');
  const [intention, setIntention] = useState('General');

  const startReading = (spreadId: SpreadType) => {
    onStartReading({ question, intention, spreadId });
  };

  return (
    <TarotShell>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-12 px-6 py-20 text-center sm:px-10">
        <header className="space-y-6 animate-fade-in">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-[color:var(--gilt)] to-transparent opacity-50" />
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">Tarot Oracle</p>
          </div>

          <h1 className="font-ritual text-5xl leading-none text-[color:var(--bone)] sm:text-6xl md:text-7xl">
            Tarot <span className="text-[color:var(--gilt)]">Alchemy</span>
          </h1>

          <p className="mx-auto max-w-xl border-b border-[color:var(--copper)]/12 pb-6 text-sm leading-relaxed tracking-[0.08em] text-[color:#D5D0C6] sm:text-base">
            The mirror does not show you what you look like.
            <br />
            It shows you who you are becoming through attention.
          </p>
        </header>

        <section className="group relative w-full max-w-3xl animate-fade-in">
          <div className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l border-t border-[color:var(--gilt)]/28 transition-all group-hover:h-full group-hover:w-full group-hover:border-[color:var(--gilt)]/10" />
          <div className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b border-r border-[color:var(--gilt)]/28 transition-all group-hover:h-full group-hover:w-full group-hover:border-[color:var(--gilt)]/10" />

          <div className="space-y-10 border border-[color:var(--copper)]/16 bg-[linear-gradient(180deg,rgba(6,11,19,0.82),rgba(6,11,19,0.66))] p-8 sm:p-10">
            <div className="space-y-4">
              <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">
                <CircleDot size={10} /> The question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is seeking awareness?"
                className="w-full border-b border-[color:var(--copper)]/18 bg-transparent px-4 py-4 text-center font-ritual text-2xl text-[color:var(--bone)] outline-none transition placeholder:text-[color:var(--mist)]/40 focus:border-[color:var(--gilt)] sm:text-3xl"
              />
            </div>

            <div className="space-y-4">
              <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">
                <Triangle size={10} className="rotate-180" /> Intention
              </label>
              <div className="flex flex-wrap justify-center gap-3">
                {INTENTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setIntention(option)}
                    className={`inline-flex min-h-[40px] items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
                      intention === option
                        ? 'border-[color:var(--gilt)] bg-[rgba(184,155,94,0.12)] text-[color:var(--bone)]'
                        : 'border-[color:var(--copper)]/18 text-[color:var(--mist)] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-[color:var(--copper)]/12 pt-6 md:grid-cols-3">
              {[
                { id: 'one-card', name: 'Focus', desc: 'Single Insight', icon: CircleDot },
                { id: 'three-card', name: 'Trinity', desc: 'Past / Present / Future', icon: Triangle },
                { id: 'celtic-cross', name: 'Celtic', desc: 'Deep Analysis', icon: Infinity },
              ].map((spread) => (
                <button
                  key={spread.id}
                  type="button"
                  onClick={() => startReading(spread.id as SpreadType)}
                  className="group/btn flex flex-col items-center justify-center gap-3 border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.55)] p-6 text-center transition hover:border-[color:var(--gilt)]/42 hover:bg-[rgba(10,16,25,0.72)]"
                >
                  <spread.icon size={20} className="text-[color:var(--gilt)]/55 transition group-hover/btn:text-[color:var(--gilt)]" />
                  <div>
                    <div className="font-ritual text-3xl text-[color:var(--bone)]">{spread.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--mist)]">{spread.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[11px] uppercase tracking-[0.28em] text-[color:var(--mist)]">
            <button type="button" onClick={() => onNavigate('journal')} className="inline-flex items-center gap-2 transition hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Journal
            </button>
            <button type="button" onClick={() => onNavigate('decks')} className="inline-flex items-center gap-2 transition hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Decks
            </button>
            <button type="button" onClick={() => onNavigate('settings')} className="inline-flex items-center gap-2 transition hover:text-[color:var(--gilt)]">
              <span className="h-1 w-1 rounded-full bg-current" /> Settings
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[color:var(--copper)]/18 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            <ExternalLink size={12} /> Return to Awareness Paradox
          </Link>
        </div>
      </div>
    </TarotShell>
  );
};

export default Home;
