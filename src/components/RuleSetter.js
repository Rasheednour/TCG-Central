import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  List,
  MenuItem,
  Stack,
  Select,
} from "@mui/material";
import cover from "../assets/temp_db/cover1.png";
import "./styles/GameSummary.css";
import { getAllRules } from "../utils/getAllRules";
import { getAllFetch } from "../utils/getAllFetch";

export default function RuleSetter(theRules, setGameRules) {
  console.log(theRules.theRules);
  theRules = theRules.theRules;
  function ruleZoneSelect(allRules) {
    let result = [];
    for (let i = 0; i < allRules.length; i++) {
      result.push(
        <MenuItem value={allRules[i].name}>{allRules[i].title}</MenuItem>
      );
    }
    return result;
  }

  function generateRuleZone(rule, setGameRules) {
    function fillSelects(cur) {
      let result = [];
      for (let i = 0; i < cur["values"].length; i++) {
        result.push(<MenuItem value={cur.values[i]}>{cur.values[i]}</MenuItem>);
      }
      return result;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {rule.title}
          <br />
          {rule.description}
        </Grid>
        <Grid item xs={6}>
          {rule["value_type"] == "INT" && <input type="number"></input>}
          {rule["value_type"] == "ENUM" && <Select>{fillSelects(rule)}</Select>}
          {rule.value_type == "STR" && <input type="text"></input>}
        </Grid>
      </Grid>
    );
  }

  return (
    <Container>
      <SELECT id="ruleSelect">{ruleZoneSelect(theRules)}</SELECT>
      {generateRuleZone(
        theRules.filter((el) => {
          document.getElementById("ruleSelect").value == el.name;
        })[0]
      )}
    </Container>
    // <List>
    //   {theRules.length != 0 ? (
    //     theRules.map((cur) => {
    //       return <li key={cur.name}>{generateRuleZone(cur, setGameRules)}</li>;
    //     })
    //   ) : (
    //     <li key="noRules">
    //       <span>No rules</span>
    //     </li>
    //   )}
    // </List>
  );
}
