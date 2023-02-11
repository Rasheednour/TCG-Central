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
  Tooltip,
} from "@mui/material";

export default function RuleSetter({ theRules, setGameRules, gameRules }) {
  // console.log("the rules started as", theRules, gameRules);
  const [allRules, setAllRules] = useState(theRules);

  function retrieveStartVal(rule) {
    if (rule["name"] in gameRules) {
      return gameRules[rule["name"]];
    }
    return rule["values"][0];
  }

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

    function ruleMainDescParse(desc) {
      let segmented = desc.split("[");
      let main_desc = segmented[0];
      return main_desc;
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
            {/* {main_desc} */}
            <List>
              {list_desc.map((el) => {
                return (
                  <ListItem
                    key={el.split(" ").join("").slice(0, 20) + "-description"}
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
        return; //<Box>{desc}</Box>;
      }
    }

    return (
      <Grid item xs={4} key={rule.name + "-grid-item-wrapper"}>
        <Tooltip title={ruleMainDescParse(rule.description)}>
          <Container>
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
                      document.getElementById(
                        rule["name"] + "-value"
                      ).textContent = event.target.value;
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
            <Box>
              {" "}
              {ruleDescriptionParser(rule.description, rule.value_type)}
            </Box>
          </Container>
        </Tooltip>
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
