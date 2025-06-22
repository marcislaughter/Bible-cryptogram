import React from 'react';
import './Controls.css';

interface ControlsProps {
  onReset: () => void;
  onHint: () => void;
  onGiveUp: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onReset, onHint, onGiveUp }) => {
  return (
    <div className="controls-container">
      <button onClick={onReset}>Reset</button>
      <button onClick={onHint}>Hint</button>
      <button onClick={onGiveUp}>Give Up</button>
    </div>
  );
};

export default Controls; 