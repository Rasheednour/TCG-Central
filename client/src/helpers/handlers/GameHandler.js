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
            this.isMyTurn = !this.isMyTurn;
        }

        this.spawnEnemies = () => {
            
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