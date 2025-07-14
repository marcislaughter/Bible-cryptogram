import React from 'react';
import { Link } from 'react-router-dom';
import './InstructionsSofWhyMemorize.css';

const UnscrambleInstructions: React.FC = () => {
  return (
    <div className="instructions-page">
      <Link to="/" className="top-back-btn">← Back to Game</Link>
      
      <div className="instructions-container">
        <h1>How to Play Unscramble</h1>
        
        <div className="instructions-content">
          <h2>Objective</h2>
          <p>Unscramble each word in the Bible verse by guessing the first letter of each scrambled word.</p>
          
          <h2>How It Works</h2>
          <ul>
            <li>Each word in the Bible verse is scrambled (letters rearranged randomly)</li>
            <li>You need to guess the first letter of each original word</li>
            <li>When you guess correctly, the entire word is revealed</li>
            <li>The game progresses word by word until you complete the entire verse</li>
          </ul>

          <h2>Tips</h2>
          <ul>
            <li>Look at the scrambled letters to figure out what the original word might be</li>
            <li>Consider common Bible words like "GOD", "LORD", "JESUS", "CHRIST"</li>
            <li>Short words (2-3 letters) are often easier to unscramble mentally</li>
            <li>Articles like "THE", "AND", "A" are very common in verses</li>
            <li>Look for word patterns - does the scrambled word contain common letter combinations?</li>
            <li>If you're stuck, use the hint feature to reveal the current word</li>
          </ul>

          <h2>How to Play</h2>
          <ul>
            <li><strong>Look at the scrambled word</strong> - Try to figure out what the original word is</li>
            <li><strong>Type the first letter</strong> of what you think the original word is</li>
            <li><strong>Correct guess</strong> - The entire word is revealed and you move to the next word</li>
            <li><strong>Incorrect guess</strong> - The input turns red briefly and you can try again</li>
            <li><strong>Continue</strong> until all words are unscrambled</li>
          </ul>

          <h2>Game Features</h2>
          <ul>
            <li><strong>Hints</strong>: Click the "Hint" button to reveal the current word (3 hints per game)</li>
            <li><strong>Reset</strong>: Start over with the same verse but with new scrambled words</li>
            <li><strong>Verse Selector</strong>: Choose from different Bible verses</li>
            <li><strong>Progress Tracking</strong>: See which words you've solved and which is currently active</li>
          </ul>

          <h2>Winning</h2>
          <p>You win when you've correctly unscrambled all words in the verse. The game will show a congratulations message with the complete verse!</p>
        </div>

        <div className="back-to-game">
          <Link to="/" className="back-btn">← Back to Game</Link>
        </div>
      </div>
    </div>
  );
};

export default UnscrambleInstructions; 