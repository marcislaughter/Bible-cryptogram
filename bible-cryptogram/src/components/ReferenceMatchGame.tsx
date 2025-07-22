import React, { useState, useEffect } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, getChapterFromReference } from '../data/bibleVerses';
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

// Utility function to get random verses from the same chapter
const getRandomVerses = (count: number, currentVerse: BibleVerse): BibleVerse[] => {
  // Get the chapter of the current verse
  const currentChapter = getChapterFromReference(currentVerse.reference);
  
  // Filter verses to only include those from the same chapter
  const chapterVerses = BIBLE_VERSES.filter(v => 
    getChapterFromReference(v.reference) === currentChapter
  );
  
  // If the chapter has fewer than the requested count, use all verses from the chapter
  if (chapterVerses.length <= count) {
    return shuffleArray(chapterVerses);
  }
  
  // Always include the current verse
  const verses = [currentVerse];
  
  // Get other random verses from the same chapter
  const otherVerses = chapterVerses.filter(v => v.reference !== currentVerse.reference);
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
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [gameVerses, setGameVerses] = useState<BibleVerse[]>([]);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});

  const generateNewGame = () => {
    // Get 6 random verses including the current one
    const selectedVerses = getRandomVerses(6, currentVerse);
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
          if (matchedPairs.length + 1 === 6) {
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
    setWordStatsEnabled(false);
    setIncorrectAttempts(0);
    generateNewGame();
  };



  const handleVerseChange = (verse: BibleVerse) => {
    onVerseChange(verse);
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

        
        {wordStatsEnabled && <WordStats />}
        
        <div className="cards-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`match-card ${card.type} ${
                card.isSelected ? 'selected' : ''
              } ${
                card.isMatched ? 'matched' : ''
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
        
        {isSolved && (
          <div className="solved-message">
            {(() => {
              const score = Math.round(((6 - incorrectAttempts) / 6) * 100);
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
                Score: {Math.round(((6 - incorrectAttempts) / 6) * 100)}%
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
      </div>
    </>
  );
};

export default ReferenceMatchGame; 