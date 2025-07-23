import React, { useState, useEffect } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, getChapterFromReference } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ReferenceMatch.css';

// Import the images
import img1Cor111 from '../assets/1cor_11_1_realistic.jpg';
import img1Cor112 from '../assets/1cor_11_2_realistic.jpg';
import img1Cor113 from '../assets/1cor_11_3_realistic.jpg';
import img1Cor114 from '../assets/1cor_11_4_realistic.jpg';
import img1Cor115 from '../assets/1cor_11_5_realistic.jpg';

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

// Color wheel mapping for verse numbers
const COLOR_WHEEL: Record<number, { color: string; name: string }> = {
  1: { color: '#00008B', name: 'dark blue' },
  2: { color: '#8B0000', name: 'red' },
  3: { color: '#228B22', name: 'green' },
  4: { color: '#FF8C00', name: 'orange' },
  5: { color: '#9370DB', name: 'purple' },
  6: { color: '#00FFFF', name: 'cyan' },
  7: { color: '#8B4513', name: 'brown' },
  8: { color: '#00FF00', name: 'lime' },
  9: { color: '#FFFF00', name: 'yellow' },
  10: { color: '#FF69B4', name: 'pink' }
};

// Function to get image and color for any verse reference based on ending digit
const getReferenceStyle = (reference: string) => {
  // Extract verse number from any Bible reference (e.g., "John 3:16" -> 16, "Psalm 23:1" -> 1)
  const verseMatch = reference.match(/:(\d+)(?:-\d+)?$/);
  if (!verseMatch) {
    // Fallback if no verse number found
    return {
      backgroundImage: 'none', // Override the default CSS background image
      backgroundColor: 'rgba(0, 0, 139, 0.3)',
      borderColor: '#00008B'
    };
  }
  
  const verseNumber = parseInt(verseMatch[1]);
  const lastDigit = verseNumber % 10; // Get last digit (0-9)
  const colorKey = lastDigit === 0 ? 10 : lastDigit; // Map 0 to 10 for color wheel
  const color = COLOR_WHEEL[colorKey];
  
  if (!color) {
    // Fallback if color not found
    return {
      backgroundImage: 'none', // Override the default CSS background image
      backgroundColor: 'rgba(0, 0, 139, 0.3)',
      borderColor: '#00008B'
    };
  }
  
  // Check if this is exactly 1 Cor 11:1, 11:2, 11:3, 11:4, or 11:5 (exact match only)
  const cor11ExactMatch = reference.match(/1\s*Cor(?:inthians)?\s*11:([1-5])$/i);
  if (cor11ExactMatch) {
    const cor11Verse = parseInt(cor11ExactMatch[1]);
    const imageMap: Record<number, string> = {
      1: img1Cor111,
      2: img1Cor112,
      3: img1Cor113,
      4: img1Cor114,
      5: img1Cor115
    };
    
    if (imageMap[cor11Verse]) {
      return {
        backgroundImage: `url(${imageMap[cor11Verse]})`,
        backgroundColor: `${color.color}80`, // Add 80 for 50% opacity
        borderColor: color.color
      };
    }
  }
  
  // For all other references, use 30% transparent color background (no image)
  return {
    backgroundImage: 'none', // Override the default CSS background image
    backgroundColor: `${color.color}30`, // 30% opacity like the image cards
    borderColor: color.color
  };
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
    if (clickedCard.isMatched) {
      return;
    }

    // If the card is already selected, deselect it
    if (clickedCard.isSelected) {
      const newCards = cards.map(card =>
        card.id === clickedCard.id ? { ...card, isSelected: false } : card
      );
      setCards(newCards);
      
      // Remove from selectedCards array
      setSelectedCards(prev => prev.filter(card => card.id !== clickedCard.id));
      return;
    }

    // If we already have 2 cards selected, don't allow selecting more
    if (selectedCards.length >= 2) {
      return;
    }

    // Select the card
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
        }, 500);
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
        }, 800);
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
    
    // Scroll to top of page
    window.scrollTo(0, 0);
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
          {cards.map((card) => {
            const referenceStyle = card.type === 'reference' && !card.isMatched ? getReferenceStyle(card.content) : null;
            
            return (
              <div
                key={card.id}
                className={`match-card ${card.type} ${
                  card.isSelected ? 'selected' : ''
                } ${
                  card.isMatched ? 'matched' : ''
                }`}
                style={referenceStyle ? {
                  backgroundImage: referenceStyle.backgroundImage,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  backgroundColor: referenceStyle.backgroundColor,
                  // Don't override border color when selected - let CSS handle the white border
                  ...(card.isSelected ? {} : { borderColor: referenceStyle.borderColor })
                } : {}}
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
            );
          })}
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