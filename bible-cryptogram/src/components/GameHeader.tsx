import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import Dropdown, { type DropdownItem } from './Dropdown';
import HierarchicalDropdown from './HierarchicalDropdown';
import { BIBLE_CHAPTERS } from '../data/bibleVerses';
import type { BibleVerse } from '../data/bibleVerses';
import './Dropdown.css';

export type GameType = 'cryptogram' | 'unscramble' | 'reference-match';

interface GameHeaderProps {
  wordStatsEnabled: boolean;
  onToggleWordStats: () => void;
  currentVerse: BibleVerse;
  onVerseChange: (verse: BibleVerse) => void;
  gameType?: GameType;
  onGameTypeChange?: (gameType: GameType) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  wordStatsEnabled, 
  onToggleWordStats,
  currentVerse,
  onVerseChange,
  gameType = 'cryptogram',
  onGameTypeChange
}) => {
  // Game type dropdown items
  const gameTypeItems: DropdownItem[] = [
    {
      type: 'button',
      content: 'Cryptogram',
      onClick: () => onGameTypeChange?.('cryptogram')
    },
    {
      type: 'button',
      content: 'Unscramble',
      onClick: () => onGameTypeChange?.('unscramble')
    },
    {
      type: 'button',
      content: 'Coming soon - First Letter'
    },
    {
      type: 'button',
      content: 'Reference Match',
      onClick: () => onGameTypeChange?.('reference-match')
    }
  ];

  // Verse dropdown is now handled by HierarchicalDropdown component

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
    ...(gameType === 'cryptogram' ? [{
      type: 'button' as const,
      content: wordStatsEnabled ? 'Unpin Word Stats' : 'Pin Word Stats',
      onClick: onToggleWordStats
    }] : [])
  ];

  return (
    <div className="top-banner">
      <div className="banner-content">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Dropdown
            trigger={
              <button className="cryptogram-button">
                {gameType === 'cryptogram' ? 'Cryptogram' : gameType === 'unscramble' ? 'Unscramble' : 'Reference Match'} <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            items={gameTypeItems}
            align="left"
            className="cryptogram-dropdown"
          />
          
          <HierarchicalDropdown
            trigger={
              <button className="cryptogram-button">
                {currentVerse.reference} <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            chapters={BIBLE_CHAPTERS}
            currentVerse={currentVerse}
            onVerseChange={onVerseChange}
            align="left"
            className="verse-dropdown"
          />
        </div>

        <div className="banner-right">
          <Link to={gameType === 'cryptogram' ? '/instructions' : gameType === 'unscramble' ? '/unscramble-instructions' : '/reference-match-instructions'} className="help-btn">
            <FontAwesomeIcon icon={faCircleQuestion} />
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