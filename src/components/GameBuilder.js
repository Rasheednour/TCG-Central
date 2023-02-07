// Game Builder component: contains the interface for building a game
// Can be used to build a new game or to modify an existing game

import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";
import GameNameSetter from "./GameNameSetter";

// TODO: make this value come from a config, rather than hardcoded
const BACKEND_URL = "https://tcgbackend-s2kqyb5vna-wl.a.run.app";
const BACKEND_CODE = "tcgadmin";
const ACCESS_TOKEN = null;

export default function GameBuilder(gameId) {
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
  const [gameName, setGameName] = useState("");
  const [id, setId] = useState(gameId.gameId || "");
  const [setupDone, setSetupDone] = useState(false);
  const [gameSaving, setGameSaving] = useState(false);
  //console.log("game builder is called, game id is", gameId, id);

  function saveGame(event) {
    //This save the game, makes a post request
    if (!gameSaving) {
      console.log("attempting game save");
      setGameSaving(true);
    }
  }

  useEffect(() => {
    console.log("game save effect triggered");
    async function updateGame(aGame) {
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
      for (let rule in gameRules) {
        let curEl = document.getElementById(rule + "-value");
        new_rules[rule] = curEl ? curEl.value : gameRules[rule];
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
      if (id && gameName == "") {
        let gameInfo = await getAllFetch(
          BACKEND_URL,
          BACKEND_CODE,
          ACCESS_TOKEN,
          `/games/${gameId}`
        ).catch((err) => {
          console.log(`error fetching game: ${err}`);
        });
        setGameCharacters(gameInfo["characters"]);
        setGameName(gameInfo["name"]);
        setGameRules(gameInfo["rules"]);
      } else {
        //setup default game
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
      }

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
  }, [rules, abilities, setupDone]);

  function handleGameNameChange(event) {
    console.log("this is the input that we get for setting name:", event);
    setGameName(event);
  }

  return (
    <div>
      <h1>
        <button onClick={saveGame}>SAVE GAME</button>
      </h1>
      <Container>
        <Stack direction="column" spacing={2}>
          <GameNameSetter
            key={gameName}
            current={gameName}
            setGameName={handleGameNameChange}
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
