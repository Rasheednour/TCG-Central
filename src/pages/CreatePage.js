import "./styles/SignUpPage.css";
import TopRibbon from "../components/TopRibbon.js";
import GameBuilder from "../components/GameBuilder";
import { useNavigate } from "react-router-dom";
import React from "react";

function CreatePage() {
  let navigate = useNavigate();
  console.log("create page is called");

  return (
    <div className="CreatePage">
      <TopRibbon />
      <div className="create-upper-half">
        <div className="create-intro" bg-color="black">
          <h1>Create Custom Trading Card Game</h1>
          <p>
            Use the bellow interface to customize your game. Don't forget to
            click save to save your changes!
          </p>
        </div>
        <div className="create-body">
          <GameBuilder />
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
