import CardBack from './cards/CardBack';
import Boolean from './cards/Boolean';
import Ping from './cards/Ping'


//the DeckHandler will provide all the utility surrounding what we want a deck of cards to be able to do:
//Draw (deal)
//Shuffle
export default class DeckHandler {
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                boolean: new Boolean(scene),
                ping: new Ping(scene)
            }
            let newCard = cards[name];
            return(newCard.render(x, y, type));
        }
    }
}