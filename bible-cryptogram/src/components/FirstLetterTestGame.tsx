import React, { useState, useEffect } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, BIBLE_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import './FirstLetterTestGame.css';

interface FirstLetterTestGameProps {
  gameType?: import('./GameHeader').GameType;
  onGameTypeChange?: (gameType: import('./GameHeader').GameType) => void;
  currentVerse?: BibleVerse;
  onVerseChange?: (verse: BibleVerse) => void;
}

const FirstLetterTestGame: React.FC<FirstLetterTestGameProps> = ({ 
  gameType = 'first-letter-test', 
  onGameTypeChange, 
  currentVerse: propCurrentVerse, 
  onVerseChange: propOnVerseChange 
}) => {
  const [chapterWords, setChapterWords] = useState<string[]>([]);
  const [revealedWords, setRevealedWords] = useState<boolean[]>([]);
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

  const generateNewGame = () => {
    const currentChapter = getCurrentChapter();
    if (!currentChapter) return;

    // Combine all verses in the chapter into one text block
    const chapterText = currentChapter.verses.map(v => v.text).join(' ');
    
    // Parse into words, handling punctuation
    const words = chapterText.split(' ').map(word => {
      return word.replace(/[^A-Z]/g, ''); // Remove punctuation
    }).filter(word => word.length > 0);

    setChapterWords(words);
    setRevealedWords(new Array(words.length).fill(false));
    setIsSolved(false);
    setCurrentWordIndex(0);
    setHasError(false);
  };

  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

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

      const key = event.key.toUpperCase();
      
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        
        const nextWordIndex = findNextUnrevealedWord(currentWordIndex);
        if (nextWordIndex === -1) return; // All words revealed

        const targetWord = chapterWords[nextWordIndex];
        
        if (key === targetWord[0]) {
          // Correct first letter - clear error and reveal the word
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
          // Wrong letter - show error
          setHasError(true);
          
          // Clear error after animation duration
          setTimeout(() => {
            setHasError(false);
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterWords, revealedWords, currentWordIndex, isSolved, hasError]);

  const handleReset = () => {
    generateNewGame();
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

  // Get current chapter info for display
  const currentChapter = getCurrentChapter();
  const chapterTitle = currentChapter ? currentChapter.chapterTitle : '';

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
        
        <div className="first-letter-test-verse-container">
          {chapterWords.slice(0, currentWordIndex + 1).map((word, wordIndex) => (
            <span 
              key={wordIndex} 
              className={`test-word ${revealedWords[wordIndex] ? 'revealed' : 'current'} ${
                wordIndex === currentWordIndex && hasError ? 'error' : ''
              }`}
            >
              {revealedWords[wordIndex] ? word : '__'}
              {wordIndex < currentWordIndex ? ' ' : ''}
            </span>
          ))}
        </div>
        
        {!isSolved && (
          <div className="instruction-text">
            Type the first letter of each word to reveal it
          </div>
        )}
        
        {isSolved && (
          <div className="solved-message">
            <h2>Excellent! You completed the entire chapter!</h2>
            <div className="revealed-chapter">
              {currentChapter?.verses.map((verse, index) => (
                <div key={index} className="verse-line">
                  {verse.text}
                  <span className="verse-reference"> — {verse.reference}</span>
                </div>
              ))}
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