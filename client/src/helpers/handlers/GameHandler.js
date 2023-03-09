//GameHandler can handle game logic, including keeping track of cards, enemies, turns, etc.

export default class GameHandler{
    constructor(scene) {
        this.gameState = "Initializing";
        this.isMyTurn = true;
        this.playerDeck = [];
        

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
            console.log("start enemies " + scene.EnemyHandler.enemies);
            console.log("start allies " + scene.AllyHandler.allies);
            //Enemies take turn here
            scene.EnemyHandler.enemiesAttack();
            //Allies take turn here WILL CHANGE SOON:
            scene.AllyHandler.alliesAttack();
            //reset resources, etc. and return to player turn.
            scene.UIHandler.updatePlayerHealth(scene.PlayerHandler.health);
            scene.UIHandler.resetAllyPositions();
            scene.PlayerHandler.resetResources();
            console.log("end enemies " + scene.EnemyHandler.enemies);
            console.log("end allies " + scene.AllyHandler.allies);
            scene.socket.emit('drawCards', scene.socket.id, scene.RulesHandler.turnDraw)
            this.isMyTurn = !this.isMyTurn;
        }

        this.spawnEnemies = () => {
            for(let i in scene.EnemyHandler.enemyNames) {
                scene.EnemyHandler.spawnEnemy(155 + (i * 155), 135, 
                scene.EnemyHandler.enemyNames[i][0], 
                scene.EnemyHandler.enemyNames[i][1],
                scene.EnemyHandler.enemyNames[i][2],
                scene.EnemyHandler.enemyNames[i][3],
                scene.EnemyHandler.enemyNames[i][4],
                scene.EnemyHandler.enemyNames[i][5],  
                )
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