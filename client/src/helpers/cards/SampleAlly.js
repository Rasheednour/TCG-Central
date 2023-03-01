import Ally from "./Ally";

export default class SampleAlly extends Ally {
    constructor(scene, index) {
        super(scene);
        this.name = "Sample_Ally";
        this.enemyCardSprite = "stonePath";
        this.cost = 1;
        this.attack = 1;
        this.defense = 0;
        this.health = 2;
        this.ability = "";
        this.index = index
        this.playerCardSprite = "stonePath";
    }
}