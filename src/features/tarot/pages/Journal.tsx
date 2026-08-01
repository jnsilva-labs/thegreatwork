'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Search } from '../icons';
import TarotCardFace from '../components/TarotCardFace';
import TarotShell from '../components/TarotShell';
import { Reading, TarotView } from '../types';
import { deleteReading, getReadings, updateReadingNotes } from '../services/storageService';

interface JournalProps {
  onNavigate: (view: TarotView) => void;
}

const Journal: React.FC<JournalProps> = ({ onNavigate }) => {
  const [readings, setReadings] = useState<Reading[]>(() => getReadings());
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const filteredReadings = readings.filter((reading) =>
    reading.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.intention?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.interpretation?.mirrorStatement.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleNotesChange = (readingId: string, notes: string) => {
    setReadings((prev) => prev.map((reading) => (reading.id === readingId ? { ...reading, notes } : reading)));
  };

  const handleNotesBlur = (readingId: string, notes: string) => {
    updateReadingNotes(readingId, notes);
  };

  const handleDelete = (readingId: string) => {
    deleteReading(readingId);
    setReadings((prev) => prev.filter((reading) => reading.id !== readingId));
    setConfirmingDeleteId(null);
  };

  return (
    <TarotShell>
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-16 md:px-12">
        <header className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('home')} aria-label="Return to tarot home" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[color:var(--copper)]/18 px-3 py-2 text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--gilt)]">Journal</p>
            <h1 className="font-ritual text-4xl text-[color:var(--bone)]">Saved readings</h1>
          </div>
        </header>

        <div className="relative">
          <label htmlFor="journal-search" className="sr-only">Search saved readings</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--mist)]/72" size={18} />
          <input
            id="journal-search"
            name="search"
            type="text"
            placeholder="Search your journey..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            autoComplete="off"
            className="min-h-[44px] w-full border border-[color:var(--copper)]/16 bg-[rgba(6,11,19,0.72)] py-3 pl-12 pr-4 text-[color:#D5D0C6] outline-none transition-[border-color] focus:border-[color:var(--gilt)]/42"
          />
        </div>

        <div className="space-y-4">
          {filteredReadings.length === 0 ? (
            <div className="py-12 text-center italic text-[color:var(--mist)]/72">
              {readings.length === 0
                ? 'The page is blank. Draw a reading and it will be kept here.'
                : 'No entries match your search.'}
            </div>
          ) : (
            filteredReadings.map((reading) => (
              <div key={reading.id} className="group border border-[color:var(--copper)]/14 bg-[rgba(6,11,19,0.72)] p-6 transition-colors hover:border-[color:var(--gilt)]/26">
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

                <div className="mt-5 border-t border-[color:var(--copper)]/10 pt-4">
                  <label
                    htmlFor={`notes-${reading.id}`}
                    className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]/72"
                  >
                    Your reflection
                  </label>
                  <textarea
                    id={`notes-${reading.id}`}
                    value={reading.notes ?? ''}
                    onChange={(event) => handleNotesChange(reading.id, event.target.value)}
                    onBlur={(event) => handleNotesBlur(reading.id, event.target.value)}
                    placeholder="What did this reading stir? Write it while it is warm."
                    rows={2}
                    className="w-full resize-y border border-[color:var(--copper)]/14 bg-[rgba(4,7,13,0.6)] p-3 text-sm leading-relaxed text-[color:#D5D0C6] outline-none transition-[border-color] placeholder:text-[color:var(--mist)]/40 focus:border-[color:var(--gilt)]/42"
                  />
                </div>

                <div className="mt-3 flex justify-end">
                  {confirmingDeleteId === reading.id ? (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[color:var(--mist)]">Remove this reading for good?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(reading.id)}
                        className="min-h-[44px] uppercase tracking-[0.22em] text-red-300/90 transition hover:text-red-200"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="min-h-[44px] uppercase tracking-[0.22em] text-[color:var(--mist)]/72 transition hover:text-[color:var(--bone)]"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(reading.id)}
                      className="min-h-[44px] text-[10px] uppercase tracking-[0.24em] text-[color:var(--mist)]/48 transition hover:text-red-300/80"
                    >
                      Remove entry
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TarotShell>
  );
};

export default Journal;
