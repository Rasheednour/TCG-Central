import React from "react";
import "./styles/HomePage.css";
import TopRibbon from "../components/TopRibbon.js";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import home_cover from "../assets/images/home-cover.png";

function HomePage() {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/games`;
    navigate(path);
  };

  const loginRedirect = () => {
    let path = `/signup`;
    navigate(path);
  };

  return (
    <div className="HomePage">
      <TopRibbon />
      <div className="home-container">
        <div className="home-intro">
          <h1>Community Created Trading Card Games</h1>
          <p>
            TCG CENTRAL is your one stop shop to view, and play trading card
            games created by a community of thousands of creative individuals,
            as well as create your own.
          </p>
          <Button variant="contained" onClick={routeChange}>
            VIEW PUBLISHED GAMES
          </Button>
          <Button
            variant="contained"
            onClick={loginRedirect}
            className="login-button"
          >
            Log-in to Create your own
          </Button>
        </div>
        <div className="GS">
          <img src={home_cover} width="100%" alt="tcg portal cover image" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
