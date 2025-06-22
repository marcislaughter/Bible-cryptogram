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

    setEncryptedQuote(applyCipher(quote.text));
    setGuesses({});
    setSelectedChar(null);
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
        if (selectedChar) {
          handleGuessChange(selectedChar, key);
          setSelectedChar(null); // Clear selection after typing
        }
      } else if (key === 'ESCAPE') {
        setSelectedChar(null); // Clear selection with Escape
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        if (selectedChar && guesses[selectedChar]) {
          const newGuesses = { ...guesses };
          delete newGuesses[selectedChar];
          setGuesses(newGuesses);
          setSelectedChar(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChar, guesses]);

  const handleGuessChange = (encryptedChar: string, guess: string) => {
    const newGuesses = { ...guesses, [encryptedChar]: guess.toUpperCase() };
    setGuesses(newGuesses);
    
    // Check if puzzle is solved after each guess
    if (checkIfSolved(newGuesses)) {
      setIsSolved(true);
    }
  };

  const handleInputClick = (char: string) => {
    if (/[A-Z]/.test(char)) {
      setSelectedChar(char);
    }
  };

  // Add new function to handle direct input changes
  const handleInputChange = (encryptedChar: string, value: string) => {
    if (/^[A-Z]?$/.test(value)) {
      handleGuessChange(encryptedChar, value);
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
        {encryptedQuote.split(' ').map((word, wordIndex) => (
          <div key={wordIndex} className="word-container">
            {word.split('').map((char, charIndex) => (
              <div
                key={charIndex}
                className="char-container"
                onClick={() => handleInputClick(char)}
              >
                <input
                  type="text"
                  maxLength={1}
                  className={`guess-input ${selectedChar === char ? 'selected' : ''}`}
                  value={guesses[char] || ''}
                  onChange={(e) => handleInputChange(char, e.target.value.toUpperCase())}
                  onFocus={() => setSelectedChar(char)}
                  disabled={!/[A-Z]/.test(char)}
                />
                <div className="encrypted-char">{char}</div>
              </div>
            ))}
          </div>
        ))}
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