import React, { useState, useEffect } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, BIBLE_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRotateLeft, faLightbulb, faUndo } from '@fortawesome/free-solid-svg-icons';
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

  const generateNewGame = () => {
    const currentChapter = getCurrentChapter();
    if (!currentChapter) return;

    const wordItems: WordItem[] = [];
    let wordIndex = 0;

    // Process each verse in the chapter
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

    setChapterWords(wordItems);
    setRevealedWords(new Array(wordItems.length).fill(false));
    setWordsWithErrors(new Array(wordItems.length).fill(false));
    setIsSolved(false);
    setCurrentWordIndex(0);
    setHasError(false);
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

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSolved) return;

      const key = event.key;
      
      // Handle numbers and letters
      if (/^[A-Z0-9]$/i.test(key)) {
        event.preventDefault();
        
        const nextWordIndex = findNextUnrevealedWord(currentWordIndex);
        if (nextWordIndex === -1) return; // All words revealed

        const targetWordItem = chapterWords[nextWordIndex];
        const inputKey = key.toUpperCase();
        
        let isCorrect = false;
        
        if (targetWordItem.isVerseNumber) {
          // For verse numbers, check if the key matches the full number
          isCorrect = key === targetWordItem.text;
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterWords, revealedWords, wordsWithErrors, currentWordIndex, isSolved, hasError]);

  const handleReset = () => {
    generateNewGame();
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
    
    return currentChapter.verses.filter((verse, index) => verseHasError[index]);
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

  // Get current chapter info for display
  const currentChapter = getCurrentChapter();
  const chapterTitle = currentChapter ? currentChapter.chapterTitle : '';
  const versesWithErrors = getVersesWithErrors();

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

      <div className="first-letter-test-container">
        {wordStatsEnabled && <WordStats />}
        
        <div className="chapter-title">
          {chapterTitle}
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
          {chapterWords.slice(0, currentWordIndex + 1).map((wordItem, wordIndex) => (
            <span key={wordIndex}>
              <span 
                className={`test-word ${revealedWords[wordIndex] ? 'revealed' : 'current'} ${
                  wordIndex === currentWordIndex && hasError ? 'error' : ''
                } ${wordsWithErrors[wordIndex] ? 'error' : ''}`}
              >
                {revealedWords[wordIndex] 
                  ? wordItem.text 
                  : '__'
                }
              </span>
              {wordIndex < currentWordIndex ? ' ' : ''}
            </span>
          ))}
        </div>
        
        {!isSolved && (
          <div className="instruction-text">
            Type verse numbers and first letters of words to reveal the chapter
          </div>
        )}
        
        {isSolved && (
          <div className="solved-message">
            <h2>Excellent! You completed the entire chapter!</h2>
            <div className="revealed-chapter">
              {versesWithErrors.length > 0 ? (
                <>
                  <h3>Verses that needed corrections:</h3>
                  {versesWithErrors.map((verse, index) => {
                    const originalVerseIndex = currentChapter!.verses.indexOf(verse);
                    return renderVerseWithErrors(verse, originalVerseIndex);
                  })}
                </>
              ) : (
                <h3>Perfect! No errors in any verse!</h3>
              )}
            </div>
            <div className="solved-buttons">
              <button onClick={handleReset} className="retry-btn">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
              <button onClick={handleNextChapter} className="next-chapter-btn">
                {getNextChapterReference()} <FontAwesomeIcon icon={faArrowRight} />
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

export default FirstLetterTestGame; 