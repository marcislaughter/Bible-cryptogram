import React from 'react';
import { Link } from 'react-router-dom';
import './InstructionsSofWhyMemorize.css';

const WhyMemorize: React.FC = () => {
  return (
    <div className="instructions-page">
      <Link to="/" className="top-back-btn">← Back to Game</Link>
      
      <div className="instructions-container">
        <h1>Why Memorize Scripture?</h1>
        
        <div className="instructions-content">
          <h2>My heart engraved metaphor</h2>
          <p>2 Corinthians 3:3 tells us that our hearts can be engraved with a letter from Christ, known and read by everyone, just as the sacred tablets were engraved in the Old Testament by the finger of God. The passage goes on to describe in verse 18 how we are transformed as we "contemplate the Lord's glory". I believe that one way to do this is to meditate on scriptures that we have memorized and allow the Spirit to direct our thoughts.</p>
          <p>This metaphor of engraving reminds me of the Japanese tradition of Kintsugi, where broken pottery is repaired with gold. The broken pieces are not discarded, nor is there an attempt to conceal the damage, but rather the cracks are highlighted with gold to create a new and beautiful piece of art. I believe that through memorization and meditation the Holy Spirit can use us in our weakness and inlay the cracks of our hearts with gold.</p>

          <h2>My Story</h2>
          <p>I memorized a lot of scripture as a child and teenager through AWANA, Bible Quizzing, and the National Bible Bee. However, at that time, it never fully clicked for me why Scripture memorization was important, other than for the fun of the competition and the praise I received for memorizing verses.</p>
          <p>One day in my mid-twenties, my church hosted a scripture reading event where we read through significant portions of scripture out loud. Although I did not come in entirely enthusiastic, something about the relaxing atmosphere and the familiarity of the passages I had previously memorized caused me to step outside of my analytical brain and focus on the message and emotions the passage was truly portraying. </p> 
          <p>Since that day I have re-incorporated scripture memory into my daily routine, and find if I know a passage well enough that I can run through it in my mind without exerting significant mental effort, then I am able to more easily step outside of my analytical brain and into the presence of the Lord when I hear these scriptures either read out loud in a church setting, or during my own personal devotional time. Hearing these familiar scriptures will then produce the fruits of the Holy Spirit (Gal 5:22-23) in my life.</p>    
          <p>I have created this app to help both myself and others to engage in scripture memory in an easy and fun way. I began with a cryptogram game, and am working to add additional translations, games, user stats, and other features.</p>    
   
          <h2>Other helpful links</h2>
          <p>Below are some helpful links to other scripture memorization resources:</p>
          <ul>
            <li><a href="https://scripturememory.com/why" target="_blank" rel="noopener noreferrer"><strong>Additional commentary on why scripture memory is important</strong></a></li>
            <li><a href="https://scripturememory.com/verselocker/grid/" target="_blank" rel="noopener noreferrer"><strong>Create a printable grid of first letters in your passage</strong></a></li>
            <li><a href="https://www.mcscott.org/index.html" target="_blank" rel="noopener noreferrer"><strong>Create scripture flashcards (ESV and KJV only)</strong></a></li>
          </ul>

          <h2>Tips for Scripture Memory</h2>
          <ul>
            <li><strong>Memorize with context</strong>: Try memorizing an entire passage rather than individual verses</li>
            <li><strong>Repeat Regularly</strong>: Review at regular intervals</li>
            <li><strong>Use Multiple Methods</strong>: Have fun with the games provided</li>
            <li><strong>Apply Context</strong>: Use any down time (e.g. waiting in line) to reflect on your scriptures</li>
            <li><strong>Pray for Help</strong>: Ask God to help you hide His Word in your heart</li>
          </ul>
        </div>

        <div className="back-to-game">
          <Link to="/" className="back-btn">← Back to Game</Link>
        </div>
      </div>
    </div>
  );
};

export default WhyMemorize; 