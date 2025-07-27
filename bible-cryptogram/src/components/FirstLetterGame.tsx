import React, { useState, useEffect, useRef } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './FirstLetterGame.css';

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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});
  const [hiddenWordIndices, setHiddenWordIndices] = useState<number[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number[]>([]);
  const [errorInputs, setErrorInputs] = useState<number[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Use ref to track if we're currently advancing focus to prevent race conditions
  const isAdvancingFocus = useRef(false);

  const generateNewGame = () => {
    // Parse the verse into words, handling punctuation
    const words = currentVerse.text.split(' ').map(word => {
      // Remove punctuation for processing but keep the word structure
      return word.replace(/[^A-Z]/g, '');
    }).filter(word => word.length > 0);

    // Store original words
    setOriginalWords(words);

    // Determine which words should be hidden (every 4th word)
    const hiddenIndices: number[] = [];
    for (let i = 3; i < words.length; i += 4) {
      hiddenIndices.push(i);
    }
    setHiddenWordIndices(hiddenIndices);

    // Initialize guesses array
    setGuesses(new Array(words.length).fill(''));
    setCurrentWordIndex(0);
    setIsSolved(false);
    setIncorrectGuesses([]);
    setErrorInputs([]);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Focus first input when game starts
  useEffect(() => {
    if (originalWords.length > 0) {
      setTimeout(() => {
        const firstInput = document.querySelector('.first-letter-input') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
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
      // Remove from incorrect guesses and error inputs if they were there
      setIncorrectGuesses(prev => prev.filter(i => i !== wordIndex));
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
      
      // Add to incorrect guesses
      if (!incorrectGuesses.includes(wordIndex)) {
        setIncorrectGuesses(prev => [...prev, wordIndex]);
      }
      
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
      
      // Only advance focus if the guess was correct
      if (canAdvance) {
        advanceFocus(e.target);
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
        // Only advance focus if the guess was correct
        if (canAdvance) {
          advanceFocus(activeElement);
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
    setIncorrectGuesses([]);
    setErrorInputs([]);
    isAdvancingFocus.current = false;
    generateNewGame();
  };

  const handleHint = () => {
    if (isSolved) return;

    // Find the first word that hasn't been correctly guessed yet
    const nextWordToReveal = originalWords.findIndex((word, index) => 
      guesses[index] !== word[0] && !hiddenWordIndices.includes(index)
    );

    if (nextWordToReveal !== -1) {
      // Reveal the first letter
      const newGuesses = [...guesses];
      newGuesses[nextWordToReveal] = originalWords[nextWordToReveal][0];
      setGuesses(newGuesses);
      
      // Remove from incorrect guesses and error inputs if they were there
      setIncorrectGuesses(prev => prev.filter(i => i !== nextWordToReveal));
      setErrorInputs(prev => prev.filter(i => i !== nextWordToReveal));

      // Check if puzzle is solved
      if (checkIfSolved(newGuesses)) {
        setIsSolved(true);
      }
    }
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

  const handleRepeatVerse = () => {
    handleReset();
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
        
        <div className="first-letter-verse-container">
          {originalWords.map((word, wordIndex) => (
            <div key={wordIndex} className="first-letter-word-container">
              <div className="first-letter-input-container">
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
              </div>
              <div className={`word-display ${
                hiddenWordIndices.includes(wordIndex) 
                  ? (guesses[wordIndex] === word[0] ? 'revealed' : 'hidden')
                  : 'always-visible'
              }`}>
                {hiddenWordIndices.includes(wordIndex) 
                  ? (guesses[wordIndex] === word[0] ? word : '?????')
                  : word
                }
              </div>
            </div>
          ))}
        </div>
        
        {isSolved && (
          <div className="solved-message">
            <h2>Excellent! You got all the first letters!</h2>
            <div className="revealed-verse">
              {currentVerse.text}
            </div>
            <p className="reference">— {currentVerse.reference}</p>
            <div className="solved-buttons">
              <button onClick={handleRepeatVerse} className="repeat-verse-btn">
                <FontAwesomeIcon icon={faArrowLeft} /> {currentVerse.reference}
              </button>
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

export default FirstLetterGame; 