import React, {useState, useEffect} from 'react';
import './styles/UserPage.css'
import TopRibbon from '../components/TopRibbon.js'
import UserProfile from '../components/UserProfile';
import { useNavigate, useSearchParams } from "react-router-dom";

function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const saveData = () => {
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user_name");
    if (!loggedInUser) {
      localStorage.setItem('user_name', searchParams.get("name"));
      localStorage.setItem('access_token', searchParams.get("access_token"));
      localStorage.setItem('user_id', searchParams.get("user_id"));
    } else {
      setLoggedIn(true);
    }
  }, []);

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/signup`; 
    navigate(path);
  }


  return (
    <div className="UserPage">
        <TopRibbon/>
        <div className='page-content'>
          {loggedIn?(<UserProfile user_name={ localStorage.getItem("user_name")} user_id={localStorage.getItem("user_id")}/>):(<h3>User not logged in</h3>)}
        </div>
        {/* <div className='redirect-info'>
          <p>User Name is: {searchParams.get("name")}</p>
          <p>Access Token is: {searchParams.get('access_token')}</p>
        </div> */}
        
    </div>
  );
}

export default UserPage;