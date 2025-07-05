import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faBars, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface GameHeaderProps {
  wordStatsEnabled: boolean;
  onToggleWordStats: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ wordStatsEnabled, onToggleWordStats }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  // Add click outside handler for both menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="top-banner">
      <div className="banner-content">
        <div className="cryptogram-dropdown" ref={menuRef}>
          <button 
            className="cryptogram-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Cryptogram <FontAwesomeIcon icon={faChevronDown} />
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button className="menu-item">
                Coming soon - Unscramble
              </button>
              <button className="menu-item">
                Coming soon - First Letter
              </button>
              <button className="menu-item">
                Coming soon - Reference Match
              </button>
            </div>
          )}
        </div>

        <div className="banner-right">
          <Link to="/instructions" className="help-btn">
            <FontAwesomeIcon icon={faQuestion} />
          </Link>
          <div className="hamburger-menu" ref={hamburgerRef}>
            <button 
              className="hamburger-button"
              onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            {isHamburgerOpen && (
              <div className="menu-dropdown">
                <Link to="/memorization" className="menu-item" onClick={() => setIsHamburgerOpen(false)}>
                  Why Memorize?
                </Link>
                <Link to="/faith" className="menu-item" onClick={() => setIsHamburgerOpen(false)}>
                  Statement of Faith
                </Link>
                <button 
                  onClick={() => {
                    onToggleWordStats();
                    setIsHamburgerOpen(false);
                  }}
                  className="menu-item"
                >
                  {wordStatsEnabled ? 'Unpin Word Stats' : 'Pin Word Stats'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader; 