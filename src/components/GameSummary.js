
// This is the Game Summary card component, which is a box that shows a brief summary
// about any given TCG to the user (title, description, creator, cover art, sample cards, play button)

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import cover from '../assets/temp_db/cover1.png'
import './styles/GameSummary.css';

function GameSummary({title, creator, description}) {
  return (
    <div className="GameSummary">
        <div className='cover-image'>
            <img src={cover} width="400" height="500" alt='game cover logo'/>
        </div>

        <div className='right-panel'>
            <h1>{title}</h1>
            <h2>Created by: {creator}</h2>
            <p>{description}</p>
            <div className='card-samples'>

            </div>
        </div>
        
        
    </div>
  );
}

export default GameSummary;