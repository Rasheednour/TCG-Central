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
  gameImage,
  setGameImage,
}) {
  const DEFAULT_IMAGE =
    "https://tcg-maker-frontend-123.uc.r.appspot.com/static/media/cover1.5a4e4b1dc837f8ce878b.png";
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
          <form onSubmit={updateName}>
            <label>
              New Name:
              <input type="text" id="game-name-input">
                {/* {current} */}
              </input>
            </label>
            <Button variant="contained" onClick={updateName}>
              Update Name
            </Button>
          </form>
        </div>
      </Grid>
      <Grid item xs={4}>
        Game Description:
        <br /> <span id="current-desc">{gameDesc}</span>
        <br />
        <TextField
          id={"game-desc-value"}
          label={"Game Description"}
          multiline
          defaultValue={gameDesc || ""}
          variant="outlined"
        ></TextField>
        <Button variant="contained" onClick={updateDesc}>
          Update Description
        </Button>
      </Grid>
      <Grid item xs={4}>
        Game Profile Image:
        <br />
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt="The image for your game."
          src={gameImage || DEFAULT_IMAGE}
        />
        <br />
        <TextField
          id={"game-iamge-value"}
          label={"Game Image URL"}
          multiline
          defaultValue={gameImage || DEFAULT_IMAGE}
          variant="outlined"
        ></TextField>
      </Grid>
    </Grid>
  );
}
