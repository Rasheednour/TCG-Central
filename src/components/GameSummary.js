// This is the Game Summary card component, which is a box that shows a brief summary
// about any given TCG to the user (title, description, creator, cover art, sample cards, play button)

import React from "react";
import Button from "@mui/material/Button";
import cover from "../assets/temp_db/cover1.png";
import "./styles/GameSummary.css";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";

const PLAYGROUND_URL = "https://tcg-maker-phaser.herokuapp.com";

function GameSummary({
  title,
  creator,
  description,
  imageURL,
  game_id,
  publicStatus,
}) {
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
        {publicStatus === "OPEN_SOURCE" && (
          <h2 style={{ color: "green" }}>Open Source Game</h2>
        )}
        <h2>Created by: {creator}</h2>
        <p>{description}</p>
        <div>
          <Button variant="contained" onClick={routeChange}>
            PLAY
          </Button>
          {publicStatus === "OPEN_SOURCE" && (
            <Button
              style={{ backgroundColor: "green" }}
              variant="contained"
              onClick={gameEditRout}
            >
              EDIT GAME
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameSummary;
