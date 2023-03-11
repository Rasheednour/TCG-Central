import ZoneHandler from "./ZoneHandler";

const STARTING_RESOURCES = 1;
const STARTING_PLAYER_HEALTH = 20;

export default class UIHandler {
  constructor(scene) {
    //the play area is going to be comprized of dropZones, which will be handled with a ZoneHandler.
    this.zoneHandler = new ZoneHandler(scene);

    this.buildZones = () => {
      scene.dropZone = this.zoneHandler.renderZone(470, 500);
      this.zoneHandler.renderOutline(scene.dropZone);
    };

    this.buildPlayerArea = () => {
      scene.playerHandArea = scene.add.rectangle(470, 860, 850, 230);
      scene.playerHandArea.setStrokeStyle(4, 0x0096ff);
      scene.playerDeckArea = scene.add.rectangle(1000, 860, 155, 215);
      scene.playerDeckArea.setStrokeStyle(3, 0x00ffff);
    };

    this.buildEnemyArea = () => {
      scene.enemyArea = scene.add.rectangle(570, 135, 1050, 230);
      scene.enemyArea.setStrokeStyle(4, 0x880808);
    };

    //builds the Start Game and End Turn buttons
    this.buildGameText = () => {
      scene.startGame = scene.add
        .text(960, 465, "Start Game")
        .setFontSize(14)
        .setFontFamily("Treubuchet MS");
      scene.endTurn = scene.add
        .text(960, 365, "End Turn")
        .setFontSize(14)
        .setFontFamily("Treubuchet MS");
    };

    this.setPlayerResources = (Resources) => {
      let resourceString = `Resources: ${Resources}`;
      scene.playerResources = scene.add
        .text(960, 515, resourceString)
        .setFontSize(14)
        .setFontFamily("Treubuchet MS");
    };

    this.updatePlayerResources = (Resources) => {
      scene.playerResources.setText("Resources: " + Resources);
    };

    this.setPlayerHealth = (Health) => {
      let healthString = `Player Health: ${Health}`;
      scene.playerHealth = scene.add
        .text(960, 415, healthString)
        .setFontSize(14)
        .setFontFamily("Treubuchet MS");
    };

    this.updatePlayerHealth = (Health) => {
      scene.playerHealth.setText("Player Health: " + Health);
    };

    /*
        Resets the dropZone's cards to 0
        
        Goes through every ally id recorded in AllyHandler's allySprites,
        and checks them aginst PlayerHandler's playerHand list, which remembers every card GameObject
        that the player has seen throughout the game. If one matches, it places it in the first available
        spot in the dropZone. This makes sure that the dropZone doesn't have gaps, and new cards are ready to be played.

        */
    this.resetAllyPositions = () => {
      scene.dropZone.data.values.cards = 0;
      for (let ally in scene.AllyHandler.allySprites) {
        //console.log("checking for ally " + scene.AllyHandler.allySprites[ally]);
        for (let i in scene.PlayerHandler.playedCards) {
          //console.log("checking card " + scene.PlayerHandler.playedCards[i].data.values.id)
          if (
            scene.AllyHandler.allySprites[ally] ===
            scene.PlayerHandler.playedCards[i].data.values.id
          ) {
            scene.PlayerHandler.playedCards[i].x =
              scene.dropZone.x - 350 + scene.dropZone.data.values.cards * 150;
            scene.PlayerHandler.playedCards[i].y = scene.dropZone.y;
            scene.dropZone.data.values.cards++;
          }
        }
      }
    };

    this.buildUI = () => {
      this.buildZones();
      this.buildPlayerArea();
      this.buildEnemyArea();
      this.buildGameText();
      this.setPlayerHealth(STARTING_PLAYER_HEALTH);
      this.setPlayerResources(STARTING_RESOURCES);
    };
  }
}
