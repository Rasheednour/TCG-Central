import '../App.css';
import tcg_logo from '../assets/images/tcg_logo.png'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function TopRibbon() {
  return (
    <div className="TopRibbon">

        <img src={tcg_logo} alt='tcg central logo'/>

        <div className='redirect-links'>
            <Link to='/'>Home</Link> 
            <Link to='/'>Play</Link> 
            <Link to='/'>Create</Link> 
        </div>

        <div className='login-buttons'>
            <Button className='button1' variant="contained">Sign Up</Button>
            <Button className='button2' variant="outlined">Log In</Button>
        </div>
        
        
    </div>
  );
}

export default TopRibbon;