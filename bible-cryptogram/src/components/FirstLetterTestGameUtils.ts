import type { WordItem } from './FirstLetterTestGameTypes';
import { ALL_CONTENT_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';

export const extractVerseNumber = (reference: string): string => {
  const parts = reference.split(':');
  return parts.length > 1 ? parts[1] : '1';
};

export const getCurrentChapter = (currentVerse: BibleVerse) => {
  const chapterRef = currentVerse.reference.includes(':') 
    ? currentVerse.reference.split(':')[0]  // "1 Cor 11:1" -> "1 Cor 11"
    : currentVerse.reference;
  
  return ALL_CONTENT_CHAPTERS.find(chapter => chapter.chapterReference === chapterRef);
};

export const generateWordItems = (
  currentVerse: BibleVerse, 
  reviewMode: boolean, 
  versesWithErrors: BibleVerse[]
): WordItem[] => {
  const currentChapter = getCurrentChapter(currentVerse);
  if (!currentChapter) return [];

  const wordItems: WordItem[] = [];
  let wordIndex = 0;

  const versesToProcess = reviewMode ? versesWithErrors : currentChapter.verses;

  versesToProcess.forEach((verse) => {
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

  return wordItems;
};

export const initializeRevealedWords = (
  wordItems: WordItem[], 
  reviewMode: boolean
): boolean[] => {
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
  
  return initialRevealedWords;
};

export const findNextUnrevealedWord = (
  revealedWords: boolean[], 
  startIndex: number = 0
): number => {
  for (let i = startIndex; i < revealedWords.length; i++) {
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

export const findFirstUnrevealedIndex = (revealedWords: boolean[]): number => {
  let firstUnrevealedIndex = 0;
  for (let i = 0; i < revealedWords.length; i++) {
    if (!revealedWords[i]) {
      firstUnrevealedIndex = i;
      break;
    }
  }
  return firstUnrevealedIndex;
};

export const processVerseNumberInput = (
  key: string,
  partialInput: string,
  targetText: string
): { isCorrect: boolean; newPartialInput: string; isComplete: boolean } => {
  if (!/^[0-9]$/.test(key)) {
    return { isCorrect: false, newPartialInput: '', isComplete: false };
  }

  const newPartialInput = partialInput + key;
  
  // Check if the new partial input matches the beginning of the target verse number
  if (targetText.startsWith(newPartialInput)) {
    // Check if we've completed the verse number
    if (newPartialInput === targetText) {
      return { isCorrect: true, newPartialInput: '', isComplete: true };
    } else {
      // Partial match - don't advance yet, but don't show error
      return { isCorrect: true, newPartialInput, isComplete: false };
    }
  } else {
    // Wrong digit - reset partial input and show error
    return { isCorrect: false, newPartialInput: '', isComplete: false };
  }
};

export const processWordInput = (key: string, targetText: string): boolean => {
  const inputKey = key.toUpperCase();
  return inputKey === targetText[0];
};

export const calculatePercentageCorrect = (
  chapterWords: WordItem[], 
  wordsWithErrors: boolean[]
): number => {
  if (chapterWords.length === 0) return 100;
  
  const totalWords = chapterWords.length;
  const errorWords = wordsWithErrors.filter(hasError => hasError).length;
  const correctWords = totalWords - errorWords;
  const percentage = (correctWords / totalWords) * 100;
  
  return Math.round(percentage);
};

export const getVersesWithErrors = (
  currentVerse: BibleVerse,
  chapterWords: WordItem[],
  wordsWithErrors: boolean[]
): BibleVerse[] => {
  const currentChapter = getCurrentChapter(currentVerse);
  if (!currentChapter) return [];
  
  const verseHasError = new Array(currentChapter.verses.length).fill(false);
  
  chapterWords.forEach((wordItem, wordIndex) => {
    if (wordsWithErrors[wordIndex]) {
      verseHasError[wordItem.verseIndex] = true;
    }
  });
  
  return currentChapter.verses.filter((_, index) => verseHasError[index]);
};

export const getNextChapterReference = (currentVerse: BibleVerse): string => {
  const currentChapter = getCurrentChapter(currentVerse);
  if (!currentChapter) return '';
  
  const currentChapterIndex = ALL_CONTENT_CHAPTERS.findIndex(chapter => 
    chapter.chapterReference === currentChapter.chapterReference);
  const nextChapterIndex = (currentChapterIndex + 1) % ALL_CONTENT_CHAPTERS.length;
  return ALL_CONTENT_CHAPTERS[nextChapterIndex].chapterReference;
};

export const getMinimumDisplayWords = (currentWordIndex: number): number => {
  // Always show at least 2 words to ensure first verse number and current position are visible
  return Math.max(2, currentWordIndex + 1);
}; 