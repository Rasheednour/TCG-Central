import SampleEnemy from "../cards/SampleEnemy";

export default class EnemyHandler {
    constructor(scene) {
        this.enemies = ["Sample_Enemy"];

        this.enemiesAttack = () => {
            for(i = 0 ; i < this.enemies.length; i++) {
                this.enemies[i].strike();
            }
        }

        this.spawnEnemy = (x, y, name) => {
            let enemies = {
                //This is where we will load the Enemy types
                Sample_Enemy: new SampleEnemy(scene)
            }
            let newEnemy = enemies[name];
            return(newEnemy.render(x, y));
        }
    }
}