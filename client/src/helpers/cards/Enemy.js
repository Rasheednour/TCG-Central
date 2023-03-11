export default class Enemy {
  constructor(scene, sprite, name, attack, defense, health, ability, index) {
    this.name = name;
    this.sprite = sprite;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
    this.ability = ability;
    this.index = index;

    this.takeDamage = (damage) => {
      this.health = this.health - damage;
      if (this.health <= 0) {
        console.log("enemy destroyed");
        scene.EnemyHandler.deleteEnemy(this.index);
        if (scene.EnemyHandler.enemyIndex < 1) {
          scene.GameHandler.gameWon();
        }
      } else {
        scene.EnemyHandler.updateHealth(this.health, this.index);
      }
    };

    this.strike = () => {
      if (scene.AllyHandler.allies.length === 0) {
        scene.PlayerHandler.takeDamage(this.attack);
      } else {
        const target = 0;
        scene.AllyHandler.allies[target].takeDamage(this.attack);
      }
    };

    this.render = (x, y) => {
      let sprite = scene.add.image(0, 0, this.sprite);
      sprite.setScale(1.7);
      // add a white box on top of the static stats section in the enemy card image
      let statBox = scene.add.rectangle(0, 390, 500, 35, "0xffffff");
      // add dynamic stats text boxes
      let attackText = scene.add
        .text(-220, 375, `ATK/${this.attack}`)
        .setFontSize(30)
        .setFontFamily("Treubuchet MS")
        .setColor("#000")
        .setFontStyle("bold");
      let defenseText = scene.add
        .text(-50, 375, `DEF/${this.defense}`)
        .setFontSize(30)
        .setFontFamily("Treubuchet MS")
        .setColor("#000")
        .setFontStyle("bold");
      let healthText = scene.add
        .text(120, 375, `HP/${this.health}`)
        .setFontSize(30)
        .setFontFamily("Treubuchet MS")
        .setColor("#000")
        .setFontStyle("bold");
      let enemy = scene.add
        .container(x, y, [sprite, statBox, attackText, defenseText, healthText])
        .setDataEnabled()
        .setSize(sprite.width, sprite.height)
        .setScale(0.25, 0.25)
        .setInteractive()
        .setData({
          name: this.name,
          attack: this.attack,
          defense: this.defense,
          health: this.health,
          sprite: sprite,
          attackText: attackText,
          defenseText: defenseText,
          healthText: healthText,
          index: this.index,
        });
      return enemy;
    };
  }
}

//.setInteractive(new Phaser.Geom.Rectangle(0,0, 85, 115), Phaser.Geom.Rectangle.Contains)
