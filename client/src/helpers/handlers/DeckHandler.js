import CardBack from '../cards/CardBack';
import SampleAlly from '../cards/SampleAlly';


//the DeckHandler will provide all the utility surrounding what we want a deck of cards to be able to do:
//Draw (deal)
//Shuffle
export default class DeckHandler {
    constructor(scene) {
        this.cardsDealt = 0;

        this.dealCard = (x, y, name, type) => {
            let cards = {
                //This is where we will load the player deck's cards
                cardBack: new CardBack(scene),
                Sample_Ally: new SampleAlly(scene)
            }
            let newCard = cards[name];
            let id = this.cardsDealt;
            this.cardsDealt ++;
            return(newCard.render(x, y, type, id));
        }
    }
}