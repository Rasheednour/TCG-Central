import React, { useState, useEffect } from "react";
import "./styles/UserPage.css";
import TopRibbon from "../components/TopRibbon.js";
import UserProfile from "../components/UserProfile";
import { useNavigate, useSearchParams } from "react-router-dom";

function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user_name");
    if (!loggedInUser) {
      localStorage.setItem("user_name", searchParams.get("name"));
      localStorage.setItem("access_token", searchParams.get("access_token"));
      localStorage.setItem("user_id", searchParams.get("user_id"));
      setLoggedIn(true);
    } else {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="UserPage">
      <TopRibbon />
      <div className="page-content">
        {loggedIn ? (
          <UserProfile
            user_name={localStorage.getItem("user_name")}
            user_id={localStorage.getItem("user_id")}
          />
        ) : (
          <h3>User not logged in</h3>
        )}
      </div>
    </div>
  );
}

export default UserPage;
