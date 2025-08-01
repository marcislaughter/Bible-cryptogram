import React, { useState, useEffect, useRef } from 'react';
import Keyboard from './Keyboard';
import Controls from './Controls';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './CryptogramGame.css';

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

interface CryptogramGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

const Game: React.FC<CryptogramGameProps> = ({ 
  gameType = 'cryptogram', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [cipher, setCipher] = useState<Record<string, string>>({});
  const [encryptedVerse, setEncryptedVerse] = useState('');
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [isSolved, setIsSolved] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});
  const [focusedChar, setFocusedChar] = useState<string | null>(null);
  
  // Use ref to track if we're currently advancing focus to prevent race conditions
  const isAdvancingFocus = useRef(false);
  
  // Use ref to track the last input that was processed to prevent double processing
  const lastProcessedInput = useRef<string>('');

  // Helper function to get all input elements
  const getAllInputs = () => {
    return Array.from(document.querySelectorAll('.guess-input:not([disabled])')) as HTMLInputElement[];
  };

  // Helper function to get the next input element
  const getNextInput = (currentInput: HTMLInputElement) => {
    const allInputs = getAllInputs();
    const currentIndex = allInputs.indexOf(currentInput);
    return allInputs[(currentIndex + 1) % allInputs.length];
  };

  // Helper function to get the previous input element
  const getPreviousInput = (currentInput: HTMLInputElement) => {
    const allInputs = getAllInputs();
    const currentIndex = allInputs.indexOf(currentInput);
    return allInputs[currentIndex > 0 ? currentIndex - 1 : allInputs.length - 1];
  };

  // Robust focus advancement with race condition prevention
  const advanceFocus = (currentInput: HTMLInputElement) => {
    if (isAdvancingFocus.current) return;
    
    isAdvancingFocus.current = true;
    
    // Use immediate focus change instead of requestAnimationFrame
    const nextInput = getNextInput(currentInput);
    nextInput.focus();
    setFocusedChar(nextInput.dataset.char!);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isAdvancingFocus.current = false;
    }, 10);
  };

  // Move to previous input
  const moveToPrevious = (currentInput: HTMLInputElement) => {
    if (isAdvancingFocus.current) return;
    
    isAdvancingFocus.current = true;
    
    const previousInput = getPreviousInput(currentInput);
    previousInput.focus();
    setFocusedChar(previousInput.dataset.char!);
    
    setTimeout(() => {
      isAdvancingFocus.current = false;
    }, 10);
  };

  // Move to next input
  const moveToNext = (currentInput: HTMLInputElement) => {
    if (isAdvancingFocus.current) return;
    
    isAdvancingFocus.current = true;
    
    const nextInput = getNextInput(currentInput);
    nextInput.focus();
    setFocusedChar(nextInput.dataset.char!);
    
    setTimeout(() => {
      isAdvancingFocus.current = false;
    }, 10);
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
    setEncryptedVerse(encrypted);
    setGuesses({});
    setHintsRemaining(3);
    setRevealedLetters([]);
    setIsSolved(false);
    lastProcessedInput.current = '';
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Focus first input when game starts
  useEffect(() => {
    if (encryptedVerse) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const firstInput = getAllInputs()[0];
        if (firstInput) {
          firstInput.focus();
          setFocusedChar(firstInput.dataset.char!);
        }
      }, 50);
    }
  }, [encryptedVerse]);

  // Keyboard event handler with improved race condition handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLInputElement;
      if (!activeElement?.classList.contains('guess-input') || isAdvancingFocus.current) return;

      const key = event.key.toUpperCase();
      const char = activeElement.dataset.char!;
      
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        
        // Prevent double processing of the same input
        const inputKey = `${char}-${key}-${Date.now()}`;
        if (lastProcessedInput.current === inputKey) return;
        lastProcessedInput.current = inputKey;
        
        handleGuessChange(char, key);
        advanceFocus(activeElement);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        event.preventDefault();
        if (guesses[char]) {
          handleGuessChange(char, '');
        }
        moveToPrevious(activeElement);
      } else if (key === 'ARROWLEFT') {
        event.preventDefault();
        moveToPrevious(activeElement);
      } else if (key === 'ARROWRIGHT') {
        event.preventDefault();
        moveToNext(activeElement);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guesses]);

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
  };

  // Enhanced input change handler for mobile compatibility
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, char: string) => {
    if (isAdvancingFocus.current) return;
    
    const value = e.target.value.toUpperCase();
    const currentGuess = guesses[char] || '';
    
    // Get the new character - could be replacement or addition
    let newChar = '';
    if (value.length > 0) {
      // Take the last character if multiple characters somehow got in
      newChar = value.slice(-1);
    }
    
    // Only allow A-Z letters
    if (newChar && /^[A-Z]$/.test(newChar)) {
      // Always replace the current guess with the new letter
      handleGuessChange(char, newChar);
      
      // Clear the input value to prevent display issues on mobile
      e.target.value = '';
      
      // Advance focus for mobile
      advanceFocus(e.target);
    } else if (value === '' && currentGuess) {
      // Handle backspace/delete - only clear if there was a previous guess
      handleGuessChange(char, '');
    }
  };

  // Additional input handler for mobile keyboard compatibility
  const handleInputEvent = (e: React.FormEvent<HTMLInputElement>, char: string) => {
    if (isAdvancingFocus.current) return;
    
    const target = e.target as HTMLInputElement;
    const value = target.value.toUpperCase();
    
    if (value.length > 0) {
      const newChar = value.slice(-1);
      if (/^[A-Z]$/.test(newChar)) {
        // Replace current guess
        handleGuessChange(char, newChar);
        
        // Clear input and advance focus
        target.value = '';
        advanceFocus(target);
      }
    }
  };

  // Focus handler
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>, char: string) => {
    if (!isAdvancingFocus.current) {
      setFocusedChar(char);
    }
    
    // Mobile keyboard compatibility
    e.target.value = '';
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  // Blur handler
  const handleInputBlur = () => {
    // Keep focus highlighting until another input is focused
  };

  // On-screen keyboard handlers
  const handleKeyPress = (key: string) => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input') && !isAdvancingFocus.current) {
      handleGuessChange(activeElement.dataset.char!, key);
      advanceFocus(activeElement);
    }
  };

  const handleBackspace = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input') && !isAdvancingFocus.current) {
      if (guesses[activeElement.dataset.char!]) {
        handleGuessChange(activeElement.dataset.char!, '');
      }
      moveToPrevious(activeElement);
    }
  };

  const handleArrowLeft = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input') && !isAdvancingFocus.current) {
      moveToPrevious(activeElement);
    }
  };

  const handleArrowRight = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input') && !isAdvancingFocus.current) {
      moveToNext(activeElement);
    }
  };

  const handleReset = () => {
    setGuesses({});
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedLetters([]);
    setAutoCheckEnabled(false);
    setWordStatsEnabled(false);
    isAdvancingFocus.current = false;
    lastProcessedInput.current = '';
    generateNewGame();
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

  const handleVerseChange = (verse: BibleVerse) => {
    onVerseChange(verse);
  };

  // Function to get the next verse reference
  const getNextVerseReference = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.reference === currentVerse.reference);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    return BIBLE_VERSES[nextIndex].reference;
  };

  // Function to go to the next verse
  const handleNextVerse = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.reference === currentVerse.reference);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    onVerseChange(BIBLE_VERSES[nextIndex]);
  };

  // Function to go to a random verse
  const handleRandomVerse = () => {
    let randomVerse;
    do {
      randomVerse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
    } while (randomVerse.reference === currentVerse.reference && BIBLE_VERSES.length > 1);
    onVerseChange(randomVerse);
  };

  // Function to check if a guess is correct
  const isGuessCorrect = (encryptedChar: string, guess: string) => {
    return cipher[guess] === encryptedChar;
  };

  // Function to get CSS class for input based on auto-check state
  const getInputClass = (char: string) => {
    let baseClass = '';
    
    // Check if this character matches the currently focused character
    if (focusedChar === char) {
      baseClass += 'same-letter';
    }

    // Add auto-check styling if enabled and there's a guess
    if (autoCheckEnabled && guesses[char]) {
      const isCorrect = isGuessCorrect(char, guesses[char]);
      baseClass += isCorrect ? ' correct' : ' incorrect';
    }

    return baseClass.trim();
  };

  // Cryptogram-specific win message handler
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('cryptogram-win-gradient');
      
      // Cryptogram uses instant scroll to top of message
      setTimeout(() => {
        const solvedMessage = document.querySelector('.solved-message');
        if (solvedMessage) {
          solvedMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 150); // Slightly longer delay for cryptogram
    } else {
      document.body.classList.remove('cryptogram-win-gradient');
    }
    
    return () => {
      document.body.classList.remove('cryptogram-win-gradient');
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

      <div className="cryptogram-container">
        <Controls
          onReset={handleReset}
          onHint={handleHint}
          onAutoCheck={handleAutoCheck}
          hintsRemaining={hintsRemaining}
          autoCheckEnabled={autoCheckEnabled}
        />
        
        {wordStatsEnabled && <WordStats />}
        
        <div className="verse-container">
          {(() => {
            let letterIndex = 0;
            return encryptedVerse.split(' ').map((word, wordIndex) => (
              <div key={wordIndex} className="word-container">
                {word.split('').map((char, charIndex) => {
                  const isLetter = /[A-Z]/.test(char);
                  const isPunctuation = /[^A-Z\s]/.test(char);
                  if (isLetter) letterIndex++;
                  
                  // Determine punctuation positioning class
                  const getPunctuationClass = (char: string) => {
                    if (char === ',') return 'comma';
                    if (char === "'" || char === "'") return 'apostrophe';
                    if (char === '.') return 'period';
                    if (char === '?') return 'question';
                    if (char === '!') return 'exclamation';
                    if (char === ':') return 'colon';
                    if (char === ';') return 'semicolon';
                    if (char === '"' || char === '"') return 'quote';
                    return '';
                  };
                  
                  return (
                    <div
                      key={charIndex}
                      className="char-container"
                    >
                      {isPunctuation ? (
                        <div className={`punctuation-mark ${getPunctuationClass(char)}`}>{char}</div>
                      ) : (
                        <input
                          type="text"
                          maxLength={1}
                          className={`guess-input ${getInputClass(char)}`}
                          value={guesses[char] || ''}
                          onChange={(e) => handleInputChange(e, char)}
                          onInput={(e) => handleInputEvent(e, char)}
                          onFocus={(e) => handleInputFocus(e, char)}
                          onBlur={handleInputBlur}
                          data-char={char}
                          disabled={!isLetter}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="characters"
                          spellCheck="false"
                          inputMode="text"
                        />
                      )}
                      {isLetter && <div className="encrypted-char">{char}</div>}
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
            <div className="revealed-verse">
              {currentVerse.text}
            </div>
            <p className="reference">— {currentVerse.reference}</p>
            <div className="solved-buttons">
              <button onClick={handleRandomVerse} className="next-verse-btn solved-button-base">
                Random Verse
              </button>
              <button onClick={handleNextVerse} className="next-verse-btn solved-button-base">
                {getNextVerseReference()} <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        )}
        
        <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} onArrowLeft={handleArrowLeft} onArrowRight={handleArrowRight} guesses={guesses} />
        
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