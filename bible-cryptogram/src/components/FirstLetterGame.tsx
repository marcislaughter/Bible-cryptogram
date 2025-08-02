import React, { useState, useEffect, useRef } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowUp, faArrowRotateLeft, faLightbulb, faUndo } from '@fortawesome/free-solid-svg-icons';
import './FirstLetterGame.css';
import './Controls.css';

interface FirstLetterGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

const FirstLetterGame: React.FC<FirstLetterGameProps> = ({ 
  gameType = 'first-letter', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});
  const [hiddenWordIndices, setHiddenWordIndices] = useState<number[]>([]);
  const [errorInputs, setErrorInputs] = useState<number[]>([]);
  const [_forceUpdate, setForceUpdate] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(2); // Default to level 2 (1/4 missing)
  const [hasManuallySelectedLevel, setHasManuallySelectedLevel] = useState(false);
  const [preferredLevel, setPreferredLevel] = useState(2);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  
  // Use ref to track if we're currently advancing focus to prevent race conditions
  const isAdvancingFocus = useRef(false);

  // Function to calculate which words should be hidden based on difficulty level
  const calculateHiddenWords = (words: string[], difficulty: number): number[] => {
    const totalWords = words.length;
    let hiddenCount = 0;
    
    switch (difficulty) {
      case 1: hiddenCount = 0; break; // 0% hidden
      case 2: hiddenCount = Math.round(totalWords * 0.25); break; // 25% hidden
      case 3: hiddenCount = Math.round(totalWords * 0.5); break; // 50% hidden
      case 4: hiddenCount = Math.round(totalWords * 0.75); break; // 75% hidden
      case 5: hiddenCount = totalWords; break; // 100% hidden
      default: hiddenCount = Math.round(totalWords * 0.25); break;
    }
    
    if (hiddenCount === 0) return [];
    if (hiddenCount >= totalWords) return Array.from({ length: totalWords }, (_, i) => i);
    
    // Distribute hidden words evenly across the verse
    const hiddenIndices: number[] = [];
    const step = totalWords / hiddenCount;
    
    for (let i = 0; i < hiddenCount; i++) {
      const index = Math.round(i * step);
      if (index < totalWords && !hiddenIndices.includes(index)) {
        hiddenIndices.push(index);
      }
    }
    
    // If we didn't get enough indices due to rounding, fill in gaps
    while (hiddenIndices.length < hiddenCount && hiddenIndices.length < totalWords) {
      for (let i = 0; i < totalWords && hiddenIndices.length < hiddenCount; i++) {
        if (!hiddenIndices.includes(i)) {
          hiddenIndices.push(i);
          break;
        }
      }
    }
    
    return hiddenIndices.sort((a, b) => a - b);
  };

  const generateNewGame = () => {
    // Parse the verse into words, handling punctuation
    const words = currentVerse.text.split(' ').map(word => {
      // Remove punctuation for processing but keep the word structure
      return word.replace(/[^A-Z]/g, '');
    }).filter(word => word.length > 0);

    // Store original words
    setOriginalWords(words);

    // Determine which words should be hidden based on difficulty level
    const hiddenIndices = calculateHiddenWords(words, difficultyLevel);
    setHiddenWordIndices(hiddenIndices);

    // Initialize guesses array
    setGuesses(new Array(words.length).fill(''));
    setIsSolved(false);
    setErrorInputs([]);
    setHintsUsed(0);
    setIncorrectGuesses(0);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse, difficultyLevel]);

  // Focus first input when game starts
  useEffect(() => {
    if (originalWords.length > 0) {
      setTimeout(() => {
        // Get all inputs and find the leftmost one visually
        const allInputs = Array.from(document.querySelectorAll('.first-letter-input')) as HTMLInputElement[];
        if (allInputs.length > 0) {
          // Sort inputs by their visual position (left to right, top to bottom)
          const sortedInputs = allInputs.sort((a, b) => {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            
            // First sort by top position (row), then by left position (column)
            if (Math.abs(aRect.top - bRect.top) > 5) { // Allow 5px tolerance for same row
              return aRect.top - bRect.top;
            }
            return aRect.left - bRect.left;
          });
          
          sortedInputs[0].focus();
        }
      }, 50);
    }
  }, [originalWords]);

  // Helper function to get all input elements
  const getAllInputs = () => {
    return Array.from(document.querySelectorAll('.first-letter-input:not([disabled])')) as HTMLInputElement[];
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

  // Advance focus to next input
  const advanceFocus = (currentInput: HTMLInputElement) => {
    if (isAdvancingFocus.current) return;
    
    isAdvancingFocus.current = true;
    
    const nextInput = getNextInput(currentInput);
    nextInput.focus();
    
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
    
    setTimeout(() => {
      isAdvancingFocus.current = false;
    }, 10);
  };

  // Check if all first letters are correctly guessed
  const checkIfSolved = (currentGuesses: string[]) => {
    return originalWords.every((word, index) => {
      return currentGuesses[index] === word[0];
    });
  };

  // Handle input change for first letter guessing
  const handleInputChange = (wordIndex: number, value: string, shouldAdvanceFocus: boolean = false) => {
    if (isSolved) return;
    
    const upperValue = value.toUpperCase();
    const correctFirstLetter = originalWords[wordIndex][0];
    
    const newGuesses = [...guesses];
    newGuesses[wordIndex] = upperValue;
    setGuesses(newGuesses);

    // Check if the guess is correct
    if (upperValue === correctFirstLetter) {
      // Remove from error inputs if they were there
      setErrorInputs(prev => prev.filter(i => i !== wordIndex));
      
      // Check if puzzle is solved
      if (checkIfSolved(newGuesses)) {
        setIsSolved(true);
      }
      
      // Return true to indicate success (can advance focus)
      return true;
    } else if (upperValue && upperValue !== correctFirstLetter) {
      // Wrong guess - add to error inputs and show red shake animation
      if (!errorInputs.includes(wordIndex)) {
        setErrorInputs(prev => [...prev, wordIndex]);
      }
      
      // Increment incorrect guesses counter
      setIncorrectGuesses(prev => prev + 1);
      
      // Clear the error state after the shake animation (500ms)
      setTimeout(() => {
        setErrorInputs(prev => prev.filter(i => i !== wordIndex));
      }, 500);
      
      // Return false to indicate failure (cannot advance focus)
      return false;
    }
    
    // Empty value or other case
    return shouldAdvanceFocus;
  };

  // Enhanced input change handler for mobile compatibility
  const handleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>, wordIndex: number) => {
    if (isAdvancingFocus.current) return;
    
    const value = e.target.value.toUpperCase();
    
    // Only allow A-Z letters
    if (value && /^[A-Z]$/.test(value)) {
      const canAdvance = handleInputChange(wordIndex, value, true);
      
      // Clear the input value to prevent display issues on mobile
      e.target.value = '';
      
      if (canAdvance) {
        // Correct guess - advance focus
        advanceFocus(e.target);
      } else {
        // Incorrect guess - clear the stored guess and blur briefly to reset state
        const newGuesses = [...guesses];
        newGuesses[wordIndex] = '';
        setGuesses(newGuesses);
        
        // Blur and refocus to reset the input state on mobile
        e.target.blur();
        setTimeout(() => {
          e.target.focus();
        }, 100);
      }
    } else if (value === '') {
      handleInputChange(wordIndex, '');
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLInputElement;
      if (!activeElement?.classList.contains('first-letter-input') || isAdvancingFocus.current) return;

      const key = event.key.toUpperCase();
      const wordIndex = parseInt(activeElement.dataset.wordIndex!);
      
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        const canAdvance = handleInputChange(wordIndex, key, true);
        
        if (canAdvance) {
          // Correct guess - advance focus
          advanceFocus(activeElement);
        } else {
          // Incorrect guess - clear the stored guess and reset input state
          const newGuesses = [...guesses];
          newGuesses[wordIndex] = '';
          setGuesses(newGuesses);
          
          // Brief blur/refocus to reset state for consistency with mobile
          activeElement.blur();
          setTimeout(() => {
            activeElement.focus();
          }, 100);
        }
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        event.preventDefault();
        handleInputChange(wordIndex, '');
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
  }, [guesses, originalWords]);

  // Focus handler
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Mobile keyboard compatibility
    e.target.value = '';
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const handleReset = () => {
    setGuesses(new Array(originalWords.length).fill(''));
    setIsSolved(false);
    setErrorInputs([]);
    setHintsUsed(0);
    setIncorrectGuesses(0);
    isAdvancingFocus.current = false;
    generateNewGame();
  };

  const handleHint = () => {
    if (isSolved) return;
    
    // Find the first word that hasn't been guessed correctly yet
    const nextWordIndex = originalWords.findIndex((word, index) => {
      return hiddenWordIndices.includes(index) && guesses[index] !== word[0];
    });
    
    if (nextWordIndex === -1) return; // All words are already correctly guessed
    
    // Reveal the first letter of the word
    const correctFirstLetter = originalWords[nextWordIndex][0];
    const newGuesses = [...guesses];
    newGuesses[nextWordIndex] = correctFirstLetter;
    setGuesses(newGuesses);
    
    // Increment hints used counter
    setHintsUsed(prev => prev + 1);
    
    // Mark this word as having had an error (since a hint was needed)
    if (!errorInputs.includes(nextWordIndex)) {
      setErrorInputs(prev => [...prev, nextWordIndex]);
      
      // Clear the error state after the shake animation (500ms)
      setTimeout(() => {
        setErrorInputs(prev => prev.filter(i => i !== nextWordIndex));
      }, 500);
    }
    
    // Check if puzzle is solved after the hint
    if (checkIfSolved(newGuesses)) {
      setIsSolved(true);
    }
    
    // Focus the next input that needs attention
    setTimeout(() => {
      const allInputs = getAllInputs();
      const nextInput = allInputs.find(input => {
        const wordIndex = parseInt(input.dataset.wordIndex!);
        return hiddenWordIndices.includes(wordIndex) && guesses[wordIndex] !== originalWords[wordIndex][0];
      });
      
      if (nextInput) {
        nextInput.focus();
      }
    }, 100);
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
    
    // Set difficulty level based on user preference
    if (hasManuallySelectedLevel) {
      setDifficultyLevel(preferredLevel);
    } else {
      setDifficultyLevel(2); // Default to level 2
    }
    
    onVerseChange(BIBLE_VERSES[nextIndex]);
  };

  const handleStepperClick = (level: number) => {
    setDifficultyLevel(level);
    setHasManuallySelectedLevel(true);
    setPreferredLevel(level);
  };

  const handleRepeatVerse = () => {
    handleReset();
  };

  const handleNextLevel = () => {
    if (difficultyLevel < 5) {
      setDifficultyLevel(difficultyLevel + 1);
    } else {
      // If already at max level, go to next verse
      handleNextVerse();
    }
  };

  // Function to get CSS class for input based on state
  const getInputClass = (wordIndex: number) => {
    const guess = guesses[wordIndex];
    const correctLetter = originalWords[wordIndex][0];
    
    // Check for error state first (red shake animation)
    if (errorInputs.includes(wordIndex)) {
      return 'incorrect';
    }
    
    if (!guess) return '';
    
    // Show incorrect guesses as red
    if (guess !== correctLetter) {
      return 'incorrect';
    }
    
    return '';
  };

  // Function to calculate input width based on word length
  const getInputWidth = (wordIndex: number) => {
    const wordLength = originalWords[wordIndex].length;
    
    // Responsive width calculation based on screen size
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 500;
    
    let baseWidth, charWidth, minWidth;
    
    if (isSmallMobile) {
      baseWidth = 10;
      charWidth = 5;
      minWidth = 20;
    } else if (isMobile) {
      baseWidth = 12;
      charWidth = 6;
      minWidth = 22;
    } else {
      baseWidth = 15;
      charWidth = 8;
      minWidth = 25;
    }
    
    const calculatedWidth = Math.max(minWidth, baseWidth + (wordLength * charWidth));
    return `${calculatedWidth}px`;
  };

  // Resize listener to update input widths on screen size change
  useEffect(() => {
    const handleResize = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Win message handler
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('first-letter-win-gradient');
      
      setTimeout(() => {
        const solvedMessage = document.querySelector('.solved-message');
        if (solvedMessage) {
          solvedMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 150);
    } else {
      document.body.classList.remove('first-letter-win-gradient');
    }
    
    return () => {
      document.body.classList.remove('first-letter-win-gradient');
    };
  }, [isSolved]);

  // Handle Enter key on completion screen
  useEffect(() => {
    const handleCompletionKeyDown = (event: KeyboardEvent) => {
      if (isSolved && event.key === 'Enter') {
        event.preventDefault();
        const totalHiddenWords = hiddenWordIndices.length;
        const score = totalHiddenWords > 0 ? Math.round(((totalHiddenWords - hintsUsed - incorrectGuesses) / totalHiddenWords) * 100) : 100;
        if (score > 95) {
          if (difficultyLevel < 5) {
            handleNextLevel();
          } else {
            handleNextVerse();
          }
        } else {
          handleRepeatVerse();
        }
      }
    };

    window.addEventListener('keydown', handleCompletionKeyDown);
    return () => window.removeEventListener('keydown', handleCompletionKeyDown);
  }, [isSolved, difficultyLevel, hiddenWordIndices.length, hintsUsed, incorrectGuesses]);

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

      <div className="first-letter-container">
        {wordStatsEnabled && <WordStats />}
        
        {!isSolved && (
          <div className="first-letter-top-controls">
            <div className="controls-container">
              <button onClick={handleReset}>
                <FontAwesomeIcon icon={faUndo} />
                Reset
              </button>
              <button 
                onClick={handleHint}
                className={hiddenWordIndices.every(index => guesses[index] === originalWords[index][0]) ? 'disabled' : ''}
                disabled={hiddenWordIndices.every(index => guesses[index] === originalWords[index][0])}
              >
                <FontAwesomeIcon icon={faLightbulb} />
                Hint
              </button>
            </div>
          </div>
        )}
        
        <div className="first-letter-verse-container">
          {originalWords.map((word, wordIndex) => (
            <div key={wordIndex} className="first-letter-word-container">
              <div className="first-letter-input-container">
                {!isSolved && (
                  <input
                    type="text"
                    maxLength={1}
                    className={`first-letter-input ${getInputClass(wordIndex)}`}
                    style={{ width: getInputWidth(wordIndex) }}
                    value={guesses[wordIndex] || ''}
                    onChange={(e) => handleInputChangeEvent(e, wordIndex)}
                    onFocus={handleInputFocus}
                    data-word-index={wordIndex}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    inputMode="text"
                  />
                )}
              </div>
              <div className={`word-display ${
                hiddenWordIndices.includes(wordIndex) 
                  ? (guesses[wordIndex] === word[0] ? 'revealed' : 'hidden')
                  : 'always-visible'
              }`}>
                {hiddenWordIndices.includes(wordIndex) 
                  ? (guesses[wordIndex] === word[0] ? word : '_'.repeat(word.length))
                  : word
                }
              </div>
            </div>
          ))}
        </div>
        
        {isSolved && (
          <div className="solved-message">
            {(() => {
              const totalHiddenWords = hiddenWordIndices.length;
              const score = totalHiddenWords > 0 ? Math.round(((totalHiddenWords - hintsUsed - incorrectGuesses) / totalHiddenWords) * 100) : 100;
              
              if (score === 100) {
                return <h2>Perfect! You got all the first letters!</h2>;
              } else if (score >= 80) {
                return <h2>Excellent! You got all the first letters!</h2>;
              } else if (score >= 60) {
                return <h2>Good job! You got all the first letters!</h2>;
              } else {
                return <h2>Nice effort! You got all the first letters!</h2>;
              }
            })()}
            <div className="score-display">
              <p className="score-text">
                Score: {(() => {
                  const totalHiddenWords = hiddenWordIndices.length;
                  return totalHiddenWords > 0 ? Math.round(((totalHiddenWords - hintsUsed - incorrectGuesses) / totalHiddenWords) * 100) : 100;
                })()}%
              </p>
            </div>
            <div className="first-letter-revealed-verse">
              {currentVerse.text}
            </div>
            <p className="first-letter-reference">— {currentVerse.reference}</p>
            <div className="first-letter-solved-buttons">
              {(() => {
                const totalHiddenWords = hiddenWordIndices.length;
                const score = totalHiddenWords > 0 ? Math.round(((totalHiddenWords - hintsUsed - incorrectGuesses) / totalHiddenWords) * 100) : 100;
                const isPrimaryNext = score > 95;
                
                return (
                  <>
                    <button 
                      onClick={handleRepeatVerse} 
                      className={`solved-button-base retry-btn ${!isPrimaryNext ? 'primary-button' : ''}`}
                    >
                      <FontAwesomeIcon icon={faArrowRotateLeft} />
                    </button>
                    {difficultyLevel < 5 ? (
                      <button 
                        onClick={handleNextLevel} 
                        className={`solved-button-base ${isPrimaryNext ? 'primary-button' : ''}`}
                      >
                        Next Level <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                    ) : (
                      <button 
                        onClick={handleNextVerse} 
                        className={`solved-button-base ${isPrimaryNext ? 'primary-button' : ''}`}
                      >
                        {getNextVerseReference()} <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
        
        <div className="first-letter-difficulty-stepper">
          <div className="first-letter-difficulty-label">Difficulty Level:</div>
          <div className="first-letter-stepper-container">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                className={`first-letter-stepper-button ${difficultyLevel === level ? 'active' : ''}`}
                onClick={() => handleStepperClick(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="first-letter-citation">
          Scripture quotations taken from the Holy Bible, New International Version®, NIV®.<br />
          Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™<br />
          Used by permission. All rights reserved worldwide.
        </div>
      </div>
    </>
  );
};

export default FirstLetterGame; 