import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ReferenceMatch.css';

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Utility function to get random verses
const getRandomVerses = (count: number, currentVerse: BibleVerse): BibleVerse[] => {
  // Always include the current verse
  const verses = [currentVerse];
  
  // Get other random verses
  const otherVerses = BIBLE_VERSES.filter(v => v.reference !== currentVerse.reference);
  const shuffledOthers = shuffleArray(otherVerses);
  
  return verses.concat(shuffledOthers.slice(0, count - 1));
};

interface MatchCard {
  id: string;
  type: 'verse' | 'reference';
  content: string;
  verseId: string; // Links verse and reference cards
  isSelected: boolean;
  isMatched: boolean;
}

interface ReferenceMatchGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

const ReferenceMatchGame: React.FC<ReferenceMatchGameProps> = ({ 
  gameType = 'reference-match', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedPairs, setRevealedPairs] = useState<string[]>([]);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [gameVerses, setGameVerses] = useState<BibleVerse[]>([]);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});

  const generateNewGame = () => {
    // Get 5 random verses including the current one
    const selectedVerses = getRandomVerses(5, currentVerse);
    setGameVerses(selectedVerses);
    
    // Create cards for verses and references
    const newCards: MatchCard[] = [];
    
    selectedVerses.forEach((verse, index) => {
      // Verse card
      newCards.push({
        id: `verse-${index}`,
        type: 'verse',
        content: verse.text,
        verseId: verse.reference,
        isSelected: false,
        isMatched: false
      });
      
      // Reference card
      newCards.push({
        id: `reference-${index}`,
        type: 'reference',
        content: verse.reference,
        verseId: verse.reference,
        isSelected: false,
        isMatched: false
      });
    });
    
    // Shuffle all cards
    const shuffledCards = shuffleArray(newCards);
    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedPairs([]);
    setIncorrectAttempts(0);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  const handleCardClick = (clickedCard: MatchCard) => {
    if (clickedCard.isMatched || clickedCard.isSelected || selectedCards.length >= 2) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isSelected: true } : card
    );
    setCards(newCards);

    const newSelectedCards = [...selectedCards, { ...clickedCard, isSelected: true }];
    setSelectedCards(newSelectedCards);

    // Check for match when 2 cards are selected
    if (newSelectedCards.length === 2) {
      const [card1, card2] = newSelectedCards;
      
      if (card1.verseId === card2.verseId && card1.type !== card2.type) {
        // Match found!
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.verseId === card1.verseId
                ? { ...card, isMatched: true, isSelected: false }
                : card
            )
          );
          setMatchedPairs(prev => [...prev, card1.verseId]);
          setSelectedCards([]);
          
          // Check if game is complete
          if (matchedPairs.length + 1 === 5) {
            setIsSolved(true);
          }
        }, 1000);
      } else {
        // No match
        setIncorrectAttempts(prev => prev + 1);
        
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.isSelected && !card.isMatched
                ? { ...card, isSelected: false }
                : card
            )
          );
          setSelectedCards([]);
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
    setMatchedPairs([]);
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedPairs([]);
    setAutoCheckEnabled(false);
    setWordStatsEnabled(false);
    setIncorrectAttempts(0);
    generateNewGame();
  };

  const handleHint = () => {
    if (hintsRemaining <= 0 || isSolved) return;

    // Find an unmatched pair and reveal it
    const unmatchedVerseIds = gameVerses
      .map(v => v.reference)
      .filter(ref => !matchedPairs.includes(ref) && !revealedPairs.includes(ref));
    
    if (unmatchedVerseIds.length > 0) {
      const targetVerseId = unmatchedVerseIds[0];
      
      setCards(prevCards =>
        prevCards.map(card =>
          card.verseId === targetVerseId
            ? { ...card, isMatched: true }
            : card
        )
      );
      
      setMatchedPairs(prev => [...prev, targetVerseId]);
      setRevealedPairs(prev => [...prev, targetVerseId]);
      setSelectedCards([]);
      
      // Check if game is complete
      if (matchedPairs.length + 1 === 5) {
        setIsSolved(true);
      }
    }

    setHintsRemaining(prev => prev - 1);
  };

  const handleAutoCheck = () => {
    setAutoCheckEnabled(!autoCheckEnabled);
  };

  const handleVerseChange = (verse: BibleVerse) => {
    onVerseChange(verse);
  };

  // Function to get the next verse reference
  const getNextVerseReference = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.reference === currentVerse.reference);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    return BIBLE_VERSES[nextIndex].reference;
  };

  const handleNextVerse = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.reference === currentVerse.reference);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    onVerseChange(BIBLE_VERSES[nextIndex]);
  };

  const handleRepeatVerse = () => {
    handleReset();
  };

  // Add useEffect to manage body background when puzzle is solved
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('win-gradient');
      
      // Scroll to completion message on mobile
      setTimeout(() => {
        const solvedMessage = document.querySelector('.solved-message');
        if (solvedMessage) {
          solvedMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    } else {
      document.body.classList.remove('win-gradient');
    }
    
    return () => {
      document.body.classList.remove('win-gradient');
    };
  }, [isSolved]);

  return (
    <>
      <GameHeader 
        wordStatsEnabled={wordStatsEnabled}
        onToggleWordStats={() => setWordStatsEnabled(!wordStatsEnabled)}
        currentVerse={currentVerse}
        onVerseChange={handleVerseChange}
        gameType={gameType}
        onGameTypeChange={onGameTypeChange}
      />

      <div className="reference-match-container">
        <Controls
          onReset={handleReset}
          onHint={handleHint}
          onAutoCheck={handleAutoCheck}
          hintsRemaining={hintsRemaining}
          autoCheckEnabled={autoCheckEnabled}
          showAutoCheck={false}
        />
        
        {wordStatsEnabled && <WordStats />}
        
        <div className="game-instructions">
          <h2>Match Verses with References</h2>
          <p>Click cards to match Bible verses with their correct references. Match all 5 pairs to win!</p>
        </div>
        
        <div className="cards-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`match-card ${card.type} ${
                card.isSelected ? 'selected' : ''
              } ${
                card.isMatched ? 'matched' : ''
              } ${
                revealedPairs.includes(card.verseId) ? 'hint-revealed' : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-content">
                {card.type === 'verse' ? (
                  <div className="verse-content">
                    {card.content}
                  </div>
                ) : (
                  <div className="reference-content">
                    {card.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="game-progress">
          <div className="progress-text">
            Matched: {matchedPairs.length} / 5
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(matchedPairs.length / 5) * 100}%` }}
            />
          </div>
        </div>
        
        {isSolved && (
          <div className="solved-message">
            {(() => {
              const score = Math.round(((5 - revealedPairs.length - incorrectAttempts) / 5) * 100);
              if (score === 100) {
                return <h2>Perfect! You matched all verses!</h2>;
              } else if (score >= 80) {
                return <h2>Excellent! Great memory work!</h2>;
              } else if (score >= 60) {
                return <h2>Good job! Keep practicing!</h2>;
              } else {
                return <h2>Nice effort! Try again for a better score!</h2>;
              }
            })()}
            <div className="score-display">
              <p className="score-text">
                Score: {Math.round(((5 - revealedPairs.length - incorrectAttempts) / 5) * 100)}%
              </p>
            </div>
            <div className="matches-summary">
              <h3>Completed Matches:</h3>
              {gameVerses.map((verse) => (
                <div key={verse.reference} className="match-summary">
                  <strong>{verse.reference}</strong>: {verse.text}
                </div>
              ))}
            </div>
            <div className="solved-buttons">
              <button onClick={handleRepeatVerse} className="repeat-verse-btn">
                <FontAwesomeIcon icon={faArrowLeft} /> Play Again
              </button>
              <button onClick={handleNextVerse} className="next-verse-btn">
                Next Game <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}
        
        <div className="citation">
          Match Bible verses with their references to strengthen your Scripture knowledge and memorization.
        </div>
      </div>
    </>
  );
};

export default ReferenceMatchGame; 