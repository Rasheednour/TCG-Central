import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {

        //scene.socket = io('https://tcg-maker-phaser.herokuapp.com/');
        scene.socket = io('http://localhost:3000');
        //server connects, and tells the server to deal a deck.
        scene.socket.on('connect', () => {
            console.log("connected!");
            scene.socket.emit('dealDeck', scene.socket.id);
        })
        //Starts the first turn
        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        })
        
        //Deal one cardBack to signify decks. Will need to change later.
        scene.socket.on('changeGameState', (gameState) =>{
            scene.GameHandler.changeGameState(gameState);
            if (gameState === 'Initializing') {
                scene.DeckHandler.dealCard(1000, 860, "cardBack", 'playerCard');
                //set the interactive buttons to be interactable
                scene.startGame.setInteractive();
                scene.endTurn.setInteractive();
                scene.startGame.setColor('#00ffff');
            }
        })

        //end turn
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        })

        //tells the server to deal cards
        scene.socket.on('startGame', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    let card = scene.PlayerHandler.playerHand.push(scene.DeckHandler.dealCard(155 + (i* 155), 860, cards[i], "playerCard"));
                }
            }
        })
    }
}