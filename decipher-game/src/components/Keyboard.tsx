import React from 'react';
import './Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: Record<string, string>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses }) => {
  const rows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
  ];

  const isGuessed = (key: string) => Object.values(guesses).includes(key);

  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.split('').map(key => (
            <button 
              key={key} 
              onClick={() => onKeyPress(key)}
              className={isGuessed(key) ? 'guessed' : ''}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 