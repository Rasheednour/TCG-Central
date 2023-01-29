import '../App.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';


function HomePage() {
  return (
    <div className="HomePage">

        <TopRibbon/>
        <div className='home-intro'>
          <h1>Community Created Trading Card Games</h1>
          <p>TCG CENTRAL is your one stop shop to view, and play trading card games created by a community of thousands of creative individuals, as well as create your own.</p>
          <Button variant="contained">VIEW PUBLISHED GAMES</Button>
        </div>
        
    </div>
  );
}

export default HomePage;