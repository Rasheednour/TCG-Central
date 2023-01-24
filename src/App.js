import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header" >
          <Routes>
          <Route path="/" element={<HomePage/>} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
