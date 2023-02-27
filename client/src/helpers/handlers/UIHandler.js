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
            scene.enemyArea = scene.add.rectangle(570, 135, 1050, 230);
            scene.enemyArea.setStrokeStyle(4, 0x880808);
        }

        this.buildGameText = () => {
            scene.dealCards = scene.add.text(960, 465, "Deal Cards").setFontSize(14).setFontFamily("Treubuchet MS");
            scene.endTurn = scene.add.text(960, 365, "End Turn").setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.setPlayerResources = (Resources) => {
            let resourceString = `Resources: ${Resources}`;
            scene.playerResources = scene.add.text(960, 515, resourceString).setFontSize(14).setFontFamily("Treubuchet MS");
        }
        
        this.updatePlayerResources = (Resources) => {
            scene.playerResources.setText('Resources: ' + Resources);
        }

        this.setPlayerHealth = (Health) => {
            let healthString = `Player Health: ${Health}`;
            scene.playerHealth = scene.add.text(960, 415, healthString).setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.updatePlayerHealth = (Health) => {
            scene.playerHealth.setText('Player Health: ' + Health);
        }

        this.resetAllyPositions = () => {
            scene.dropZone.data.values.cards = 0;
            for(let ally in scene.AllyHandler.allySprites) {
                console.log("checking for ally " + scene.AllyHandler.allySprites[ally]);
                for(let i in scene.PlayerHandler.playerHand) {
                    console.log("checking card " + scene.PlayerHandler.playerHand[i].data.values.id)
                    if(scene.AllyHandler.allySprites[ally] === scene.PlayerHandler.playerHand[i].data.values.id) {
                        scene.PlayerHandler.playerHand[i].x = (scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 150);
                        scene.PlayerHandler.playerHand[i].y = scene.dropZone.y;
                        scene.dropZone.data.values.cards++;
                    }
                }
            }
            console.log(scene.dropZone.data.values.cards);
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerArea();
            this.buildEnemyArea();
            this.buildGameText();
            this.setPlayerHealth(20);
            this.setPlayerResources(1);
        }

    }
}