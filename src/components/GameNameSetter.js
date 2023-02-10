import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Select,
  TextField,
} from "@mui/material";

export default function GameNameSetter({
  gameNameProp,
  setGameName,
  gameDesc,
  setGameDesc,
}) {
  //const { name, setName } = useState(current);
  //console.log("set game name is:", setGameName, "and current is", current);
  function updateName(event) {
    let new_name = document.getElementById("game-name-input").value;
    // console.log("updating game name to: ", new_name);
    document.getElementById("current-name-display").textContent = new_name;
    setGameName(new_name);
  }
  function updateDesc(event) {
    let new_desc = document.getElementById("game-desc-value").value;
    // console.log("updating game name to: ", new_name);
    document.getElementById("current-desc").textContent = new_desc;
    setGameDesc(new_desc);
  }
  console.log("game name current is", gameNameProp);

  return (
    <Grid container>
      <Grid item xs={4}>
        <h3>
          Game Name: <div id="current-name-display">{gameNameProp}</div>
        </h3>
        <div>
          <label>
            New Name:
            <input type="text" id="game-name-input">
              {/* {current} */}
            </input>
          </label>
          <button onClick={updateName}>Update Name</button>
        </div>
      </Grid>
      <Grid item xs={4}>
        Game Description:
        <br /> <span id="current-desc">{gameDesc}</span>
        <TextField
          id={"game-desc-value"}
          label={"Game Description"}
          defaultValue={gameDesc || ""}
          variant="outlined"
        ></TextField>
        <Button variant="contained" onClick={updateDesc}>
          Update Description
        </Button>
      </Grid>
    </Grid>
  );
}
