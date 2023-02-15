import Card from "./Card"

export default class Ally extends Card {
    constructor(scene, name, cost, attack, defense, health, ability) {
        super(scene);
        this.name = name;
        this.cost = cost;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.ability = ability;

        this.takeDamage = (damage) => {
            this.health = this.health - damage;
            if(this.health <= 0) {
                console.log("ally destroyed");
            }
        }
        
        //strike will currently hit a random enemy.
        this.strike = () => {
            if(scene.GameHandler.enemies.length > 0) {
                const target = Math.floor(Math.random() * scene.GameHandler.enemies.length);
                scene.GameHandler.enemies[target].takeDamage(this.attack);
            } else {
                console.log("No enemies to Target!");
                return;
            }
        }
    }
}