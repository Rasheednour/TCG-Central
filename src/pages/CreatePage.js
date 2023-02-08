import React from 'react';
import './styles/HomePage.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import {useLocation} from 'react-router-dom';

function CreatePage() {
 
  const location = useLocation();

  return (
    <div className="CreatePage">

        <TopRibbon/>
        <h1>Game Customizer Interface</h1>
        
    </div>
  );
}

export default CreatePage;