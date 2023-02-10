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

export default function GameNameSetter({ current, setGameName }) {
  //const { name, setName } = useState(current);
  //console.log("set game name is:", setGameName, "and current is", current);
  function updateName(event) {
    let new_name = document.getElementById("game-name-input").value;
    // console.log("updating game name to: ", new_name);
    document.getElementById("current-name-display").textContent = new_name;
    setGameName(new_name);
  }

  return (
    <Grid container>
      <Grid item>
        <h3>
          Game Name: <div id="current-name-display">{current}</div>
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
    </Grid>
  );
}
