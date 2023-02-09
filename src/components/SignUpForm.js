import React, {useState, useEffect} from 'react';
import './styles/SignUpForm.css';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const api = 'http://localhost:8080/';


const SignUpForm = () => {
  // const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const [fetched, setFetched] = useState(false);
  const [url, setURL] = useState("");

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    navigate(url);
  }

  useEffect(() => {
    const url = api + 'register';
    axios.get(url).then((res) => {
      console.log(res.data);
      setURL(res.data);
      setFetched(true);
    })
    .catch ((error) => {
      console.log("fetch error" + error);
    });
  }, {});

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(fullName, email, password);
  // };

  return (
    <div className="SignUpForm">
      <h1>Start Creating TCGs</h1>
      <h2>Signup now. It's free and takes less than 2 minutes</h2>
      <form>
          {/* <TextField id="outlined-basic" label="Full Name" variant="outlined" onChange={(event) => setFullName(event.target.value)}/>
        <br />
        <br />
        <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
        <br />
        <br />
        <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(event) => setFullName(event.target.value)}/>
        <br />
        <br />
        <Button className="button1" variant="contained" type="submit">Get Started</Button>
        <br /> */}
        <div>
          {fetched ? (<Button className="button2" variant="contained" type="submit" href={url}>Sign in with Google</Button>):(<p>oauth url not yet fetched</p>)}
        
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;