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
    this.ability = ability; //ability is an array, not a string, but that is fine because we never render it
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
            type: this.type,
            name: this.name,
            cost: this.cost,
            attack: this.attack,
            defense: this.defense,
            health: this.health,
            ability: this.ability,
            sprite: sprite,
            attackText: attackText,
            defenseText: defenseText,
            healthText: healthText,
            index: this.index,
            attackedThisTurn: false,
            id: this.id,
          });
        scene.input.setDraggable(card);

        return card;
      } else if (this.type === "hero") {
        let nameText;
        let sprite;
        let attackText = "none";
        let defenseText = "none";
        let abilityText = "none";
        sprite = scene.add.image(0, 0, this.sprite);
        sprite.setScale(1.2);
        nameText = scene.add
          .text(-150, -300, `${this.name}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        attackText = scene.add
          .text(-100, 240, `${this.attack}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        defenseText = scene.add
          .text(0, 240, `${this.defense}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        abilityText = scene.add
          .text(0, 140, `${this.ability}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        // let hitBox = scene.add.zone(
        //   0,
        //   0,
        //   this.sprite.width,
        //   this.sprite.height
        // );
        // hitBox.setDropZone();

        let card = scene.add
          .container(x, y, [
            sprite,
            attackText,
            defenseText,
            nameText,
            abilityText,
            // hitBox,
          ])
          .setDataEnabled()
          .setSize(sprite.width, sprite.height)
          .setScale(0.25, 0.25)
          .setInteractive()
          .setData({
            type: this.type,
            name: this.name,
            cost: this.cost,
            attack: this.attack,
            defense: this.defense,
            health: this.health,
            ability: this.ability,
            sprite: sprite,
            attackText: attackText,
            defenseText: defenseText,
            index: this.index,
            attackedThisTurn: false,
            id: this.id,
          });
        scene.input.setDraggable(card);
        return card;
      } else if (this.type === "spell") {
        let sprite;
        sprite = scene.add.image(0, 0, this.sprite);
        sprite.setScale(1.7);
        let card = scene.add
          .container(x, y, [sprite])
          .setDataEnabled()
          .setSize(sprite.width, sprite.height)
          .setScale(0.25, 0.25)
          .setInteractive()
          .setData({
            type: this.type,
            name: this.name,
            cost: this.cost,
            attack: 0, //Spell cards may or may not have creature stats saved on the card, but we don't want them to
            defense: 0,
            health: 0,
            ability: this.ability,
            sprite: sprite,
            attackText: "",
            defenseText: "",
            healthText: "",
            index: this.index,
            attackedThisTurn: false,
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
