import "./styles/SignUpPage.css";
import TopRibbon from "../components/TopRibbon.js";
import EnemyCard from "../components/EnemyCard";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useLocation, useParams } from "react-router-dom";
import { CONFIG } from "../config";
import getAllFetch from "../utils/getAllFetch";
import {
  Button,
  Container,
  Stack,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import CreatureCard from "../components/CreatureCard";
import SpellCard from "../components/SpellCard";

export default function CardEditorPage() {
  const BACKEND_CODE = CONFIG.BACKEND_CODE;
  const BACKEND_URL = CONFIG.BACKEND_URL;
  const ACCESS_TOKEN = CONFIG.ACCESS_TOKEN;
  const DEFAULT_CARD = CONFIG.DEFAULT_CARD;
  const DEFAULT_ENEMY = CONFIG.DEFAULT_ENEMY;
  const availTypeDesk = {
    DEFAULT:
      "All default cards that are eligible for a player deck will populate their min number in generated decks, then function like commons",
    COMMON: "Common cards appear more frequently in decks",
    RARE: "Rare cards appear less frequently in decks",
  };

  let navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); //params.game_id is the game's id
  const [pageType, setPageType] = useState(location.pathname.split("/")[1]);
  const [info, setInfo] = useState({});
  const [notLoaded, setNotLoaded] = useState(true);
  const [triggerSave, setTriggerSave] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function getCardInfo() {
      let path_params = location.pathname.split("/");
      if (path_params[3] != "new") {
        let loadInfo = await getAllFetch(
          BACKEND_URL,
          BACKEND_CODE,
          ACCESS_TOKEN,
          `/${path_params[1]}/${path_params[3]}`
        ).catch((err) => {
          console.log(`error fetching cards/enemies for game: ${err}`);
        });
        setInfo(loadInfo);
      } else {
        setInfo(pageType == "enemies" ? DEFAULT_ENEMY : DEFAULT_CARD);
      }
    }
    if (notLoaded) {
      getCardInfo().catch(console.log);
      setNotLoaded(false);
    }
  }, [notLoaded, info, pageType]);

  useEffect(() => {
    let saveInfo = async () => {
      let groomed_info = info;
      console.log("groomed card before grooming", groomed_info);
      if (!groomed_info["game_ids"].includes(location.pathname.split("/")[2])) {
        groomed_info["game_ids"].push(location.pathname.split("/")[2]);
      }
      await fetch(
        BACKEND_URL + `/games/${location.pathname.split("/")[2]}/${pageType}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + ACCESS_TOKEN,
          },
          method: "POST",
          body: JSON.stringify(groomed_info),
        }
      )
        .then((res) => {
          if (res.status < 300) {
            return res.json();
          } else {
            console.log(`error in posting update`, res.status, res.json());
            return {};
          }
        })
        .then((data) => {
          if (
            !((pageType == "cards" ? "card_id" : "enemy_id") in groomed_info)
          ) {
            groomed_info[pageType == "cards" ? "card_id" : "enemy_id"] =
              data[pageType == "cards" ? "card_id" : "enemy_id"];
          }
          setInfo(groomed_info);
        });
    };
    if (triggerSave) {
      setTriggerSave(false);
      saveInfo();
    }
  }, [info, triggerSave]);

  function setGameImage(url) {
    let cop = JSON.parse(JSON.stringify(info));
    cop["image"] = url;
    setInfo(cop);
  }

  // handle image upload to Firebase
  const uploadImage = () => {
    if (imageFile == null) return;
    // specify the image file name and storage folder location
    const imageRef = ref(storage, `card_images/${imageFile.name + v4()}`);
    // start image upload
    uploadBytes(imageRef, imageFile).then((snapshot) => {
      // get the image's public URL
      getDownloadURL(imageRef).then((downloadURL) => {
        setGameImage(downloadURL);
      });
    });
  };

  const saveInfo = (infoObj) => {
    console.log("setting info to", infoObj);
    setInfo(infoObj);
    setTriggerSave(true);
  };

  const updateInfo = (infoObj) => {
    setInfo(infoObj);
  };

  function renderStats() {
    if (
      (pageType == "cards" && info["type"] == "CREATURE") ||
      pageType == "enemies"
    ) {
      return (
        <div>
          <Box padding={1}>
            <FormControl fullWidth>
              <InputLabel id="card-attack-simple-select-label" shrink>
                Attack
              </InputLabel>
              <TextField
                name={"attack-stat-value"}
                //labelId="card-attack-simple-select-label"
                variant="outlined"
                id={"attack-stat-value"}
                type={"number"}
                onChange={(event) => {
                  let newVal = event.target.value < 0 ? 0 : event.target.value;
                  let cop = JSON.parse(JSON.stringify(info));
                  cop["attack"] = newVal;
                  setInfo(cop);
                }}
                value={info["attack"]}
              />
            </FormControl>
          </Box>
          <Box padding={1}>
            <FormControl fullWidth>
              <InputLabel id="card-defense-simple-select-label" shrink>
                Defense
              </InputLabel>
              <TextField
                name={"defense-stat-value"}
                //labelId="card-defense-simple-select-label"
                variant="outlined"
                id={"defense-stat-value"}
                type={"number"}
                onChange={(event) => {
                  let newVal = event.target.value < 0 ? 0 : event.target.value;
                  let cop = JSON.parse(JSON.stringify(info));
                  cop["defense"] = newVal;
                  setInfo(cop);
                }}
                value={info["defense"]}
              />
            </FormControl>
          </Box>
          <Box padding={1}>
            <FormControl fullWidth>
              <InputLabel id="card-health-simple-select-label" shrink>
                Health
              </InputLabel>
              <TextField
                name={"health-stat-value"}
                //labelId="card-health-simple-select-label"
                variant="outlined"
                id={"health-stat-value"}
                type={"number"}
                onChange={(event) => {
                  let newVal = event.target.value < 0 ? 0 : event.target.value;
                  let cop = JSON.parse(JSON.stringify(info));
                  cop["health"] = newVal;
                  setInfo(cop);
                }}
                value={info["health"]}
              />
            </FormControl>
          </Box>
        </div>
      );
    }
  }

  return (
    <div className="CardEditorPage">
      <TopRibbon />
      <h1>
        Editting {pageType == "cards" && "Card"}
        {pageType == "enemies" && "Enemy"}
        <Container sx={{ width: 4 / 7 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate(
                `/${location.pathname.split("/")[1]}/${
                  location.pathname.split("/")[2]
                }`
              );
            }}
            fullWidth
          >
            Return to {pageType == "cards" ? "Card" : "Enemy"} List
          </Button>
        </Container>
      </h1>

      <div className="cards-body" style={{ display: "flex", flexFlow: "wrap" }}>
        <Grid container>
          <Grid item xs>
            <div>
              <h1>
                <Container sx={{ width: 4 / 7 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      saveInfo(info);
                    }}
                    fullWidth
                  >
                    SAVE {pageType == "cards" ? "CARD" : "ENEMY"}
                  </Button>
                </Container>
              </h1>
              <Box padding={1}>
                <FormControl fullWidth>
                  <InputLabel id="card-name-simple-select-label" shrink>
                    {pageType == "cards" ? "Card" : "Enemy"} Name
                  </InputLabel>
                  <TextField
                    id="card-name-editor"
                    //labelId="card-name-simple-select-label"
                    value={info["name"]}
                    variant="outlined"
                    onChange={(e) => {
                      let val = e.target.value;
                      let copyInfo = JSON.parse(JSON.stringify(info));
                      copyInfo["name"] = val;
                      setInfo(copyInfo);
                    }}
                  ></TextField>
                </FormControl>
              </Box>
              {pageType == "cards" && (
                <Box padding={1}>
                  <FormControl fullWidth>
                    <InputLabel id="card-type-simple-select-label">
                      Card Type
                    </InputLabel>
                    <Select
                      //labelId="card-type-simple-select-label"
                      id="card-type-simple-select"
                      value={info["type"] || "CREATURE"}
                      label="Card Type"
                      onChange={(e) => {
                        let val = e.target.value;
                        let cop = JSON.parse(JSON.stringify(info));
                        cop["type"] = val;
                        setInfo(cop);
                      }}
                    >
                      <MenuItem value={"CREATURE"}>Creature</MenuItem>
                      <MenuItem value={"SPELL"}>Spell</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
              {renderStats()}
            </div>
          </Grid>
          <Grid item xs>
            {pageType == "enemies" && (
              <EnemyCard
                domId={`id-enemy-card-${info.enemy_id}`}
                key={`enemy-${info.enemy_id}`}
                title={info.name}
                level={info.level}
                image={info.image}
                backgroundColor={info.color || "purple"}
                description={info.description}
                effect={info.effect || "None"}
                stats={[info.attack, info.defense, info.health]}
              />
            )}
            {pageType == "cards" && info.type == "CREATURE" && (
              <CreatureCard
                domId={`id-card-${info.card_id}`}
                key={`card-${info.card_id}`}
                title={info.name}
                cost={info.cost}
                type={info.type}
                image={info.image_url || info.image}
                backgroundColor={info.color || "blue"}
                description={info.description}
                effect={
                  info.effect && info.effect.length > 0 ? info.effect : ["None"]
                }
                stats={[info["attack"], info["defense"], info["health"]]}
              />
            )}
            {pageType == "cards" && info.type == "SPELL" && (
              <SpellCard
                domId={`id-spell-card-${info.card_id}`}
                key={`card-spell-${info.card_id}`}
                title={info.name}
                cost={info.cost}
                type={info.type}
                image={info.image_url || info.image}
                backgroundColor={info.color || "blue"}
                description={info.description}
                effect={
                  info.effect && info.effect.length > 0 ? info.effect : ["None"]
                }
              />
            )}
          </Grid>
          <Grid item xs>
            {pageType == "cards" && (
              <Box padding={1}>
                <FormControl fullWidth>
                  <InputLabel id="card-cost-simple-select-label" shrink>
                    Cost
                  </InputLabel>
                  <TextField
                    name={"cost-stat-value"}
                    //labelId="card-cost-simple-select-label"
                    variant="outlined"
                    id={"cost-stat-value"}
                    type={"number"}
                    onChange={(event) => {
                      let newVal =
                        event.target.value < 0 ? 0 : event.target.value;
                      let cop = JSON.parse(JSON.stringify(info));
                      cop["cost"] = newVal;
                      setInfo(cop);
                    }}
                    value={info["cost"]}
                  />
                </FormControl>
              </Box>
            )}
            {pageType == "enemies" && (
              <Box padding={1}>
                <FormControl fullWidth>
                  <InputLabel id="card-level-simple-select-label" shrink>
                    Level
                  </InputLabel>
                  <TextField
                    name={"level-stat-value"}
                    //labelId="card-cost-simple-select-label"
                    variant="outlined"
                    id={"cost-level-value"}
                    type={"number"}
                    onChange={(event) => {
                      let newVal =
                        event.target.value < 0 ? 0 : event.target.value;
                      let cop = JSON.parse(JSON.stringify(info));
                      cop["level"] = newVal;
                      setInfo(cop);
                    }}
                    value={info["level"]}
                  />
                </FormControl>
              </Box>
            )}
            <Box padding={1}>
              <FormControl fullWidth>
                <InputLabel id="card-description-simple-select-label" shrink>
                  {pageType == "cards" ? "Card" : "Enemy"} Description
                </InputLabel>
                <TextField
                  id="card-description-editor"
                  //labelId="card-description-simple-select-label"
                  value={info["description"]}
                  variant="outlined"
                  multiline
                  onChange={(e) => {
                    let val = e.target.value;
                    let copyInfo = JSON.parse(JSON.stringify(info));
                    copyInfo["description"] = val;
                    setInfo(copyInfo);
                  }}
                ></TextField>
              </FormControl>
            </Box>
            <Box padding={1}>
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
            </Box>
            {pageType == "cards" && (
              <Box padding={1}>
                <h3>Card Availability</h3>
                <Tooltip
                  placement="top"
                  title={
                    availTypeDesk[
                      (info["availability"] || "DEFAULT_1_1").split("_")[0]
                    ]
                  }
                >
                  <FormControl fullWidth>
                    <InputLabel id="card-availability-simple-select-label">
                      Availability Type
                    </InputLabel>
                    <Select
                      //labelId="card-availability-simple-select-label"
                      id="card-type-simple-select"
                      value={
                        (info["availability"] || "DEFAULT_1_1").split("_")[0]
                      }
                      label="Availability Type"
                      onChange={(e) => {
                        let avail_set = info["availability"].split("_");
                        let val =
                          e.target.value + "_" + avail_set.slice(1).join("_");
                        console.log("new val of avail", val);
                        let cop = JSON.parse(JSON.stringify(info));
                        cop["availability"] = val;
                        setInfo(cop);
                      }}
                    >
                      <MenuItem value={"DEFAULT"}>Default</MenuItem>
                      <MenuItem value={"COMMON"}>Common</MenuItem>
                      <MenuItem value={"RARE"}>Rare</MenuItem>
                    </Select>
                  </FormControl>
                </Tooltip>
              </Box>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
