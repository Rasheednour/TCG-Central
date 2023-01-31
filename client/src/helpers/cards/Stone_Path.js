import Card from './Card.js';

export default class StonePath extends Card {
    constructor(scene) {
        super(scene);
        this.name = 'stone path';
        this.playerCardSprite = 'Stone_Path';
        this.opponentCardSprite = 'Stone_Path';
    }
}