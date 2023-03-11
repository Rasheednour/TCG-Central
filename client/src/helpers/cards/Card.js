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
        let nameText;
        let sprite;
        let attackText = "none";
        let defenseText = "none";
        let healthText = "none";
        let abilityText = "none";
        let costText = "none";
        sprite = scene.add.image(0, 0, this.sprite);
        nameText = scene.add
          .text(-150, -300, `${this.name}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        costText = scene.add
          .text(100, -300, `cost: ${this.cost}`)
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
        healthText = scene.add
          .text(100, 240, ` <3 ${this.health}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        // let hitBox = scene.add
        //   .zone(0, 0, sprite.width, sprite.height)
        //   .setDropZone();

        let card = scene.add
          .container(x, y, [
            sprite,
            attackText,
            defenseText,
            healthText,
            costText,
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
            healthText: healthText,
            index: this.index,
            attackedThisTurn: false,
            id: this.id,
          });
        scene.input.setDraggable(card);
        //TRYING ALTERNATE WAY OF SETTING DROP ZONE
        //scene.input.setDropZone(card);
        return card;
      } else if (this.type === "hero") {
        let nameText;
        let sprite;
        let attackText = "none";
        let defenseText = "none";
        let abilityText = "none";
        sprite = scene.add.image(0, 0, this.sprite);
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
        // let hitBox = scene.add
        //   .zone(0, 0, sprite.width, sprite.height)
        //   .setDropZone();

        let card = scene.add
          .container(x, y, [
            sprite,
            attackText,
            defenseText,
            nameText,
            abilityText,
            // hitBox
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
        let nameText;
        let sprite;
        let attackText = "none";
        let defenseText = "none";
        let healthText = "none";
        let abilityText = "none";
        let costText = "none";
        sprite = scene.add.image(0, 0, this.sprite);
        nameText = scene.add
          .text(-150, -300, `${this.name}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        costText = scene.add
          .text(100, -300, `cost: ${this.cost}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");
        abilityText = scene.add
          .text(0, 140, `${this.ability}`)
          .setFontSize(40)
          .setFontFamily("Treubuchet MS");

        let card = scene.add
          .container(x, y, [sprite, costText, nameText, abilityText])
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
