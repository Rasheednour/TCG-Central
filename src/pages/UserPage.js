import '../App.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';

function UserPage() {
  return (
    <div className="UserPage">

        <TopRibbon/>
        <div className='User-Container'>
          <h1>User Profile</h1>
          <h2>Private Information</h2>
          <h2>User TCGs</h2>
          <Button variant='contained'>Create a new TCG</Button>
        </div>
        
    </div>
  );
}

export default UserPage;