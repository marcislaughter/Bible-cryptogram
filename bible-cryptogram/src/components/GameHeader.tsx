import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown, { type DropdownItem } from './Dropdown';
import { BIBLE_VERSES } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import './Dropdown.css';

interface GameHeaderProps {
  wordStatsEnabled: boolean;
  onToggleWordStats: () => void;
  currentVerse: BibleVerse;
  onVerseChange: (verse: BibleVerse) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  wordStatsEnabled, 
  onToggleWordStats,
  currentVerse,
  onVerseChange
}) => {
  // Cryptogram dropdown items
  const cryptogramItems: DropdownItem[] = [
    {
      type: 'button',
      content: 'Coming soon - Unscramble'
    },
    {
      type: 'button',
      content: 'Coming soon - First Letter'
    },
    {
      type: 'button',
      content: 'Coming soon - Reference Match'
    }
  ];

  // Verse dropdown items
  const verseItems: DropdownItem[] = BIBLE_VERSES.map((verse, index) => ({
    type: 'button',
    content: `${verse.reference}`,
    onClick: () => onVerseChange(verse)
  }));

  // Hamburger menu items
  const hamburgerItems: DropdownItem[] = [
    {
      type: 'link',
      content: 'Why Memorize?',
      href: '/memorization'
    },
    {
      type: 'link',
      content: 'Statement of Faith',
      href: '/faith'
    },
    {
      type: 'button',
      content: wordStatsEnabled ? 'Unpin Word Stats' : 'Pin Word Stats',
      onClick: onToggleWordStats
    }
  ];

  return (
    <div className="top-banner">
      <div className="banner-content">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Dropdown
            trigger={
              <button className="cryptogram-button">
                Cryptogram <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            items={cryptogramItems}
            align="left"
            className="cryptogram-dropdown"
          />
          
          <Dropdown
            trigger={
              <button className="cryptogram-button">
                {currentVerse.reference} <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            items={verseItems}
            align="left"
            className="verse-dropdown"
          />
        </div>

        <div className="banner-right">
          <Link to="/instructions" className="help-btn">
            <FontAwesomeIcon icon={faQuestion} />
          </Link>
          <Dropdown
            trigger={
              <button className="hamburger-button">
                <FontAwesomeIcon icon={faBars} />
              </button>
            }
            items={hamburgerItems}
            align="right"
            className="hamburger-menu"
          />
        </div>
      </div>
    </div>
  );
};

export default GameHeader; 