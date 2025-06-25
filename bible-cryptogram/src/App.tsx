import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Instructions from './components/Instructions';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </Router>
  );
}

export default App;
