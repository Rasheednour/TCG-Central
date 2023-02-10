export default class Enemy {
    constructor(scene, name, level, attack, defense, health, ability) {
        super(scene);
        this.name = name;
        this.level = level;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.ability = ability;
        
        this.takeDamage = (damage) => {
            this.health = this.health - damage;
            if(this.health <= 0) {
                //destroy the enemy
            }
        }
    }
}