import React, { useReducer, useEffect, useRef, useMemo } from 'react';
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
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

  // Utility function to refocus the hidden input for mobile
  const refocusInput = () => {
    setTimeout(() => {
      if (hiddenInputRef.current && !state.isSolved) {
        hiddenInputRef.current.focus();
      }
    }, 100);
  };

  // Generate new game
  const generateNewGame = (reviewMode = false) => {
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
  };

  // Handle character input
  const handleCharacterInput = (key: string) => {
    if (state.isSolved) return;

    if (/^[A-Z0-9]$/i.test(key)) {
      const nextWordIndex = findNextUnrevealedWord(state.revealedWords, state.currentWordIndex);
      if (nextWordIndex === -1) return;

      const targetWordItem = state.chapterWords[nextWordIndex];
      let isCorrect = false;
      
      if (targetWordItem.isVerseNumber) {
        const result = processVerseNumberInput(key, state.partialVerseInput, targetWordItem.text);
        
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
        isCorrect = processWordInput(key, targetWordItem.text);
      }
      
      if (isCorrect) {
        dispatch({ type: 'REVEAL_WORD', payload: { wordIndex: nextWordIndex } });
        
        const nextUnrevealedIndex = findNextUnrevealedWord(state.revealedWords, nextWordIndex + 1);
        if (nextUnrevealedIndex === -1) {
          dispatch({ type: 'SET_SOLVED', payload: true });
        } else {
          dispatch({ type: 'SET_CURRENT_WORD_INDEX', payload: nextUnrevealedIndex });
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: { wordIndex: nextWordIndex, hasError: true } });
        
        setTimeout(() => {
          dispatch({ type: 'CLEAR_ERROR' });
        }, 500);
      }
    }
  };

  // Handle input events for mobile
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      handleCharacterInput(lastChar);
      event.target.value = '';
    }
  };

  // Handle game actions
  const handleReset = () => {
    generateNewGame(state.isReviewMode);
    refocusInput();
  };

  const handleHint = () => {
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
    
    refocusInput();
  };

  const handleReviewErrors = () => {
    dispatch({ 
      type: 'SET_REVIEW_MODE', 
      payload: { 
        isReviewMode: true
      } 
    });
    generateNewGame(true);
    refocusInput();
  };

  const handleExitReview = () => {
    dispatch({ type: 'SET_REVIEW_MODE', payload: { isReviewMode: false } });
    generateNewGame(false);
    refocusInput();
  };

  const handleNextChapter = () => {
    const currentChapter = getCurrentChapter(currentVerse);
    if (!currentChapter) return;
    
    const currentChapterIndex = ALL_CONTENT_CHAPTERS.findIndex(chapter => 
      chapter.chapterReference === currentChapter.chapterReference);
    const nextChapterIndex = (currentChapterIndex + 1) % ALL_CONTENT_CHAPTERS.length;
    const nextChapter = ALL_CONTENT_CHAPTERS[nextChapterIndex];
    
    if (nextChapter.verses.length > 0) {
      onVerseChange(nextChapter.verses[0]);
      refocusInput();
    }
  };

  const handleGameAreaClick = () => {
    if (hiddenInputRef.current && !state.isSolved) {
      hiddenInputRef.current.focus();
    }
  };

  // Simplified button state logic
  const getButtonState = (): ButtonState => {
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
  };

  // Handle keyboard input for desktop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target === hiddenInputRef.current && !state.isSolved) return;
      
      if (event.key === 'Enter' && state.isSolved) {
        event.preventDefault();
        
        const buttonState = getButtonState();
        if (buttonState.action) {
          buttonState.action();
        }
        return;
      }
      
      if (!state.isSolved) {
        event.preventDefault();
        handleCharacterInput(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  // Initialize game and focus input
  useEffect(() => {
    generateNewGame();
  }, [currentVerse]);

  useEffect(() => {
    if (hiddenInputRef.current && !state.isSolved) {
      hiddenInputRef.current.focus();
    }
  }, [state.isSolved, currentVerse]);

  // Check for game completion
  useEffect(() => {
    if (state.chapterWords.length > 0 && state.revealedWords.length > 0) {
      const allRevealed = state.revealedWords.every(revealed => revealed);
      if (allRevealed && !state.isSolved) {
        dispatch({ type: 'SET_SOLVED', payload: true });
        if (hiddenInputRef.current) {
          hiddenInputRef.current.blur();
        }
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
  
  const chapterTitle = useMemo(() => 
    currentChapter ? currentChapter.chapterTitle : '', 
    [currentChapter]
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
        
        {state.wordStatsEnabled && <WordStats />}
        
        <div className="first-letter-test-chapter-title">
          {chapterTitle} {state.isReviewMode && '(Review Mode - Verses with Errors)'}
        </div>
        
        {!state.isSolved && (
          <GameControls
            onReset={handleReset}
            onHint={handleHint}
            isHintDisabled={isHintDisabled}
          />
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
        
        {!state.isSolved && (
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