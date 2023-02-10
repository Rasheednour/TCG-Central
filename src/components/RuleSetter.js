import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function RuleSetter({ theRules, setGameRules, gameRules }) {
  console.log("the rules started as", theRules, gameRules);
  const [allRules, setAllRules] = useState(theRules);

  function retrieveStartVal(rule) {
    if (rule["name"] in gameRules) {
      return gameRules[rule["name"]];
    }
    return rule["values"][0];
  }

  //   const [currentRule, setCurrentRule] = useState(allRules[0]);
  //   useEffect(() => {
  //     //INitializing
  //     if (allRules.length == 0) {
  //       setAllRules(theRules.theRules);
  //       console.log("but allRules started as", allRules);
  //     }
  //     if (!("name" in currentRule)) {
  //       setCurrentRule(allRules[0]);
  //       console.log("current rule started as", currentRule);
  //     }
  //   }, [allRules, currentRule]);
  //   console.log("rule setter rendering rules:", allRules);

  //   function ruleZoneSelect(allRules) {
  //     let result = [];
  //     for (let i = 0; i < allRules.length; i++) {
  //       result.push(
  //         <option value={allRules[i].name}>{allRules[i].title}</option>
  //       );
  //     }
  //     return result;
  //   }

  //   const changeSelected = (event) => {
  //     //setGameRules(allRules);
  //     console.log("changed with event", event);
  //     setCurrentRule(allRules.filter((el) => el.name === event.target.value)[0]);
  //   };

  function generateRuleZone(rule, setGameRules) {
    function fillSelects(cur) {
      let result = [];
      for (let i = 0; i < cur["values"].length; i++) {
        result.push(
          <MenuItem value={cur.values[i]} key={cur.values[i] + "-menu-item"}>
            {cur.values[i]}
          </MenuItem>
        );
      }
      return result;
    }
    function ruleDescriptionParser(desc, type) {
      if (type == "ENUM") {
        let segmented = desc.split("[");
        let main_desc = segmented[0];
        let list_desc = [];
        for (let i = 1; i < segmented.length; i++) {
          list_desc.push(segmented[i].substring(2));
        }
        //console.log("parsed", main_desc, list_desc);
        return (
          <Box>
            {main_desc}
            <List>
              {list_desc.map((el) => {
                return (
                  <ListItem
                    key={el.substring(0, el.indexOf(" ")) + "-description"}
                    disablePadding
                  >
                    <ListItemText primary={el}></ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      } else {
        return <Box>{desc}</Box>;
      }
    }

    return (
      <Grid item xs={4}>
        <Box>{rule.title}</Box>
        <Box padding={2}>
          {rule["value_type"] == "INT" && (
            <TextField
              name={rule["name"] + "-value"}
              label={rule["title"]}
              variant="outlined"
              id={rule["name"] + "-value"}
              type={"number"}
              onChange={(event) =>
                event.target.value < 0
                  ? (event.target.value = 0)
                  : event.target.value
              }
              defaultValue={gameRules[rule["name"]]}
            />
          )}
          {rule["value_type"] == "ENUM" && (
            <FormControl>
              <InputLabel id={rule["name"] + "-value-label"}>
                {rule["title"]}
              </InputLabel>
              <Select
                labelId={rule["name"] + "-value-label"}
                id={rule["name"] + "-value"}
                defaultValue={retrieveStartVal(rule)}
                //value={retrieveStartVal(rule)}
                onChange={(event) => {
                  console.log("heres the change event", event);
                  document.getElementById(rule["name"] + "-value").value =
                    event.target.value;
                  document.getElementById(rule["name"] + "-value").textContent =
                    event.target.value;
                  console.log(
                    "Post change",
                    document.getElementById(rule["name"] + "-value"),
                    "and value of",
                    document.getElementById(rule["name"] + "-value").value
                  );
                  //   this.setState({ [rule["name"]]: event.target.value });
                }}
              >
                {fillSelects(rule)}
              </Select>
            </FormControl>
          )}
          {rule.value_type == "STR" && (
            <TextField
              id={rule["name"] + "-value"}
              label={rule["title"]}
              defaultValue={gameRules[rule["name"]] || ""}
              variant="outlined"
            ></TextField>
          )}
        </Box>
        <Box> {ruleDescriptionParser(rule.description, rule.value_type)}</Box>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      {allRules.map((currentRule) => {
        return generateRuleZone(currentRule);
      })}
    </Grid>
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
