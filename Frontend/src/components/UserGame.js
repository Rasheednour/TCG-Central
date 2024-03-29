import React from "react";
import Button from "@mui/material/Button";
import cover from "../assets/temp_db/cover1.png";
import "./styles/UserGame.css";
import { useNavigate } from "react-router-dom";

function UserGame({ title, description, imageURL, game_id, user_id }) {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/games/${game_id}`;
    navigate(path);
  };
  const gameEditRout = () => {
    let path = `/create/${game_id}`;
    navigate(path);
  };

  return (
    <div className="GameSummary">
      <div className="cover-image">
        <img
          src={imageURL || cover}
          width="400"
          height="500"
          alt="game cover logo"
        />
      </div>

      <div className="right-panel">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="card-samples">
          <Button variant="contained" onClick={routeChange}>
            PLAY GAME
          </Button>
          <Button variant="contained" onClick={gameEditRout}>
            EDIT GAME
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserGame;
