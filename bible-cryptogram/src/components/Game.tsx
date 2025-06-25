import React, { useState, useEffect, useRef } from 'react';
import Keyboard from './Keyboard';
import Controls from './Controls';

// Bible verses data
const BIBLE_VERSES = [
  {
    text: "LOVE IS PATIENT, LOVE IS KIND, IT DOES NOT ENVY, IT DOES NOT BOAST, IT IS NOT PROUD",
    author: "1 Corinthians 13:4"
  },
  {
    text: "AM I NOT FREE? AM I NOT AN APOSTLE? HAVE I NOT SEEN JESUS OUR LORD? ARE YOU NOT THE RESULT OF MY WORK IN THE LORD?",
    author: "1 Corinthians 9:1"
  },
  {
    text: "EVEN THOUGH I MAY NOT BE AN APOSTLE TO OTHERS, SURELY I AM TO YOU! FOR YOU ARE THE SEAL OF MY APOSTLESHIP IN THE LORD",
    author: "1 Corinthians 9:2"
  },
  {
    text: "THIS IS MY DEFENSE TO THOSE WHO SIT IN JUDGMENT ON ME",
    author: "1 Corinthians 9:3"
  },
  {
    text: "DON'T WE HAVE THE RIGHT TO FOOD AND DRINK?",
    author: "1 Corinthians 9:4"
  },
  {
    text: "DON'T WE HAVE THE RIGHT TO TAKE A BELIEVING WIFE ALONG WITH US, AS DO THE OTHER APOSTLES AND THE LORD'S BROTHERS AND CEPHAS?",
    author: "1 Corinthians 9:5"
  },
  {
    text: "OR IS IT ONLY I AND BARNABAS WHO LACK THE RIGHT TO NOT WORK FOR A LIVING?",
    author: "1 Corinthians 9:6"
  },
  {
    text: "WHO SERVES AS A SOLDIER AT HIS OWN EXPENSE? WHO PLANTS A VINEYARD AND DOES NOT EAT ITS GRAPES? WHO TENDS A FLOCK AND DOES NOT DRINK THE MILK?",
    author: "1 Corinthians 9:7"
  },
  {
    text: "DO I SAY THIS MERELY ON HUMAN AUTHORITY? DOESN'T THE LAW SAY THE SAME THING?",
    author: "1 Corinthians 9:8"
  },
  {
    text: "FOR IT IS WRITTEN IN THE LAW OF MOSES: DO NOT MUZZLE AN OX WHILE IT IS TREADING OUT THE GRAIN. IS IT ABOUT OXEN THAT GOD IS CONCERNED?",
    author: "1 Corinthians 9:9"
  },
  {
    text: "SURELY HE SAYS THIS FOR US, DOESN'T HE? YES, THIS WAS WRITTEN FOR US, BECAUSE WHOEVER PLOWS AND THRESHES SHOULD BE ABLE TO DO SO IN THE HOPE OF SHARING IN THE HARVEST",
    author: "1 Corinthians 9:10"
  },
  {
    text: "IF WE HAVE SOWN SPIRITUAL SEED AMONG YOU, IS IT TOO MUCH IF WE REAP A MATERIAL HARVEST FROM YOU?",
    author: "1 Corinthians 9:11"
  },
  {
    text: "IF OTHERS HAVE THIS RIGHT OF SUPPORT FROM YOU, SHOULDN'T WE HAVE IT ALL THE MORE?",
    author: "1 Corinthians 9:12"
  },
  {
    text: "BUT WE DID NOT USE THIS RIGHT. ON THE CONTRARY, WE PUT UP WITH ANYTHING RATHER THAN HINDER THE GOSPEL OF CHRIST",
    author: "1 Corinthians 9:12b"
  },
  {
    text: "DON'T YOU KNOW THAT THOSE WHO SERVE IN THE TEMPLE GET THEIR FOOD FROM THE TEMPLE, AND THAT THOSE WHO SERVE AT THE ALTAR SHARE IN WHAT IS OFFERED ON THE ALTAR?",
    author: "1 Corinthians 9:13"
  },
  {
    text: "IN THE SAME WAY, THE LORD HAS COMMANDED THAT THOSE WHO PREACH THE GOSPEL SHOULD RECEIVE THEIR LIVING FROM THE GOSPEL",
    author: "1 Corinthians 9:14"
  },
  {
    text: "BUT I HAVE NOT USED ANY OF THESE RIGHTS. AND I AM NOT WRITING THIS IN THE HOPE THAT YOU WILL DO SUCH THINGS FOR ME, FOR I WOULD RATHER DIE THAN ALLOW ANYONE TO DEPRIVE ME OF THIS BOAST",
    author: "1 Corinthians 9:15"
  },
  {
    text: "FOR WHEN I PREACH THE GOSPEL, I CANNOT BOAST, SINCE I AM COMPELLED TO PREACH. WOE TO ME IF I DO NOT PREACH THE GOSPEL!",
    author: "1 Corinthians 9:16"
  },
  {
    text: "IF I PREACH VOLUNTARILY, I HAVE A REWARD; IF NOT VOLUNTARILY, I AM SIMPLY DISCHARGING THE TRUST COMMITTED TO ME",
    author: "1 Corinthians 9:17"
  },
  {
    text: "WHAT THEN IS MY REWARD? JUST THIS: THAT IN PREACHING THE GOSPEL I MAY OFFER IT FREE OF CHARGE, AND SO NOT MAKE FULL USE OF MY RIGHTS AS A PREACHER OF THE GOSPEL",
    author: "1 Corinthians 9:18"
  },
  {
    text: "THOUGH I AM FREE AND BELONG TO NO ONE, I HAVE MADE MYSELF A SLAVE TO EVERYONE, TO WIN AS MANY AS POSSIBLE",
    author: "1 Corinthians 9:19"
  },
  {
    text: "TO THE JEWS I BECAME LIKE A JEW, TO WIN THE JEWS. TO THOSE UNDER THE LAW I BECAME LIKE ONE UNDER THE LAW, SO AS TO WIN THOSE UNDER THE LAW",
    author: "1 Corinthians 9:20"
  },
  {
    text: "TO THOSE NOT HAVING THE LAW I BECAME LIKE ONE NOT HAVING THE LAW, SO AS TO WIN THOSE NOT HAVING THE LAW",
    author: "1 Corinthians 9:21"
  },
  {
    text: "TO THE WEAK I BECAME WEAK, TO WIN THE WEAK. I HAVE BECOME ALL THINGS TO ALL PEOPLE SO THAT BY ALL POSSIBLE MEANS I MIGHT SAVE SOME",
    author: "1 Corinthians 9:22"
  },
  {
    text: "I DO ALL THIS FOR THE SAKE OF THE GOSPEL, THAT I MAY SHARE IN ITS BLESSINGS",
    author: "1 Corinthians 9:23"
  },
  {
    text: "DO YOU NOT KNOW THAT IN A RACE ALL THE RUNNERS RUN, BUT ONLY ONE GETS THE PRIZE? RUN IN SUCH A WAY AS TO GET THE PRIZE",
    author: "1 Corinthians 9:24"
  },
  {
    text: "EVERYONE WHO COMPETES IN THE GAMES GOES INTO STRICT TRAINING. THEY DO IT TO GET A CROWN THAT WILL NOT LAST, BUT WE DO IT TO GET A CROWN THAT WILL LAST FOREVER",
    author: "1 Corinthians 9:25"
  },
  {
    text: "THEREFORE I DO NOT RUN LIKE SOMEONE RUNNING AIMLESSLY; I DO NOT FIGHT LIKE A BOXER BEATING THE AIR",
    author: "1 Corinthians 9:26"
  },
  {
    text: "NO, I STRIKE A BLOW TO MY BODY AND MAKE IT MY SLAVE SO THAT AFTER I HAVE PREACHED TO OTHERS, I MYSELF WILL NOT BE DISQUALIFIED FOR THE PRIZE",
    author: "1 Corinthians 9:27"
  }
];

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
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [cipher, setCipher] = useState<Record<string, string>>({});
  const [encryptedQuote, setEncryptedQuote] = useState('');
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number>(-1);
  const [isSolved, setIsSolved] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const currentQuote = BIBLE_VERSES[currentVerseIndex];

  // Check if the puzzle is solved
  const checkIfSolved = (currentGuesses: Record<string, string>) => {
    const lettersInQuote = currentQuote.text.split('').filter(char => /[A-Z]/.test(char));
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

    const encrypted = applyCipher(currentQuote.text);
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

  // Handle verse change
  const handleVerseChange = (newIndex: number) => {
    setCurrentVerseIndex(newIndex);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerseIndex]);

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
            moveToNextCharacter();
          }
        }
      } else if (key === 'ESCAPE') {
        setSelectedChar(null);
        setSelectedPosition(-1);
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        handleBackspace();
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
    // Check if this letter is already used in another position
    const isLetterAlreadyUsed = Object.values(guesses).includes(guess.toUpperCase());
    
    // If the letter is already used and it's not the same encrypted character, don't allow it
    if (isLetterAlreadyUsed && guesses[encryptedChar] !== guess.toUpperCase()) {
      return false; // Return false to indicate the guess was rejected
    }
    
    const newGuesses = { ...guesses, [encryptedChar]: guess.toUpperCase() };
    setGuesses(newGuesses);
    
    // Check if puzzle is solved after each guess
    if (checkIfSolved(newGuesses)) {
      setIsSolved(true);
    }
    
    return true; // Return true to indicate the guess was accepted
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
        setTimeout(() => moveToNextCharacter(), 0);
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (selectedChar) {
      const guessAccepted = handleGuessChange(selectedChar, key);
      // Move to the next character after typing only if guess was accepted
      if (guessAccepted) {
        moveToNextCharacter();
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
    moveToPreviousCharacter();
  };

  const handleReset = () => {
    setGuesses({});
    setIsSolved(false);
    setHintsRemaining(3);
    setRevealedLetters([]);
    setAutoCheckEnabled(false);
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) return;

    // Get letter frequency in the original quote
    const letterFrequency: Record<string, number> = {};
    currentQuote.text.split('').forEach(char => {
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
    if (selectedChar && inputRefs.current[selectedChar]) {
      // Use a small delay to ensure the DOM has updated
      setTimeout(() => {
        const inputElement = inputRefs.current[selectedChar];
        if (inputElement) {
          // Store current scroll position
          const scrollY = window.scrollY;
          
          // Focus the input
          inputElement.focus({ preventScroll: true });
          
          // Restore scroll position if it changed
          if (window.scrollY !== scrollY) {
            window.scrollTo(0, scrollY);
          }
        }
      }, 10);
    }
  }, [selectedChar, selectedPosition]);

  return (
    <div className="game-container">
      <h1>Bible Cryptogram</h1>
      
      {/* Verse selector */}
      <div className="verse-selector">
        <label htmlFor="verse-select">Select Verse: </label>
        <select 
          id="verse-select"
          value={currentVerseIndex}
          onChange={(e) => handleVerseChange(Number(e.target.value))}
          className="verse-dropdown"
        >
          {BIBLE_VERSES.map((verse, index) => (
            <option key={index} value={index}>
              {verse.author}
            </option>
          ))}
        </select>
      </div>

      <Controls
        onReset={handleReset}
        onHint={handleHint}
        onAutoCheck={handleAutoCheck}
        hintsRemaining={hintsRemaining}
        autoCheckEnabled={autoCheckEnabled}
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
                      ref={(el) => {
                        if (isLetter) {
                          inputRefs.current[char] = el;
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
          <p className="author">— {currentQuote.author}</p>
        </div>
      )}
      
      <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} guesses={guesses} />
      
      <div className="citation">
        Scripture quotations taken from the Holy Bible, New International Version®, NIV®.<br />
        Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™<br />
        Used by permission. All rights reserved worldwide.
      </div>
    </div>
  );
};

export default Game; 