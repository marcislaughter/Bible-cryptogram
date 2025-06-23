import React from 'react';
import './Controls.css';

interface ControlsProps {
  onReset: () => void;
  onHint: () => void;
  onGiveUp: () => void;
  hintsRemaining: number;
}

const Controls: React.FC<ControlsProps> = ({ onReset, onHint, onGiveUp, hintsRemaining }) => {
  return (
    <div className="controls-container">
      <button onClick={onReset}>Reset</button>
      <button 
        onClick={onHint} 
        disabled={hintsRemaining <= 0}
        className={hintsRemaining <= 0 ? 'disabled' : ''}
      >
        Hint ({hintsRemaining})
      </button>
      <button onClick={onGiveUp}>Give Up</button>
    </div>
  );
};

export default Controls; 