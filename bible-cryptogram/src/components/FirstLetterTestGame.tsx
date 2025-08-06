import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import WordStats from './WordStats';
import GameHeader from './GameHeader';
import { BIBLE_VERSES, ALL_CONTENT_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import './FirstLetterTestGame.css';
import './Controls.css';

// Import refactored components and utilities
import type { ButtonState } from './FirstLetterTestGameTypes';
import { gameReducer, initialGameState } from './FirstLetterTestGameReducer';
import {
  getCurrentChapter,
  generateWordItems,
  initializeRevealedWords,
  findNextUnrevealedWord,
  findFirstUnrevealedIndex,
  processVerseNumberInput,
  processWordInput,
  calculatePercentageCorrect,
  getVersesWithErrors,
  getNextChapterReference,
  getMinimumDisplayWords
} from './FirstLetterTestGameUtils';
import {
  GameControls,
  WordDisplay,
  InstructionText,
  SolvedMessage
} from './FirstLetterTestGameComponents';

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
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const currentVerse = propCurrentVerse || BIBLE_VERSES[0];
  const onVerseChange = propOnVerseChange || (() => {});

  // Generate new game
  const generateNewGame = useCallback((reviewMode = false) => {
    const versesWithErrors = reviewMode ? 
      getVersesWithErrors(currentVerse, state.chapterWords, state.wordsWithErrors) : [];
    
    const wordItems = generateWordItems(currentVerse, reviewMode, versesWithErrors);
    const revealedWords = initializeRevealedWords(wordItems, reviewMode);
    const wordsWithErrors = new Array(wordItems.length).fill(false);
    
    const firstUnrevealedIndex = findFirstUnrevealedIndex(revealedWords);
    
    dispatch({
      type: 'INITIALIZE_GAME',
      payload: {
        chapterWords: wordItems,
        revealedWords,
        wordsWithErrors,
        currentWordIndex: reviewMode ? firstUnrevealedIndex : 0,
        isReviewMode: reviewMode
      }
    });
  }, [currentVerse, state.chapterWords, state.wordsWithErrors]);

  // Handle word input from individual input fields
  const handleWordInput = useCallback((wordIndex: number, input: string) => {
    if (state.isSolved) return;

    // Set hasStartedTyping flag on first input
    if (!state.hasStartedTyping) {
      dispatch({ type: 'SET_HAS_STARTED_TYPING', payload: true });
    }

    const targetWordItem = state.chapterWords[wordIndex];
    if (!targetWordItem) return;

    let isCorrect = false;
    
    if (targetWordItem.isVerseNumber) {
      const result = processVerseNumberInput(input.slice(-1), input.slice(0, -1), targetWordItem.text);
      
      if (result.isComplete) {
        isCorrect = true;
        dispatch({ type: 'SET_PARTIAL_VERSE_INPUT', payload: '' });
      } else if (result.isCorrect && !result.isComplete) {
        dispatch({ type: 'SET_PARTIAL_VERSE_INPUT', payload: result.newPartialInput });
        return;
      } else {
        dispatch({ type: 'SET_PARTIAL_VERSE_INPUT', payload: '' });
        isCorrect = false;
      }
    } else {
      // For regular words, check if input matches first letter
      isCorrect = input.length > 0 && processWordInput(input.slice(-1), targetWordItem.text);
    }
    
    if (isCorrect) {
      dispatch({ type: 'REVEAL_WORD', payload: { wordIndex } });
      
      // Don't clear errors - let incorrect words stay red even when answered correctly
      
      const nextUnrevealedIndex = findNextUnrevealedWord(state.revealedWords, wordIndex + 1);
      if (nextUnrevealedIndex === -1) {
        dispatch({ type: 'SET_SOLVED', payload: true });
      } else {
        dispatch({ type: 'SET_CURRENT_WORD_INDEX', payload: nextUnrevealedIndex });
      }
    } else {
      // Mark word as having an error (persistent) and show temporary error animation
      dispatch({ type: 'SET_ERROR', payload: { wordIndex, hasError: true } });
      
      // Clear the temporary error animation after 500ms, but keep the word marked as wrong
      setTimeout(() => {
        dispatch({ type: 'CLEAR_ERROR' });
      }, 500);
    }
  }, [state.isSolved, state.revealedWords, state.chapterWords, state.partialVerseInput]);

  // Handle word focus
  const handleWordFocus = useCallback((wordIndex: number) => {
    if (!state.isSolved && !state.revealedWords[wordIndex]) {
      dispatch({ type: 'SET_CURRENT_WORD_INDEX', payload: wordIndex });
    }
  }, [state.isSolved, state.revealedWords]);

  // Handle game actions
  const handleReset = useCallback(() => {
    generateNewGame(state.isReviewMode);
  }, [generateNewGame, state.isReviewMode]);

  const handleHint = useCallback(() => {
    if (state.isSolved) return;
    
    const nextWordIndex = findNextUnrevealedWord(state.revealedWords, state.currentWordIndex);
    if (nextWordIndex === -1) return;
    
    dispatch({ type: 'REVEAL_WORD', payload: { wordIndex: nextWordIndex } });
    dispatch({ type: 'SET_ERROR', payload: { wordIndex: nextWordIndex, hasError: true } });
    
    const nextUnrevealedIndex = findNextUnrevealedWord(state.revealedWords, nextWordIndex + 1);
    if (nextUnrevealedIndex === -1) {
      dispatch({ type: 'SET_SOLVED', payload: true });
    } else {
      dispatch({ type: 'SET_CURRENT_WORD_INDEX', payload: nextUnrevealedIndex });
    }
  }, [state.isSolved, state.revealedWords, state.currentWordIndex]);

  const handleReviewErrors = useCallback(() => {
    dispatch({ 
      type: 'SET_REVIEW_MODE', 
      payload: { 
        isReviewMode: true
      } 
    });
    generateNewGame(true);
  }, [generateNewGame]);

  const handleExitReview = useCallback(() => {
    dispatch({ type: 'SET_REVIEW_MODE', payload: { isReviewMode: false } });
    generateNewGame(false);
  }, [generateNewGame]);

  const handleNextChapter = useCallback(() => {
    const currentChapter = getCurrentChapter(currentVerse);
    if (!currentChapter) return;
    
    const currentChapterIndex = ALL_CONTENT_CHAPTERS.findIndex(chapter => 
      chapter.chapterReference === currentChapter.chapterReference);
    const nextChapterIndex = (currentChapterIndex + 1) % ALL_CONTENT_CHAPTERS.length;
    const nextChapter = ALL_CONTENT_CHAPTERS[nextChapterIndex];
    
    if (nextChapter.verses.length > 0) {
      onVerseChange(nextChapter.verses[0]);
    }
  }, [currentVerse, onVerseChange]);

  // Simplified button state logic
  const getButtonState = useCallback((): ButtonState => {
    if (!state.isSolved) return { action: null, buttonType: null };
    
    const hasErrors = state.wordsWithErrors.some(hasError => hasError);
    
    const buttonStates: Record<string, ButtonState> = {
      'normal-with-errors': { action: handleReviewErrors, buttonType: 'review' },
      'normal-no-errors': { action: handleNextChapter, buttonType: 'next-chapter' },
      'review-with-errors': { action: handleReset, buttonType: 'retry' },
      'review-no-errors': { action: handleExitReview, buttonType: 'exit-review' },
    };
    
    const key = `${state.isReviewMode ? 'review' : 'normal'}-${hasErrors ? 'with-errors' : 'no-errors'}`;
    return buttonStates[key] || { action: null, buttonType: null };
  }, [state.isSolved, state.wordsWithErrors, state.isReviewMode, handleReviewErrors, handleNextChapter, handleReset, handleExitReview]);

  // Handle custom events from word inputs
  useEffect(() => {
    const handleWordInputEvent = (event: CustomEvent) => {
      const { wordIndex, input } = event.detail;
      handleWordInput(wordIndex, input);
    };

    const handleWordFocusEvent = (event: CustomEvent) => {
      const { wordIndex } = event.detail;
      handleWordFocus(wordIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && state.isSolved) {
        event.preventDefault();
        
        const buttonState = getButtonState();
        if (buttonState.action) {
          buttonState.action();
        }
        return;
      }
    };

    window.addEventListener('wordInput', handleWordInputEvent as EventListener);
    window.addEventListener('wordFocus', handleWordFocusEvent as EventListener);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wordInput', handleWordInputEvent as EventListener);
      window.removeEventListener('wordFocus', handleWordFocusEvent as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWordInput, handleWordFocus, state.isSolved, getButtonState]);

  // Initialize game and focus input
  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);





  // Check for game completion
  useEffect(() => {
    if (state.chapterWords.length > 0 && state.revealedWords.length > 0) {
      const allRevealed = state.revealedWords.every(revealed => revealed);
      if (allRevealed && !state.isSolved) {
        dispatch({ type: 'SET_SOLVED', payload: true });
      }
    }
  }, [state.revealedWords, state.chapterWords, state.isSolved]);

  // Apply high score gradient
  useEffect(() => {
    if (state.isSolved) {
      document.body.classList.add('first-letter-test-high-score');
    } else {
      document.body.classList.remove('first-letter-test-high-score');
    }

    return () => {
      document.body.classList.remove('first-letter-test-high-score');
    };
  }, [state.isSolved]);

  // Computed values (optimized with useMemo)
  const currentChapter = useMemo(() => 
    getCurrentChapter(currentVerse), 
    [currentVerse]
  );
  

  
  const versesWithErrors = useMemo(() => 
    getVersesWithErrors(currentVerse, state.chapterWords, state.wordsWithErrors),
    [currentVerse, state.chapterWords, state.wordsWithErrors]
  );
  
  const percentageCorrect = useMemo(() => 
    calculatePercentageCorrect(state.chapterWords, state.wordsWithErrors),
    [state.chapterWords, state.wordsWithErrors]
  );
  
  const buttonState = useMemo(() => 
    getButtonState(),
    [state.isSolved, state.wordsWithErrors, state.isReviewMode]
  );
  
  // These change frequently and need to recalculate often
  const displayCount = Math.max(state.currentWordIndex + 1, getMinimumDisplayWords(state.currentWordIndex));
  const isHintDisabled = findNextUnrevealedWord(state.revealedWords, state.currentWordIndex) === -1;

  return (
    <>
      <GameHeader 
        wordStatsEnabled={state.wordStatsEnabled}
        onToggleWordStats={() => dispatch({ type: 'TOGGLE_WORD_STATS' })}
        currentVerse={currentVerse}
        onVerseChange={onVerseChange}
        gameType={gameType}
        onGameTypeChange={onGameTypeChange}
      />

      <div className="first-letter-test-container">
        
        {state.wordStatsEnabled && <WordStats />}
        
        {!state.isSolved && (
          <div className="first-letter-test-sticky-controls">
            <GameControls
              onReset={handleReset}
              onHint={handleHint}
              isHintDisabled={isHintDisabled}
            />
          </div>
        )}
        
        <WordDisplay
          chapterWords={state.chapterWords}
          revealedWords={state.revealedWords}
          wordsWithErrors={state.wordsWithErrors}
          currentWordIndex={state.currentWordIndex}
          hasError={state.hasError}
          partialVerseInput={state.partialVerseInput}
          displayCount={displayCount}
        />
        
        {!state.isSolved && !state.hasStartedTyping && (
          <InstructionText isReviewMode={state.isReviewMode} />
        )}
        
        {state.isSolved && (
          <SolvedMessage
            percentageCorrect={percentageCorrect}
            versesWithErrors={versesWithErrors}
            chapterWords={state.chapterWords}
            wordsWithErrors={state.wordsWithErrors}
            isReviewMode={state.isReviewMode}
            primaryButtonType={buttonState.buttonType}
            onReset={handleReset}
            onReviewErrors={handleReviewErrors}
            onExitReview={handleExitReview}
            onNextChapter={handleNextChapter}
            nextChapterReference={getNextChapterReference(currentVerse)}
            currentChapter={currentChapter}
          />
        )}
        
        <div className="first-letter-test-citation">
          Scripture quotations taken from the Holy Bible, New International Version®, NIV®.<br />
          Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™<br />
          Used by permission. All rights reserved worldwide.
        </div>
      </div>
    </>
  );
};

export default FirstLetterTestGame; 