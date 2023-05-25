export default class Ally {
  constructor(scene, name, cost, attack, defense, health, ability, id) {
    this.scene = scene;
    this.name = name;
    this.cost = cost;
    this.attack = attack;
    this.defense = defense;
    this.health = health;
    this.ability = ability;
    this.id = id;

    this.takeDamage = (damage) => {
      this.health = this.health - damage;
      if (this.health <= 0) {
        console.log("ally destroyed");
        scene.AllyHandler.deleteAlly(this.id);
      } else {
        scene.AllyHandler.updateHealth(this.health, this.id);
      }
    };

    //strike will currently hit a random enemy.
    this.strike = () => {
      if (scene.EnemyHandler.enemies.length > 0) {
        const target = Math.floor(
          Math.random() * scene.EnemyHandler.enemies.length
        );
        scene.EnemyHandler.enemies[target].takeDamage(this.attack);
      } else {
        console.log("No enemies to Target!");
        return;
      }
    };
  }
}
