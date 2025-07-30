import React, { useState, useEffect, useRef } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, BIBLE_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRotateLeft, faLightbulb, faUndo, faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './FirstLetterTestGame.css';

interface FirstLetterTestGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

interface WordItem {
  text: string;
  isVerseNumber: boolean;
  originalIndex: number;
  verseIndex: number;
}

const FirstLetterTestGame: React.FC<FirstLetterTestGameProps> = ({ 
  gameType = 'first-letter-test', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [chapterWords, setChapterWords] = useState<WordItem[]>([]);
  const [revealedWords, setRevealedWords] = useState<boolean[]>([]);
  const [wordsWithErrors, setWordsWithErrors] = useState<boolean[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [wordStatsEnabled, setWordStatsEnabled] = useState(false);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [originalWordsWithErrors, setOriginalWordsWithErrors] = useState<boolean[]>([]);
  // Add state to track partial verse number input
  const [partialVerseInput, setPartialVerseInput] = useState<string>('');
  // Ref for hidden input to handle mobile keyboard
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

  // Get the current chapter based on the selected verse
  const getCurrentChapter = () => {
    const chapterRef = currentVerse.reference.includes(':') 
      ? currentVerse.reference.split(':')[0]  // "1 Cor 11:1" -> "1 Cor 11"
      : currentVerse.reference;
    
    return BIBLE_CHAPTERS.find(chapter => chapter.chapterReference === chapterRef);
  };

  const extractVerseNumber = (reference: string): string => {
    const parts = reference.split(':');
    return parts.length > 1 ? parts[1] : '1';
  };

  const generateNewGame = (reviewMode = false) => {
    const currentChapter = getCurrentChapter();
    if (!currentChapter) return;

    const wordItems: WordItem[] = [];
    let wordIndex = 0;

    if (reviewMode) {
      // In review mode, only include verses that had errors
      const versesWithErrors = getVersesWithErrors();
      
      versesWithErrors.forEach((verse) => {
        const verseIndex = currentChapter.verses.indexOf(verse);
        
        // Add verse number
        const verseNumber = extractVerseNumber(verse.reference);
        wordItems.push({
          text: verseNumber,
          isVerseNumber: true,
          originalIndex: wordIndex++,
          verseIndex: verseIndex
        });

        // Add verse words (removing punctuation and filtering empty)
        const verseWords = verse.text.split(' ')
          .map(word => word.replace(/[^A-Z]/g, ''))
          .filter(word => word.length > 0);

        verseWords.forEach(word => {
          wordItems.push({
            text: word,
            isVerseNumber: false,
            originalIndex: wordIndex++,
            verseIndex: verseIndex
          });
        });
      });
    } else {
      // Regular mode - process all verses in the chapter
      currentChapter.verses.forEach((verse, verseIndex) => {
        // Add verse number
        const verseNumber = extractVerseNumber(verse.reference);
        wordItems.push({
          text: verseNumber,
          isVerseNumber: true,
          originalIndex: wordIndex++,
          verseIndex: verseIndex
        });

        // Add verse words (removing punctuation and filtering empty)
        const verseWords = verse.text.split(' ')
          .map(word => word.replace(/[^A-Z]/g, ''))
          .filter(word => word.length > 0);

        verseWords.forEach(word => {
          wordItems.push({
            text: word,
            isVerseNumber: false,
            originalIndex: wordIndex++,
            verseIndex: verseIndex
          });
        });
      });
    }

    setChapterWords(wordItems);
    
    // Set up revealed words
    const initialRevealedWords = new Array(wordItems.length).fill(false);
    let isFirstVerseNumber = true;
    
    wordItems.forEach((wordItem, index) => {
      if (wordItem.isVerseNumber) {
        if (reviewMode) {
          // In review mode, reveal all verse numbers
          initialRevealedWords[index] = true;
        } else if (isFirstVerseNumber) {
          // In regular mode, only reveal the first verse number
          initialRevealedWords[index] = true;
          isFirstVerseNumber = false;
        }
      }
    });
    
    // Find the first unrevealed word
    let firstUnrevealedIndex = 0;
    for (let i = 0; i < initialRevealedWords.length; i++) {
      if (!initialRevealedWords[i]) {
        firstUnrevealedIndex = i;
        break;
      }
    }
    
    setRevealedWords(initialRevealedWords);
    
    if (!reviewMode) {
      setWordsWithErrors(new Array(wordItems.length).fill(false));
    } else {
      // In review mode, start fresh with error tracking
      setWordsWithErrors(new Array(wordItems.length).fill(false));
    }
    
    setIsSolved(false);
    setCurrentWordIndex(reviewMode ? firstUnrevealedIndex : 0);
    setHasError(false);
    setPartialVerseInput(''); // Reset partial verse input for new game
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  // Check for game completion whenever revealed words change
  useEffect(() => {
    if (chapterWords.length > 0 && revealedWords.length > 0) {
      const allRevealed = revealedWords.every(revealed => revealed);
      if (allRevealed && !isSolved) {
        setIsSolved(true);
        // Blur the hidden input so Enter key can be handled by main event handler
        if (hiddenInputRef.current) {
          hiddenInputRef.current.blur();
        }
      }
    }
  }, [revealedWords, chapterWords, isSolved]);

  // Find the next unrevealed word
  const findNextUnrevealedWord = (startIndex: number = 0): number => {
    for (let i = startIndex; i < chapterWords.length; i++) {
      if (!revealedWords[i]) {
        return i;
      }
    }
    // If no unrevealed words found from startIndex, search from beginning
    for (let i = 0; i < startIndex; i++) {
      if (!revealedWords[i]) {
        return i;
      }
    }
    return -1; // All words revealed
  };

  // Focus the hidden input when component mounts or game resets
  useEffect(() => {
    if (hiddenInputRef.current && !isSolved) {
      hiddenInputRef.current.focus();
    }
  }, [isSolved, currentVerse]);



  // Function to handle character input (works for both desktop and mobile)
  const handleCharacterInput = (key: string) => {
    if (isSolved) return;

    // Handle numbers and letters
    if (/^[A-Z0-9]$/i.test(key)) {
      const nextWordIndex = findNextUnrevealedWord(currentWordIndex);
      if (nextWordIndex === -1) return; // All words revealed

      const targetWordItem = chapterWords[nextWordIndex];
      const inputKey = key.toUpperCase();
      
      let isCorrect = false;
      
      if (targetWordItem.isVerseNumber) {
        // For verse numbers, build up the input digit by digit
        if (/^[0-9]$/.test(key)) {
          const newPartialInput = partialVerseInput + key;
          
          // Check if the new partial input matches the beginning of the target verse number
          if (targetWordItem.text.startsWith(newPartialInput)) {
            setPartialVerseInput(newPartialInput);
            
            // Check if we've completed the verse number
            if (newPartialInput === targetWordItem.text) {
              isCorrect = true;
              setPartialVerseInput(''); // Reset for next verse number
            } else {
              // Partial match - don't advance yet, but don't show error
              return; // Exit early without showing error or advancing
            }
          } else {
            // Wrong digit - reset partial input and show error
            setPartialVerseInput('');
            isCorrect = false;
          }
        } else {
          // Non-digit key pressed for verse number
          isCorrect = false;
        }
      } else {
        // For regular words, check if the key matches the first letter
        isCorrect = inputKey === targetWordItem.text[0];
      }
      
      if (isCorrect) {
        // Correct input - clear error and reveal the word
        setHasError(false);
        const newRevealedWords = [...revealedWords];
        newRevealedWords[nextWordIndex] = true;
        setRevealedWords(newRevealedWords);
        
        // Move to next unrevealed word
        const nextUnrevealedIndex = findNextUnrevealedWord(nextWordIndex + 1);
        if (nextUnrevealedIndex === -1) {
          // All words revealed - game complete!
          setIsSolved(true);
        } else {
          setCurrentWordIndex(nextUnrevealedIndex);
        }
      } else {
        // Wrong input - show error and mark word as having had an error
        setHasError(true);
        const newWordsWithErrors = [...wordsWithErrors];
        newWordsWithErrors[nextWordIndex] = true;
        setWordsWithErrors(newWordsWithErrors);
        
        // Clear error after animation duration
        setTimeout(() => {
          setHasError(false);
        }, 500);
      }
    }
  };

  // Handle keyboard input for desktop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only skip input handling if it's the hidden input AND the game is not solved
      if (event.target === hiddenInputRef.current && !isSolved) return;
      
      // Handle Enter key when game is solved
      if (event.key === 'Enter' && isSolved) {
        event.preventDefault();
        
        // Get the primary action using the existing function
        const primaryAction = getPrimaryAction();
        
        if (primaryAction) {
          primaryAction();
        }
        return;
      }
      
      // Handle regular game input
      if (!isSolved) {
        event.preventDefault();
        handleCharacterInput(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterWords, revealedWords, wordsWithErrors, currentWordIndex, isSolved, hasError, partialVerseInput, isReviewMode]);

  // Handle input events for mobile
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      handleCharacterInput(lastChar);
      // Clear the input to allow continuous typing
      event.target.value = '';
    }
  };

  // Handle clicking on the game area to focus the input (mobile)
  const handleGameAreaClick = () => {
    if (hiddenInputRef.current && !isSolved) {
      hiddenInputRef.current.focus();
    }
  };

  const handleReset = () => {
    generateNewGame(isReviewMode);
    // Refocus input after reset for mobile
    setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 100);
  };

  const handleReviewErrors = () => {
    // Store the original errors before switching to review mode
    setOriginalWordsWithErrors([...wordsWithErrors]);
    setIsReviewMode(true);
    generateNewGame(true);
    // Refocus input after entering review mode for mobile
    setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 100);
  };

  const handleExitReview = () => {
    setIsReviewMode(false);
    // Restore original errors and regenerate full game
    setWordsWithErrors([...originalWordsWithErrors]);
    generateNewGame(false);
    // Refocus input after exiting review mode for mobile
    setTimeout(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus();
      }
    }, 100);
  };

  const handleHint = () => {
    if (isSolved) return;
    
    const nextWordIndex = findNextUnrevealedWord(currentWordIndex);
    if (nextWordIndex === -1) return; // All words revealed
    
    // Reveal the current word and mark it as having had an error (since a hint was needed)
    const newRevealedWords = [...revealedWords];
    newRevealedWords[nextWordIndex] = true;
    setRevealedWords(newRevealedWords);
    
    const newWordsWithErrors = [...wordsWithErrors];
    newWordsWithErrors[nextWordIndex] = true;
    setWordsWithErrors(newWordsWithErrors);
    
    // Move to next unrevealed word
    const nextUnrevealedIndex = findNextUnrevealedWord(nextWordIndex + 1);
    if (nextUnrevealedIndex === -1) {
      // All words revealed - game complete!
      setIsSolved(true);
    } else {
      setCurrentWordIndex(nextUnrevealedIndex);
    }
    
    // Refocus input after hint for mobile
    setTimeout(() => {
      if (hiddenInputRef.current && !isSolved) {
        hiddenInputRef.current.focus();
      }
    }, 100);
  };

  const handleVerseChange = (verse: BibleVerse) => {
    onVerseChange(verse);
  };

  // Function to get the next verse reference
  const getNextChapterReference = () => {
    const currentChapter = getCurrentChapter();
    if (!currentChapter) return '';
    
    const currentChapterIndex = BIBLE_CHAPTERS.findIndex(chapter => 
      chapter.chapterReference === currentChapter.chapterReference);
    const nextChapterIndex = (currentChapterIndex + 1) % BIBLE_CHAPTERS.length;
    return BIBLE_CHAPTERS[nextChapterIndex].chapterReference;
  };

  const handleNextChapter = () => {
    const currentChapter = getCurrentChapter();
    if (!currentChapter) return;
    
    const currentChapterIndex = BIBLE_CHAPTERS.findIndex(chapter => 
      chapter.chapterReference === currentChapter.chapterReference);
    const nextChapterIndex = (currentChapterIndex + 1) % BIBLE_CHAPTERS.length;
    const nextChapter = BIBLE_CHAPTERS[nextChapterIndex];
    
    // Select the first verse of the next chapter
    if (nextChapter.verses.length > 0) {
      onVerseChange(nextChapter.verses[0]);
      // Refocus input after changing chapter for mobile
      setTimeout(() => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Get verses that had errors (at least one red word)
  const getVersesWithErrors = () => {
    if (!currentChapter) return [];
    
    const verseHasError = new Array(currentChapter.verses.length).fill(false);
    
    chapterWords.forEach((wordItem, wordIndex) => {
      if (wordsWithErrors[wordIndex]) {
        verseHasError[wordItem.verseIndex] = true;
      }
    });
    
    return currentChapter.verses.filter((_, index) => verseHasError[index]);
  };

  // Render a verse with error words highlighted
  const renderVerseWithErrors = (verse: any, verseIndex: number) => {
    const verseWords = chapterWords.filter(wordItem => wordItem.verseIndex === verseIndex);
    const originalText = verse.text;
    const words = originalText.split(' ');
    
    let wordItemIndex = 0;
    let renderedElements: React.ReactElement[] = [];
    
    // Add verse number first
    const verseNumberWordItem = verseWords.find(w => w.isVerseNumber);
    if (verseNumberWordItem) {
      const wordIndex = chapterWords.indexOf(verseNumberWordItem);
      const hasError = wordsWithErrors[wordIndex];
      
      renderedElements.push(
        <span key={`verse-num-${verseIndex}`} className={hasError ? 'error-word' : ''}>
          {verseNumberWordItem.text}
        </span>
      );
      renderedElements.push(<span key={`space-after-num-${verseIndex}`}> </span>);
      wordItemIndex++;
    }
    
    // Process each word in the original text
    words.forEach((originalWord: string, originalWordIndex: number) => {
      // Extract just the letters for matching
      const cleanWord = originalWord.replace(/[^A-Z]/g, '');
      
      if (cleanWord.length > 0) {
        // Find the corresponding word item
        const wordItem = verseWords.find((w, idx) => 
          !w.isVerseNumber && idx === wordItemIndex
        );
        
        if (wordItem) {
          const wordIndex = chapterWords.indexOf(wordItem);
          const hasError = wordsWithErrors[wordIndex];
          
          renderedElements.push(
            <span key={`word-${verseIndex}-${originalWordIndex}`} className={hasError ? 'error-word' : ''}>
              {originalWord}
            </span>
          );
          wordItemIndex++;
        } else {
          // Fallback for words that don't match
          renderedElements.push(
            <span key={`word-fallback-${verseIndex}-${originalWordIndex}`}>
              {originalWord}
            </span>
          );
        }
      } else {
        // Handle punctuation-only "words"
        renderedElements.push(
          <span key={`punct-${verseIndex}-${originalWordIndex}`}>
            {originalWord}
          </span>
        );
      }
      
      // Add space after word (except for last word)
      if (originalWordIndex < words.length - 1) {
        renderedElements.push(
          <span key={`space-${verseIndex}-${originalWordIndex}`}> </span>
        );
      }
    });
    
    return (
      <div key={verseIndex} className="verse-line">
        {renderedElements}
      </div>
    );
  };

  // Get minimum words to display (ensure first verse number + current word are always visible)
  const getMinimumDisplayWords = () => {
    // Always show at least 2 words to ensure first verse number and current position are visible
    return Math.max(2, currentWordIndex + 1);
  };

  // Calculate percentage correct
  const calculatePercentageCorrect = () => {
    if (chapterWords.length === 0) return 100;
    
    const totalWords = chapterWords.length;
    const errorWords = wordsWithErrors.filter(hasError => hasError).length;
    const correctWords = totalWords - errorWords;
    const percentage = (correctWords / totalWords) * 100;
    
    return Math.round(percentage);
  };

  // Get current chapter info for display
  const currentChapter = getCurrentChapter();
  const chapterTitle = currentChapter ? currentChapter.chapterTitle : '';
  const versesWithErrors = getVersesWithErrors();
  const percentageCorrect = calculatePercentageCorrect();

  // Apply high score gradient to body when game is solved
  useEffect(() => {
    if (isSolved) {
      document.body.classList.add('first-letter-test-high-score');
    } else {
      document.body.classList.remove('first-letter-test-high-score');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('first-letter-test-high-score');
    };
  }, [isSolved]);

  // Function to determine which action should be primary (highlighted and triggered by Enter)
  const getPrimaryAction = () => {
    if (!isSolved) return null;
    
    if (!isReviewMode && versesWithErrors.length > 0) {
      // Has errors to review - highlight review errors button
      return handleReviewErrors;
    } else if (!isReviewMode && versesWithErrors.length === 0) {
      // No errors - highlight next chapter button
      return handleNextChapter;
    } else if (isReviewMode) {
      // In review mode - highlight back to full chapter button
      return handleExitReview;
    }
    
    return null;
  };

  // Function to determine which button should have primary styling
  const getPrimaryButtonType = (): 'review' | 'next-chapter' | 'exit-review' | 'retry' | null => {
    if (!isSolved) return null;
    
    const hasErrors = wordsWithErrors.some(hasError => hasError);
    
    if (!isReviewMode && hasErrors) {
      return 'review';
    } else if (!isReviewMode && !hasErrors) {
      return 'next-chapter';
    } else if (isReviewMode && hasErrors) {
      return 'retry';
    } else if (isReviewMode && !hasErrors) {
      return 'exit-review';
    }
    
    return null;
  };

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

      <div className="first-letter-test-container" onClick={handleGameAreaClick}>
        {/* Hidden input for mobile keyboard support */}
        <textarea
          ref={hiddenInputRef}
          style={{
            position: 'absolute',
            left: '-9999px',
            opacity: 0,
            pointerEvents: 'none',
            resize: 'none'
          }}
          onChange={handleInputChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="text"
          enterKeyHint="done"
          name="game-input"
          id="game-input-hidden"
          role="textbox"
          aria-label="Game input"
          rows={1}
          cols={1}
        />
        {wordStatsEnabled && <WordStats />}
        
        <div className="chapter-title">
          {chapterTitle} {isReviewMode && '(Review Mode - Verses with Errors)'}
        </div>
        
        {!isSolved && (
          <div className="top-controls">
            <button onClick={handleReset} className="reset-btn">
              <FontAwesomeIcon icon={faUndo} />
              Reset
            </button>
            <button 
              onClick={handleHint} 
              className="hint-btn"
              disabled={findNextUnrevealedWord(currentWordIndex) === -1}
            >
              <FontAwesomeIcon icon={faLightbulb} />
              Hint
            </button>
          </div>
        )}
        
        <div className="verse-text">
          {chapterWords.slice(0, Math.max(currentWordIndex + 1, getMinimumDisplayWords())).map((wordItem, wordIndex) => (
            <span key={wordIndex}>
              <span 
                className={`test-word ${revealedWords[wordIndex] ? 'revealed' : 'current'} ${
                  wordIndex === currentWordIndex && hasError ? 'error' : ''
                } ${wordsWithErrors[wordIndex] ? 'error' : ''}`}
              >
                {revealedWords[wordIndex] 
                  ? wordItem.text 
                  : (wordItem.isVerseNumber && wordIndex === currentWordIndex && partialVerseInput.length > 0)
                    ? partialVerseInput + '_'.repeat(wordItem.text.length - partialVerseInput.length)
                    : '__'
                }
              </span>
              {wordIndex < Math.max(currentWordIndex, getMinimumDisplayWords() - 1) ? ' ' : ''}
            </span>
          ))}
        </div>
        
        {!isSolved && (
          <div className="instruction-text">
            {isReviewMode 
              ? 'Review mode: Verse numbers are shown - type first letters of words to complete these verses'
              : 'Type verse numbers and first letters of words to reveal the chapter (first verse number is shown)'
            }
          </div>
        )}
        
        {isSolved && (
          <div className="solved-message">
            <h2>Excellent! You completed the entire chapter! ({percentageCorrect}% correct)</h2>
            <div className="revealed-chapter">
              {versesWithErrors.length > 0 ? (
                <>
                  <h3>Verses with errors:</h3>
                  {versesWithErrors.map((verse) => {
                    const originalVerseIndex = currentChapter!.verses.indexOf(verse);
                    return renderVerseWithErrors(verse, originalVerseIndex);
                  })}
                </>
              ) : (
                <h3>Perfect! No errors in any verse!</h3>
              )}
            </div>
            <div className="solved-buttons">
              {!isReviewMode && versesWithErrors.length > 0 ? (
                <>
                  <button onClick={handleReset} className="retry-btn">
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                  </button>
                  <button 
                    onClick={handleReviewErrors} 
                    className={`review-btn ${getPrimaryButtonType() === 'review' ? 'primary-button' : ''}`}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    Review errors
                  </button>
                </>
              ) : isReviewMode ? (
                <>
                  <button 
                    onClick={handleExitReview} 
                    className={`exit-review-btn ${getPrimaryButtonType() === 'exit-review' ? 'primary-button' : ''}`}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to full passage
                  </button>
                  {versesWithErrors.length > 0 && (
                    <button 
                      onClick={handleReset} 
                      className={`retry-btn ${getPrimaryButtonType() === 'retry' ? 'primary-button' : ''}`}
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                      Review errors
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button onClick={handleReset} className="retry-btn">
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                  </button>
                  <button 
                    onClick={handleNextChapter} 
                    className={`next-chapter-btn ${getPrimaryButtonType() === 'next-chapter' ? 'primary-button' : ''}`}
                  >
                    {getNextChapterReference()} <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </>
              )}
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

export default FirstLetterTestGame; 