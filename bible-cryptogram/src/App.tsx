import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CryptogramGame from './components/CryptogramGame';
import UnscrambleGame from './components/UnscrambleGame';
import Instructions from './components/Instructions';
import ScriptureMemorization from './components/ScriptureMemorization';
import StatementOfFaith from './components/StatementOfFaith';
import type { GameType } from './components/GameHeader';
import { BIBLE_VERSES } from './data/bibleVerses';
import type { BibleVerse } from './data/bibleVerses';
import './App.css';

// Game container component that manages game switching
const GameContainer: React.FC = () => {
  const [gameType, setGameType] = useState<GameType>('cryptogram');
  const [currentVerse, setCurrentVerse] = useState<BibleVerse>(BIBLE_VERSES[0]);

  const handleGameTypeChange = (newGameType: GameType) => {
    setGameType(newGameType);
  };

  const handleVerseChange = (verse: BibleVerse) => {
    setCurrentVerse(verse);
  };

  return (
    <>
      {gameType === 'cryptogram' && (
        <CryptogramGame 
          gameType={gameType} 
          onGameTypeChange={handleGameTypeChange}
          currentVerse={currentVerse}
          onVerseChange={handleVerseChange}
        />
      )}
      {gameType === 'unscramble' && (
        <UnscrambleGame 
          gameType={gameType} 
          onGameTypeChange={handleGameTypeChange}
          currentVerse={currentVerse}
          onVerseChange={handleVerseChange}
        />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameContainer />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/memorization" element={<ScriptureMemorization />} />
        <Route path="/faith" element={<StatementOfFaith />} />
      </Routes>
    </Router>
  );
}

export default App;
