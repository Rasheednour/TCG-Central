import "./styles/CreatePage.css";
import TopRibbon from "../components/TopRibbon.js";
import GameBuilder from "../components/GameBuilder";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useLocation, useParams } from "react-router-dom";

function CreatePage() {
  let navigate = useNavigate();
  //console.log("create page is called");
  const location = useLocation();
  const params = useParams();
  console.log("location", location, "state", location.state, "params", params);
  // LEAVING THIS LOG IN AS A REMINDER OF WHERE THIS INFO IS SUPPOSED TO BE ACCESIBLE FROM
  // console.log(
  //   "user id for create page is",
  //   location.state.user_id || "NO_USER_ID",
  //   " and game_id is, ",
  //   location.state.game_id || "NO_GAME_ID"
  // );

  return (
    <div className="CreatePage">
      <TopRibbon />
      <div className="create-container">
        <div className="create-intro" bg-color="black">
          <h1>Custom Trading Card Game Builder</h1>
          <p>
            {(params.game_id &&
              "YOU ARE EDITTING AN EXISTING GAME.  Clicking save will overwrite (so please click save if you want to save your changes).") ||
              "Use the bellow interface to a new game. Don't forget to click save to save your changes!"}
          </p>
        </div>
        <div className="create-body">
          <GameBuilder gameId={params.game_id} userId={localStorage.getItem("user_id")}/>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
