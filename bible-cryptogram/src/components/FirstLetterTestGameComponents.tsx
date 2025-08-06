import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faArrowRotateLeft, 
  faLightbulb, 
  faUndo, 
  faMagnifyingGlass, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import type { WordItem, ButtonAction } from './FirstLetterTestGameTypes';
import type { BibleVerse } from '../data/bibleVerses';

interface GameControlsProps {
  onReset: () => void;
  onHint: () => void;
  isHintDisabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = React.memo(({ 
  onReset, 
  onHint, 
  isHintDisabled 
}) => (
  <div className="controls-container">
    <button onClick={onReset}>
      <FontAwesomeIcon icon={faUndo} />
      Reset
    </button>
    <button 
      onClick={isHintDisabled ? undefined : onHint} 
      className={isHintDisabled ? 'disabled' : ''}
    >
      <FontAwesomeIcon icon={faLightbulb} />
      Hint
    </button>
  </div>
));

interface WordDisplayProps {
  chapterWords: WordItem[];
  revealedWords: boolean[];
  wordsWithErrors: boolean[];
  currentWordIndex: number;
  hasError: boolean;
  partialVerseInput: string;
  displayCount: number;
}

// Custom comparison function for WordDisplay to prevent unnecessary re-renders
const areWordDisplayPropsEqual = (prevProps: WordDisplayProps, nextProps: WordDisplayProps) => {
  // Check if displayCount changed
  if (prevProps.displayCount !== nextProps.displayCount) return false;
  
  // Check if current word index changed
  if (prevProps.currentWordIndex !== nextProps.currentWordIndex) return false;
  
  // Check if error state changed
  if (prevProps.hasError !== nextProps.hasError) return false;
  
  // Check if partial verse input changed
  if (prevProps.partialVerseInput !== nextProps.partialVerseInput) return false;
  
  // Check if the visible portion of arrays changed
  const visibleCount = Math.min(prevProps.displayCount, nextProps.displayCount);
  
  for (let i = 0; i < visibleCount; i++) {
    if (prevProps.revealedWords[i] !== nextProps.revealedWords[i]) return false;
    if (prevProps.wordsWithErrors[i] !== nextProps.wordsWithErrors[i]) return false;
    if (prevProps.chapterWords[i]?.text !== nextProps.chapterWords[i]?.text) return false;
    if (prevProps.chapterWords[i]?.isVerseNumber !== nextProps.chapterWords[i]?.isVerseNumber) return false;
  }
  
  return true;
};

interface WordInputProps {
  wordItem: WordItem;
  wordIndex: number;
  isRevealed: boolean;
  isError: boolean;
  isCurrent: boolean;
  partialInput: string;
  onInput: (wordIndex: number, input: string) => void;
  onFocus: (wordIndex: number) => void;
}

const WordInput: React.FC<WordInputProps> = React.memo(({
  wordItem,
  wordIndex,
  isRevealed,
  isError,
  isCurrent,
  partialInput,
  onInput,
  onFocus
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus current word
  React.useEffect(() => {
    if (isCurrent && inputRef.current && !isRevealed) {
      inputRef.current.focus();
    }
  }, [isCurrent, isRevealed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onInput(wordIndex, value);
  };

  const handleFocus = () => {
    onFocus(wordIndex);
  };

  const getDisplayValue = () => {
    if (isRevealed) return wordItem.text;
    if (wordItem.isVerseNumber && isCurrent && partialInput.length > 0) {
      return partialInput;
    }
    return '';
  };

  const getPlaceholder = () => {
    if (isRevealed) return '';
    return '_'.repeat(wordItem.text.length);
  };

  if (isRevealed) {
    return (
      <span className="first-letter-test-word revealed">
        {wordItem.text}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className={`first-letter-test-word-input ${isCurrent ? 'current' : ''} ${isError ? 'error' : ''}`}
      value={getDisplayValue()}
      placeholder={getPlaceholder()}
      onChange={handleInputChange}
      onFocus={handleFocus}
      maxLength={wordItem.text.length}
      size={Math.max(wordItem.text.length, 2)}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
});

export const WordDisplay: React.FC<WordDisplayProps> = React.memo(({
  chapterWords,
  revealedWords,
  wordsWithErrors,
  currentWordIndex,
  hasError,
  partialVerseInput,
  displayCount
}) => {
  const handleWordInput = React.useCallback((wordIndex: number, input: string) => {
    // This will be passed down from parent component
    window.dispatchEvent(new CustomEvent('wordInput', { 
      detail: { wordIndex, input } 
    }));
  }, []);

  const handleWordFocus = React.useCallback((wordIndex: number) => {
    // This will be passed down from parent component
    window.dispatchEvent(new CustomEvent('wordFocus', { 
      detail: { wordIndex } 
    }));
  }, []);

  return (
    <div className="first-letter-test-verse-text">
      {chapterWords.slice(0, displayCount).map((wordItem, wordIndex) => (
        <span key={wordIndex}>
          <WordInput
            wordItem={wordItem}
            wordIndex={wordIndex}
            isRevealed={revealedWords[wordIndex]}
            isError={wordsWithErrors[wordIndex] || (wordIndex === currentWordIndex && hasError)}
            isCurrent={wordIndex === currentWordIndex}
            partialInput={wordItem.isVerseNumber && wordIndex === currentWordIndex ? partialVerseInput : ''}
            onInput={handleWordInput}
            onFocus={handleWordFocus}
          />
          {wordIndex < displayCount - 1 && <span> </span>}
        </span>
      ))}
    </div>
  );
}, areWordDisplayPropsEqual);

interface InstructionTextProps {
  isReviewMode: boolean;
}

export const InstructionText: React.FC<InstructionTextProps> = React.memo(({ isReviewMode }) => (
  <div className="first-letter-test-instruction-text">
    {isReviewMode 
      ? 'Review mode: Verse numbers are shown - type first letters of words to complete these verses'
      : 'Type verse numbers and first letters of words to reveal the chapter (first verse number is shown)'
    }
  </div>
));

interface VerseWithErrorsProps {
  verse: BibleVerse;
  verseIndex: number;
  chapterWords: WordItem[];
  wordsWithErrors: boolean[];
}

export const VerseWithErrors: React.FC<VerseWithErrorsProps> = React.memo(({
  verse,
  verseIndex,
  chapterWords,
  wordsWithErrors
}) => {
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
      <span key={`verse-num-${verseIndex}`} className={hasError ? 'first-letter-test-error-word' : ''}>
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
          <span key={`word-${verseIndex}-${originalWordIndex}`} className={hasError ? 'first-letter-test-error-word' : ''}>
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
    <div key={verseIndex} className="first-letter-test-verse-line">
      {renderedElements}
    </div>
  );
});

interface SolvedMessageButtonsProps {
  isReviewMode: boolean;
  hasErrors: boolean;
  primaryButtonType: ButtonAction | null;
  onReset: () => void;
  onReviewErrors: () => void;
  onExitReview: () => void;
  onNextChapter: () => void;
  nextChapterReference: string;
}

export const SolvedMessageButtons: React.FC<SolvedMessageButtonsProps> = React.memo(({
  isReviewMode,
  hasErrors,
  primaryButtonType,
  onReset,
  onReviewErrors,
  onExitReview,
  onNextChapter,
  nextChapterReference
}) => {
  if (!isReviewMode && hasErrors) {
    return (
      <>
        <button onClick={onReset} className="retry-btn solved-button-base">
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </button>
        <button 
          onClick={onReviewErrors} 
          className={`review-btn solved-button-base ${primaryButtonType === 'review' ? 'primary-button' : ''}`}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          Review errors
        </button>
      </>
    );
  }

  if (isReviewMode) {
    return (
      <>
        <button 
          onClick={onExitReview} 
          className={`exit-review-btn solved-button-base ${primaryButtonType === 'exit-review' ? 'primary-button' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to full passage
        </button>
        {hasErrors && (
          <button 
            onClick={onReset} 
            className={`retry-btn solved-button-base ${primaryButtonType === 'retry' ? 'primary-button' : ''}`}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Review errors
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <button onClick={onReset} className="retry-btn solved-button-base">
        <FontAwesomeIcon icon={faArrowRotateLeft} />
      </button>
      <button 
        onClick={onNextChapter} 
        className={`next-chapter-btn solved-button-base ${primaryButtonType === 'next-chapter' ? 'primary-button' : ''}`}
      >
        {nextChapterReference} <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </>
  );
});

interface SolvedMessageProps {
  percentageCorrect: number;
  versesWithErrors: BibleVerse[];
  chapterWords: WordItem[];
  wordsWithErrors: boolean[];
  isReviewMode: boolean;
  primaryButtonType: ButtonAction | null;
  onReset: () => void;
  onReviewErrors: () => void;
  onExitReview: () => void;
  onNextChapter: () => void;
  nextChapterReference: string;
  currentChapter: any;
}

export const SolvedMessage: React.FC<SolvedMessageProps> = React.memo(({
  percentageCorrect,
  versesWithErrors,
  chapterWords,
  wordsWithErrors,
  isReviewMode,
  primaryButtonType,
  onReset,
  onReviewErrors,
  onExitReview,
  onNextChapter,
  nextChapterReference,
  currentChapter
}) => (
  <div className="first-letter-test-solved-message">
    <h2>Excellent! You completed the entire chapter! ({percentageCorrect}% correct)</h2>
    <div className="first-letter-test-revealed-chapter">
      {versesWithErrors.length > 0 ? (
        <>
          <h3>Verses with errors:</h3>
          {versesWithErrors.map((verse) => {
            const originalVerseIndex = currentChapter!.verses.indexOf(verse);
            return (
              <VerseWithErrors
                key={originalVerseIndex}
                verse={verse}
                verseIndex={originalVerseIndex}
                chapterWords={chapterWords}
                wordsWithErrors={wordsWithErrors}
              />
            );
          })}
        </>
      ) : (
        <h3>Perfect! No errors in any verse!</h3>
      )}
    </div>
    <div className="first-letter-test-solved-buttons">
      <SolvedMessageButtons
        isReviewMode={isReviewMode}
        hasErrors={versesWithErrors.length > 0}
        primaryButtonType={primaryButtonType}
        onReset={onReset}
        onReviewErrors={onReviewErrors}
        onExitReview={onExitReview}
        onNextChapter={onNextChapter}
        nextChapterReference={nextChapterReference}
      />
    </div>
  </div>
)); 