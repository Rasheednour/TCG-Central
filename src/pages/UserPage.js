import React, {useState} from 'react';
import './styles/UserPage.css'
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';
import axios from 'axios';
import UserProfile from '../components/UserProfile';

import { useSearchParams } from 'react-router-dom';
const backendURL = 'http://localhost:8080/register';

function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(true);

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
        <div className='page-content'>
          {loggedIn?(<UserProfile user_name={'Joe Doe'} user_email={'joedoe@gmail.com'}/>):(<h3>Please Log-in to Continue</h3>)}
        </div>
        {/* <div className='redirect-info'>
          <p>User Name is: {searchParams.get("name")}</p>
          <p>Access Token is: {searchParams.get('access_token')}</p>
        </div> */}
        
    </div>
  );
}

export default UserPage;