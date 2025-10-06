import React from 'react';
import { Link } from 'react-router-dom';
import './InstructionsSofWhyMemorize.css';

const StatementOfFaith: React.FC = () => {
  return (
    <div className="instructions-page">
      <Link to="/" className="top-back-btn">← Back to Game</Link>
      
      <div className="instructions-container">
        <h1>Statement of Faith</h1>
        
        <div className="instructions-content">
          <p>We believe in both the Apostles' Creed and Nicene creed, which have stood the test of time in laying out the essential doctrines of the church</p>

          <h2>The Apostles' Creed</h2>
          <p>
            I believe in God, the Father almighty,<br/>
            creator of heaven and earth.<br/><br/>
            
            I believe in Jesus Christ, his only Son, our Lord,<br/>
            who was conceived by the Holy Spirit<br/>
            and born of the virgin Mary.<br/>
            He suffered under Pontius Pilate,<br/>
            was crucified, died, and was buried;<br/>
            he descended to hell.<br/>
            The third day he rose again from the dead.<br/>
            He ascended to heaven<br/>
            and is seated at the right hand of God the Father almighty.<br/>
            From there he will come to judge the living and the dead.<br/><br/>
            
            I believe in the Holy Spirit,<br/>
            the holy catholic* church,<br/>
            the communion of saints,<br/>
            the forgiveness of sins,<br/>
            the resurrection of the body,<br/>
            and the life everlasting. Amen.<br/>
          </p>
          <p><strong>*The word "catholic" refers to the universal church of all believers throughout all times and places.</strong></p>

          <h2>The Nicene Creed</h2>
          <p>
            We believe in one God,<br/>
            the Father almighty,<br/>
            maker of heaven and earth,<br/>
            of all things visible and invisible.<br/><br/>

            We believe in one Lord, Jesus Christ,<br/>
            the only Son of God,<br/>
            begotten from the Father before all ages,<br/>
            God from God,<br/>
            Light from Light,<br/>
            true God from true God,<br/>
            begotten, not made;<br/>
            of the same essence as the Father.<br/>
            Through him all things were made.<br/>
            For us and for our salvation<br/>
            he came down from heaven;<br/>
            he became incarnate by the Holy Spirit and the virgin Mary,<br/>
            and was made human.<br/>
            He was crucified for us under Pontius Pilate;<br/>
            he suffered and was buried.<br/>
            The third day he rose again, according to the Scriptures.<br/>
            He ascended to heaven<br/>
            and is seated at the right hand of the Father.<br/>
            He will come again with glory<br/>
            to judge the living and the dead.<br/>
            His kingdom will never end.<br/><br/>

            We believe in the Holy Spirit,<br/>
            the Lord, the giver of life.<br/>
            He proceeds from the Father and the Son,<br/>
            and with the Father and the Son is worshiped and glorified.<br/>
            He spoke through the prophets.<br/>
            We believe in one holy catholic* and apostolic church.<br/>
            We affirm one baptism for the forgiveness of sins.<br/>
            We look forward to the resurrection of the dead,<br/>
            and to life in the world to come. Amen.<br/>
          </p>
          <p><strong>*The word "catholic" refers to the universal church of all believers throughout all times and places.</strong></p>

          <h2>Additional Beliefs</h2>
          <p>In addition to the beliefs above, we also believe that the gospel is a message of godly conviction (2 Cor 7:10, Rom 2:4), hope (Col. 1:23), and confidence (2 Cor 3:12), which leaves no room for shame (Rom 1:16, Phil 1:20, 2 Tim 1:12) or condemnation (Rom 8:1).</p>
        </div>

        <div className="back-to-game">
          <Link to="/" className="back-btn">← Back to Game</Link>
        </div>
      </div>
    </div>
  );
};

export default StatementOfFaith; 