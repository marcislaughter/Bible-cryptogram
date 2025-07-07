import React from 'react';
import './Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  guesses: Record<string, string>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onBackspace, guesses }) => {
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

  return (
    <div className="keyboard">
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