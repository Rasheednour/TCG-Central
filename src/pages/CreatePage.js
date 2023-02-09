import React from 'react';
import './styles/HomePage.css';
import TopRibbon from '../components/TopRibbon.js'
import {useLocation} from 'react-router-dom';

function CreatePage() {
 
  const location = useLocation();

  return (
    <div className="CreatePage">

        <TopRibbon/>
        <h1>Game Customizer Interface</h1>
        <h3>Creating game for user with user_id: {location.state.user_id}</h3>
        
    </div>
  );
}

export default CreatePage;