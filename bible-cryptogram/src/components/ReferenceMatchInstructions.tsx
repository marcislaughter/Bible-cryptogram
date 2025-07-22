import React from 'react';
import { Link } from 'react-router-dom';
import './InstructionsSofWhyMemorize.css';

const ColorWheel: React.FC = () => {
  const colors = [
    { id: 1, name: 'yellow', color: '#FFFF00' },
    { id: 2, name: 'lime', color: '#00FF00' },
    { id: 3, name: 'forest green', color: '#228B22' },
    { id: 4, name: 'cyan', color: '#00FFFF' },
    { id: 5, name: 'dark blue', color: '#00008B' },
    { id: 6, name: 'purple', color: '#9370DB' },
    { id: 7, name: 'hot pink', color: '#FF69B4' },
    { id: 8, name: 'red', color: '#DC143C' },
    { id: 9, name: 'brown', color: '#8B4513' },
    { id: 10, name: 'silver', color: '#C0C0C0' }
  ];

  return (
    <div className="color-wheel-container">
      <h2>Color Wheel Reference</h2>
      <div className="color-wheel">
        {colors.map((item) => (
          <div key={item.id} className="color-segment">
            <div 
              className="color-circle"
              style={{ backgroundColor: item.color }}
            >
              <span className="color-number">{item.id}</span>
            </div>
            <span className="color-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReferenceMatchInstructions: React.FC = () => {
  return (
    <div className="instructions-page">
      <Link to="/" className="top-back-btn">← Back to Game</Link>
      
      <div className="instructions-container">
        <h1>How to Play Reference Match</h1>
        
        <ColorWheel />
        
        <div className="instructions-content">
          <h2>Objective</h2>
          <p>Match Bible verses with their corresponding references by clicking pairs of cards. Find all 5 matching pairs to win!</p>
          
          <h2>How It Works</h2>
          <ul>
            <li>10 cards are displayed in a grid: 5 with Bible verse text and 5 with Bible references</li>
            <li>Click on two cards to select them - one verse card and one reference card</li>
            <li>If they match (the verse text goes with that reference), both cards stay matched</li>
            <li>If they don't match, both cards will unselect after a moment</li>
            <li>Continue until you've matched all 5 pairs</li>
          </ul>

          <h2>Tips</h2>
          <ul>
            <li>Read the verse text carefully - it may give you clues about which book it comes from</li>
            <li>Look for distinctive words or phrases that might identify the verse</li>
            <li>Gospel books (Matthew, Mark, Luke, John) often contain teachings of Jesus</li>
            <li>Psalms are poetic and often express worship, praise, or emotions</li>
            <li>Proverbs contain wisdom sayings and practical life advice</li>
            <li>Epistles (letters) often contain instructions for Christian living</li>
            <li>If you're stuck, use the hint feature to reveal a matching pair</li>
          </ul>

          <h2>How to Play</h2>
          <ul>
            <li><strong>Select first card</strong> - Click on either a verse card or reference card</li>
            <li><strong>Select second card</strong> - Click on a card of the opposite type (verse or reference)</li>
            <li><strong>Check for match</strong> - If they belong together, both cards turn green and stay matched</li>
            <li><strong>Try again</strong> - If they don't match, both cards will unselect and you can try again</li>
            <li><strong>Complete all pairs</strong> - Match all 5 verse-reference pairs to win the game</li>
          </ul>

          <h2>Game Features</h2>
          <ul>
            <li><strong>Hints</strong>: Click the "Hint" button to automatically match one pair (3 hints per game)</li>
            <li><strong>Reset</strong>: Start over with a new set of 5 random verses and shuffled cards</li>
            <li><strong>Verse Selector</strong>: Change the featured verse to get different verse combinations</li>
            <li><strong>Progress Bar</strong>: Visual indicator showing how many pairs you've matched</li>
            <li><strong>Scoring</strong>: Your score is based on correct matches without using hints or making mistakes</li>
          </ul>

          <h2>Card Types</h2>
          <p>There are two types of cards in the game:</p>
          <ul>
            <li><strong>Verse Cards</strong>: Display the full text of a Bible verse</li>
            <li><strong>Reference Cards</strong>: Show the Bible reference (book, chapter, and verse)</li>
          </ul>
          <p>Example pair: A verse card showing "For God so loved the world..." matches with a reference card showing "John 3:16"</p>

          <h2>Scoring</h2>
          <p>Your score is calculated based on:</p>
          <ul>
            <li><strong>Correct matches</strong>: Each pair you match correctly without hints</li>
            <li><strong>Hints used</strong>: Using hints reduces your final score</li>
            <li><strong>Incorrect attempts</strong>: Wrong matches also affect your score</li>
          </ul>

          <h2>Winning</h2>
          <p>You win when you've successfully matched all 5 verse-reference pairs! The game will show a congratulations message with your score and a summary of all the matched verses and references.</p>
        </div>

        <div className="back-to-game">
          <Link to="/" className="back-btn">← Back to Game</Link>
        </div>
      </div>
    </div>
  );
};

export default ReferenceMatchInstructions; 