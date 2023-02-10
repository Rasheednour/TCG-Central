// Game Builder component: contains the interface for building a game
// Can be used to build a new game or to modify an existing game

import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";
import GameNameSetter from "./GameNameSetter";

export default function GameBuilder(gameId) {
  // TODO: make this value come from a config, rather than hardcoded
  const BACKEND_URL = "https://tcgbackend-s2kqyb5vna-wl.a.run.app";
  const BACKEND_CODE = "tcgadmin";
  const ACCESS_TOKEN = null;

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
  const [gameName, setGameName] = useState("");
  const [id, setId] = useState(gameId.gameId || "");
  const [setupDone, setSetupDone] = useState(false);
  const [gameSaving, setGameSaving] = useState(false);
  //console.log("game builder is called, game id is", gameId, id);

  function ruleSorter(first, second) {
    if ("description" in first && "description" in second) {
      return first.description.length - second.description.length;
    }
    return 0;
  }

  function saveGame(event) {
    //This save the game, makes a post request
    if (!gameSaving) {
      //console.log("attempting game save");
      setGameSaving(true);
    }
  }

  function setupDefaultGame(loadrules, loadabilities) {
    if (!("starting_hand" in gameRules)) {
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

  useEffect(() => {
    console.log("game save effect triggered");
    async function updateGame(aGame) {
      console.log("and update game actually called");
      let the_game_id = await fetch(BACKEND_URL + "/games", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + ACCESS_TOKEN,
        },
        method: "POST",
        body: JSON.stringify(aGame),
      })
        .then((res) => {
          console.log("first res is", res.status);
          if (res.status < 300) {
            return res.json();
          } else {
            console.log(`error in posting game`, res.status, res.json());
            return {};
          }
        })
        .then((data) => {
          console.log("returning data", data);
          if ("game_id" in data) {
            setId(data["game_id"]);
          }
          return data;
        });
    }

    if (gameSaving) {
      let new_rules = {};
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let curEl = document.getElementById(rule["name"] + "-value");
        console.log("saving ", rule, "with value", curEl.value, curEl);
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
      };
      if (id.length > 0) {
        game["game_id"] = id;
      }
      console.log("sending post request with,", game);
      updateGame(game).catch(console.error);
      setGameRules(new_rules);
      setGameSaving(false);
    }
  }, [gameSaving]);

  useEffect(() => {
    //console.log("calling setup useeffect");
    async function fetchData() {
      console.log("fetch data called");
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
        console.log("game fetch triggered", id, gameName);

        let gameFetch = await getAllFetch(
          BACKEND_URL,
          BACKEND_CODE,
          ACCESS_TOKEN,
          `/games/${id}`
        )
          .then((gameInfo) => {
            console.log("game info is", gameInfo);
            if ("name" in gameInfo) {
              setGameCharacters(gameInfo["characters"]);
              setGameName(gameInfo["name"]);
              setGameRules(gameInfo["rules"]);
              setGameDescription(gameInfo["description"]);
              setGameImage(gameInfo["image"]);
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
        console.log(
          "setting up default game rules, when gameRules are currently",
          gameRules
        );
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
    //console.log("rules currently are:", rules);
  }, [
    rules,
    abilities,
    setupDone,
    // gameName,
    // gameDescription,
    // gameCharacters,
    // gameImage,
  ]);

  function handleGameNameChange(event) {
    console.log("this is the input that we get for setting name:", event);
    setGameName(event);
  }

  function handleGameDescChange(event) {
    setGameDescription(event);
  }

  console.log("game name before return of component", gameName);
  return (
    <div>
      <h1>
        <Button variant="contained" color="secondary" onClick={saveGame}>
          SAVE GAME
        </Button>
      </h1>
      <Container>
        <Stack direction="column" spacing={2}>
          <GameNameSetter
            gameNameProp={gameName}
            setGameName={handleGameNameChange}
            gameDesc={gameDescription}
            setGameDesc={handleGameDescChange}
            key={gameName}
          ></GameNameSetter>
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
