import React from "react";
import "./styles/TCGPortal.css";
import TopRibbon from "../components/TopRibbon.js";
import { useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
//import SearchIcon from "@mui/icons-material/SearchIcon";
import GameSummary from "../components/GameSummary";

import tcg_portal_cover from "../assets/images/tcg_portal_cover.png";
import axios from "axios";

const api = "https://tcgbackend-s2kqyb5vna-wl.a.run.app/";

function TCGPortal() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  // filter games list by search input
  const filterGames = () => {
    let newGames = [];
    games.forEach((game) => {
      if (game.name.toLowerCase().includes(search.toLowerCase())) {
        newGames.push(game);
      }
    });
    setFilteredGames(newGames);
    searchInputRef.current.focus();
  };

  useEffect(() => {
    searchInputRef.current.focus();
    filterGames();
  }, [search]);

  useEffect(() => {
    searchInputRef.current.focus();
  }, [filteredGames]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    searchInputRef.current.focus();
  };

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
        value={search}
        onChange={handleSearchChange}
        inputRef={searchInputRef}
      />
    </form>
  );

  // assigns a user name to a game to be displayed in the portal
  const assignUsers = () => {
    let gamesCopy = [...games];

    gamesCopy.forEach((game) => {
      let foundUser = false;
      users.forEach((user) => {
        if (user.games.includes(game.game_id) && !foundUser) {
          game.user = user.name;
          foundUser = true;
        }
      });
    });

    setGames(gamesCopy);
    setFilteredGames(gamesCopy);
  };

  useEffect(() => {
    const url = api + "games";
    axios
      .get(url)
      .then((res) => {
        setGames(res.data);
        setFetched(true);
        setFilteredGames(res.data);
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, []);

  useEffect(() => {
    const url = api + "users";
    axios
      .get(url)
      .then((res) => {
        setUsers(res.data);
        if (fetched) {
          assignUsers();
        }
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, [fetched]);

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
            {filteredGames.map((game) => (
              <div key={game.name} className="tcg-card">
                {game.rules.public === "PUBLIC" ? (
                  <GameSummary
                    title={game.name}
                    description={game.description}
                    game_id={game.game_id}
                    imageURL={game.image}
                    creator={game.user}
                  />
                ) : game.rules.public === "OPEN_SOURCE" ? (
                  <GameSummary
                    title={game.name}
                    description={game.description}
                    game_id={game.game_id}
                    imageURL={game.image}
                    publicStatus={game.rules.public}
                    creator={game.user}
                  />
                ) : (
                  <></>
                )}
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
