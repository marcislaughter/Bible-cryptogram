import React from 'react';

const WordStats: React.FC = () => {
  return (
    <div className="word-stats">
      <h3>Common English Word Stats</h3>
      <div className="stats-content">
          <div><strong>Most Common Letters:</strong> E, T, A, O, I, N, S, H, R, D, L, C, U, M, F, G, Y, P, B, V, K, J, X, Q, Z</div>
          <div><strong>Most common letters at the beginning of a word:</strong> T, A, O, I, S, W, C, B, P, H, F, M, D, E, R, L, N, G, U, K, V, Y, J, Q, X, Z</div> 
          <div><strong>Most common letters at end of word:</strong> E, S, D, T, N, R, Y, L, A, I, O, U, M, P, C, H, G, F, B, V, K, W, X, J, Q, Z</div>
          <div><strong>Common double letters:</strong> EE, LL, SS, OO, TT, FF, RR, NN, PP, CC</div>
          <div><strong>Common double letters at end of word:</strong> EE, LL, SS, FF</div>
          <div><strong>Common three-letter words with a distinct pattern:</strong> aLL, sEE, aDD</div>
          <div><strong>Common four-letter words with a distinct pattern:</strong> nEEd, EvEn, ThaT, gOOd, frEE, hErE, bEEn, bOOk, fuLL, wiLL, wErE, AreA</div>
          <div><strong>Common five-letter words with a distinct pattern:</strong> thErE, whErE, lEvEl, shaLL, nEvEr, bOOks, smaLL, claSS, preSS, staFF, wHicH, sTaTe, thrEE, stiLL, tOOls, thEsE TiTle</div>
        </div>
      </div>
  );
};

export default WordStats; 