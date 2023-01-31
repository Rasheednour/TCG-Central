import io from 'socket.io-client';

export default class SocketHandler {
    constructor(scene) {

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
                scene.DeckHandler.dealCard(1000, 135, "cardBack", "enemyCard");
                scene.dealCards.setInteractive();
                scene.dealCards.setColor('#00ffff');
            }
        })

        //end turn
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        })

        //tells the server to deal cards
        scene.socket.on('dealCards', (socketId, cards) => {
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    let card = scene.GameHandler.playerHand.push(scene.DeckHandler.dealCard(155 + (i* 155), 860, cards[i], "playerCard"));
                }
            } else {
                for (let i in cards) {
                    let card = scene.GameHandler.enemies.push(scene.DeckHandler.dealCard(155 + (i * 155), 135, "cardBack", "enemyCard"));
                }
            }
        })

        //when a card is played.
        scene.socket.on('cardPlayed', (cardName, socketId) => {
            if (socketId !== scene.socket.id) {
                scene.GameHandler.enemies.shift().destroy();
                scene.DeckHandler.dealCard((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 150), scene.dropZone.y, cardName, "playerCard");
                scene.dropZone.data.values.cards++;
            }
        })
    }
}