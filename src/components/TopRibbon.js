import React, { useState, useEffect } from "react";
import "./styles/TopRibbon.css";
import tcg_logo from "../assets/images/tcg_logo.png";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function TopRibbon() {
  const [loggedIn, setLoggedIn] = useState(false);

  let navigate = useNavigate();
  const login = () => {
    let path = `/signup`;
    navigate(path);
  };

  const visitProfile = () => {
    let path = `/user`;
    navigate(path);
  };

  const goHome = () => {
    let path = `/`;
    navigate(path);
  };

  useEffect(() => {
    if (localStorage.getItem("user_name")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    goHome();
  };

  return (
    <div className="TopRibbon">
      <img src={tcg_logo} alt="tcg central logo" />

      <div className="redirect-links">
        <Link to="/">Home</Link>
        <Link to="/tcgportal">TCG Portal</Link>
        {loggedIn ? (
          <Link to="/create">Create TCGs</Link>
        ) : (
          <Link to="/signup">Create TCGs</Link>
        )}
      </div>
      {loggedIn ? (
        <div className="login-buttons">
          <Button
            className="button3"
            variant="contained"
            onClick={visitProfile}
          >
            Profile
          </Button>
          <Button className="button4" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="login-buttons">
          <Button className="button1" variant="contained" onClick={login}>
            Sign Up
          </Button>
          <Button className="button2" variant="outlined" onClick={login}>
            Login
          </Button>
        </div>
      )}
    </div>
  );
}

export default TopRibbon;
