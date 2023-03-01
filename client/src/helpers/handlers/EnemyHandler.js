import SampleEnemy from "../cards/SampleEnemy";

export default class EnemyHandler {
    constructor(scene) {
        this.enemyNames = ["Sample_Enemy", "Sample_Enemy"];
        this.enemyIndex = 0;
        this.enemies = [];
        this.enemySprites = [];

        this.enemiesAttack = () => {
            for(let i in this.enemies) {
                this.enemies[i].strike();
            }
        }

        this.spawnEnemy = (x, y, name) => {
            let enemies = {
                //This is where we will load the Enemy types
                Sample_Enemy: new SampleEnemy(scene, this.enemyIndex)
            }
            let newEnemy = enemies[name];
            this.enemies[this.enemyIndex] = newEnemy;
            this.enemySprites[this.enemyIndex] = (newEnemy.render(x, y));
            this.enemyIndex = this.enemyIndex + 1;
            return;
        }

        this.deleteEnemy = (index) => {
            this.enemySprites[index].visible = false;
            this.enemies.splice(index, 1);
            this.enemySprites.splice(index, 1);
            scene.EnemyHandler.enemyIndex --;
            for(let i in this.enemies) {
                if(this.enemies[i].index > index) {
                    this.enemies[i].index --;
                }
            }
            for(let i in this.enemySprites) {
                if(this.enemySprites[i].data.index > index) {
                    this.enemySprites[i].data.index --;
                }
            }
        }
    }
}