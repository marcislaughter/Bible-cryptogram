import React from 'react';
import './Controls.css';

interface ControlsProps {
  onReset: () => void;
  onHint: () => void;
  onAutoCheck: () => void;
  hintsRemaining: number;
  autoCheckEnabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onReset, 
  onHint, 
  onAutoCheck, 
  hintsRemaining, 
  autoCheckEnabled
}) => {
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
      <button 
        onClick={onAutoCheck}
        className={autoCheckEnabled ? 'active' : ''}
      >
        {autoCheckEnabled ? '✓ Auto Check' : 'Auto Check'}
      </button>
    </div>
  );
};

export default Controls; 