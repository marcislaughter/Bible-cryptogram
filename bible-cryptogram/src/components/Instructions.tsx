import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="instructions-page">
      <div className="instructions-container">
        <h1>How to Play Cryptogram</h1>
        
        <div className="instructions-content">
          <h2>Objective</h2>
          <p>Decode the encrypted Bible verse by figuring out which letter each encrypted character represents.</p>
          
          <h2>How It Works</h2>
          <ul>
            <li>Each letter in the original text is replaced with a different letter using a substitution cipher</li>
            <li>For example, if 'A' becomes 'X', then every 'A' in the original text will appear as 'X' in the encrypted version</li>
            <li>Your goal is to figure out the correct letter for each encrypted character</li>
          </ul>

          <h2>How to Play</h2>
          <ul>
            <li><strong>Click on any encrypted letter</strong> to select it, or use arrow keys to navigate</li>
            <li><strong>Type a letter</strong> to make your guess (A-Z)</li>
            <li><strong>Use the keyboard</strong> below or type directly on your computer keyboard</li>
            <li><strong>Arrow keys</strong> to move between letters</li>
            <li><strong>Backspace/Delete</strong> to clear a guess</li>
            <li><strong>Escape</strong> to deselect the current letter</li>
          </ul>

          <h2>Game Features</h2>
          <ul>
            <li><strong>Hints</strong>: Click the "Hint" button to reveal a letter (3 hints per game)</li>
            <li><strong>Auto Check</strong>: Enable to see if your guesses are correct (green = correct, red = incorrect)</li>
            <li><strong>Reset</strong>: Start over with the same verse</li>
            <li><strong>Verse Selector</strong>: Choose from different Bible verses</li>
          </ul>

          <h2>Tips</h2>
          <ul>
            <li>Look for common letter patterns (like 'THE', 'AND', 'THAT')</li>
            <li>Consider letter frequency - 'E', 'T', 'A', 'O' are the most common letters in English</li>
            <li>Pay attention to word length and letter patterns</li>
            <li>Use the hints strategically when you're stuck</li>
          </ul>

          <h2>Winning</h2>
          <p>You win when you've correctly decoded all the letters in the verse. The game will show a congratulations message!</p>
        </div>

        <div className="back-to-game">
          <a href="#/" className="back-btn">← Back to Game</a>
        </div>
      </div>
    </div>
  );
};

export default Instructions; 