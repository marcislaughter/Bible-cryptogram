import React, { useState, useEffect } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, getChapterFromReference } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './ReferenceMatch.css';

// Dynamic image loading using Vite's import.meta.glob
// This automatically imports all images matching the pattern
const imageModules = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });

// Create dynamic image mapping
const createImageMap = () => {
  const imageMap: Record<string, string> = {};
  
  Object.entries(imageModules).forEach(([path, module]) => {
    // Extract filename without extension from path
    // '../assets/1cor_11_1_realistic.jpg' -> '1cor_11_1_realistic'
    const filename = path.split('/').pop()?.replace(/\.(png|jpg|jpeg|svg)$/i, '') || '';
    
    // Get the default export (the image URL)
    const imageUrl = (module as { default: string }).default;
    
    // Create mapping with original filename as key
    imageMap[filename] = imageUrl;
    
    // Also create simplified mapping for the reference system
    // 'filename' could be '1cor_11_1_realistic' -> create '1cor_11_1' mapping
    const simplifiedKey = filename.replace(/_realistic$/, '');
    if (simplifiedKey !== filename) {
      imageMap[simplifiedKey] = imageUrl;
    }
  });
  
  console.log('Dynamic image map created:', Object.keys(imageMap));
  return imageMap;
};

// Create the image map at module load time
const IMAGE_MAP = createImageMap();

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Function to convert reference to image key
const getReferenceImageKey = (reference: string): string | null => {
  // Convert reference formats to image filename patterns
  
  // Bible verses: "1 Cor 11:1" -> "1cor_11_1"
  const bibleMatch = reference.match(/(\d*)\s*([A-Za-z]+)\s*(\d+):(\d+)/i);
  if (bibleMatch) {
    const [, bookNum, book, chapter, verse] = bibleMatch;
    
    // Normalize book names
    const bookKey = normalizeBookName(bookNum + book);
    if (bookKey) {
      return `${bookKey}_${chapter}_${verse}`;
    }
  }
  
  // Other reference types can be added here
  // Example: "Psalm 23:1" -> "ps_23_1"
  // Example: "John 3:16" -> "john_3_16"
  
  return null;
};

// Helper function to normalize book names to consistent keys
const normalizeBookName = (bookInput: string): string | null => {
  const normalized = bookInput.toLowerCase().replace(/\s+/g, '');
  
  // Book name mappings - expand this as you add more books
  const bookMappings: Record<string, string> = {
    '1cor': '1cor',
    '1corinthians': '1cor',
    '2cor': '2cor', 
    '2corinthians': '2cor',
    'john': 'john',
    'psalm': 'ps',
    'psalms': 'ps',
    'genesis': 'gen',
    'matthew': 'matt',
    'mark': 'mark',
    'luke': 'luke',
    'romans': 'rom',
    // Add more mappings as needed
  };
  
  return bookMappings[normalized] || null;
};

// Function to get image URL for a reference
const getImageForReference = (reference: string): string | null => {
  const imageKey = getReferenceImageKey(reference);
  if (!imageKey) return null;
  
  // Try multiple possible filename patterns in order of preference
  const possibleKeys = [
    `${imageKey}_realistic`,     // prefer realistic versions
    imageKey,                    // exact match
    `${imageKey}_artistic`,      // artistic versions
    `${imageKey}_illustration`   // illustration versions
  ];
  
  for (const key of possibleKeys) {
    if (IMAGE_MAP[key]) {
      console.log(`Found image for ${reference}: ${key}`);
      return IMAGE_MAP[key];
    }
  }
  
  return null;
};

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

// Function to get styling info for any verse reference based on ending digit
const getReferenceStyleInfo = (reference: string) => {
  // Extract verse number from any Bible reference (e.g., "John 3:16" -> 16, "Psalm 23:1" -> 1)
  const verseMatch = reference.match(/:(\d+)(?:-\d+)?$/);
  if (!verseMatch) {
    // Fallback if no verse number found
    return {
      hasImage: false,
      cssClass: 'no-image',
      cssVariables: {
        '--reference-bg-color': 'rgba(0, 0, 139, 0.3)',
        '--reference-bg-color-rgba': 'rgba(0, 0, 139, 0.3)',
        '--reference-border-color': '#00008B'
      }
    };
  }
  
  const verseNumber = parseInt(verseMatch[1]);
  const lastDigit = verseNumber % 10; // Get last digit (0-9)
  const colorKey = lastDigit === 0 ? 10 : lastDigit; // Map 0 to 10 for color wheel
  const color = COLOR_WHEEL[colorKey];
  
  if (!color) {
    // Fallback if color not found
    return {
      hasImage: false,
      cssClass: 'no-image',
      cssVariables: {
        '--reference-bg-color': 'rgba(0, 0, 139, 0.3)',
        '--reference-bg-color-rgba': 'rgba(0, 0, 139, 0.3)',
        '--reference-border-color': '#00008B'
      }
    };
  }
  
  // Check if we have an image for this reference using the dynamic system
  const imageUrl = getImageForReference(reference);
  
  if (imageUrl) {
    console.log('Using dynamic image for:', reference);
    return {
      hasImage: true,
      cssClass: 'has-image',
      cssVariables: {
        '--reference-bg-image': `url(${imageUrl})`,
        '--reference-bg-color': `${color.color}80`, // 50% opacity for images
        '--reference-bg-color-rgba': `${hexToRgba(color.color, 0.5)}`, // RGBA fallback
        '--reference-border-color': color.color
      }
    };
  }
  
  // For all other references, use 30% transparent color background (no image)
  return {
    hasImage: false,
    cssClass: 'no-image',
    cssVariables: {
      '--reference-bg-color': `${color.color}30`, // 30% opacity
      '--reference-bg-color-rgba': `${hexToRgba(color.color, 0.3)}`, // RGBA fallback
      '--reference-border-color': color.color
    }
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

interface FeedbackCard {
  id: string;
  type: 'correct' | 'incorrect';
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
  const [feedbackCards, setFeedbackCards] = useState<FeedbackCard[]>([]);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  
  // Add accordion state near the other state declarations
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);

  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});

  // Function to detect mobile devices
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768 && 'ontouchstart' in window);
  };

  // Function to scroll down slightly on mobile to hide browser navigation
  const hideMobileBrowserNavigation = () => {
    if (isMobileDevice() && !isSolved) { // Don't interfere with win message
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        window.scrollTo({
          top: 1,
          behavior: 'smooth'
        });
      }, 50); // Shorter delay to avoid conflict
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let intervalId: number;

    if (gameStartTime && !isSolved) {
      intervalId = setInterval(() => {
        const currentTime = Math.floor((Date.now() - gameStartTime) / 1000);
        setElapsedTime(currentTime);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStartTime, isSolved]);

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
    setFeedbackCards([]);
    setIsAccordionExpanded(false); // Reset accordion state
    
    // Reset timer
    setElapsedTime(0);
    setGameStartTime(Date.now());
    
    // Hide mobile browser navigation after generating new game
    hideMobileBrowserNavigation();
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Hide mobile browser navigation on component mount
  useEffect(() => {
    hideMobileBrowserNavigation();
  }, []);

  const handleCardClick = (clickedCard: MatchCard) => {
    if (clickedCard.isMatched) {
      return;
    }

    // Prevent clicking cards that are showing feedback
    const cardHasFeedback = feedbackCards.some(f => f.id === clickedCard.id);
    if (cardHasFeedback) {
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
      
      // Show immediate visual feedback
      const isMatch = card1.verseId === card2.verseId && card1.type !== card2.type;
      const feedbackType = isMatch ? 'correct' : 'incorrect';
      
      // Set feedback for both cards AND clear their selected state immediately
      setFeedbackCards([
        { id: card1.id, type: feedbackType },
        { id: card2.id, type: feedbackType }
      ]);
      
      // Clear selected state from the actual cards to prevent CSS conflicts
      setCards(prevCards =>
        prevCards.map(card =>
          (card.id === card1.id || card.id === card2.id)
            ? { ...card, isSelected: false }
            : card
        )
      );
      
      // Clear selectedCards immediately to allow new selections during animation
      setSelectedCards([]);
      
      if (isMatch) {
        // Match found - show green feedback, then mark as matched
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.verseId === card1.verseId
                ? { ...card, isMatched: true, isSelected: false }
                : card
            )
          );
          setMatchedPairs(prev => [...prev, card1.verseId]);
          setFeedbackCards([]);
          
          // Check if game is complete
          if (matchedPairs.length + 1 === 6) {
            setIsSolved(true);
          }
        }, 800); // Show green feedback for 800ms
      } else {
        // No match - show red feedback, then revert
        setIncorrectAttempts(prev => prev + 1);
        
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.isSelected && !card.isMatched
                ? { ...card, isSelected: false }
                : card
            )
          );
          setFeedbackCards([]);
        }, 1000); // Show red feedback for 1000ms
      }
    }
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

  // Reference Match specific win message handler
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('reference-match-win-gradient');
      
      // Reference Match uses animated scroll with bounce effect
              setTimeout(() => {
          const solvedMessage = document.querySelector('.reference-match-solved-message') as HTMLElement;
          if (solvedMessage) {
            // First scroll past the target, then back to create bounce effect
            window.scrollTo({
              top: solvedMessage.offsetTop - 50,
              behavior: 'smooth'
            });
            setTimeout(() => {
              solvedMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }, 300);
          }
        }, 200); // Longer delay for reference match
    } else {
      document.body.classList.remove('reference-match-win-gradient');
    }
    
    return () => {
      document.body.classList.remove('reference-match-win-gradient');
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
        {/* Timer Display - hidden when game is solved */}
        {!isSolved && (
          <div className="game-timer">
            Time: {formatTime(elapsedTime)}
          </div>
        )}
        
        {wordStatsEnabled && <WordStats />}
        
        <div className="cards-grid">
          {cards.map((card) => {
            const referenceStyleInfo = card.type === 'reference' && !card.isMatched ? getReferenceStyleInfo(card.content) : null;
            const feedbackCard = feedbackCards.find(f => f.id === card.id);
            
            return (
              <div
                key={card.id}
                className={`match-card ${card.type} ${
                  card.isSelected ? 'selected' : ''
                } ${
                  card.isMatched ? 'matched' : ''
                } ${
                  feedbackCard ? feedbackCard.type : ''
                } ${
                  referenceStyleInfo ? referenceStyleInfo.cssClass : ''
                }`}
                style={referenceStyleInfo ? referenceStyleInfo.cssVariables as React.CSSProperties : {}}
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
          <div className="reference-match-solved-message">
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
              <p className="time-text">
                Time: {formatTime(elapsedTime)}
              </p>
            </div>
            
            {/* NEW: Replace the old matches-summary div with this accordion */}
            <div className="matches-accordion">
              <button 
                className={`accordion-header ${isAccordionExpanded ? 'expanded' : ''}`}
                onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
              >
                <span>View completed matches ({gameVerses.length})</span>
                <span className="accordion-arrow">
                  <FontAwesomeIcon icon={isAccordionExpanded ? faChevronDown : faChevronRight} />
                </span>
              </button>
              <div className={`accordion-content ${isAccordionExpanded ? 'expanded' : ''}`}>
                <div className="matches-summary">
                  {gameVerses.map((verse) => (
                    <div key={verse.reference} className="match-summary">
                      <strong>{verse.reference}</strong>: {verse.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="solved-buttons">
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