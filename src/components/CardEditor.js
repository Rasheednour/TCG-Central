import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Select,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";
import GameNameSetter from "./GameNameSetter";
import CharacterCustomizer from "./CharacterCustomizer";
import { CONFIG } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

export default function CardEditor({ cardInfo, saveCard, updateCard }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(cardInfo["name"] || "");
  const [type, setType] = useState(cardInfo["type"] || "NONE");
  const [attack, setAttack] = useState(cardInfo["attack"] || 0);
  const [defense, setDefense] = useState(cardInfo["defense"] || 0);
  const [health, setHealth] = useState(cardInfo["health"] || 1);
  const [effect, setEffect] = useState(cardInfo["effect"] || []);
  const [description, setDescription] = useState(cardInfo["description"] || "");
  const [cost, setCost] = useState(cardInfo["cost"] || 0);
  const [availability, setAvailability] = useState(
    cardInfo["availability"] || "COMMON_1_3"
  );

  useEffect(() => {
    if (type == "NONE") {
      setType(cardInfo["type"]);
    }
  });

  function handleTypeChange(event) {
    setType(event.target.value);
  }

  function newCardInfo() {
    let newCard = JSON.parse(JSON.stringify(cardInfo));
    newCard["name"] = name;
    newCard["type"] = type;
    newCard["attack"] = attack;
    newCard["defense"] = defense;
    newCard["health"] = health;
    newCard["effect"] = effect;
    newCard["description"] = description;
    newCard["cost"] = cost;
    newCard["availability"] = availability;
    return newCard;
  }

  function renderStats() {
    if (type === "CREATURE") {
      return (
        <Box padding={1}>
          <FormControl fullWidth>
            <InputLabel id="card-attack-simple-select-label" shrink>
              Attack
            </InputLabel>
            <TextField
              name={"attack-stat-value"}
              labelId="card-attack-simple-select-label"
              variant="outlined"
              id={"attack-stat-value"}
              type={"number"}
              onChange={(event) => {
                let newVal = event.target.value < 0 ? 0 : event.target.value;
                setAttack(Number(newVal));
              }}
              value={attack}
            />
          </FormControl>
        </Box>
      );
    }
  }

  console.log("card info is", cardInfo);
  return (
    <div>
      <h1>
        <Container sx={{ width: 4 / 7 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              saveCard(newCardInfo());
              //   navigate(
              //     `/${location.pathname.split("/")[1]}/${
              //       location.pathname.split("/")[2]
              //     }`
              //   );
            }}
            fullWidth
          >
            SAVE CARD
          </Button>
        </Container>
      </h1>

      <Box padding={1}>
        <FormControl fullWidth>
          <InputLabel id="card-name-simple-select-label" shrink>
            Card Name
          </InputLabel>
          <TextField
            id="card-name-editor"
            labelId="card-name-simple-select-label"
            value={name}
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
          ></TextField>
        </FormControl>
      </Box>
      <Box padding={1}>
        <FormControl fullWidth>
          <InputLabel id="card-type-simple-select-label">Card Type</InputLabel>
          <Select
            labelId="card-type-simple-select-label"
            id="card-type-simple-select"
            value={type}
            label="Card Type"
            onChange={handleTypeChange}
          >
            <MenuItem value={"CREATURE"}>Creature</MenuItem>
            <MenuItem value={"SPELL"}>Spell</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {renderStats()}
    </div>
  );
}
