import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import "./styles/UserProfile.css";
import { useNavigate } from "react-router-dom";
import profile_photo from "../assets/images/profile.jpg";
import axios from "axios";
import UserGame from "./UserGame";

const API_ENDPOINT = "https://tcgbackend-s2kqyb5vna-wl.a.run.app";


function UserProfile({ user_id, user_name }) {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/create`;
    navigate(path, { state: { user_id: user_id } });
  };

  const [fetched, setFetched] = useState(false);
  const [games, setGames] = useState([]);

  const fetchAllGames = async (pathVariables) => {
    const requests = pathVariables.map((pathVariable) => {
      const url = `${API_ENDPOINT}/games/${pathVariable}`;
      return axios.get(url);
    });

    try {
      const responses = await Promise.all(requests);
      const responseData = responses.map((response) => response.data);
      setGames(responseData);
      setFetched(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // first get the list of user games
    axios
      .get(`${API_ENDPOINT}/users/${user_id}/games`)
      .then((res) => {
        // res.data has the user's list of games in it (stored as gameIDs)

        // get list of user's game IDs
        const games = res.data;
        // call a promise.all function that takes a list of game IDs and makes concurrent requests to the API to get all game objects
        fetchAllGames(games);
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
  }, []);

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
