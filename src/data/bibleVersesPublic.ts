export interface BibleVerse {
  text: string;
  reference: string;
}

export interface ChapterGroup {
  chapterTitle: string;
  chapterReference: string; // e.g., "1 Cor 10"
  verses: BibleVerse[];
}

// Interface for historical speeches and documents
export interface HistoricalText {
  text: string;
  reference: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  {
    text: "THE LORD IS MY SHEPHERD, I LACK NOTHING.",
    reference: "Ps 23:1"
  },
  {
    text: "HE MAKES ME LIE DOWN IN GREEN PASTURES, HE LEADS ME BESIDE QUIET WATERS,",
    reference: "Ps 23:2"
  },
  {
    text: "HE REFRESHES MY SOUL. HE GUIDES ME ALONG THE RIGHT PATHS FOR HIS NAME'S SAKE.",
    reference: "Ps 23:3"
  },
  {
    text: "EVEN THOUGH I WALK THROUGH THE DARKEST VALLEY, I WILL FEAR NO EVIL, FOR YOU ARE WITH ME; YOUR ROD AND YOUR STAFF, THEY COMFORT ME.",
    reference: "Ps 23:4"
  },
  {
    text: "YOU PREPARE A TABLE BEFORE ME IN THE PRESENCE OF MY ENEMIES. YOU ANOINT MY HEAD WITH OIL; MY CUP OVERFLOWS.",
    reference: "Ps 23:5"
  },
  {
    text: "SURELY YOUR GOODNESS AND LOVE WILL FOLLOW ME ALL THE DAYS OF MY LIFE, AND I WILL DWELL IN THE HOUSE OF THE LORD FOREVER.",
    reference: "Ps 23:6"
  }
];

// Historical speeches and documents
export const HISTORICAL_TEXTS: HistoricalText[] = [];

/**
 * Generic function to extract chapter/collection name from any verse reference.
 * This function uses pattern matching to work with any future chapters you add.
 * 
 * Patterns supported:
 * - Bible format: "Book Chapter:Verse" -> "Book Chapter" (e.g., "1 Cor 11:1" -> "1 Cor 11")
 * - Numbered collections: "Collection Name Number" -> "Collection Name" (e.g., "Prayer Name 1" -> "Prayer Name")
 * - Single references: Uses the full reference as the chapter
 */
export const getChapterFromReference = (reference: string): string => {
  // Pattern 1: Bible verses with colon format (e.g., "1 Cor 11:1" -> "1 Cor 11")
  const bibleChapterMatch = reference.match(/^(.*?\d+):/);
  if (bibleChapterMatch) {
    return bibleChapterMatch[1];
  }
  
  // Pattern 2: Numbered collections (e.g., "Prayer Name 1" -> "Prayer Name")
  // This matches any reference that ends with a space followed by a number
  const numberedCollectionMatch = reference.match(/^(.+)\s+\d+[a-z]?$/);
  if (numberedCollectionMatch) {
    return numberedCollectionMatch[1];
  }
  
  // Pattern 3: Single references or unknown formats - use the full reference
  return reference;
};

// Helper function to organize verses by chapter
export const organizeVersesByChapter = (): ChapterGroup[] => {
  const chapters = new Map<string, BibleVerse[]>();
  
  BIBLE_VERSES.forEach(verse => {
    const chapterRef = getChapterFromReference(verse.reference);
    
    if (!chapters.has(chapterRef)) {
      chapters.set(chapterRef, []);
    }
    chapters.get(chapterRef)!.push(verse);
  });
  
  // Convert map to array in original order
  return Array.from(chapters.entries())
    .map(([chapterRef, verses]) => ({
      chapterTitle: chapterRef,
      chapterReference: chapterRef,
      verses: verses // Keep verses in original order
    }));
};

// Helper function to organize historical texts by collection
export const organizeHistoricalTexts = (): ChapterGroup[] => {
  const collections = new Map<string, BibleVerse[]>();
  
  HISTORICAL_TEXTS.forEach(text => {
    const collectionRef = getChapterFromReference(text.reference);
    
    if (!collections.has(collectionRef)) {
      collections.set(collectionRef, []);
    }
    // Convert HistoricalText to BibleVerse format for consistency
    collections.get(collectionRef)!.push({
      text: text.text,
      reference: text.reference
    });
  });
  
  // Convert map to array in original order
  return Array.from(collections.entries())
    .map(([collectionRef, texts]) => ({
      chapterTitle: collectionRef,
      chapterReference: collectionRef,
      verses: texts // Keep texts in original order
    }));
};

// Helper function to organize all content (Bible verses + Historical texts)
export const organizeAllContent = (): ChapterGroup[] => {
  const bibleChapters = organizeVersesByChapter();
  const historicalCollections = organizeHistoricalTexts();
  
  // Combine both arrays
  return [...bibleChapters, ...historicalCollections];
};

// Export organized chapters (Bible only)
export const BIBLE_CHAPTERS = organizeVersesByChapter();

// Export all content organized (Bible + Historical)
export const ALL_CONTENT_CHAPTERS = organizeAllContent();


