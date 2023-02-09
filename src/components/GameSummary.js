
// This is the Game Summary card component, which is a box that shows a brief summary
// about any given TCG to the user (title, description, creator, cover art, sample cards, play button)

import React from 'react';
import Button from '@mui/material/Button';
import cover from '../assets/temp_db/cover1.png'
import './styles/GameSummary.css';
import { useNavigate } from "react-router-dom";


function GameSummary({title, creator, description, imageURL, game_id}) {

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/play`; 
    navigate(path, {state:{game_id: game_id}});
  }

  return (
    <div className="GameSummary">
        <div className='cover-image'>
            <img src={cover} width="400" height="500" alt='game cover logo'/>
        </div>

        <div className='right-panel'>
            <h1>{title}</h1>
            <h2>Created by: {creator}</h2>
            <p>{description}</p>
            <div>
            <Button variant="contained" onClick={routeChange}>PLAY</Button>
            </div>
        </div>
    </div>
  );
}

export default GameSummary;