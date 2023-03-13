import io from "socket.io-client";

export default class SocketHandler {
  constructor(scene) {
    scene.socket = io('https://tcg-maker-phaser.herokuapp.com/');
    //scene.socket = io("http://localhost:3000");
    //server connects, and tells the server to deal a deck.
    scene.socket.on("connect", () => {
      console.log("connected!");
      // send the deck of cards to the server to be shuffled/dealt/kept track of.
      scene.socket.emit("dealDeck", scene.socket.id, scene.cardDeck, scene.character, scene.gameRules.starting_health);
    });
    //Starts the first turn
    scene.socket.on("firstTurn", () => {
      scene.GameHandler.changeTurn();
    });

    //Deal one cardBack to signify decks. Will need to change later.
    scene.socket.on("changeGameState", (gameState) => {
      scene.GameHandler.changeGameState(gameState);
      if (gameState === "Initializing") {
        //set the interactive buttons to be interactable
        scene.startGame.setInteractive();
        scene.endTurn.setInteractive();
        scene.startGame.setColor("#00ffff");
      }
    });

    //end turn
    scene.socket.on("changeTurn", () => {
      scene.GameHandler.changeTurn();
    });

        //tells the server to deal cards
        scene.socket.on('startGame', (socketId, cards, hero) => {
            if (socketId === scene.socket.id) {
                for (let i in cards) {
                    scene.PlayerHandler.playerHand.push(scene.DeckHandler.dealCard(133 + (i* (850/cards.length)), 860, cards[i]));
                }
                scene.HeroHandler.hero = scene.DeckHandler.dealCard(1000, 860, hero[0])
            }
        })

        //to Draw Cards, and reset hand positions accordingly.
        scene.socket.on('resetHand', (socketId, cards) => {
            if(socketId === scene.socket.id) {
                scene.PlayerHandler.resetHand();
                for(let i = 0; i< cards.length; i++) {
                    scene.PlayerHandler.playerHand.push(scene.DeckHandler.dealCard(155 + (i * (850/cards.length)), 860, cards[i]));
                }
            }
        })
    }
}

