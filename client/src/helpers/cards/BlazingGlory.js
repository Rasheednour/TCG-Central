import Card from './Card.js';

export default class BlazingGlory extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'blazing glory';
        this.playerCardSprite = 'Blazing_Glory';
        this.opponentCardSprite = 'Blazing_Glory';
    }
}