import '../App.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import cover from '../assets/temp_db/cover1.png'

function GameSummary({title, creator, description}) {
  return (
    <div className="GameSummary">
        <div className='cover-image'>
            <img src={cover} alt='game cover logo'/>
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