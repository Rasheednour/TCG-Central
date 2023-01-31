import CardBack from './cards/CardBack';
import Boolean from './cards/BlazingGlory';
import Ping from './cards/Stone_Path'
import BlazingGlory from './cards/BlazingGlory';
import StonePath from './cards/Stone_Path';


//the DeckHandler will provide all the utility surrounding what we want a deck of cards to be able to do:
//Draw (deal)
//Shuffle
export default class DeckHandler {
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                boolean: new BlazingGlory(scene),
                ping: new StonePath(scene)
            }
            let newCard = cards[name];
            return(newCard.render(x, y, type));
        }
    }
}