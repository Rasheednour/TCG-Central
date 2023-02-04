import CardBack from '../cards/CardBack';
import BlazingGlory from '../cards/BlazingGlory';
import StonePath from '../cards/StonePath'


//the DeckHandler will provide all the utility surrounding what we want a deck of cards to be able to do:
//Draw (deal)
//Shuffle
export default class DeckHandler {
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let cards = {
                //This is where we will load the player deck's cards
                cardBack: new CardBack(scene),
                blazingGlory: new BlazingGlory(scene),
                stonePath: new StonePath(scene)
            }
            let newCard = cards[name];
            return(newCard.render(x, y, type));
        }
    }
}