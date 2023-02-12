import React from "react";
import "./styles/TCGPortal.css";
import TopRibbon from "../components/TopRibbon.js";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
//import SearchIcon from "@mui/icons-material/SearchIcon";
import GameSummary from "../components/GameSummary";
import tcg_portal_cover from "../assets/images/tcg_portal_cover.png";
import axios from "axios";

const api = "https://tcgbackend-s2kqyb5vna-wl.a.run.app/";

const SearchBar = () => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      label="Enter a TCG name"
      variant="outlined"
      placeholder="Search..."
      size="small"
      style={{ width: "300px" }}
    />
    <IconButton type="submit" aria-label="search">
      {/* <SearchIcon style={{ fill: "blue" }} /> */}
    </IconButton>
  </form>
);

function TCGPortal() {
  const [games, setGames] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const url = api + "games";
    axios
      .get(url)
      .then((res) => {
        setGames(res.data);
        setFetched(true);
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, {});

  return (
    <div className="TCGPortal">
      <TopRibbon />
      <div className="top-image">
        <img src={tcg_portal_cover} width="100%" alt="tcg portal cover image" />
      </div>
      <div className="TCG-Container">
        <h1>TCG Portal</h1>
        <h2>Browse Published Trading Card Games</h2>
        <SearchBar />
      </div>
      <div>
        {fetched ? (
          <div className="tcgames">
            {games.map((game) => (
              <div key={game.name} className="tcg-card">
                <GameSummary
                  title={game.name}
                  description={game.description}
                  game_id={game.game_id}
                  imageURL={game.image}
                />
              </div>
            ))}
          </div>
        ) : (
          <h3>no games found</h3>
        )}
      </div>
    </div>
  );
}

export default TCGPortal;
