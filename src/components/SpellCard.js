

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import spell_art from '../assets/temp_db/spell_art.png'
import './styles/SpellCard.css';

function SpellCard({title, cost, image, backgroundColor, type, description}) {
    const backgroundStyle = "background-color: " + backgroundColor;
  return (
    <div className="spell-card-container" >
        <div className='card-title'>
            <h3>{title}</h3>
            <h4>{cost}</h4>
        </div>
        <div className='background-image'>
            <img src={spell_art} width="300" height="240" alt='trading card image'/>
        </div>

        <div className='card-type'>
            <h3>{type}</h3>
        </div>
        
        <div className='card-description'>
            <p>{description}</p>
        </div>
       
    </div>
  );
}

export default SpellCard;