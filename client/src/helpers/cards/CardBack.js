import Card from './Card.js';

export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'cardBack';
        this.playerCardSprite = 'Card_Back';
        this.opponentCardSprite = 'Card_Back';
    }
}