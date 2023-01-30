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
            scene.enemyArea = scene.add.rectangle(470, 135, 850, 230);
            scene.enemyArea.setStrokeStyle(4, 0x880808);
            scene.enemyArea = scene.add.rectangle(1000, 135, 155, 215);
            scene.enemyArea.setStrokeStyle(3, 0x880808);
        }

        this.buildGameText = () => {
            scene.dealCards = scene.add.text(960, 465, "Deal Cards").setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.buildUI = () => {
            this.buildZones();
            this.buildPlayerArea();
            this.buildEnemyArea();
            this.buildGameText();
        }

    }
}