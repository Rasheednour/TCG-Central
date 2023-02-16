import Enemy from "./Enemy";

export default class SampleEnemy extends Enemy {
    constructor(scene) {
        super(scene);
        this.name = "Sample_Enemy";
        this.enemyCardSprite = "blazingGlory";
        this.attack = 1;
        this.defense = 0;
        this.health = 2;
        this.ability = "";
    }
}