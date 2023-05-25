import React, { useState, useEffect } from "react";
import "./styles/SetupPage.css";
import TopRibbon from "../components/TopRibbon.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
} from "@mui/material";

const BACKEND_API = "https://tcg-backend-app-2nzzlueilq-lz.a.run.app/";
const PHASER_CLIENT = "https://tcg-maker-phaser.herokuapp.com/";

function SetupPage() {
  const [game, setGame] = useState("");
  const [character, setCharacter] = useState("");
  const [characters, setCharacters] = useState([]);
  const [difficulty, setDifficulty] = useState("1");
  const [deckSize, setDeckSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const game_id = useParams().game_id;

  const handleCharChange = (event) => {
    setCharacter(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    window.location.href =
      PHASER_CLIENT +
      "?gameId=" +
      game_id +
      "&characterId=" +
      character.id +
      "&deckSize=" +
      deckSize +
      "&difficulty=" +
      difficulty;
  };

  function getDeckSizes() {
    const deckSizes = [];
    for (
      let i = game.rules.cards_per_deck_min;
      i <= game.rules.cards_per_deck_max;
      i++
    ) {
      deckSizes.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return deckSizes;
  }

  useEffect(() => {
    const gameUrl = BACKEND_API + "games/" + game_id;
    axios
      .get(gameUrl)
      .then((res) => {
        setGame(res.data);
        setCharacters(res.data.characters);
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, [game_id]);

  return (
    <div className="SetupPage">
      <TopRibbon />
      <br></br>
      <h2>Game Setup</h2>

      {game ? (
        <div className="setup">
          <h3>Select Your Character</h3>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Character</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={character}
              label="Character"
              onChange={handleCharChange}
              sx={{ bgcolor: "white" }}
            >
              {characters.map((character) => (
                <MenuItem
                  key={character.name}
                  value={character}
                  className="menu-item"
                >
                  {character.name} (ATK: {character.attack}, DEF:{" "}
                  {character.defense}, HPMOD: {character.health_mod})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h3>Select Your Deck Size</h3>
          <h4>
            Min. deck size is: {game.rules.cards_per_deck_min} & Max. deck size
            is {game.rules.cards_per_deck_max}
          </h4>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Deck Size</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Deck Size"
              value={deckSize}
              onChange={(event) => {
                setDeckSize(event.target.value);
              }}
              sx={{ bgcolor: "white" }}
            >
              {getDeckSizes()}
            </Select>
          </FormControl>
          <h3>Select Difficulty Level</h3>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Difficulty"
              variant="outlined"
              value={difficulty}
              sx={{ bgcolor: "white" }}
              onChange={(event) => {
                setDifficulty(event.target.value);
              }}
            />
          </Box>
          <Button variant="contained" onClick={handleSubmit}>
            Start Game
          </Button>
          {isLoading && <h3>Game Is Loading...</h3>}
        </div>
      ) : (
        <h2>Game does not exist</h2>
      )}
    </div>
  );
}

export default SetupPage;
