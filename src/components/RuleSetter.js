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
//import "./styles/GameSummary.css";
import { getAllRules } from "../utils/getAllRules";
import { getAllFetch } from "../utils/getAllFetch";

export default function RuleSetter(theRules, setGameRules) {
  //console.log("the rules started as", theRules.theRules);
  const [allRules, setAllRules] = useState([]);

  const [currentRule, setCurrentRule] = useState({
    name: "",
    title: "",
    value_type: "INT",
    description: "",
  });
  useEffect(() => {
    //INitializing
    if (allRules.length == 0) {
      setAllRules(theRules.theRules);
      console.log("but allRules started as", allRules);
    }
    if (currentRule.length == 0) {
      setCurrentRule(allRules[0]);
      console.log("current rule started as", currentRule);
    }
  }, [allRules, currentRule]);

  function ruleZoneSelect(allRules) {
    let result = [];
    for (let i = 0; i < allRules.length; i++) {
      result.push(
        <MenuItem value={allRules[i].name}>{allRules[i].title}</MenuItem>
      );
    }
    return result;
  }

  const changeSelected = (event) => {
    //setGameRules(allRules);
    console.log("changed with event", event);
    setCurrentRule(allRules.filter((el) => el.name === event.value));
  };

  function generateRuleZone(rule, setGameRules) {
    function fillSelects(cur) {
      let result = [];
      for (let i = 0; i < cur["values"].length; i++) {
        result.push(<MenuItem value={cur.values[i]}>{cur.values[i]}</MenuItem>);
      }
      return result;
    }
    console.log("generating rule zone for rule:", rule);

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
      <Select
        id="ruleSelect"
        labelId="rule-select-label-id"
        value={currentRule.title}
        label="Select Rule to Edit"
        onChange={changeSelected}
      >
        {ruleZoneSelect(allRules)}
      </Select>
      {allRules.length > 0 &&
        generateRuleZone(
          currentRule
          //   allRules.filter((el) => {
          //     console.log(
          //       "checking equality between,",
          //       currentRule["name"],
          //       el.name
          //     );
          //     return currentRule["name"] == el.name;
          //   })[0]
        )}
    </Container>
    // <List>
    //   {allRules.length != 0 ? (
    //     allRules.map((cur) => {
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
