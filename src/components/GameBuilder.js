// Game Builder component: contains the interface for building a game
// Can be used to build a new game or to modify an existing game

import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import "./styles/GameSummary.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";

// TODO: make this value come from a config, rather than hardcoded
const BACKEND_URL = "https://tcgbackend-s2kqyb5vna-wl.a.run.app";
const BACKEND_CODE = "tcgadmin";
const ACCESS_TOKEN = null;

// function GameSummary({title, creator, description}) {
//   return (
//     <div className="GameSummary">
//         <div className='cover-image'>
//             <img src={cover} width="400" height="500" alt='game cover logo'/>
//         </div>

//         <div className='right-panel'>
//             <h1>{title}</h1>
//             <h2>Created by: {creator}</h2>
//             <p>{description}</p>
//             <div className='card-samples'>

//             </div>
//         </div>

//     </div>
//   );
// }

export default function GameBuilder(gameId) {
  const [rules, setRules] = useState([]);
  const [effects, setEffects] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [gameRules, setGameRules] = useState({});
  const [gameCharacters, setGameCharacters] = useState([]);
  const [gameName, setGameName] = useState("");
  const [id, setId] = useState(gameId.gameId || "");
  //console.log("game builder is called, game id is", gameId, id);

  useEffect(() => {
    console.log("calling setup useeffect");
    async function fetchData() {
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
      if (id) {
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
      setRules(loadrules);
      setAbilities(loadabilities);
      //console.log("here's what rules looks like:", rules);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Container>
        <Stack direction="column" spacing={2}>
          <RuleSetter theRules={rules}></RuleSetter>
        </Stack>
      </Container>
    </div>
  );
}
