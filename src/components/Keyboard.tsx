import React from 'react';
import './Keyboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  guesses: Record<string, string>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onBackspace, onArrowLeft, onArrowRight, guesses }) => {
  const rows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
  ];

  const isGuessed = (key: string) => Object.values(guesses).includes(key);

  const handleKeyClick = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    onKeyPress(key);
  };

  const handleBackspaceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onBackspace();
  };

  const handleArrowLeftClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onArrowLeft?.();
  };

  const handleArrowRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onArrowRight?.();
  };

  return (
    <div className="keyboard">
      {/* Arrow navigation buttons */}
      {(onArrowLeft || onArrowRight) && (
        <div className="arrow-navigation">
          {onArrowLeft && (
            <button 
              onMouseDown={handleArrowLeftClick}
              className="arrow-key left-arrow"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          {onArrowRight && (
            <button 
              onMouseDown={handleArrowRightClick}
              className="arrow-key right-arrow"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      )}
      
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`keyboard-row keyboard-row-${rowIndex + 1}`}>
          {row.split('').map(key => (
            <button 
              key={key} 
              onMouseDown={(e) => handleKeyClick(e, key)}
              className={`keyboard-key ${isGuessed(key) ? 'guessed' : ''}`}
            >
              {key}
            </button>
          ))}
          {rowIndex === rows.length - 1 && (
            <button 
              onMouseDown={handleBackspaceClick}
              className="keyboard-key backspace"
            >
              ←
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 