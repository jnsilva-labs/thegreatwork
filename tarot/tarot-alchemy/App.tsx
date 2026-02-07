import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Journal from './pages/Journal';
import DeckManager from './pages/DeckManager';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/decks" element={<DeckManager />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
};

export default App;