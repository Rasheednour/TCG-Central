import '../App.css';
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';
import { useNavigate } from "react-router-dom";

function HomePage() {

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/tcgportal`; 
    navigate(path);
  }

  return (
    <div className="HomePage">

        <TopRibbon/>
        <div className='home-upper-half'>
          <div className='home-intro'>
            <h1>Community Created Trading Card Games</h1>
            <p>TCG CENTRAL is your one stop shop to view, and play trading card games created by a community of thousands of creative individuals, as well as create your own.</p>
            <Button variant="contained" onClick={routeChange}>VIEW PUBLISHED GAMES</Button>
          </div>
          <div className='GS'>
          <GameSummary title={'Mystic Warriors'} creator={'joeDoe'} description={'A fantasy TCG set int he world of kaosp smaol;a msialsj kasaisjia iasj;;a jsiajj sdlsi hatwqiqp ahdgqyha ahsg aua aysohjha'}/>
          </div>
        </div>
        
    </div>
  );
}

export default HomePage;