import Card from "./Card"

export default class Ally extends Card {
    constructor(scene, name, attack, defense, health, ability) {
        super(scene);
        this.name = name;
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
        
        this.strike = () => {
            if(scene.gameHandler.enemies.length > 0) {
                const target = Math.floor(Math.random() * scene.gameHandler.enemies.length);
                scene.gameHandler.enemies[target].takeDamage(this.attack);
            } else {
                console.log("No enemies to Target!")
                return;
            }
        }
    }
}