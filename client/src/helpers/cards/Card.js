export default class Card {
  constructor(
    scene,
    type,
    name,
    sprite,
    cost,
    attack,
    defense,
    health,
    ability,
    id
  ) {
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
      if (this.type === "ally") {
        let sprite;
        let attackText = "none";
        let defenseText = "none";
        let healthText = "none";
        sprite = scene.add.image(0, 0, this.sprite);
        sprite.setScale(1.7);
        // add a white box on top of the static stats section in the card image
        let statBox = scene.add.rectangle(0, 390, 500, 35, "0xffffff");
        // add dynamic stats text boxes
        attackText = scene.add
          .text(-220, 375, `ATK/${this.attack}`)
          .setFontSize(30)
          .setFontFamily("Treubuchet MS")
          .setColor("#000")
          .setFontStyle("bold");
        defenseText = scene.add
          .text(-50, 375, `DEF/${this.defense}`)
          .setFontSize(30)
          .setFontFamily("Treubuchet MS")
          .setColor("#000")
          .setFontStyle("bold");
        healthText = scene.add
          .text(120, 375, ` HP/${this.health}`)
          .setFontSize(30)
          .setFontFamily("Treubuchet MS")
          .setColor("#000")
          .setFontStyle("bold");

        let card = scene.add
          .container(x, y, [
            sprite,
            statBox,
            attackText,
            defenseText,
            healthText,
          ])
          .setDataEnabled()
          .setSize(sprite.width, sprite.height)
          .setScale(0.25, 0.25)
          .setInteractive()
          .setData({
            name: this.name,
            cost: this.cost,
            attack: this.attack,
            defense: this.defense,
            health: this.health,
            sprite: sprite,
            attackText: attackText,
            defenseText: defenseText,
            healthText: healthText,
            index: this.index,
            id: this.id,
          });
        scene.input.setDraggable(card);
        return card;
      } else {
        return;
      }
    };
  }
}
