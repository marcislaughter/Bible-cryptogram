import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Unscramble.css';

// Utility function to scramble a word
const scrambleWord = (word: string): string => {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
};

interface UnscrambleGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

const UnscrambleGame: React.FC<UnscrambleGameProps> = ({ 
  gameType = 'unscramble', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [scrambledVerse, setScrambledVerse] = useState<string[]>([]);
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedWords, setRevealedWords] = useState<number[]>([]);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});
  const [currentGuess, setCurrentGuess] = useState('');
  const [hasInputError, setHasInputError] = useState(false);
  const [wordsWithIncorrectGuesses, setWordsWithIncorrectGuesses] = useState<number[]>([]);



  const generateNewGame = () => {
    // Parse the verse into words, handling punctuation
    const words = currentVerse.text.split(' ').map(word => {
      // Remove punctuation for scrambling but keep track of it
      const cleanWord = word.replace(/[^A-Z]/g, '');
      return cleanWord;
    }).filter(word => word.length > 0);

    // Store original words
    setOriginalWords(words);

    // Create scrambled versions
    const scrambled = words.map(word => {
      // Don't scramble single letters or very short words
      if (word.length <= 2) {
        return word;
      }
      let scrambledWord = scrambleWord(word);
      // Ensure the scrambled word is different from the original
      while (scrambledWord === word && word.length > 2) {
        scrambledWord = scrambleWord(word);
      }
      return scrambledWord;
    });

    setScrambledVerse(scrambled);
    setGuesses(new Array(words.length).fill(''));
    setCurrentWordIndex(0);
    setHintsRemaining(3);
    setRevealedWords([]);
    setIsSolved(false);
    setCurrentGuess('');
    setWordsWithIncorrectGuesses([]);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);



  const handleInputChange = (value: string) => {
    if (isSolved || !value) return;
    
    const upperValue = value.toUpperCase();
    
    // Check if the input is the correct first letter
    if (upperValue === originalWords[currentWordIndex]?.[0]) {
      // Correct guess - move to next word
      const newGuesses = [...guesses];
      newGuesses[currentWordIndex] = originalWords[currentWordIndex];
      setGuesses(newGuesses);
      
      // Move to next word or complete the puzzle
      if (currentWordIndex < originalWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentGuess('');
      } else {
        setIsSolved(true);
      }
      
      // Clear any error state
      setHasInputError(false);
    } else {
      // Wrong guess - show red feedback and clear input
      setHasInputError(true);
      setCurrentGuess('');
      
      // Track this word as having an incorrect guess
      if (!wordsWithIncorrectGuesses.includes(currentWordIndex)) {
        setWordsWithIncorrectGuesses(prev => [...prev, currentWordIndex]);
      }
      
      // Clear error state after 1 second
      setTimeout(() => {
        setHasInputError(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setGuesses(new Array(originalWords.length).fill(''));
    setCurrentWordIndex(0);
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedWords([]);
    setAutoCheckEnabled(false);
    setWordStatsEnabled(false);
    setCurrentGuess('');
    setHasInputError(false);
    setWordsWithIncorrectGuesses([]);
    generateNewGame();
  };

  const handleHint = () => {
    if (hintsRemaining <= 0 || isSolved) return;

    // Reveal the current word
    const newGuesses = [...guesses];
    newGuesses[currentWordIndex] = originalWords[currentWordIndex];
    setGuesses(newGuesses);
    setRevealedWords([...revealedWords, currentWordIndex]);

    // Move to next word
    if (currentWordIndex < originalWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentGuess('');
      setHasInputError(false);
    } else {
      setIsSolved(true);
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

  // Add useEffect to manage body background when puzzle is solved
  useEffect(() => {
    if (isSolved) {
      // Only show win gradient for perfect scores (100%)
      const score = Math.round(((originalWords.length - revealedWords.length - wordsWithIncorrectGuesses.length) / originalWords.length) * 100);
      if (score === 100) {
        document.body.classList.add('win-gradient');
      }
      
      // Scroll to completion message on mobile
      setTimeout(() => {
        const solvedMessage = document.querySelector('.solved-message');
        if (solvedMessage) {
          solvedMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100); // Small delay to ensure message is rendered
    } else {
      document.body.classList.remove('win-gradient');
    }
    
    return () => {
      document.body.classList.remove('win-gradient');
    };
  }, [isSolved, originalWords.length, revealedWords.length, wordsWithIncorrectGuesses.length]);

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

      <div className="unscramble-container">
        <Controls
          onReset={handleReset}
          onHint={handleHint}
          onAutoCheck={handleAutoCheck}
          hintsRemaining={hintsRemaining}
          autoCheckEnabled={autoCheckEnabled}
          showAutoCheck={false}
        />
        
        {wordStatsEnabled && <WordStats />}
        
        <div className="unscramble-verse-container">
          <div className="words-grid">
            {scrambledVerse.map((scrambledWord, wordIndex) => (
              <div
                key={wordIndex}
                className={`word-item ${
                  wordIndex === currentWordIndex ? 'current-word' : ''
                } ${
                  guesses[wordIndex] ? 'solved-word' : ''
                } ${
                  revealedWords.includes(wordIndex) ? 'hint-revealed' : ''
                }`}
              >
                <div className="scrambled-word">{scrambledWord}</div>
                <div className="word-input-container">
                  {guesses[wordIndex] ? (
                    <div className="solved-word-display">{guesses[wordIndex]}</div>
                  ) : wordIndex === currentWordIndex ? (
                    <div className="current-input">
                      <input
                        type="text"
                        value={currentGuess}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className={`word-input ${hasInputError ? 'incorrect' : ''}`}
                        placeholder="|"
                        maxLength={1}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="word-placeholder">?</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {isSolved && (
          <div className="solved-message">
            {(() => {
              const score = Math.round(((originalWords.length - revealedWords.length - wordsWithIncorrectGuesses.length) / originalWords.length) * 100);
              if (score === 100) {
                return <h2>Perfect! You unscrambled it!</h2>;
              } else if (score >= 80) {
                return <h2>Almost there! Great job!</h2>;
              } else if (score >= 60) {
                return <h2>Nice try! Keep it up!</h2>;
              } else {
                return <h2>Good effort! Try again for a better score!</h2>;
              }
            })()}
            <div className="score-display">
              <p className="score-text">
                Score: {Math.round(((originalWords.length - revealedWords.length - wordsWithIncorrectGuesses.length) / originalWords.length) * 100)}%
              </p>
            </div>
            <div className="revealed-verse">
              {originalWords.join(' ')}
            </div>
            <p className="reference">— {currentVerse.reference}</p>
            <div className="solved-buttons">
              <button onClick={handleNextVerse} className="next-verse-btn">
                {getNextVerseReference()} <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}
        
        <div className="citation">
          Scripture quotations taken from the Holy Bible, New International Version®, NIV®.<br />
          Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™<br />
          Used by permission. All rights reserved worldwide.
        </div>
      </div>
    </>
  );
};

export default UnscrambleGame; 