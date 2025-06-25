import React from 'react';

const WordStats: React.FC = () => {
  return (
    <div className="word-stats">
      <h3>Letter Frequency in English</h3>
      <div className="stats-content">
        <div className="most-common">
          <strong>Most Common Letters:</strong> E, T, A, O, I, N, S, H, R, D, L, C, U, M, F, G, Y, P, B, V, K, J, X, Q, Z 
        </div>
        <div className="common-patterns">
          <div><strong>Most common letters at the beginning of a word:</strong> T, A, O, D, O, W, K, J, Q</div> 
          <div><strong>Most common letters at end of word:</strong> E, S, D, T</div>
          <div><strong>Common Double Letters:</strong> EE, LL, SS, OO, TT, FF, RR, NN, PP, CC</div>
          <div><strong>Common Double Letters at end of word:</strong> EE, LL, SS, FF</div>
          <div><strong>Words frequently following comma:</strong> AND, BUT, WHO, FOR</div>
          <div><strong>Common Two-Letter Words:</strong> TO, OF, IN, IT, IS, AS, AT, BE, BY, HE, WE, ME, UP, ON, AN, OR, IF, MY, DO, GO, NO, SO, US, AM</div>
          <div><strong>Common Three-Letter Words:</strong> THE, AND, FOR, ARE, BUT, NOT, YOU, ALL</div>
          <div><strong>Common Four-Letter Words:</strong> THAT, WITH, HAVE, THIS, WILL, FROM, THEY, WANT, BEEN, GOOD, MUCH, SOME</div>
        </div>
      </div>
    </div>
  );
};

export default WordStats; 