// Game Builder component: contains the interface for building a game
// Can be used to build a new game or to modify an existing game

import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";
import GameNameSetter from "./GameNameSetter";
import CharacterCustomizer from "./CharacterCustomizer";
import { CONFIG } from "../config";
import { useNavigate } from "react-router-dom";

export default function GameBuilder({ gameId, userId }) {
  // TODO: make this value come from a config, rather than hardcoded
  const BACKEND_URL = CONFIG.BACKEND_URL;
  const BACKEND_CODE = CONFIG.BACKEND_CODE;
  const ACCESS_TOKEN = CONFIG.ACCESS_TOKEN;
  const navigate = useNavigate();

  const [rules, setRules] = useState([
    {
      name: "example_rule",
      title: "Loading...",
      value_type: "INT",
      description: "Loading rule options...",
    },
    {
      name: "other_example",
      title: "still loading",
      value_type: "STR",
      description: "still loading rule customization options...",
    },
  ]);
  const [abilities, setAbilities] = useState([
    {
      name: "Loading...",
      description: "Character ability options still loading",
      type: [{ name: "CREATURE", attribute_types: ["ATTACK", "DEFENSE"] }],
    },
  ]);
  const [gameRules, setGameRules] = useState({});
  const [gameCharacters, setGameCharacters] = useState([]);
  const [gameDescription, setGameDescription] = useState("");
  const [gameImage, setGameImage] = useState(
    "https://tcg-maker-frontend-123.uc.r.appspot.com/static/media/cover1.5a4e4b1dc837f8ce878b.png"
  );
  const [imageFile, setImageFile] = useState(null);
  const [gameName, setGameName] = useState("");
  const [id, setId] = useState(gameId || "");
  const [setupDone, setSetupDone] = useState(false);
  const [gameSaving, setGameSaving] = useState(false);
  //console.log("game builder is called, game id is", gameId, id);

  function ruleSorter(first, second) {
    if ("description" in first && "description" in second) {
      return first.description.length - second.description.length;
    }
    return 0;
  }

  const visitCards = () => {
    let path = `/cards/${id}`;
    navigate(path);
  };
  const visitEnemies = () => {
    let path = `/enemies/${id}`;
    navigate(path);
  };

  function saveGame(event) {
    //This save the game, makes a post request
    updateCharState();
    if (!gameSaving) {
      //console.log("attempting game save");
      setGameSaving(true);
    }
  }

  useEffect(() => {
    // console.log("game save effect triggered");
    async function updateGame(aGame) {
      let the_game_id = await fetch(BACKEND_URL + `/games`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ACCESS_TOKEN,
        },
        method: "POST",
        body: JSON.stringify(aGame),
      })
        .then((res) => {
          if (res.status < 300) {
            return res.json();
          } else {
            console.log(`error in posting game`, res.status, res.json());
            return {};
          }
        })
        .then((data) => {
          if ("game_id" in data) {
            setId(data["game_id"]);
          }
          return data;
        });
    }

    async function updateUser(id) {
      const url = `${BACKEND_URL}/users/${userId}/games`;
      const game = { game_id: id };
      let user_id = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ACCESS_TOKEN,
        },
        method: "PUT",
        body: JSON.stringify(game),
      }).then((res) => {
        if (res.status < 300) {
          return res.json();
        } else {
          console.log(`error in adding user game`, res.status, res.json());
          return {};
        }
      });
    }

    if (gameSaving) {
      let new_rules = {};
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let curEl = document.getElementById(rule["name"] + "-value");

        new_rules[rule["name"]] = curEl
          ? curEl.value
            ? curEl.value
            : curEl.textContent
          : gameRules[rule["name"]];
      }

      let game = {
        rules: new_rules,
        name: gameName,
        description: gameDescription,
        characters: gameCharacters,
        image: gameImage,
      };
      if (id.length > 0) {
        game["game_id"] = id;
      }

      updateGame(game).catch(console.error);
      setGameRules(new_rules);
      setGameSaving(false);
    }

    // if game id is fetched, save the game id to the user's list of games
    if (id) {
      updateUser(id).catch(console.error);
    }
  }, [
    gameSaving,
    gameCharacters,
    gameDescription,
    gameImage,
    gameName,
    gameRules,
    id,
    rules,
    ACCESS_TOKEN,
    BACKEND_URL,
    userId,
  ]);

  useEffect(() => {
    function setupDefaultGame(loadrules) {
      if (loadrules && !("starting_hand" in gameRules)) {
        let rule_object = {};
        for (let i = 0; i < loadrules.length; i++) {
          if (!(loadrules[i].name in rule_object)) {
            switch (loadrules[i].value_type) {
              case "INT":
                rule_object[loadrules[i].name] = 1;
                break;
              case "ENUM":
                rule_object[loadrules[i].name] = loadrules[i].values[0];
                break;
              default:
                //This is always INT, ENUM or STR, so must be STR
                rule_object[loadrules[i].name] = "None";
            }
          }
        }
        setGameRules(rule_object);
        return rule_object;
      }
      return gameRules;
    }
    async function fetchData() {
      let loadrules = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        "/rules"
      ).catch((err) => {
        console.log(`error fetching rules: ${err}`);
      });
      let loadabilities = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        "/abilities"
      ).catch((err) => {
        console.log(`error fetching abilities: ${err}`);
      });
      if (id) {
        await getAllFetch(
          BACKEND_URL,
          BACKEND_CODE,
          ACCESS_TOKEN,
          `/games/${id}`
        )
          .then((gameInfo) => {
            if ("name" in gameInfo) {
              setGameCharacters(gameInfo["characters"]);
              setGameName(gameInfo["name"]);
              setGameRules(gameInfo["rules"]);
              setGameDescription(gameInfo["description"]);
              setGameImage(gameInfo["image"] || "");
            } else {
              console.log(
                "building up default game rules, when gameRules are currently",
                gameRules,
                gameInfo
              );
              setupDefaultGame(loadrules, loadabilities);
            }
          })
          .catch((err) => {
            console.log(`error fetching game: ${err}`);
            setupDefaultGame(loadrules, loadabilities);
          });
        // setSetupDone(true);
      } else {
        //setup default game
        setupDefaultGame(loadrules, loadabilities);
        // setSetupDone(true);
      }

      loadrules.sort(ruleSorter);
      setRules(loadrules.slice());
      //console.log("rules now are:", rules);
      setAbilities(loadabilities.slice());
      setSetupDone(true);
      //console.log("here's what rules looks like:", rules);
    }
    if (!setupDone) {
      fetchData().catch(console.error);
    }
  }, [
    rules,
    abilities,
    setupDone,
    gameRules,
    id,
    ACCESS_TOKEN,
    BACKEND_CODE,
    BACKEND_URL,
  ]);

  function updateCharState() {
    let char_copy = [];
    for (let i = 0; i < gameCharacters.length; i++) {
      char_copy.push({
        name: document
          .getElementById(
            "character-value-" +
              (i + 1) +
              gameCharacters[i].name.split(" ").join("")
          )
          .value.toUpperCase(),
        attack: parseInt(
          document.getElementById(
            "character-attack-" +
              (i + 1) +
              gameCharacters[i].name.split(" ").join("")
          ).value
        ),
        health_mod: parseInt(
          document.getElementById(
            "character-health-" +
              (i + 1) +
              gameCharacters[i].name.split(" ").join("")
          ).value
        ),
        defense: parseInt(
          document.getElementById(
            "character-defense-" +
              (i + 1) +
              gameCharacters[i].name.split(" ").join("")
          ).value
        ),
        id:
          gameCharacters[i]["id"] ||
          "char" + Date.now() + "" + Math.floor(Math.random() * 1000),
      });
    }
    setGameCharacters(char_copy);
  }

  function handleGameNameChange(event) {
    setGameName(event);
  }

  function handleGameDescChange(event) {
    setGameDescription(event);
  }

  function handleGameImageChange(event) {
    setGameImage(event);
  }

  return (
    <div>
      <h1 spacing={0}>
        <Container sx={{ width: 4 / 7 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={saveGame}
            fullWidth
          >
            SAVE GAME
          </Button>
        </Container>
        <Container sx={{ width: 4 / 7 }}>
          {id && (
            <Button
              variant="contained"
              color="primary"
              onClick={visitCards}
              fullWidth
            >
              Edit Game's Cards
            </Button>
          )}
        </Container>
        <Container sx={{ width: 4 / 7 }}>
          {id && (
            <Button
              variant="contained"
              color="error"
              onClick={visitEnemies}
              fullWidth
            >
              Edit Game's Enemies
            </Button>
          )}
        </Container>
      </h1>
      <Container>
        <Stack direction="column" spacing={2}>
          <GameNameSetter
            gameNameProp={gameName}
            setGameName={handleGameNameChange}
            gameDesc={gameDescription}
            setGameDesc={handleGameDescChange}
            gameImage={gameImage}
            setGameImage={handleGameImageChange}
            imageFile={imageFile}
            setImageFile={setImageFile}
            key={gameName}
          ></GameNameSetter>
          <CharacterCustomizer
            characters={gameCharacters}
            setCharacters={setGameCharacters}
          />
          <RuleSetter
            theRules={rules}
            setGameRules={setGameRules}
            gameRules={gameRules}
            key={rules[0].name}
          ></RuleSetter>
        </Stack>
      </Container>
    </div>
  );
}
