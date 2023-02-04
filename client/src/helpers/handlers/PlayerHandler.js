//PlayerHandler should handle information about the player itself: health totals, etc.

export default class PlayerHandler {
    constructor(scene) {
        //default starting health is currently 20, but we will want to get this number from the database.
        this.health = 20;
    }
}