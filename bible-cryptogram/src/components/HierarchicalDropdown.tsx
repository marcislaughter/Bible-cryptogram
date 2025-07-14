import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type { ReactNode } from 'react';
import type { ChapterGroup, BibleVerse } from '../data/bibleVerses';

interface HierarchicalDropdownProps {
  trigger: ReactNode;
  chapters: ChapterGroup[];
  currentVerse: BibleVerse;
  onVerseChange: (verse: BibleVerse) => void;
  align?: 'left' | 'right';
  className?: string;
}

const HierarchicalDropdown: React.FC<HierarchicalDropdownProps> = ({
  trigger,
  chapters,
  currentVerse,
  onVerseChange,
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setExpandedChapters(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-expand the chapter that contains the current verse when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const currentChapter = chapters.find(chapter => 
        chapter.verses.some(verse => verse.reference === currentVerse.reference)
      );
      if (currentChapter) {
        setExpandedChapters(new Set([currentChapter.chapterReference]));
      }
    }
  }, [isOpen, chapters, currentVerse]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const toggleChapter = (chapterRef: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterRef)) {
        newSet.delete(chapterRef);
      } else {
        newSet.add(chapterRef);
      }
      return newSet;
    });
  };

  const handleVerseClick = (verse: BibleVerse) => {
    onVerseChange(verse);
    setIsOpen(false);
    setExpandedChapters(new Set());
  };

  return (
    <div ref={dropdownRef} className={className}>
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`menu-dropdown ${align === 'left' ? 'dropdown-left' : 'dropdown-right'}`}>
          {chapters.map((chapter) => (
            <div key={chapter.chapterReference}>
              <button
                className="menu-item chapter-item"
                onClick={() => toggleChapter(chapter.chapterReference)}
              >
                <FontAwesomeIcon 
                  icon={expandedChapters.has(chapter.chapterReference) ? faChevronDown : faChevronRight}
                  className="chapter-icon"
                />
                {chapter.chapterTitle}
              </button>
              {expandedChapters.has(chapter.chapterReference) && (
                <div className="verse-list">
                  {chapter.verses.map((verse) => (
                    <button
                      key={verse.reference}
                      className={`menu-item verse-item ${
                        verse.reference === currentVerse.reference ? 'current-verse' : ''
                      }`}
                      onClick={() => handleVerseClick(verse)}
                    >
                      {verse.reference}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchicalDropdown; 