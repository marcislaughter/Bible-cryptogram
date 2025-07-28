import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CryptogramGame from './components/CryptogramGame';
import UnscrambleGame from './components/UnscrambleGame';
import FirstLetterGame from './components/FirstLetterGame';
import FirstLetterTestGame from './components/FirstLetterTestGame';
import ReferenceMatchGame from './components/ReferenceMatchGame';
import Instructions from './components/Instructions';
import UnscrambleInstructions from './components/UnscrambleInstructions';
import FirstLetterInstructions from './components/FirstLetterInstructions';
import ReferenceMatchInstructions from './components/ReferenceMatchInstructions';
import WhyMemorize from './components/WhyMemorize.tsx';
import StatementOfFaith from './components/StatementOfFaith.tsx';
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
      {gameType === 'first-letter' && (
        <FirstLetterGame 
          gameType={gameType} 
          onGameTypeChange={handleGameTypeChange}
          currentVerse={currentVerse}
          onVerseChange={handleVerseChange}
        />
      )}
      {gameType === 'first-letter-test' && (
        <FirstLetterTestGame 
          gameType={gameType} 
          onGameTypeChange={handleGameTypeChange}
          currentVerse={currentVerse}
          onVerseChange={handleVerseChange}
        />
      )}
      {gameType === 'reference-match' && (
        <ReferenceMatchGame 
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
        <Route path="/unscramble-instructions" element={<UnscrambleInstructions />} />
        <Route path="/first-letter-instructions" element={<FirstLetterInstructions />} />
        <Route path="/reference-match-instructions" element={<ReferenceMatchInstructions />} />
        <Route path="/memorization" element={<WhyMemorize />} />
        <Route path="/faith" element={<StatementOfFaith />} />
      </Routes>
    </Router>
  );
}

export default App;
