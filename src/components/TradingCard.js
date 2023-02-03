

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import monster_art from '../assets/temp_db/monster_art.png'
import './styles/TradingCard.css';

function TradingCard({title, cost, image, backgroundColor, type, description, effect, stats}) {
    const backgroundStyle = "background-color: " + backgroundColor;
  return (
    <div className="card-container" >
        <div className='card-title'>
            <h3>{title}</h3>
            <h4>2</h4>
        </div>
        <div className='background-image'>
            <img src={monster_art} width="300" height="240" alt='trading card image'/>
        </div>

        <div className='card-type'>
            <h3>{type}</h3>
        </div>
        
        <div className='card-description'>
            <p>{description}</p>
            <p>Effect: {effect}</p>
            <div className='card-stats'>
                <h5>ATK/ {stats[0]}</h5>
                <h5>DEF/ {stats[1]}</h5>
                <h5>HP/ {stats[2]}</h5>
            </div>
        </div>
       
    </div>
  );
}

export default TradingCard;