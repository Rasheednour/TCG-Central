import DeckHandler from "../helpers/handlers/DeckHandler";
import InteractiveHandler from "../helpers/handlers/InteractiveHandler";
import GameHandler from "../helpers/handlers/GameHandler";
import SocketHandler from "../helpers/handlers/SocketHandler";
import UIHandler from "../helpers/handlers/UIHandler";
import PlayerHandler from "../helpers/handlers/PlayerHandler";
import AllyHandler from "../helpers/handlers/AllyHandler";
import EnemyHandler from "../helpers/handlers/EnemyHandler";
import RulesHandler from "../helpers/handlers/RulesHandler";
import HeroHandler from "../helpers/handlers/HeroHandler";

//So far, everything in the game happens in one Phaser Scene, which we call a Game
export default class Game extends Phaser.Scene {
  constructor(cardDeck, enemyList, character, gameRules, enemyUrls, cardUrls) {
    super({
      key: "Game",
    });
    this.cardDeck = cardDeck;
    this.enemyList = enemyList;
    this.character = character;
    this.gameRules = gameRules;
    this.enemyUrls = enemyUrls;
    this.cardUrls = cardUrls;
  }

  // main preload function responsible for preloading all card/enemy images
  preload() {
    // preload enemy card images
    for (const urlData of this.enemyUrls) {
      const enemyId = urlData[0];
      const url = urlData[1];
      this.load.image(enemyId, url);
    }

    //preload card images (spells and creatures)
    for (const urlData of this.cardUrls) {
      const cardId = urlData[0];
      const url = urlData[1];
      this.load.image(cardId, url);
    }

    // preload character image and game background
    this.load.image("stonePath", "src/assets/Stone_Path.png");
    this.load.image("gameBackground", "src/assets/Game_Background.png");
  }

  create() {
    // add game background
    this.add.image(600, 500, "gameBackground");
    // Everything is going to be dealt with through various handlers.
    this.EnemyHandler = new EnemyHandler(this);
    this.PlayerHandler = new PlayerHandler(this);
    this.HeroHandler = new HeroHandler(this);
    this.AllyHandler = new AllyHandler(this);
    this.RulesHandler = new RulesHandler(this);
    //this.CardHandler = new CardHandler();
    this.DeckHandler = new DeckHandler(this);
    this.GameHandler = new GameHandler(this);
    this.SocketHandler = new SocketHandler(this);
    this.UIHandler = new UIHandler(this);
    this.UIHandler.buildUI();
    this.InteractiveHandler = new InteractiveHandler(this);
    this.GameHandler.spawnEnemies();
  }

  update() {}
}
