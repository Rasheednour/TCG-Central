import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
// fixed signup page naming
import SignUpPage from './pages/SignUpPage';
import TCGPortal from './pages/TCGPortal';
import UserPage from './pages/UserPage';
import PlayPage from './pages/PlayPage';
import CreatePage from './pages/CreatePage';
function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header" >
          <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/tcgportal" element={<TCGPortal/>} />
          <Route path="/user" element={<UserPage/>} />
          <Route path="/play" element={<PlayPage/>} />
          <Route path="/create" element={<CreatePage/>} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
