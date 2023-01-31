import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header" >
          <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
