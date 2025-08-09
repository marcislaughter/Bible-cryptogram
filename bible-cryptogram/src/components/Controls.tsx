import React from 'react';
import './Controls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faRotateLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

interface ControlsProps {
  onReset: () => void;
  onHint: () => void;
  onAutoCheck: () => void;
  hintsRemaining: number;
  autoCheckEnabled: boolean;
  showAutoCheck?: boolean;
  children?: React.ReactNode;
}

const Controls: React.FC<ControlsProps> = ({ 
  onReset, 
  onHint, 
  onAutoCheck, 
  hintsRemaining, 
  autoCheckEnabled,
  showAutoCheck = true,
  children
}) => {
  return (
    <div className="controls-container">
      {showAutoCheck && (
        <button 
          onClick={onAutoCheck}
          className={`auto-check-btn ${autoCheckEnabled ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon={faCheck} /> Auto Check
        </button>
      )}
      <button onClick={onReset}><FontAwesomeIcon icon={faRotateLeft} /> Reset</button>
      <button 
        onClick={onHint} 
        disabled={hintsRemaining <= 0}
        className={hintsRemaining <= 0 ? 'disabled' : ''}
      >
        <FontAwesomeIcon icon={faLightbulb} /> Hint ({hintsRemaining})
      </button>
      {children}
    </div>
  );
};

export default Controls; 