import DeckHandler from '../helpers/handlers/DeckHandler';
import InteractiveHandler from '../helpers/handlers/InteractiveHandler';
import GameHandler from '../helpers/handlers/GameHandler';
import SocketHandler from '../helpers/handlers/SocketHandler';
import UIHandler from "../helpers/handlers/UIHandler";
import PlayerHandler from '../helpers/handlers/playerHandler';
import AllyHandler from '../helpers/handlers/allyHandler';
import EnemyHandler from '../helpers/handlers/EnemyHandler';
import RulesHandler from '../helpers/handlers/RulesHandler';


//So far, everything in the game happens in one Phaser Scene, which we call a Game
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
        this.EnemyHandler = new EnemyHandler(this);
        this.PlayerHandler = new PlayerHandler(this);
        this.AllyHandler = new AllyHandler(this);
        this.RulesHandler = new RulesHandler(this);
        this.DeckHandler = new DeckHandler(this);
        this.GameHandler = new GameHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.UIHandler = new UIHandler(this);
        this.UIHandler.buildUI();
        this.InteractiveHandler = new InteractiveHandler(this);
        this.GameHandler.spawnEnemies();
    }

    update() {

    }

}