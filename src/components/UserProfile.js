import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import "./styles/UserProfile.css";
import { useNavigate } from "react-router-dom";
import profile_photo from "../assets/images/profile.jpg";
import axios from "axios";
import UserGame from "./UserGame";

const api = "https://tcgbackend-s2kqyb5vna-wl.a.run.app/";

function UserProfile({ user_id, user_name }) {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/create`;
    navigate(path, { state: { user_id: user_id } });
  };

  const [fetched, setFetched] = useState(false);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const url = api + "games";
    axios
      .get(url)
      .then((res) => {
        setGames(res.data);
        setFetched(true);
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, {});

  return (
    <div className="UserProfile">
      <div className="profile-cover">
        <div className="profile-image">
          <img src={profile_photo} width="150" height="150" />
        </div>
        <Button variant="outlined">Edit Profile</Button>
      </div>

      <div className="section-head">
        <h2>About</h2>
      </div>

      <div className="about">
        <h3>Name: {user_name}</h3>
        <h3>User ID: {user_id}</h3>
      </div>

      <div className="create-button">
        <Button variant="contained" onClick={routeChange}>
          Create a new TCG
        </Button>
      </div>

      <div className="section-head">
        <h2>Created TCGs</h2>
      </div>

      <div className="user-tcgs">
        {fetched ? (
          <div className="tcgames">
            {games.map((game) => (
              <div key={game.name} className="tcg-card">
                <UserGame
                  title={game.name}
                  description={game.description}
                  imageURL={game.image}
                  game_id={game.game_id}
                />
              </div>
            ))}
          </div>
        ) : (
          <h3>There are not TCGs to show</h3>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
