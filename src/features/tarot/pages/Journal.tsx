'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Search } from '../icons';
import TarotCardFace from '../components/TarotCardFace';
import TarotShell from '../components/TarotShell';
import { Reading, TarotView } from '../types';
import { getReadings } from '../services/storageService';

interface JournalProps {
  onNavigate: (view: TarotView) => void;
}

const Journal: React.FC<JournalProps> = ({ onNavigate }) => {
  const [readings] = useState<Reading[]>(() => getReadings());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReadings = readings.filter((reading) =>
    reading.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.intention?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.interpretation?.mirrorStatement.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <TarotShell>
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-16 md:px-12">
        <header className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[color:var(--copper)]/18 px-3 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--gilt)]">Journal</p>
            <h1 className="font-ritual text-4xl text-[color:var(--bone)]">Saved readings</h1>
          </div>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--mist)]/72" size={18} />
          <input
            type="text"
            placeholder="Search your journey..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.72)] py-3 pl-12 pr-4 text-[color:#D5D0C6] outline-none transition focus:border-[color:var(--gilt)]/42"
          />
        </div>

        <div className="space-y-4">
          {filteredReadings.length === 0 ? (
            <div className="py-12 text-center italic text-[color:var(--mist)]/72">No entries found. The page is blank.</div>
          ) : (
            filteredReadings.map((reading) => (
              <div key={reading.id} className="border border-[color:var(--copper)]/14 bg-[rgba(6,11,19,0.72)] p-6 transition group hover:border-[color:var(--gilt)]/26">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="mb-1 block text-xs uppercase tracking-[0.28em] text-[color:var(--gilt)]">{reading.intention}</span>
                    <h3 className="font-ritual text-2xl text-[color:var(--bone)]">{reading.question || 'General Reading'}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[color:var(--mist)]">
                    <Calendar size={12} />
                    {new Date(reading.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {reading.cards.map((card, index) => (
                    <div key={`${reading.id}-${index}`} className="relative h-24 w-16 flex-shrink-0 overflow-hidden">
                      <TarotCardFace card={card} />
                      {card.isReversed && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-red-300 font-bold bg-black/20">REV</div>}
                    </div>
                  ))}
                </div>

                {reading.interpretation && (
                  <div className="border-t border-[color:var(--copper)]/10 pt-4">
                    <p className="mb-4 font-ritual text-xl italic text-[color:#D5D0C6]">&quot;{reading.interpretation.mirrorStatement}&quot;</p>

                    <div className="text-sm text-[color:var(--mist)]">
                      <span className="font-bold text-[color:var(--bone)]">Guidance: </span>
                      {reading.interpretation.practicalGuidance[0]}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </TarotShell>
  );
};

export default Journal;
