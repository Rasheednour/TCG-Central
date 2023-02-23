export default class Enemy {
    constructor(scene, name, level, attack, defense, health, ability, index) {
        this.name = name;
        this.level = level;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.ability = ability;
        this.index = index;
        
        this.takeDamage = (damage) => {
            this.health = this.health - damage;
            if(this.health <= 0) {
                console.log("enemy destroyed");
                scene.EnemyHandler.enemyIndex --;
                scene.EnemyHandler.deleteEnemy(this.index);
                console.log(scene.GameHandler.enemies);
                if(scene.EnemyHandler.enemyIndex < 1) {
                    scene.GameHandler.gameWon();
                }
            }
        }

        this.strike = () => {
            if(scene.AllyHandler.allies.length === 0) {
                scene.PlayerHandler.takeDamage(this.attack);
            } else {
                const target = 0;
                scene.AllyHandler.allies[target].takeDamage(this.attack);
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
                "sprite": sprite,
                "index": this.index
            });  
            return enemy;
        }
    }
}