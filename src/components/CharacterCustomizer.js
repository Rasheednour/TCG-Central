import React from "react";
import { Button, Box, Stack, TextField, Tooltip } from "@mui/material";

export default function CharacterCustomizer({
  characters,
  setCharacters,
  abilities,
}) {
  function convertNameDisplay(allCaps) {
    let subStrs = allCaps.split(" ");
    let res = "";
    for (let i = 0; i < subStrs.length; i++) {
      res =
        res +
        " " +
        subStrs[i].charAt(0).toUpperCase() +
        subStrs[i].slice(1).toLowerCase();
    }
    return res.slice(1);
  }
  function grabCharState(skip = -1) {
    let char_copy = [];

    for (let i = 0; i < characters.length; i++) {
      if (i !== skip - 1) {
        char_copy.push({
          name: document
            .getElementById(
              "character-value-" +
                (i + 1) +
                characters[i].name.split(" ").join("")
            )
            .value.toUpperCase(),
          attack: parseInt(
            document.getElementById(
              "character-attack-" +
                (i + 1) +
                characters[i].name.split(" ").join("")
            ).value
          ),
          health_mod: parseInt(
            document.getElementById(
              "character-health-" +
                (i + 1) +
                characters[i].name.split(" ").join("")
            ).value
          ),
          defense: parseInt(
            document.getElementById(
              "character-defense-" +
                (i + 1) +
                characters[i].name.split(" ").join("")
            ).value
          ),
        });
      }
    }

    return char_copy;
  }

  function updateCharDetail() {
    let char_copy = grabCharState();
    setCharacters(char_copy);
  }

  function deleteChar(charNum) {
    let char_copy = grabCharState(parseInt(charNum));
    setCharacters(char_copy);
  }

  function addNewChar() {
    let char_copy = grabCharState();
    char_copy.push({ name: "NEWBIE" });
    setCharacters(char_copy);
  }

  function fillCharacters() {
    if (characters && characters.length > 0) {
      let char_items = [];
      let inputTracker = [];
      for (let i = 0; i < characters.length; i++) {
        inputTracker.push(characters[i].name);
        char_items.push(
          <Stack
            direction="column"
            key={characters[i].name.split(" ").join("") + i}
          >
            <Box padding={2}>
              <TextField
                id={
                  "character-value-" +
                  (i + 1) +
                  characters[i].name.split(" ").join("")
                }
                label={"Character Name"}
                inputProps={{ maxLength: 42 }}
                defaultValue={convertNameDisplay(characters[i].name)}
                variant="outlined"
              />
            </Box>
            <Box>
              <Tooltip title="Amount that characters health differs from standard health for game (can be positive or negative)">
                <TextField
                  name={"Health Modifier"}
                  label={"Character Health Modifier"}
                  variant="outlined"
                  id={
                    "character-health-" +
                    (i + 1) +
                    characters[i].name.split(" ").join("")
                  }
                  type={"number"}
                  onChange={() => {
                    updateCharDetail();
                  }}
                  //   onChange={(event) =>
                  //     event.target.value < 0
                  //       ? (event.target.value = 0)
                  //       : event.target.value
                  //   }
                  defaultValue={parseInt(characters[i].health_mod || 0)}
                />
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title="Amount of damage character can do as an 'attack' action">
                <TextField
                  name={"Attack Modifier"}
                  label={"Character Attack Modifier"}
                  variant="outlined"
                  id={
                    "character-attack-" +
                    (i + 1) +
                    characters[i].name.split(" ").join("")
                  }
                  type={"number"}
                  onChange={(event) => {
                    updateCharDetail();
                    return event.target.value < 0
                      ? (event.target.value = 0)
                      : event.target.value;
                  }}
                  defaultValue={parseInt(characters[i].attack || 0)}
                />
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title="Amount that incoming damage to character is reduced">
                <TextField
                  name={"Defense Modifier"}
                  label={"Character Defense Modifier"}
                  variant="outlined"
                  id={
                    "character-defense-" +
                    (i + 1) +
                    characters[i].name.split(" ").join("")
                  }
                  type={"number"}
                  onChange={() => {
                    updateCharDetail();
                  }}
                  defaultValue={parseInt(characters[i].defense || 0)}
                />
              </Tooltip>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  let target = i + 1;
                  deleteChar(target);
                }}
              >
                Delete {characters[i].name}
              </Button>
            </Box>
          </Stack>
        );
      }
      return char_items;
    }
  }

  return (
    <Stack direction="row">
      {fillCharacters()}
      <Button variant="contained" color="success" onClick={addNewChar}>
        Add New Character
      </Button>
    </Stack>
  );
}
