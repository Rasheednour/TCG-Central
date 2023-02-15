import Ally from "./Ally";

export default class SampleAlly extends Ally {
    constructor(scene) {
        super(scene);
        this.name = "Sample Ally";
        this.enemyCardSprite = "stonePath";
        this.attack = 1;
        this.defense = 0;
        this.health = 2;
        this.ability = "";
        this.playerCardSprite = "stonePath";
    }
}