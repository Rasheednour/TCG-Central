import React, {useState} from 'react';
import './styles/UserPage.css'
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';
import axios from 'axios';
import TradingCard from '../components/TradingCard';

const backendURL = 'http://localhost:8080/register';

function UserPage() {
  const [response, setResponse] = useState("userredirect data here");
  console.log("this is the user page");

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   axios.get(backendURL).then( res => {
  //     console.log(res);
  //   })
  //   .catch(err =>{
  //     console.log(err)
  //   });
  // }

  return (
    <div className="UserPage">

        <TopRibbon/>
        <TradingCard title={'Knight Of The Golden Order'} type={'Human Warrior'} cost={2} 
                     backgroundColor={'#ffffff'} description={'Brave and chivalrous warrior. Wields shining sword of justice against evil. Trusty steed and enchanted armor make them a powerful force on the battlefield, inspiring all. Name revered by friend and foe.'} effect={'get another turn.'} stats={[600, 400, 500]}/>
        <div className='User-Container'>
          <h1>{response}</h1>
          <h1>User Profile</h1>
          <h2>Private Information</h2>
          <h2>User TCGs</h2>
          <Button variant='contained'>Create a new TCG</Button>
        </div>
        
    </div>
  );
}

export default UserPage;