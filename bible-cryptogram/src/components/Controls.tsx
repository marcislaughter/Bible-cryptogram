import React from 'react';
import './Controls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

interface ControlsProps {
  onReset: () => void;
  onNextVerse: () => void;
  onHint: () => void;
  onAutoCheck: () => void;
  hintsRemaining: number;
  autoCheckEnabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onReset, 
  onNextVerse,
  onHint, 
  onAutoCheck, 
  hintsRemaining, 
  autoCheckEnabled
}) => {
  return (
    <div className="controls-container">
      <button onClick={onReset}><FontAwesomeIcon icon={faRotateLeft} /> Reset</button>
      <button onClick={onNextVerse}>Next Verse ➜</button>
      <button 
        onClick={onHint} 
        disabled={hintsRemaining <= 0}
        className={hintsRemaining <= 0 ? 'disabled' : ''}
      >
        <FontAwesomeIcon icon={faLightbulb} /> Hint ({hintsRemaining})
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