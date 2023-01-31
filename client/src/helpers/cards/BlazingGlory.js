import Card from './Card.js';

export default class BlazingGlory extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'blazingGlory';
        this.playerCardSprite = 'blazingGlory';
        this.opponentCardSprite = 'blazingGlory';
    }
}