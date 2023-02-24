//PlayerHandler should handle information about the player itself: health totals, etc.

export default class PlayerHandler {
    constructor(scene) {
        //default starting health is currently 20, but we will want to get this number from the database.
        this.health = 20;
        this.resources = 1;
        this.maxResources = 1;
        this.resourceGrowth = 1;

        this.takeDamage = (damageNumber) => {
            this.health = this.health - damageNumber;
            if (this.health < 1) {
                scene.GameHandler.gameOver();
            }
        }

        this.spendResources = (cost) => {
            this.resources = this.resources - cost;
            scene.UIHandler.updatePlayerResources(this.resources);
        }

        this.resetResources = () => {
            this.maxResources = this.maxResources + this.resourceGrowth;
            this.resources = this.maxResources;
            scene.UIHandler.updatePlayerResources(this.resources);
        }
    }
}