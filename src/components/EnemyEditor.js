import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import "./styles/SignUpForm.css";
import getAllFetch from "../utils/getAllFetch";
import RuleSetter from "./RuleSetter";
import GameNameSetter from "./GameNameSetter";
import CharacterCustomizer from "./CharacterCustomizer";
import { CONFIG } from "../config";
import { useNavigate } from "react-router-dom";

export default function EnemyEditor({ enemyInfo, saveEnemy, updateEnemy }) {
  return (
    <div>
      <h1>
        <Container sx={{ width: 4 / 7 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => saveEnemy(enemyInfo)}
            fullWidth
          >
            SAVE ENEMY
          </Button>
        </Container>
      </h1>
    </div>
  );
}
