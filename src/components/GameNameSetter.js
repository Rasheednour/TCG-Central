import React from "react";
import { Button, Box, Grid, TextField, Input } from "@mui/material";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function GameNameSetter({
  gameNameProp,
  setGameName,
  gameDesc,
  setGameDesc,
  gameImage,
  setGameImage,
  imageFile,
  setImageFile,
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

  // handle image upload to Firebase
  const uploadImage = () => {
    if (imageFile == null) return;
    // specify the image file name and storage folder location
    const imageRef = ref(storage, `game_covers/${imageFile.name + v4()}`);
    // start image upload
    uploadBytes(imageRef, imageFile).then((snapshot) => {
      // get the image's public URL
      getDownloadURL(imageRef).then((downloadURL) => {
        setGameImage(downloadURL);
      });
    });
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <h3>
          Game Name: <div id="current-name-display">{gameNameProp}</div>
        </h3>
        <div>
          <form onSubmit={updateName}>
            <TextField
              id="game-name-input"
              label={"New Name"}
              defaultValue={gameNameProp}
              variant="outlined"
            />
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
          rows={2}
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
          id="displayed-game-image"
          alt="The image for your game."
          src={gameImage || DEFAULT_IMAGE}
        />
        <br />
        <form onSubmit={uploadImage}>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(event) => {
              setImageFile(event.target.files[0]);
            }}
          />
          <Button variant="contained" onClick={uploadImage}>
            Upload Image
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
