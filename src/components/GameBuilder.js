// Game Builder component: contains the interface for building a game
// Can be used to build a new game or to modify an existing game

import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";

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
  const [effects, setEffects] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [gameRules, setGameRules] = useState({});
  const [gameCharacters, setGameCharacters] = useState([]);
  const [gameName, setGameName] = useState("");
  const [id, setId] = useState(gameId.gameId || "");
  const [setupDone, setSetupDone] = useState(false);
  //console.log("game builder is called, game id is", gameId, id);

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
      let loadeffects = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        "/effects"
      ).catch((err) => {
        console.log(`error fetching effects: ${err}`);
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
      }
      setEffects(loadeffects);
      console.log("about to set rules to:", loadrules);
      setRules(loadrules.slice());
      console.log("rules now are:", rules);
      setAbilities(loadabilities);
      setSetupDone(true);
      //console.log("here's what rules looks like:", rules);
    }
    if (!setupDone) {
      fetchData().catch(console.error);
    }
    console.log("rules currently are:", rules);
  }, [rules, effects, abilities, setupDone]);

  return (
    <div>
      <Container>
        <Stack direction="column" spacing={2}>
          <RuleSetter
            theRules={rules}
            setGameRules={setGameRules}
            key={rules[0].name}
          ></RuleSetter>
        </Stack>
      </Container>
    </div>
  );
}
