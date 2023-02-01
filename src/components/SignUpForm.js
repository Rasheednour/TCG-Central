import React, { useState } from "react";
import './styles/SignUpForm.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(fullName, email, password);
  };

  return (
    <div className="SignUpForm">
      <h1>Start Creating TCGs</h1>
      <h2>Signup now. It's free and takes less than 2 minutes</h2>
      <form onSubmit={handleSubmit}>
          <TextField id="outlined-basic" label="Full Name" variant="outlined" onChange={(event) => setFullName(event.target.value)}/>
        <br />
        <br />
        <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
        <br />
        <br />
        <TextField id="outlined-basic" label="Password" variant="outlined" onChange={(event) => setFullName(event.target.value)}/>
        <br />
        <br />
        <Button className="button1" variant="contained" type="submit">Get Started</Button>
        <br />
        <Button className="button2" variant="contained" type="submit">Sign in with Google</Button>
      </form>
    </div>
  );
};

export default SignUpForm;