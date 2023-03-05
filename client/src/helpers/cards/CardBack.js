import Card from './Card.js';
//Use this class for Heroes?
export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'cardBack';
        this.playerCardSprite = 'cardBack';
        this.enemyCardSprite = 'cardBack';
    }
}