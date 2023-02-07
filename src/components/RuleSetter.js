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

export default function RuleSetter({ theRules, setGameRules, gameRules }) {
  //console.log("the rules started as", theRules);
  const [allRules, setAllRules] = useState(theRules);

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
        result.push(<option value={cur.values[i]}>{cur.values[i]}</option>);
      }
      return result;
    }
    console.log("generating rule zone for rule:", rule);

    return (
      <div>
        <div>
          {rule.title}
          <br />
          {rule.description}
        </div>
        <div>
          {rule["value_type"] == "INT" && (
            <input
              type="number"
              name={rule["name"] + "-value"}
              id={rule["name"] + "-value"}
              value={gameRules[rule["name"]]}
            ></input>
          )}
          {rule["value_type"] == "ENUM" && <select>{fillSelects(rule)}</select>}
          {rule.value_type == "STR" && <input type="text"></input>}
        </div>
      </div>
    );
  }

  return (
    <form>
      {allRules.map((currentRule) => {
        return generateRuleZone(currentRule);
      })}
    </form>
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
