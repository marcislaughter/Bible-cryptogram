import type { BibleVerse } from '../data/bibleVerses';

export interface WordItem {
  text: string;
  isVerseNumber: boolean;
  originalIndex: number;
  verseIndex: number;
}

export interface GameState {
  chapterWords: WordItem[];
  revealedWords: boolean[];
  wordsWithErrors: boolean[];
  currentWordIndex: number;
  partialVerseInput: string;
  isSolved: boolean;
  hasError: boolean;
  isReviewMode: boolean;
  wordStatsEnabled: boolean;
}

export type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: { 
      chapterWords: WordItem[]; 
      revealedWords: boolean[]; 
      wordsWithErrors: boolean[];
      currentWordIndex: number;
      isReviewMode: boolean;
    }}
  | { type: 'REVEAL_WORD'; payload: { wordIndex: number }}
  | { type: 'SET_ERROR'; payload: { wordIndex: number; hasError: boolean }}
  | { type: 'SET_CURRENT_WORD_INDEX'; payload: number }
  | { type: 'SET_PARTIAL_VERSE_INPUT'; payload: string }
  | { type: 'SET_SOLVED'; payload: boolean }
  | { type: 'TOGGLE_WORD_STATS' }
  | { type: 'SET_REVIEW_MODE'; payload: { 
      isReviewMode: boolean; 
    }}
  | { type: 'CLEAR_ERROR' };

export type ButtonAction = 'review' | 'next-chapter' | 'retry' | 'exit-review';

export interface ButtonState {
  action: (() => void) | null;
  buttonType: ButtonAction | null;
} 