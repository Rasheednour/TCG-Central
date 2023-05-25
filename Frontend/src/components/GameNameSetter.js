import React from "react";
import { Button, Box, Grid, TextField, Input } from "@mui/material";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "./styles/GameNameSetter.css";

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
    <div className="GameNameSetter">
      <div className="title">
        <h1>Game Info</h1>
      </div>
      <div className="game-info-cells">
        <div className="left-column">
          <div className="game-name">
            <div id="current-name-display" className="name-display">
              <h3>{gameNameProp}</h3>
            </div>
            <div className="game-name-form">
              <form onSubmit={updateName}>
                <TextField
                  id="game-name-input"
                  label={"Game Title"}
                  defaultValue={gameNameProp}
                  variant="outlined"
                />
                <Button variant="contained" onClick={updateName}>
                  Update Title
                </Button>
              </form>
            </div>
          </div>
          <div className="game-description">
            <div id="current-desc" className="current-desc">
              <p> {gameDesc}</p>
            </div>
            <div className="game-desc-form">
              <TextField
                id={"game-desc-value"}
                label={"Game Description"}
                multiline
                rows={2}
                defaultValue={gameDesc || ""}
                variant="outlined"
                className="desc-input"
              ></TextField>
              <Button variant="contained" onClick={updateDesc}>
                Update Description
              </Button>
            </div>
          </div>
        </div>
        <div className="right-column">
          <div className="game-image">
            <Box
              component="img"
              sx={{
                height: 500,
                width: 400,
              }}
              id="displayed-game-image"
              alt="The image for your game."
              src={gameImage || DEFAULT_IMAGE}
            />
            <form onSubmit={uploadImage}>
              <TextField
                type="file"
                accept=".png, .jpg, .jpeg"
                variant="outlined"
                onChange={(event) => {
                  setImageFile(event.target.files[0]);
                }}
              />
              <Button variant="contained" onClick={uploadImage}>
                Upload Game Cover Image
              </Button>
            </form>
          </div>
        </div>
        
      </div>
      <hr></hr>
    </div>
    
  );
}
