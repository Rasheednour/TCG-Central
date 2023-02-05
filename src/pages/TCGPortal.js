import './styles/TCGPortal.css'
import TopRibbon from '../components/TopRibbon.js'
import Button from '@mui/material/Button';
import GameSummary from '../components/GameSummary';
import CreatureCard from '../components/CreatureCard';
import SpellCard from '../components/SpellCard';
import EnemyCard from '../components/EnemyCard';
import tcg_portal_cover from '../assets/images/tcg_portal_cover.png'

function TCGPortal() {
  return (
    <div className="TCGPortal">

        <TopRibbon/>
        <div className='top-image'>
          <img src={tcg_portal_cover} width="100%" alt='tcg portal cover image'/>
        </div>
        <div className='TCG-Container'>
          <h1>TCG Portal</h1>
          <h2>Browse Published Trading Card Games</h2>
        </div>
        <div className='cards'>
          <div className='trading-crad'>
            <CreatureCard title={'Knight Of The Golden Order'} type={'Human Warrior'} cost={2} 
                        backgroundColor={'#ffffff'} description={'Brave and chivalrous warrior. Wields shining sword of justice against evil. Trusty steed and enchanted armor make them a powerful force on the battlefield, inspiring all. Name revered by friend and foe.'} effect={'Strike twice if enemy defense is high.'} stats={[600, 400, 500]}/>
          </div>
          <div className='trading-card'>
            <SpellCard title={'The Lost Oasis'} type={'Spell'} cost={1} 
                        backgroundColor={'#ffffff'} description={'Enemies health is cut by half for one turn.'}/>
          </div>
          <div className='trading-card'>
            <EnemyCard title={'General Zimar'} level={6} 
                        backgroundColor={'#ffffff'} description={'Brave and chivalrous warrior. Wields shining sword of justice against evil. Trusty steed and enchanted armor make them a powerful force on the battlefield, inspiring all. Name revered by friend and foe.'} effect={'Cut all Creature defenses by half.'} stats={[800, 600, 700]}/>
          </div>
        </div>
        
    </div>
  );
}

export default TCGPortal;