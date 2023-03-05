import Card from './Card.js';
//Use this class for Heroes?
export default class CardBack extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'cardBack';
        this.playerCardSprite = 'cardBack';
        this.enemyCardSprite = 'cardBack';
        this.cost = 0;
        this.health = 0
        this.attack = 0;
        this.defense = 0;

    }
}