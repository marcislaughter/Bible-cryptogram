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
    text: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF",
    author: "FRANKLIN D ROOSEVELT"
  });

  const [cipher, setCipher] = useState<Record<string, string>>({});
  const [encryptedQuote, setEncryptedQuote] = useState('');
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

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

  const handleGuessChange = (encryptedChar: string, guess: string) => {
    const newGuesses = { ...guesses, [encryptedChar]: guess.toUpperCase() };
    setGuesses(newGuesses);
  };

  const handleInputClick = (char: string) => {
    if (/[A-Z]/.test(char)) {
      setSelectedChar(char);
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
                  readOnly
                  disabled={!/[A-Z]/.test(char)}
                />
                <div className="encrypted-char">{char}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} guesses={guesses} />
    </div>
  );
};

export default Game; 