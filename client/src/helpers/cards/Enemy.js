export default class Enemy {
    constructor(scene, name, level, attack, defense, health, ability) {
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

        this.render = (x, y) => {
            let sprite;
            sprite = this.enemyCardSprite;
            let enemy = scene.add.image(x, y, sprite).setScale(.25, .25).setInteractive().setData({
                "name": this.name,
                "attack": this.attack,
                "defense": this.defense,
                "health": this.health,
                "sprite": sprite
            });  
            return enemy;
        }
    }
}