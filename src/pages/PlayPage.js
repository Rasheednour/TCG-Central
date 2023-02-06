import React from 'react';
import './styles/HomePage.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import {useLocation} from 'react-router-dom';

function PlayPage() {
 
  const location = useLocation();

  return (
    <div className="PlayPage">

        <TopRibbon/>
        <h1>Starting game with ID Number: {location.state.game_id}</h1>
        
    </div>
  );
}

export default PlayPage;