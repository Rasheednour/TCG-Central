export default class Card {
    constructor(scene, type, name, sprite, cost, attack, defense, health, ability, id) {

        this.type = type;
        this.name = name;
        this.sprite = sprite;
        this.cost = cost;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.ability = ability;
        this.id = id;

        this.render = (x, y) => {
            if(this.type === "ally"){
                let nameText;
                let sprite;
                let attackText = "none";
                let defenseText = "none";
                let healthText = "none";
                let costText = "none";
                sprite = scene.add.image(0, 0, this.sprite);
                nameText = scene.add.text(-150, -300, `${this.name}`).setFontSize(40).setFontFamily("Treubuchet MS");
                costText = scene.add.text(100, -300, `cost: ${this.cost}`).setFontSize(40).setFontFamily("Treubuchet MS");
                attackText = scene.add.text(-100, 240, `${this.attack}`).setFontSize(40).setFontFamily("Treubuchet MS");
                defenseText = scene.add.text(0, 240, `${this.defense}`).setFontSize(40).setFontFamily("Treubuchet MS");
                healthText = scene.add.text(100, 240, ` <3 ${this.health}`).setFontSize(40).setFontFamily("Treubuchet MS")
            
                let card = scene.add.container(x, y, [ sprite, attackText, defenseText, healthText, costText, nameText ])
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
                    "id": this.id
                });
                scene.input.setDraggable(card);
                return card;
            } else {
                return;
            }          
        }
    }
}