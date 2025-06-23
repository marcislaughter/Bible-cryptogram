import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import Controls from './Controls';

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
  const [quote] = useState({
    text: "LOVE IS PATIENT, LOVE IS KIDN, IT DOES NOT ENVY, IT DOES NOT BOAST, IT IS NOT PROUD",
    author: "1 Corinthians 13:4"
  });

  const [cipher, setCipher] = useState<Record<string, string>>({});
  const [encryptedQuote, setEncryptedQuote] = useState('');
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(-1);
  const [isSolved, setIsSolved] = useState(false);

  // Check if the puzzle is solved
  const checkIfSolved = (currentGuesses: Record<string, string>) => {
    const lettersInQuote = quote.text.split('').filter(char => /[A-Z]/.test(char));
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

    const encrypted = applyCipher(quote.text);
    setEncryptedQuote(encrypted);
    setGuesses({});
    
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
  }, [quote]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      // Only handle letter keys
      if (/^[A-Z]$/.test(key)) {
        if (selectedChar && selectedPosition >= 0) {
          handleGuessChange(selectedChar, key);
          moveToNextCharacter(); // Move to next character after typing
        }
      } else if (key === 'ESCAPE') {
        setSelectedChar(null);
        setSelectedPosition(-1);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        if (selectedChar && guesses[selectedChar]) {
          const newGuesses = { ...guesses };
          delete newGuesses[selectedChar];
          setGuesses(newGuesses);
          setSelectedChar(null);
          setSelectedPosition(-1);
        }
      } else if (key === 'ARROWLEFT') {
        moveToPreviousCharacter();
      } else if (key === 'ARROWRIGHT') {
        moveToNextCharacter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChar, selectedPosition, guesses]);

  // Function to move to the next character position
  const moveToNextCharacter = () => {
    const allChars = encryptedQuote.split('').filter(char => /[A-Z]/.test(char));
    
    if (selectedPosition >= 0 && selectedPosition < allChars.length - 1) {
      const nextPosition = selectedPosition + 1;
      setSelectedPosition(nextPosition);
      setSelectedChar(allChars[nextPosition]);
    } else if (selectedPosition === -1 && allChars.length > 0) {
      // If no character is selected, select the first one
      setSelectedPosition(0);
      setSelectedChar(allChars[0]);
    }
  };

  // Function to move to the previous character position
  const moveToPreviousCharacter = () => {
    const allChars = encryptedQuote.split('').filter(char => /[A-Z]/.test(char));
    
    if (selectedPosition > 0) {
      const prevPosition = selectedPosition - 1;
      setSelectedPosition(prevPosition);
      setSelectedChar(allChars[prevPosition]);
    } else if (selectedPosition === 0) {
      // Wrap to the last character
      const lastPosition = allChars.length - 1;
      setSelectedPosition(lastPosition);
      setSelectedChar(allChars[lastPosition]);
    } else if (selectedPosition === -1 && allChars.length > 0) {
      // If no character is selected, select the last one
      const lastPosition = allChars.length - 1;
      setSelectedPosition(lastPosition);
      setSelectedChar(allChars[lastPosition]);
    }
  };

  const handleGuessChange = (encryptedChar: string, guess: string) => {
    const newGuesses = { ...guesses, [encryptedChar]: guess.toUpperCase() };
    setGuesses(newGuesses);
    
    // Check if puzzle is solved after each guess
    if (checkIfSolved(newGuesses)) {
      setIsSolved(true);
    }
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
      handleGuessChange(encryptedChar, value);
      if (value) {
        // Move to next character after typing in input field
        setTimeout(() => moveToNextCharacter(), 0);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (selectedChar) {
      handleGuessChange(selectedChar, key);
    }
  };

  const handleReset = () => {
    setGuesses({});
    setIsSolved(false);
  };

  const handleHint = () => {
    const unsolvedLetters = Object.keys(cipher).filter(
      originalChar => !guesses[cipher[originalChar]] || guesses[cipher[originalChar]] !== originalChar
    );

    if (unsolvedLetters.length > 0) {
      const randomLetter = unsolvedLetters[Math.floor(Math.random() * unsolvedLetters.length)];
      handleGuessChange(cipher[randomLetter], randomLetter);
    }
  };

  const handleGiveUp = () => {
    const correctGuesses: Record<string, string> = {};
    Object.keys(cipher).forEach(originalChar => {
      correctGuesses[cipher[originalChar]] = originalChar;
    });
    setGuesses(correctGuesses);
    setIsSolved(true);
  };

  return (
    <div className="game-container">
      <h1>Cryptogram</h1>
      <Controls
        onReset={handleReset}
        onHint={handleHint}
        onGiveUp={handleGiveUp}
      />
      <div className="quote-container">
        {(() => {
          let letterIndex = 0;
          return encryptedQuote.split(' ').map((word, wordIndex) => (
            <div key={wordIndex} className="word-container">
              {word.split('').map((char, charIndex) => {
                const isLetter = /[A-Z]/.test(char);
                const currentLetterIndex = isLetter ? letterIndex++ : -1;
                
                // Check if this character should be highlighted
                const isSelected = selectedChar === char && selectedPosition === currentLetterIndex;
                const isSameLetter = selectedChar === char; // Highlight all instances of the same letter
                
                return (
                  <div
                    key={charIndex}
                    className="char-container"
                    onClick={() => isLetter && handleInputClick(char, currentLetterIndex)}
                  >
                    <input
                      type="text"
                      maxLength={1}
                      className={`guess-input ${
                        isSelected ? 'selected' : 
                        isSameLetter ? 'same-letter' : ''
                      }`}
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
          <p className="author">— {quote.author}</p>
        </div>
      )}
      <Keyboard onKeyPress={handleKeyPress} guesses={guesses} />
    </div>
  );
};

export default Game; 