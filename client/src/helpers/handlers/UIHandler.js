import ZoneHandler from "./ZoneHandler";

export default class UIHandler {
    constructor(scene) {

        //the play area is going to be comprized of dropZones, which will be handled with a ZoneHandler.
        this.zoneHandler = new ZoneHandler(scene);

        this.buildZones = () => {
            scene.dropZone = this.zoneHandler.renderZone(470, 500);
            this.zoneHandler.renderOutline(scene.dropZone);
        }

        this.buildPlayerArea = () => {
            scene.playerHandArea = scene.add.rectangle(470, 860, 850, 230);
            scene.playerHandArea.setStrokeStyle(4, 0x0096FF);
            scene.playerDeckArea = scene.add.rectangle(1000, 860, 155, 215);
            scene.playerDeckArea.setStrokeStyle(3, 0x00FFFF);
        }
        
        this.buildEnemyArea= () => {
            scene.enemyArea = scene.add.rectangle(470, 135, 1155, 230);
            scene.enemyArea.setStrokeStyle(4, 0x880808);
        }

        this.buildGameText = () => {
            scene.dealCards = scene.add.text(960, 465, "Deal Cards").setFontSize(14).setFontFamily("Treubuchet MS");
            scene.endTurn = scene.add.text(960, 365, "End Turn").setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.setPlayerHealth = (Health) => {
            healthString = `Player Health: ${Health}`;
            scene.playerHealth = scene.add.text(960, 415, healthString).setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.updatePlayerHealth = (Health) => {
            playerHealth.setText('Player Health' + Health);
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerArea();
            this.buildEnemyArea();
            this.buildGameText();
            this.setPlayerHealth(20);
        }

    }
}