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
    e.preventDefault();  // Prevent default button behavior
    onKeyPress(key);
  };

  const handleBackspaceClick = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent default button behavior
    onBackspace();
  };

  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.split('').map(key => (
            <button 
              key={key} 
              onMouseDown={(e) => handleKeyClick(e, key)}  // Changed from onClick to onMouseDown
              className={isGuessed(key) ? 'guessed' : ''}
            >
              {key}
            </button>
          ))}
          {rowIndex === rows.length - 1 && (
            <button 
              onMouseDown={handleBackspaceClick}  // Changed from onClick to onMouseDown
              className="backspace-button"
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