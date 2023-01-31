import Card from './Card.js';

export default class StonePath extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'stonePath';
        this.playerCardSprite = 'stonePath';
        this.opponentCardSprite = 'stonePath';
    }
}