import React, {useState} from 'react';
import '../App.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';
import axios from 'axios';


const backendURL = 'http://localhost:8080/register';

function UserPage() {
  const [response, setResponse] = useState("userredirect data here");
  console.log("this is the user page");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.get(backendURL).then( res => {
      console.log(res);
    })
    .catch(err =>{
      console.log(err)
    });
  }

  return (
    <div className="UserPage">

        <TopRibbon/>
        <div className='User-Container'>
          <h1>{response}</h1>
          <h1>User Profile</h1>
          <h2>Private Information</h2>
          <h2>User TCGs</h2>
          <Button variant='contained' onClick={handleSubmit}>Create a new TCG</Button>
        </div>
        
    </div>
  );
}

export default UserPage;