import type { GameState, GameAction } from './FirstLetterTestGameTypes';

export const initialGameState: GameState = {
  chapterWords: [],
  revealedWords: [],
  wordsWithErrors: [],
  originalWordsWithErrors: [],
  currentWordIndex: 0,
  partialVerseInput: '',
  isSolved: false,
  hasError: false,
  isReviewMode: false,
  wordStatsEnabled: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...state,
        chapterWords: action.payload.chapterWords,
        revealedWords: action.payload.revealedWords,
        wordsWithErrors: action.payload.wordsWithErrors,
        currentWordIndex: action.payload.currentWordIndex,
        isReviewMode: action.payload.isReviewMode,
        isSolved: false,
        hasError: false,
        partialVerseInput: '',
      };

    case 'REVEAL_WORD':
      const newRevealedWords = [...state.revealedWords];
      newRevealedWords[action.payload.wordIndex] = true;
      return {
        ...state,
        revealedWords: newRevealedWords,
        hasError: false,
      };

    case 'SET_ERROR':
      const newWordsWithErrors = [...state.wordsWithErrors];
      newWordsWithErrors[action.payload.wordIndex] = true;
      return {
        ...state,
        wordsWithErrors: newWordsWithErrors,
        hasError: action.payload.hasError,
      };

    case 'SET_CURRENT_WORD_INDEX':
      return {
        ...state,
        currentWordIndex: action.payload,
      };

    case 'SET_PARTIAL_VERSE_INPUT':
      return {
        ...state,
        partialVerseInput: action.payload,
      };

    case 'SET_SOLVED':
      return {
        ...state,
        isSolved: action.payload,
      };

    case 'TOGGLE_WORD_STATS':
      return {
        ...state,
        wordStatsEnabled: !state.wordStatsEnabled,
      };

    case 'SET_REVIEW_MODE':
      return {
        ...state,
        isReviewMode: action.payload.isReviewMode,
        originalWordsWithErrors: action.payload.originalWordsWithErrors || state.originalWordsWithErrors,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        hasError: false,
      };

    default:
      return state;
  }
} 