import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Instructions from './components/Instructions';
import ScriptureMemorization from './components/ScriptureMemorization';
import StatementOfFaith from './components/StatementOfFaith';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/memorization" element={<ScriptureMemorization />} />
        <Route path="/faith" element={<StatementOfFaith />} />
      </Routes>
    </Router>
  );
}

export default App;
