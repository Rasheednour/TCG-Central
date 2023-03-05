export default class Card {
    constructor(scene) {
        this.render = (x, y, identifier) => {
            let sprite;
            let attackText = "none";
            let defenseText = "none";
            let healthText = "none";
            let costText = "none";
            sprite = scene.add.image(0, 0, this.playerCardSprite);
            costText = scene.add.text(100, -300, `cost: ${this.cost}`).setFontSize(40).setFontFamily("Treubuchet MS");
            attackText = scene.add.text(-100, 240, `${this.attack}`).setFontSize(40).setFontFamily("Treubuchet MS");
            defenseText = scene.add.text(0, 240, `${this.defense}`).setFontSize(40).setFontFamily("Treubuchet MS");
            healthText = scene.add.text(100, 240, ` <3 ${this.health}`).setFontSize(40).setFontFamily("Treubuchet MS")
            
            let card = scene.add.container(x, y, [ sprite, attackText, defenseText, healthText, costText ])
            .setDataEnabled()
            .setSize(sprite.width, sprite.height)
            .setScale(.25,.25)
            .setInteractive()
            .setData({
                "name": this.name,
                "cost": this.cost,
                "attack": this.attack,
                "defense": this.defense,
                "health": this.health,
                "sprite": sprite,
                "attackText": attackText,
                "defenseText": defenseText,
                "healthText": healthText,
                "index": this.index,
                "id": identifier
            });
            scene.input.setDraggable(card);
            return card;
        }
    }
}