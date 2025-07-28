import React from 'react';
import { Link } from 'react-router-dom';
import './InstructionsSofWhyMemorize.css'; // Reuse the same styles

const FirstLetterInstructions: React.FC = () => {
  return (
    <div className="instructions-page">
      <Link to="/" className="top-back-btn">← Back to Game</Link>
      
      <div className="instructions-container">
        <h1>First Letter Game Instructions</h1>
        
        <div className="instructions-content">
        <section>
          <h2>How to Play</h2>
          <p>
            The First Letter game challenges you to type the first letter of each word in a Bible verse. 
            Test your memory and letter recognition skills!
          </p>
        </section>

        <section>
          <h2>Game Mechanics</h2>
          <ul>
            <li><strong>Type First Letters:</strong> For each word position, type the first letter of that word</li>
            <li><strong>Hidden Words:</strong> Every fourth word will be hidden until you correctly guess its first letter</li>
            <li><strong>Instant Feedback:</strong> The input field changes color to show if your guess is correct</li>
            <li><strong>Progressive Reveal:</strong> When you guess correctly, hidden words are revealed with animation</li>
            <li><strong>Navigation:</strong> Use Tab or arrow keys to move between input fields</li>
          </ul>
        </section>

        <section>
          <h2>Color Coding</h2>
          <ul>
            <li><strong>Purple Background:</strong> Ready for input</li>
            <li><strong>Green Background:</strong> Correct letter (when Auto Check is enabled)</li>
            <li><strong>Red Background:</strong> Incorrect letter (when Auto Check is enabled)</li>
            <li><strong>Green Border:</strong> Successfully revealed hidden word</li>
          </ul>
        </section>

        <section>
          <h2>Controls</h2>
          <ul>
            <li><strong>Auto Check:</strong> Enable to see immediate feedback on your guesses</li>
            <li><strong>Hint:</strong> Reveals the correct first letter for the next unguessed word (3 hints available)</li>
            <li><strong>Reset:</strong> Start over with a fresh puzzle</li>
          </ul>
        </section>

        <section>
          <h2>Tips for Success</h2>
          <ul>
            <li>Try to recall the verse from memory before looking at the visible words</li>
            <li>Use the context of visible words to help guess the hidden ones</li>
            <li>Pay attention to common Bible words and phrases</li>
            <li>The progress bar shows how close you are to completion</li>
          </ul>
        </section>

        <section>
          <h2>Educational Benefits</h2>
          <p>
            The First Letter game helps with:
          </p>
          <ul>
            <li>Letter recognition and spelling skills</li>
            <li>Memory recall and verse familiarity</li>
            <li>Focus and concentration</li>
            <li>Pattern recognition in biblical text</li>
          </ul>
        </section>
        </div>
      </div>
    </div>
  );
};

export default FirstLetterInstructions; 