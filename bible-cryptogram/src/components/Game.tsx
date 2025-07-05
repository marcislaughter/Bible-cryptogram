import React, { useState, useEffect, useRef } from 'react';
import Keyboard from './Keyboard';
import Controls from './Controls';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Utility function to create a substitution cipher
const createCipher = (): Record<string, string> => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
  const cipher: Record<string, string> = {};
  alphabet.forEach((letter, index) => {
    cipher[letter] = shuffled[index];
  });
  return cipher;
};

const Game: React.FC = () => {
  const [cipher, setCipher] = useState<Record<string, string>>({});
  const [encryptedQuote, setEncryptedQuote] = useState('');
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(-1);
  const [isSolved, setIsSolved] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const [currentVerse, setcurrentVerse] = useState<BibleVerse>(BIBLE_VERSES[0]);
  const [isTouching, setIsTouching] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Create debounced movement functions
  const debouncedMoveNext = useRef(
    debounce(() => moveCharacterPosition('next'), 150)
  ).current;

  const debouncedMovePrevious = useRef(
    debounce(() => moveCharacterPosition('previous'), 150)
  ).current;

  // Function to move the selected character position
  const moveCharacterPosition = (direction: 'next' | 'previous') => {
    const allChars = encryptedQuote.split('').filter(char => /[A-Z]/.test(char));
    if (allChars.length === 0) return;

    const lastPosition = allChars.length - 1;
    
    if (selectedPosition === -1) {
      // If no character is selected, select first or last based on direction
      setSelectedPosition(direction === 'next' ? 0 : lastPosition);
      setSelectedChar(direction === 'next' ? allChars[0] : allChars[lastPosition]);
      return;
    }

    let newPosition;
    if (direction === 'next') {
      newPosition = selectedPosition < lastPosition ? selectedPosition + 1 : 0;
    } else {
      newPosition = selectedPosition > 0 ? selectedPosition - 1 : lastPosition;
    }
    
    setSelectedPosition(newPosition);
    setSelectedChar(allChars[newPosition]);
  };

  // Check if the puzzle is solved
  const checkIfSolved = (currentGuesses: Record<string, string>) => {
    const lettersInQuote = currentVerse.text.split('').filter(char => /[A-Z]/.test(char));
    const uniqueLetters = [...new Set(lettersInQuote)];
    
    return uniqueLetters.every(letter => {
      const encryptedLetter = cipher[letter];
      return currentGuesses[encryptedLetter] === letter;
    });
  };

  const generateNewGame = () => {
    const newCipher = createCipher();
    setCipher(newCipher);

    const applyCipher = (text: string) => {
      return text
        .split('')
        .map(char => (newCipher[char] ? newCipher[char] : char))
        .join('');
    };

    const encrypted = applyCipher(currentVerse.text);
    setEncryptedQuote(encrypted);
    setGuesses({});
    setHintsRemaining(3);
    setRevealedLetters([]);
    
    // Select the first letter by default
    const firstLetter = encrypted.split('').find(char => /[A-Z]/.test(char));
    if (firstLetter) {
      setSelectedChar(firstLetter);
      setSelectedPosition(0);
    } else {
      setSelectedChar(null);
      setSelectedPosition(-1);
    }
    
    setIsSolved(false);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // Only handle letter keys
      if (/^[A-Z]$/.test(key)) {
        if (selectedChar && selectedPosition >= 0) {
          const guessAccepted = handleGuessChange(selectedChar, key);
          // Move to next character after typing only if guess was accepted
          if (guessAccepted) {
            moveCharacterPosition('next');
          }
        }
      } else if (key === 'ESCAPE') {
        setSelectedChar(null);
        setSelectedPosition(-1);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        handleBackspace();
      } else if (key === 'ARROWLEFT') {
        moveCharacterPosition('previous');
      } else if (key === 'ARROWRIGHT') {
        moveCharacterPosition('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChar, selectedPosition, guesses]);

  const handleGuessChange = (encryptedChar: string, guess: string) => {
    const upperGuess = guess.toUpperCase();

    // Remove this guess from any other cell
    const newGuesses = Object.fromEntries(
      Object.entries(guesses).map(([key, value]) =>
        value === upperGuess && key !== encryptedChar ? [key, ''] : [key, value]
      )
    );

    // Set the guess for the current cell
    newGuesses[encryptedChar] = upperGuess;

    setGuesses(newGuesses);

    // Check if puzzle is solved after each guess
    if (checkIfSolved(newGuesses)) {
      setIsSolved(true);
    }

    return true; // Always accept the guess now
  };

  const handleInputClick = (char: string, position: number) => {
    if (/[A-Z]/.test(char)) {
      setSelectedChar(char);
      setSelectedPosition(position);
    }
  };

  // Add new function to handle direct input changes
  const handleInputChange = (encryptedChar: string, value: string) => {
    if (/^[A-Z]?$/.test(value)) {
      const guessAccepted = handleGuessChange(encryptedChar, value);
      if (value && guessAccepted) {
        // Move to next character after typing in input field only if guess was accepted
        setTimeout(() => moveCharacterPosition('next'), 0);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (selectedChar) {
      const guessAccepted = handleGuessChange(selectedChar, key);
      // Move to the next character after typing only if guess was accepted
      if (guessAccepted) {
        moveCharacterPosition('next');
      }
    }
  };

  const handleBackspace = () => {
    if (selectedChar && guesses[selectedChar]) {
      const newGuesses = { ...guesses };
      delete newGuesses[selectedChar];
      setGuesses(newGuesses);
    }
    // Move to the previous character after deleting
    moveCharacterPosition('previous');
  };

  const handleReset = () => {
    setGuesses({});
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedLetters([]);
    setAutoCheckEnabled(false);
    setWordStatsEnabled(false);
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;

    // Get letter frequency in the original quote
    const letterFrequency: Record<string, number> = {};
    currentVerse.text.split('').forEach(char => {
      if (/[A-Z]/.test(char)) {
        letterFrequency[char] = (letterFrequency[char] || 0) + 1;
      }
    });

    // Sort letters by frequency (most frequent first)
    const sortedLetters = Object.entries(letterFrequency)
      .sort(([,a], [,b]) => b - a)
      .map(([letter]) => letter);

    // Find the next most frequent letter that hasn't been revealed yet
    const nextLetterToReveal = sortedLetters.find(letter => 
      !revealedLetters.includes(letter) && 
      (!guesses[cipher[letter]] || guesses[cipher[letter]] !== letter)
    );

    if (nextLetterToReveal) {
      // Reveal the letter
      handleGuessChange(cipher[nextLetterToReveal], nextLetterToReveal);
      setRevealedLetters(prev => [...prev, nextLetterToReveal]);
    }

    // Decrease hints remaining
    setHintsRemaining(prev => prev - 1);
  };

  const handleAutoCheck = () => {
    setAutoCheckEnabled(!autoCheckEnabled);
  };

  const handleToggleWordStats = () => {
    setWordStatsEnabled(!wordStatsEnabled);
  };

  // Function to handle next verse button
  const handleNextVerse = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.text === currentVerse.text);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    setcurrentVerse(BIBLE_VERSES[nextIndex]);
  };

  // Function to check if a guess is correct
  const isGuessCorrect = (encryptedChar: string, guess: string) => {
    return cipher[guess] === encryptedChar;
  };

  // Function to get CSS class for input based on auto-check state
  const getInputClass = (char: string, isSelected: boolean, isSameLetter: boolean) => {
    let baseClass = '';
    
    if (isSelected) {
      baseClass += 'selected';
    } else if (isSameLetter) {
      baseClass += 'same-letter';
    }

    // Add auto-check styling if enabled and there's a guess
    if (autoCheckEnabled && guesses[char]) {
      const isCorrect = isGuessCorrect(char, guesses[char]);
      baseClass += isCorrect ? ' correct' : ' incorrect';
    }

    return baseClass.trim();
  };

  // Add new useEffect to auto-focus the selected input
  useEffect(() => {
    if (selectedChar && selectedPosition >= 0) {
      const refKey = `${selectedChar}-${selectedPosition}`;
      const inputElement = inputRefs.current[refKey];
      if (inputElement) {
        // Use a small delay to ensure the DOM has updated
        setTimeout(() => {
          // Store current scroll position
          const scrollY = window.scrollY;
          
          // Focus the input
          inputElement.focus({ preventScroll: true });
          
          // Restore scroll position if it changed
          if (window.scrollY !== scrollY) {
            window.scrollTo(0, scrollY);
          }
        }, 10);
      }
    }
  }, [selectedChar, selectedPosition]);

  // Add useEffect to manage body background when puzzle is solved
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('win-gradient');
    } else {
      document.body.classList.remove('win-gradient');
    }
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('win-gradient');
    };
  }, [isSolved]);

  return (
    <>
      <GameHeader 
        wordStatsEnabled={wordStatsEnabled}
        onToggleWordStats={() => setWordStatsEnabled(!wordStatsEnabled)}
      />

      <div className="cryptogram-container">
        <Controls
          onReset={handleReset}
          onNextVerse={handleNextVerse}
          onHint={handleHint}
          onAutoCheck={handleAutoCheck}
          hintsRemaining={hintsRemaining}
          autoCheckEnabled={autoCheckEnabled}
        />
        
        {/* Word Stats Display */}
        {wordStatsEnabled && <WordStats />}
        
        <div className="verse-container" 
          onClick={(e) => {
            // Don't handle click if we're in a touch interaction
            if (isTouching) return;
            
            // Get the container's bounding rectangle
            const rect = e.currentTarget.getBoundingClientRect();
            // Calculate if click is in right half
            const isRightHalf = e.clientX > rect.left + rect.width / 2;
            
            if (isRightHalf) {
              debouncedMoveNext();
            } else {
              debouncedMovePrevious();
            }
          }}
          onTouchStart={(e) => {
            // Only prevent default if we're not touching a letter cell
            if (!(e.target as HTMLElement).closest('.char-container')) {
              e.preventDefault();
            }
            
            // If we're already in a touch interaction, ignore this touch
            if (isTouching) return;
            
            setIsTouching(true);
          }}
          onTouchEnd={(e) => {
            if (!isTouching) return;
            
            // Get the container's bounding rectangle
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            // Use the last touch point
            const touch = e.changedTouches[0];
            // Calculate if touch ended in right half
            const isRightHalf = touch.clientX > rect.left + rect.width / 2;
            
            if (isRightHalf) {
              debouncedMoveNext();
            } else {
              debouncedMovePrevious();
            }
            setIsTouching(false);
          }}
          onTouchCancel={() => {
            setIsTouching(false);
          }}
        >
          {(() => {
            let letterIndex = 0;
            return encryptedQuote.split(' ').map((word, wordIndex) => (
              <div key={wordIndex} className="word-container">
                {word.split('').map((char, charIndex) => {
                  const isLetter = /[A-Z]/.test(char);
                  const currentLetterIndex = isLetter ? letterIndex : -1;
                  if (isLetter) letterIndex++;
                  
                  // Check if this character should be highlighted
                  const isSelected = selectedChar === char && selectedPosition === currentLetterIndex;
                  const isSameLetter = selectedChar === char; // Highlight all instances of the same letter
                  
                  return (
                    <div
                      key={charIndex}
                      className="char-container"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isLetter) {
                          handleInputClick(char, currentLetterIndex);
                        }
                      }}
                    >
                      <input
                        ref={(el) => {
                          if (isLetter) {
                            const refKey = `${char}-${currentLetterIndex}`;
                            inputRefs.current[refKey] = el;
                          }
                        }}
                        type="text"
                        maxLength={1}
                        className={`guess-input ${getInputClass(char, isSelected, isSameLetter)}`}
                        value={guesses[char] || ''}
                        onChange={(e) => handleInputChange(char, e.target.value.toUpperCase())}
                        onFocus={() => {
                          if (isLetter) {
                            setSelectedChar(char);
                            setSelectedPosition(currentLetterIndex);
                          }
                        }}
                        disabled={!isLetter}
                      />
                      <div className="encrypted-char">{char}</div>
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
        
        {isSolved && (
          <div className="solved-message">
            <h2>Congratulations! You solved it!</h2>
            <p className="reference">— {currentVerse.reference}</p>
            <button 
              onClick={handleNextVerse}
              className="next-verse-btn"
            >
              Next Verse
            </button>
          </div>
        )}
        
        <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} guesses={guesses} />
        
        <div className="citation">
          Scripture quotations taken from the Holy Bible, New International Version®, NIV®.<br />
          Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™<br />
          Used by permission. All rights reserved worldwide.
        </div>
      </div>
    </>
  );
};

export default Game; 