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
import { ChromePicker } from "react-color";

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
import effectDescGen from "../utils/effectDescGen";
import { bgcolor } from "@mui/system";

export default function CardEditorPage() {
  const BACKEND_CODE = CONFIG.BACKEND_CODE;
  const BACKEND_URL = CONFIG.BACKEND_URL;
  const ACCESS_TOKEN = CONFIG.ACCESS_TOKEN;
  const DEFAULT_CARD = CONFIG.DEFAULT_CARD;
  const DEFAULT_ENEMY = CONFIG.DEFAULT_ENEMY;
  const availTypeDesk = {
    DEFAULT:
      "All default cards that are eligible for a player deck will populate at least their min number in generated decks",
    COMMON: "Common cards appear more frequently in decks",
    RARE: "Rare cards appear less frequently in decks",
  };
  const triggerDisc = {
    SUMMON: "Effect activates when card is played",
    ACTIVATE:
      "Effect can be triggered once per turn (spell's with activate effects remain in play until destroyed)",
    DEATH: "Effect triggers when this card leaves play",
    LINGER:
      "Effect is active as long as card remains in play (spells with linger remain in play until destroyed)",
    TRIGGER: "Effect is activated but certain action or event taking place",
  };
  const targetDesc = {
    SELF: "targets the player if a SPELL, targets the creature whose effect it is if a CREATURE",
    TARGET: "user picks target of any enemy, creature or player",
    ENEMIES: "effect happens to all enemies",
    CREATURES: "effect happens to all creatures the player controls",
    BOARD: "effect happens to all creatures and enemies",
    ALL: "effect happens to all creatures and enemies and to the player",
    PLAYER: "targets the player, only used for creatures",
    CREATURE: "single creature target",
    SPELL:
      "single spell target (only effects ACTIVATE type spells which remain on the board)",
    ENEMY: "single enemy",
    CARD: "means spell or creature (but not player or enemy)",
  };

  let navigate = useNavigate();
  const location = useLocation();
  const params = useParams(); //params.game_id is the game's id
  const [pageType, setPageType] = useState(location.pathname.split("/")[1]);
  const [info, setInfo] = useState({});
  const [notLoaded, setNotLoaded] = useState(true);
  const [triggerSave, setTriggerSave] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [game, setGame] = useState({});
  const [effects, setEffects] = useState([]);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleSaveColor = () => {
    setShowColorPicker(!showColorPicker);
    let cop = JSON.parse(JSON.stringify(info));
    cop["color"] = color;
    setInfo(cop);
  };

  function genTypeText(card) {
    let type = card.type;
    if (card.availability) {
      let av_ar = card.availability.split("_");
      if (av_ar.length > 3) {
        type = type + " - " + charName(av_ar[3]);
      }
    }
    return type;
  }

  function charName(charId) {
    if (game["characters"]) {
      for (let i = 0; i < game["characters"].length; i++) {
        if (game.characters[i]["id"] == charId) {
          return game.characters[i]["name"];
        }
      }
      return "CARD ASSIGNED TO NULL CHAR";
    }
    return "";
  }

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
    async function getEffects() {
      let loadEffs = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        "/effects"
      ).catch((err) => {
        console.log(`error fetching effects: ${err}`);
      });
      setEffects(loadEffs);
    }
    async function getGameInfo() {
      let path_params = location.pathname.split("/");

      let loadInfo = await getAllFetch(
        BACKEND_URL,
        BACKEND_CODE,
        ACCESS_TOKEN,
        `/games/${path_params[2]}`
      ).catch((err) => {
        console.log(`error fetching game: ${err}`);
      });
      setGame(loadInfo);
    }
    if (notLoaded) {
      getCardInfo().catch(console.log);
      getEffects().catch(console.log);
      getGameInfo().catch(console.log);

      setNotLoaded(false);
    }
  }, [notLoaded, info, pageType, game]);

  useEffect(() => {
    let saveInfo = async () => {
      let groomed_info = info;
      //console.log("groomed card before grooming", groomed_info);
      if (!groomed_info["game_ids"].includes(location.pathname.split("/")[2])) {
        groomed_info["game_ids"].push(location.pathname.split("/")[2]);
      }
      groomed_info["effect_description"] = generateEffectText(
        groomed_info.effect || []
      );
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

  function allValidEffects() {
    return effects.map((eff) => {
      if (
        eff["card_types"].includes(pageType == "cards" ? info["type"] : "ENEMY")
      ) {
        return <MenuItem value={eff["name"]}>{eff["name"]}</MenuItem>;
      }
    });
  }

  function allValidTriggers(cur_effect) {
    // for (let i = 0; i < info.effect.length; i++) {
    //   if (info.effect[i] == cur_effect) {
    if (effects.length > 0) {
      let an_effect =
        effects[
          effects.findIndex((ef) => ef["name"] == cur_effect.split("_")[1])
        ];
      //console.log("generating types for", an_effect, info, cur_effect, effects);
      return an_effect["effect_types"].map((typ) => {
        return <MenuItem value={typ}>{typ}</MenuItem>;
      });
    }
    //   }
    // }
  }

  function generateEffectText(effect_arr) {
    let effect_text = [];
    for (let i = 0; i < effect_arr.length; i++) {
      let eff_tex = effect_arr[i];
      let splitted = eff_tex.split("_");
      if (effects.length > 0) {
        let full_desc =
          effects[effects.findIndex((ef) => ef["name"] == splitted[1])][
            "effect_description"
          ];
        eff_tex = effectDescGen(info, full_desc, eff_tex);
      }
      if (!eff_tex.endsWith(".")) {
        eff_tex = eff_tex + ".";
      }
      effect_text.push(eff_tex);
    }
    return "" + effect_text.join("\n");
  }

  function deleteEffect(eff_text) {
    let cop = JSON.parse(JSON.stringify(info));
    let new_effects = [];
    let deleted = false;
    for (let i = 0; i < cop["effect"].length; i++) {
      if (cop["effect"][i] != eff_text || deleted == true) {
        new_effects.push(cop["effect"][i]);
      }
      if (cop["effect"][i] == eff_text) {
        deleted = true;
      }
    }
    cop["effect"] = new_effects;
    setInfo(cop);
  }

  function fillCurrentEffects() {
    if (info["effect"]) {
      return info["effect"].map((eff) => {
        let effid = eff + "]" + Math.floor(Math.random() * 1000);
        let effect_info =
          effects.length > 0
            ? effects[
                effects.findIndex((ef) => ef["name"] == eff.split("_")[1])
              ]
            : false;
        let splitted_eff = eff.split("_");
        return (
          <Stack
            direction="column"
            key={"effect-" + eff + Math.floor(Math.random() * 300)}
          >
            <Box>
              <Tooltip
                title={
                  effects.length > 0
                    ? effects[
                        effects.findIndex(
                          (ef) => ef["name"] == eff.split("_")[1]
                        )
                      ]["builder_description"]
                    : "Loading..."
                }
                placement="right"
              >
                <FormControl fullWidth>
                  <InputLabel id={`type-select-${effid}`}>
                    Effect Type
                  </InputLabel>
                  <Select
                    id={`${effid}-type`}
                    defaultValue={eff.split("_")[1]}
                    label="Effect Type"
                    onChange={(e) => {
                      let val = e.target.value;
                      let cop = JSON.parse(JSON.stringify(info));
                      for (let i = 0; i < cop["effect"].length; i++) {
                        if (eff == cop["effect"][i]) {
                          let splitted = cop["effect"][i].split("_");
                          cop["effect"][i] =
                            splitted[0] +
                            "_" +
                            val +
                            "_" +
                            splitted.slice(2).join("_");
                        }
                      }
                      setInfo(cop);
                    }}
                  >
                    {allValidEffects()}
                  </Select>
                </FormControl>
              </Tooltip>
            </Box>
            <Box>
              <Tooltip placement="right" title={triggerDisc[eff.split("_")[0]]}>
                <FormControl fullWidth>
                  <InputLabel id={`trigger-select-${effid}`}>
                    Trigger
                  </InputLabel>
                  <Select
                    id={`${effid}-trigger`}
                    label="Trigger"
                    defaultValue={eff.split("_")[0]}
                    onChange={(e) => {
                      let val = e.target.value;
                      let cop = JSON.parse(JSON.stringify(info));
                      for (let i = 0; i < cop["effect"].length; i++) {
                        if (eff == cop["effect"][i]) {
                          let splitted = cop["effect"][i].split("_");
                          cop["effect"][i] =
                            val + "_" + splitted.slice(1).join("_");
                        }
                      }
                      setInfo(cop);
                    }}
                  >
                    {allValidTriggers(eff)}
                  </Select>
                </FormControl>
              </Tooltip>
            </Box>
            {effect_info && effect_info["value_type"] != "NONE" && (
              <Box>
                <Tooltip
                  title={effect_info["value_description"]}
                  placement="right"
                >
                  <FormControl fullWidth>
                    <InputLabel id={`${effid}-value`} shrink>
                      Value
                    </InputLabel>
                    <TextField
                      name={"effect-value"}
                      //labelId="card-cost-simple-select-label"
                      variant="outlined"
                      id={`${effid}-effect-value`}
                      type={"number"}
                      onChange={(event) => {
                        let newVal =
                          event.target.value < 0 ? 0 : event.target.value;
                        let cop = JSON.parse(JSON.stringify(info));
                        for (let i = 0; i < cop["effect"].length; i++) {
                          if (eff == cop["effect"][i]) {
                            let splitted = cop["effect"][i].split("_");
                            let val =
                              splitted.slice(0, 2).join("_") + "_" + newVal;
                            if (splitted.length > 3) {
                              val = val + "_" + splitted.slice(3).join("_");
                            }
                            cop["effect"][i] = val;
                          }
                        }
                        setInfo(cop);
                      }}
                      value={splitted_eff[2]}
                    />
                  </FormControl>
                </Tooltip>
              </Box>
            )}
            <Box>
              <Tooltip title={targetDesc[splitted_eff[3]]} placement="right">
                <FormControl fullWidth>
                  <InputLabel id={`trigger-select-${effid}`}>
                    Effect Target
                  </InputLabel>
                  <Select
                    id={`${effid}-target`}
                    label="Effect Target"
                    defaultValue={splitted_eff[3]}
                    onChange={(e) => {
                      let val = e.target.value;
                      let cop = JSON.parse(JSON.stringify(info));
                      let new_eff =
                        splitted_eff.slice(0, 3).join("_") + "_" + val;

                      if (splitted_eff.length > 4) {
                        new_eff =
                          new_eff + "_" + splitted_eff.slice(4).join("_");
                      }
                      //   }
                      // }
                      for (let i = 0; i < cop["effect"].length; i++) {
                        if (eff == cop["effect"][i]) {
                          cop["effect"][i] = new_eff;
                        }
                      }
                      setInfo(cop);
                    }}
                  >
                    {effect_info &&
                      effect_info["valid_target"].map((v) => {
                        return <MenuItem value={v}>{v}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Tooltip>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  deleteEffect(eff);
                }}
              >
                Delete Effect
              </Button>
            </Box>
          </Stack>
        );
      });
    }
  }

  function addNewEffect() {
    console.log("add an effect");
    let cop = JSON.parse(JSON.stringify(info));
    if (!cop["effect"]) {
      cop["effect"] = [];
    }
    cop["effect"].push(`SUMMON_HEAL_${Math.floor(Math.random() * 100)}_TARGET`);
    setInfo(cop);
  }

  function renderEffects() {
    return (
      <Box padding={1}>
        <h3>{pageType == "cards" ? "Card" : "Enemy"} Effects</h3>
        <Stack direction="row">
          {fillCurrentEffects()}
          <Button variant="contained" color="success" onClick={addNewEffect}>
            Add New Effect
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <div className="CardEditorPage">
      <TopRibbon />
      <h1>
        Editing {pageType == "cards" && "Card"}
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
                effect={generateEffectText(info.effect || [])}
                stats={[info.attack, info.defense, info.health]}
              />
            )}
            {pageType == "cards" && info.type == "CREATURE" && (
              <CreatureCard
                domId={`id-card-${info.card_id}`}
                key={`card-${info.card_id}`}
                title={info.name}
                cost={info.cost}
                type={genTypeText(info)}
                image={info.image || info.image_url}
                backgroundColor={info.color || "blue"}
                description={info.description}
                effect={generateEffectText(info.effect || [])}
                stats={[info["attack"], info["defense"], info["health"]]}
              />
            )}
            {pageType == "cards" && info.type == "SPELL" && (
              <SpellCard
                domId={`id-spell-card-${info.card_id}`}
                key={`card-spell-${info.card_id}`}
                title={info.name}
                cost={info.cost}
                type={genTypeText(info)}
                image={info.image || info.image_url}
                backgroundColor={info.color || "blue"}
                description={info.description}
                effect={generateEffectText(info.effect || [])}
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
            <Box padding={1}>
              <Button
                sx={{ bgcolor: "orange", color: "black" }}
                variant="contained"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                Change Card Color
              </Button>
              {showColorPicker && (
                <div>
                  <ChromePicker color={color} onChange={handleColorChange} />
                  <Button
                    sx={{ bgcolor: "green" }}
                    variant="contained"
                    onClick={handleSaveColor}
                  >
                    Save Color
                  </Button>
                </div>
              )}
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

                <Box padding={0.7}>
                  <Tooltip title="Minimum number of occurences of this card that get added to the deck when it is selected">
                    <FormControl>
                      <InputLabel id="card-avail-min-select-label" shrink>
                        Min
                      </InputLabel>
                      <TextField
                        name={"min-avail-value"}
                        variant="outlined"
                        id={"min-avail-value"}
                        type={"number"}
                        onChange={(e) => {
                          let avail_set = info["availability"].split("_");
                          let val =
                            avail_set[0] +
                            "_" +
                            e.target.value +
                            "_" +
                            avail_set.slice(2).join("_");
                          let cop = JSON.parse(JSON.stringify(info));
                          cop["availability"] = val;
                          setInfo(cop);
                        }}
                        value={(info["availability"] || "1_1").split("_")[1]}
                      />
                    </FormControl>
                  </Tooltip>
                </Box>
                <Box padding={0.7}>
                  <Tooltip title="Maximum number of occurences of this card that can be in a deck">
                    <FormControl>
                      <InputLabel id="card-avail-max-select-label" shrink>
                        Max
                      </InputLabel>
                      <TextField
                        name={"max-avail-value"}
                        variant="outlined"
                        id={"max-avail-value"}
                        type={"number"}
                        onChange={(e) => {
                          let avail_set = info["availability"].split("_");
                          let val =
                            avail_set[0] +
                            "_" +
                            avail_set[1] +
                            "_" +
                            e.target.value;
                          if (avail_set.length > 3) {
                            val = val + "_" + avail_set.slice(3).join("_");
                          }
                          let cop = JSON.parse(JSON.stringify(info));
                          cop["availability"] = val;
                          setInfo(cop);
                        }}
                        value={(info["availability"] || "1_1_3").split("_")[2]}
                      />
                    </FormControl>
                  </Tooltip>
                </Box>
                <Tooltip
                  placement="left"
                  title={
                    "Choose which character in your game has access to this card (or ANY to make it available to all characters)"
                  }
                >
                  <FormControl fullWidth>
                    <InputLabel id="character-avail-simple-select-label">
                      Character
                    </InputLabel>
                    <Select
                      //labelId="card-availability-simple-select-label"
                      id="card-character-simple-select"
                      value={
                        (info["availability"] || "DEFAULT_1_1").split("_")
                          .length > 3
                          ? (info["availability"] || "DEFAULT_1_1").split(
                              "_"
                            )[3]
                          : "ANY"
                      }
                      label="Character"
                      onChange={(e) => {
                        let avail_set = info["availability"].split("_");
                        let val =
                          avail_set[0] +
                          "_" +
                          avail_set[1] +
                          "_" +
                          avail_set[2];
                        if (e.target.value != "ANY") {
                          val = val + "_" + e.target.value;
                        }
                        let cop = JSON.parse(JSON.stringify(info));
                        cop["availability"] = val;
                        setInfo(cop);
                      }}
                    >
                      <MenuItem value={"ANY"}>Any</MenuItem>
                      {game["characters"] &&
                        game["characters"].map((char) => {
                          return (
                            <MenuItem value={char["id"]}>
                              {char["name"]}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Tooltip>
              </Box>
            )}
          </Grid>
          <Grid item xs={9}>
            {renderEffects()}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
