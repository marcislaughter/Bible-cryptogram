import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import Controls from './Controls';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';

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
  const [shouldAdvanceFocus, setShouldAdvanceFocus] = useState<HTMLInputElement | null>(null);

  // Helper function to get the next input element
  const getNextInput = (currentInput: HTMLInputElement) => {
    const allInputs = Array.from(document.querySelectorAll('.guess-input:not([disabled])'));
    const currentIndex = allInputs.indexOf(currentInput);
    return allInputs[(currentIndex + 1) % allInputs.length] as HTMLInputElement;
  };

  // Helper function to get the previous input element
  const getPreviousInput = (currentInput: HTMLInputElement) => {
    const allInputs = Array.from(document.querySelectorAll('.guess-input:not([disabled])'));
    const currentIndex = allInputs.indexOf(currentInput);
    return allInputs[currentIndex > 0 ? currentIndex - 1 : allInputs.length - 1] as HTMLInputElement;
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
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Add effect to handle focusing after state updates
  useEffect(() => {
    if (encryptedVerse) {  // Only try to focus if we have a quote
      requestAnimationFrame(() => {
        const firstInput = document.querySelector('.guess-input:not([disabled])') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
          setFocusedChar(firstInput.dataset.char!);
        }
      });
    }
  }, [encryptedVerse]); // Run whenever encryptedVerse changes

  // Handle focus advancement after state updates
  useEffect(() => {
    if (shouldAdvanceFocus) {
      const nextInput = getNextInput(shouldAdvanceFocus);
      nextInput.focus();
      setFocusedChar(nextInput.dataset.char!);
      setShouldAdvanceFocus(null);
    }
  }, [guesses, shouldAdvanceFocus]);

  // Update keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLInputElement;
      if (!activeElement?.classList.contains('guess-input')) return;

      const key = event.key.toUpperCase();
      
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault(); // Prevent default to handle input manually
        handleGuessChange(activeElement.dataset.char!, key);
        // Signal focus advancement after state update
        setShouldAdvanceFocus(activeElement);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        if (guesses[activeElement.dataset.char!]) {
          handleGuessChange(activeElement.dataset.char!, '');
        }
        getPreviousInput(activeElement).focus();
      } else if (key === 'ARROWLEFT') {
        getPreviousInput(activeElement).focus();
      } else if (key === 'ARROWRIGHT') {
        getNextInput(activeElement).focus();
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
      
      // Signal that we should advance focus after state update completes
      setShouldAdvanceFocus(e.target);
    } else if (value === '' && currentGuess) {
      // Handle backspace/delete - only clear if there was a previous guess
      handleGuessChange(char, '');
    }
  };

  // Enhanced focus handler for mobile
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>, char: string) => {
    setFocusedChar(char);
    
    // Force the input to be empty when focused to prevent mobile keyboard issues
    // This ensures the mobile keyboard can properly detect new input
    e.target.value = '';
    
    // Select all text to ensure next input replaces current content
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  // Enhanced blur handler
  const handleInputBlur = () => {
    setFocusedChar(null);
  };

  // Additional input handler for mobile keyboard compatibility
  const handleInputEvent = (e: React.FormEvent<HTMLInputElement>, char: string) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.toUpperCase();
    
    if (value.length > 0) {
      const newChar = value.slice(-1);
      if (/^[A-Z]$/.test(newChar)) {
        // Replace current guess
        handleGuessChange(char, newChar);
        
        // Clear input and signal focus advancement
        target.value = '';
        setShouldAdvanceFocus(target);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input')) {
      handleGuessChange(activeElement.dataset.char!, key);
      setShouldAdvanceFocus(activeElement);
    }
  };

  const handleBackspace = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement?.classList.contains('guess-input')) {
      if (guesses[activeElement.dataset.char!]) {
        handleGuessChange(activeElement.dataset.char!, '');
      }
      getPreviousInput(activeElement).focus();
    }
  };

  const handleReset = () => {
    setGuesses({});
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedLetters([]);
    setAutoCheckEnabled(false);
    setWordStatsEnabled(false);
    generateNewGame(); // This will trigger the focus effect
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

  // Add useEffect to manage body background when puzzle is solved
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('win-gradient');
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
            <p className="reference">— {currentVerse.reference}</p>
            <div className="solved-buttons">
              <button onClick={handleRandomVerse} className="next-verse-btn">
                Random Verse
              </button>
              <button onClick={handleNextVerse} className="next-verse-btn">
                Next Verse
              </button>
            </div>
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