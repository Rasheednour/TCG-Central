//GameHandler can handle game logic, including keeping track of cards, enemies, turns, etc.

export default class GameHandler{
    constructor(scene) {
        this.gameState = "Initializing";
        this.isMyTurn = true;
        this.playerDeck = [];
        this.playerHand = [];
        this.allies = [];

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            console.log("isMyTurn: " + this.isMyTurn);
            //Enemies take turn here
            scene.EnemyHandler.enemiesAttack();
            //reset resources, etc. and return to player turn.
            scene.UIHandler.updatePlayerHealth(scene.playerHandler.health);
            this.isMyTurn = !this.isMyTurn;
        }

        this.spawnEnemies = () => {
            for(let i in scene.EnemyHandler.enemies) {
                scene.EnemyHandler.spawnEnemy(155 + (i * 155), 135, scene.EnemyHandler.enemies[i])
            }
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
            console.log("GameState: " + this.gameState);
        }

        this.gameOver = () => {
            alert('GAME OVER');
            location.reload();
        }
    }
}