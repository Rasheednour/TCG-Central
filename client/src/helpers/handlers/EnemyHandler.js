import SampleEnemy from "../cards/SampleEnemy";

export default class EnemyHandler {
    constructor(scene) {
        this.enemyNames = ["Sample_Enemy"];
        this.enemyIndex = 0;
        this.enemies = []

        this.enemiesAttack = () => {
            for(let i in this.enemies) {
                this.enemies[i].strike();
            }
        }

        this.spawnEnemy = (x, y, name) => {
            let enemies = {
                //This is where we will load the Enemy types
                Sample_Enemy: new SampleEnemy(scene)
            }
            let newEnemy = enemies[name];
            this.enemies[this.enemyIndex] = newEnemy;
            this.enemyIndex = this.enemyIndex + 1;
            return(newEnemy.render(x, y));
        }
    }
}