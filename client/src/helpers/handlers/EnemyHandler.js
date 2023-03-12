import Enemy from "../cards/Enemy";
import activateEffect from "./activateEffect";

export default class EnemyHandler {
  constructor(scene) {
    //this is where the enemy information needs to end up to get enemies to spawn.
    this.enemyNames = scene.enemyList;
    //this index number is how we tie the JavaScipt Enemy objects to their Container representations.
    this.enemyIndex = 0;
    //this is where the spawned enemy JS objects end up
    this.enemies = [];
    //this is where the Phaser Containers representing the enemies end up
    this.enemySprites = [];

    this.enemiesAttack = () => {
      for (let i in this.enemies) {
        this.enemies[i].strike();
        for (
          let eff_index = 0;
          eff_index < this.enemies[i].ability.length;
          eff_index++
        ) {
          if (Math.floor(Math.random() * 4) > 2) {
            activateEffect(
              this.enemies[i].ability[eff_index],
              scene,
              i,
              "enemy"
            );
          }
        }

      }
    };

    this.spawnEnemy = (
      x,
      y,
      sprite,
      name,
      attack,
      defense,
      health,
      ability
    ) => {
      let newEnemy = new Enemy(
        scene,
        sprite,
        name,
        attack,
        defense,
        health,
        ability,
        this.enemyIndex
      );
      this.enemies[this.enemyIndex] = newEnemy;
      this.enemySprites[this.enemyIndex] = newEnemy.render(x, y);
      this.enemyIndex = this.enemyIndex + 1;
      console.log(this.enemySprites);
      return;
    };

    this.updateHealth = (health, index) => {
      this.enemySprites[index].list[4].setText(`HP/${health}`);
    };

    this.updateAttack = (value, index) => {
      this.enemies[index].attack = Number(value);
      this.enemySprites[index].list[2].setText(`ATK/${value}`);
    };

    this.updateDefense = (value, index) => {
      this.enemies[index].defense = Number(value);
      this.enemySprites[index].list[3].setText(`DEF/${value}`);
    };


    this.deleteEnemy = (index) => {
      this.enemySprites[index].visible = false;
      this.enemies.splice(index, 1);
      this.enemySprites.splice(index, 1);
      scene.EnemyHandler.enemyIndex--;
      for (let i in this.enemies) {
        if (this.enemies[i].index > index) {
          this.enemies[i].index--;
        }
      }
      for (let i in this.enemySprites) {
        if (this.enemySprites[i].data.index > index) {
          this.enemySprites[i].data.index--;
        }
      }
    };
  }
}
