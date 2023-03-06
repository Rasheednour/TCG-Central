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
                scene.EnemyHandler.deleteEnemy(this.index);
                if(scene.EnemyHandler.enemyIndex < 1) {
                    scene.GameHandler.gameWon();
                }
            } else {
                scene.EnemyHandler.updateHealth(this.health, this.index);
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
            sprite = scene.add.image(0, 0, this.enemyCardSprite);
            let nameText = scene.add.text(-150, -300, `${this.name}`).setFontSize(40).setFontFamily("Treubuchet MS")
            let attackText = scene.add.text(-100, 240, `${this.attack}`).setFontSize(40).setFontFamily("Treubuchet MS")
            let defenseText = scene.add.text(0, 240, `${this.defense}`).setFontSize(40).setFontFamily("Treubuchet MS")
            let healthText = scene.add.text(100, 240, ` <3 ${this.health}`).setFontSize(40).setFontFamily("Treubuchet MS")
            let enemy = scene.add.container(x, y, [ sprite, attackText, defenseText, healthText, nameText ])
            .setDataEnabled()
            .setSize(sprite.width, sprite.height)
            .setScale(.25,.25)
            .setInteractive()
            .setData({
                "name": this.name,
                "attack": this.attack,
                "defense": this.defense,
                "health": this.health,
                "sprite": sprite,
                "attackText": attackText,
                "defenseText": defenseText,
                "healthText": healthText,
                "index": this.index
            });
            return enemy;
        }
    }
}


//.setInteractive(new Phaser.Geom.Rectangle(0,0, 85, 115), Phaser.Geom.Rectangle.Contains)