import Card from "../cards/Card"

//the DeckHandler will provide all the utility surrounding what we want a deck of cards to be able to do:
//Draw (deal)
//Shuffle
export default class DeckHandler {
    constructor(scene) {
        this.cardsDealt = 0;

        this.dealCard = (x, y, card) => {
            let id = this.cardsDealt;
            this.cardsDealt ++;
            //type, name, sprite, cost, attack, defense, health, ability
            let newCard = new Card(scene, card[0], card[1], card[2], card[3], card[4], card[5], card[6], card[7], id);
            console.log(this.cardsDealt);
            console.log(newCard);
            return(newCard.render(x, y));
        }
    }
}

