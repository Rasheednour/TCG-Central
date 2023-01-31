import CardHandler from '../helpers/CardHandler';
import DeckHandler from '../helpers/DeckHandler';
import InteractiveHandler from '../helpers/InteractiveHandler';
import GameHandler from '../helpers/GameHandler';
import SocketHandler from '../helpers/SocketHandler';
import UIHandler from "../helpers/UIHandler";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        })
    }

    preload() {
        // we can preload provided assets. We will eventually want to hook this up to our database.
        this.load.image('cardBack', 'src/assets/Card_Back.png');
        this.load.image('blazingGlory', 'src/assets/Blazing_Glory.png');
        this.load.image('stonePath', 'src/assets/Stone_Path.png');
    }

    create() {
        // Everything is going to be dealt with through various handlers.
        this.CardHandler = new CardHandler();
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();
        this.InteractiveHandler = new InteractiveHandler(this);
    }

    update() {

    }

}