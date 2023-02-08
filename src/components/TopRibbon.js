import React from 'react';
import './styles/TopRibbon.css';
import tcg_logo from '../assets/images/tcg_logo.png'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function TopRibbon() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/signup`; 
    navigate(path);
  }

  return (
    <div className="TopRibbon">

        <img src={tcg_logo} alt='tcg central logo'/>

        <div className='redirect-links'>
            <Link to='/'>Home</Link> 
            <Link to='/tcgportal'>TCG Portal</Link> 
            <Link to='/user'>Create TCGs</Link> 
        </div>

        <div className='login-buttons'>
            <Button className='button1' variant="contained" onClick={routeChange}>Sign Up</Button>
            <Button className='button2' variant="outlined" onClick={routeChange}>Log In</Button>
        </div>
        
        
    </div>
  );
}

export default TopRibbon;