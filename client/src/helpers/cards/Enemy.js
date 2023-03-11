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
      let damage = this.attack;
      if (scene.AllyHandler.allies.length === 0) {
        damage = damage - scene.HeroHandler.hero.data.values.defense;
        if (damage < 0) {
          damage = 0;
        }
        scene.PlayerHandler.takeDamage(damage);
      } else {
        const target = Math.floor(
          Math.random() * scene.AllyHandler.allies.length
        );
        damage = damage - scene.AllyHandler.allies[target].defense;
        if (damage < 0) {
          damage = 0;
        }
        scene.AllyHandler.allies[target].takeDamage(damage);
      }
    };

    this.render = (x, y) => {
      let sprite = scene.add.image(0, 0, this.sprite);
      let nameText = scene.add
        .text(-150, -300, `${this.name}`)
        .setFontSize(40)
        .setFontFamily("Treubuchet MS");
      let attackText = scene.add
        .text(-100, 240, `${this.attack}`)
        .setFontSize(40)
        .setFontFamily("Treubuchet MS");
      let defenseText = scene.add
        .text(0, 240, `${this.defense}`)
        .setFontSize(40)
        .setFontFamily("Treubuchet MS");
      let healthText = scene.add
        .text(100, 240, ` <3 ${this.health}`)
        .setFontSize(40)
        .setFontFamily("Treubuchet MS");
      let hitBox = scene.add
        .zone(0, 0, sprite.width, sprite.height)
        .setDropZone();
      let enemy = scene.add
        .container(x, y, [
          sprite,
          attackText,
          defenseText,
          healthText,
          nameText,
          hitBox,
        ])
        .setDataEnabled()
        .setSize(sprite.width, sprite.height)
        .setScale(0.25, 0.25)
        .setInteractive()
        .setData({
          type: "enemy",
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
