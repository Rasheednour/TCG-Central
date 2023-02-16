import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// fixed signup page naming
import SignUpPage from "./pages/SignupPage";
import TCGPortal from "./pages/TCGPortal";
import UserPage from "./pages/UserPage";
import PlayPage from "./pages/PlayPage";
import CreatePage from "./pages/CreatePage";
import CardsAndEnemiesPage from "./pages/CardsAndEnemiesPage";
import CardEditorPage from "./pages/CardEditorPage";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/tcgportal" element={<TCGPortal />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/create/:game_id" element={<CreatePage />} />
            <Route path="/cards/:game_id" element={<CardsAndEnemiesPage />} />
            <Route path="/enemies/:game_id" element={<CardsAndEnemiesPage />} />
            <Route
              path="/cards/:game_id/:card_id"
              element={<CardEditorPage />}
            />
            <Route
              path="/enemies/:game_id/:card_id"
              element={<CardEditorPage />}
            />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
