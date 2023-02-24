//GameHandler can handle game logic, including keeping track of cards, enemies, turns, etc.

export default class GameHandler{
    constructor(scene) {
        this.gameState = "Initializing";
        this.isMyTurn = true;
        this.playerDeck = [];
        //this is where the rendered player cards end up. V
        this.playerHand = [];
        

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            console.log("isMyTurn: " + this.isMyTurn);
            //Enemies take turn here
            scene.EnemyHandler.enemiesAttack();
            //Allies take turn here WILL CHANGE SOON:
            scene.AllyHandler.alliesAttack();
            //reset resources, etc. and return to player turn.
            scene.UIHandler.updatePlayerHealth(scene.PlayerHandler.health);
            scene.PlayerHandler.resetResources();
            this.isMyTurn = !this.isMyTurn;
        }

        this.spawnEnemies = () => {
            for(let i in scene.EnemyHandler.enemyNames) {
                scene.EnemyHandler.spawnEnemy(155 + (i * 155), 135, scene.EnemyHandler.enemyNames[i])
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

        this.gameWon = () => {
            alert('GAME WON!')
            location.reload();
        }
    }
}