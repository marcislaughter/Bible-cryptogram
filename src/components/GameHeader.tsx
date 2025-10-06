import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import Dropdown, { type DropdownItem } from './Dropdown';
import HierarchicalDropdown from './HierarchicalDropdown';
import { ALL_CONTENT_CHAPTERS } from '../data/bibleVersesPublic';
import type { BibleVerse } from '../data/bibleVersesPublic';
import './Dropdown.css';

export type GameType = 'cryptogram' | 'unscramble' | 'first-letter' | 'first-letter-test' | 'reference-match';

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
      content: 'First Letter',
      onClick: () => onGameTypeChange?.('first-letter')
    },
    {
      type: 'button',
      content: 'First Letter Test',
      onClick: () => onGameTypeChange?.('first-letter-test')
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
              <button className="gametype-button">
                {gameType === 'cryptogram' ? 'Cryptogram' : 
                 gameType === 'unscramble' ? 'Unscramble' : 
                 gameType === 'first-letter' ? 'First Letter' : 
                 gameType === 'first-letter-test' ? 'First Letter Test' :
                 'Reference Match'} <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            items={gameTypeItems}
            align="left"
            className="gametype-dropdown"
          />
          
          <HierarchicalDropdown
            trigger={
              <button className="gametype-button">
                {currentVerse.reference} <FontAwesomeIcon icon={faChevronDown} />
              </button>
            }
            chapters={ALL_CONTENT_CHAPTERS}
            currentVerse={currentVerse}
            onVerseChange={onVerseChange}
            align="left"
            className="verse-dropdown"
          />
        </div>

        <div className="banner-right">
          <Link to={gameType === 'cryptogram' ? '/instructions' : 
                    gameType === 'unscramble' ? '/unscramble-instructions' : 
                    gameType === 'first-letter' ? '/first-letter-instructions' : 
                    gameType === 'first-letter-test' ? '/first-letter-instructions' :
                    '/reference-match-instructions'} className="help-btn">
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