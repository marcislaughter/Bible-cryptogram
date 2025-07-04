import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from './Keyboard';
import Controls from './Controls';
import WordStats from './WordStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Bible verses data
const BIBLE_VERSES = [
  {
    text: "THEREFORE, MY DEAR FRIENDS, FLEE FROM IDOLATRY.",
    author: "1 Corinthians 10:14"
  },
  {
    text: "I SPEAK TO SENSIBLE PEOPLE; JUDGE FOR YOURSELVES WHAT I SAY.",
    author: "1 Corinthians 10:15"
  },
  {
    text: "IS NOT THE CUP OF THANKSGIVING FOR WHICH WE GIVE THANKS A PARTICIPATION IN THE BLOOD OF CHRIST?",
    author: "1 Corinthians 10:16a"
  },
  {
    text: "AND IS NOT THE BREAD THAT WE BREAK A PARTICIPATION IN THE BODY OF CHRIST?",
    author: "1 Corinthians 10:16b"
  },
  {
    text: "BECAUSE THERE IS ONE LOAF, WE, WHO ARE MANY, ARE ONE BODY, FOR WE ALL SHARE THE ONE LOAF.",
    author: "1 Corinthians 10:17"
  },
  {
    text: "CONSIDER THE PEOPLE OF ISRAEL: DO NOT THOSE WHO EAT THE SACRIFICES PARTICIPATE IN THE ALTAR?",
    author: "1 Corinthians 10:18"
  },
  {
    text: "DO I MEAN THEN THAT FOOD SACRIFICED TO AN IDOL IS ANYTHING, OR THAT AN IDOL IS ANYTHING?",
    author: "1 Corinthians 10:19"
  },
  {
    text: "NO, BUT THE SACRIFICES OF PAGANS ARE OFFERED TO DEMONS, NOT TO GOD,",
    author: "1 Corinthians 10:20a"
  },
  {
    text: "AND I DO NOT WANT YOU TO BE PARTICIPANTS WITH DEMONS.",
    author: "1 Corinthians 10:20b"
  },
  {
    text: "YOU CANNOT DRINK THE CUP OF THE LORD AND THE CUP OF DEMONS TOO;",
    author: "1 Corinthians 10:21a"
  },
  {
    text: "YOU CANNOT HAVE A PART IN BOTH THE LORD'S TABLE AND THE TABLE OF DEMONS.",
    author: "1 Corinthians 10:21b"
  },
  {
    text: "ARE WE TRYING TO AROUSE THE LORD'S JEALOUSY? ARE WE STRONGER THAN HE?",
    author: "1 Corinthians 10:22"
  },
  {
    text: '"I HAVE THE RIGHT TO DO ANYTHING" YOU SAY—BUT NOT EVERYTHING IS BENEFICIAL.',
    author: "1 Corinthians 10:23a"
  },
  {
    text: "'I HAVE THE RIGHT TO DO ANYTHING'—BUT NOT EVERYTHING IS CONSTRUCTIVE.",
    author: "1 Corinthians 10:23b"
  },
  {
    text: "NO ONE SHOULD SEEK THEIR OWN GOOD, BUT THE GOOD OF OTHERS.",
    author: "1 Corinthians 10:24"
  },
  {
    text: "EAT ANYTHING SOLD IN THE MEAT MARKET WITHOUT RAISING QUESTIONS OF CONSCIENCE,",
    author: "1 Corinthians 10:25"
  },
  {
    text: "FOR, 'THE EARTH IS THE LORD'S, AND EVERYTHING IN IT.'",
    author: "1 Corinthians 10:26"
  },
  {
    text: "IF AN UNBELIEVER INVITES YOU TO A MEAL AND YOU WANT TO GO, EAT WHATEVER IS PUT BEFORE YOU WITHOUT RAISING QUESTIONS OF CONSCIENCE.",
    author: "1 Corinthians 10:27"
  },
  {
    text: "BUT IF SOMEONE SAYS TO YOU, 'THIS HAS BEEN OFFERED IN SACRIFICE,' THEN DO NOT EAT IT,",
    author: "1 Corinthians 10:28a"
  },
  {
    text: "BOTH FOR THE SAKE OF THE ONE WHO TOLD YOU AND FOR THE SAKE OF CONSCIENCE.",
    author: "1 Corinthians 10:28b"
  },
  {
    text: "I AM REFERRING TO THE OTHER PERSON'S CONSCIENCE, NOT YOURS.",
    author: "1 Corinthians 10:29a"
  },
  {
    text: "FOR WHY IS MY FREEDOM BEING JUDGED BY ANOTHER'S CONSCIENCE?",
    author: "1 Corinthians 10:29b"
  },
  {
    text: "IF I TAKE PART IN THE MEAL WITH THANKFULNESS, WHY AM I DENOUNCED BECAUSE OF SOMETHING I THANK GOD FOR?",
    author: "1 Corinthians 10:30"
  },
  {
    text: "SO WHETHER YOU EAT OR DRINK OR WHATEVER YOU DO, DO IT ALL FOR THE GLORY OF GOD.",
    author: "1 Corinthians 10:31"
  },
  {
    text: "DO NOT CAUSE ANYONE TO STUMBLE, WHETHER JEWS, GREEKS OR THE CHURCH OF GOD—",
    author: "1 Corinthians 10:32"
  },
  {
    text: "EVEN AS I TRY TO PLEASE EVERYONE IN EVERY WAY.",
    author: "1 Corinthians 10:33a"
  },
  {
    text: "FOR I AM NOT SEEKING MY OWN GOOD BUT THE GOOD OF MANY, SO THAT THEY MAY BE SAVED.",
    author: "1 Corinthians 10:33b"
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
  const [currentQuote, setCurrentQuote] = useState(BIBLE_VERSES[0]);
  const [isTouching, setIsTouching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Create debounced movement functions
  const debouncedMoveNext = useRef(
    debounce(() => moveToNextCharacter(), 150)
  ).current;

  const debouncedMovePrevious = useRef(
    debounce(() => moveToPreviousCharacter(), 150)
  ).current;

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

  useEffect(() => {
    generateNewGame();
  }, [currentQuote]);

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
    setWordStatsEnabled(false);
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

  const handleToggleWordStats = () => {
    setWordStatsEnabled(!wordStatsEnabled);
  };

  // Function to handle next verse button
  const handleNextVerse = () => {
    const currentIndex = BIBLE_VERSES.findIndex(verse => verse.text === currentQuote.text);
    const nextIndex = (currentIndex + 1) % BIBLE_VERSES.length;
    setCurrentQuote(BIBLE_VERSES[nextIndex]);
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

  // Add click outside handler for both menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="top-banner">
        <div className="banner-content">
          <div className="cryptogram-dropdown" ref={menuRef}>
            <button 
              className="cryptogram-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Cryptogram <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {isMenuOpen && (
              <div className="menu-dropdown">
                <button className="menu-item">
                  Unscramble
                </button>
              </div>
            )}
          </div>

          <div className="banner-right">
            <Link to="/instructions" className="help-btn">
              <FontAwesomeIcon icon={faQuestion} />
            </Link>
            <div className="hamburger-menu" ref={hamburgerRef}>
              <button 
                className="hamburger-button"
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              {isHamburgerOpen && (
                <div className="menu-dropdown">
                  <Link to="/memorization" className="menu-item" onClick={() => setIsHamburgerOpen(false)}>
                    Why Memorize?
                  </Link>
                  <Link to="/faith" className="menu-item" onClick={() => setIsHamburgerOpen(false)}>
                    Statement of Faith
                  </Link>
                  <button 
                    onClick={() => {
                      handleToggleWordStats();
                      setIsHamburgerOpen(false);
                    }}
                    className="menu-item"
                  >
                    {wordStatsEnabled ? 'Unpin Word Stats' : 'Pin Word Stats'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="game-container">
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
        
        <div className="quote-container" 
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
            <p className="author">— {currentQuote.author}</p>
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