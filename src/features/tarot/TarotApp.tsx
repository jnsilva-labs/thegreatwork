'use client';

import React, { useMemo, useState } from 'react';
import DeckManager from './pages/DeckManager';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Reading from './pages/Reading';
import Settings from './pages/Settings';
import { ReadingRequest, TarotView } from './types';

const TarotApp: React.FC = () => {
  const [view, setView] = useState<TarotView>('home');
  const [readingRequest, setReadingRequest] = useState<ReadingRequest | null>(null);

  const content = useMemo(() => {
    if (view === 'reading') {
      return <Reading request={readingRequest} onNavigate={setView} />;
    }
    if (view === 'journal') {
      return <Journal onNavigate={setView} />;
    }
    if (view === 'decks') {
      return <DeckManager onNavigate={setView} />;
    }
    if (view === 'settings') {
      return <Settings onNavigate={setView} />;
    }

    return (
      <Home
        onNavigate={setView}
        onStartReading={(request) => {
          setReadingRequest(request);
          setView('reading');
        }}
      />
    );
  }, [readingRequest, view]);

  return <div className="relative z-20">{content}</div>;
};

export default TarotApp;
