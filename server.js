const server = require("express")();
const http = require("http").createServer(server);
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const shuffle = require("shuffle-array");
let players = {};
let gameState = "Initializing";

const io = require("socket.io")(http, {
  cors: {
    //origin: 'https://tcg-maker-phaser.herokuapp.com/',
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.use(serveStatic(__dirname + "/client/dist"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get("/", function (req, res) {
  res.send("Server Listening...");
});

io.on("connection", function (socket) {
  console.log("A player connected " + socket.id);

  players[socket.id] = {
    //Deck is where the cards should be loaded in.
    //Cards are as follows [card_type, card_name, card_sprite, cost, attack, defense, health, ability]
    deck: [],
    inDeck: [],
    inHand: [],
    inPlay: [],
  };

  socket.on("dealDeck", function (socketId, cardDeck) {
    //where cards are currently loaded in.
    let deck = [];
    // get the deck of cards to be shuffled from the client
    players[socketId].deck = cardDeck;
    for (let i = 0; i < players[socketId].deck.length; i++) {
      deck[i] = players[socketId].deck[i];
    }
    players[socketId].inDeck = shuffle(deck);
    console.log(players);
    io.emit("changeGameState", "Initializing");
  });

  //starts the game by dealing the player numCards cards.
  socket.on("startGame", function (socketId, numCards) {
    for (let i = 0; i < numCards; i++) {
      //if deck is empty, reshuffle in cards. Change later, possibly to shuffle discard?
      if (players[socketId].inDeck.length === 0) {
        let deck = [];
        for (let j = 0; j < players[socketId].deck.length; j++) {
          deck[j] = players[socketId].deck[j];
        }
        players[socketId].inDeck = shuffle(deck);
      }
      //deal top card from deck to hand
      players[socketId].inHand.push(players[socketId].inDeck.shift());
    }
    console.log(players);
    io.emit("startGame", socketId, players[socketId].inHand);
    gameState = "Ready";
    io.emit("changeGameState", "Ready");
  });

  socket.on("cardPlayed", function (cardName) {
    io.emit("cardPlayed", cardName);
  });

  /*socket.on('drawCard', function(socketId, numCards) {
        for(let i = 0; i < numCards; i++) {
            if(players[socketId].inDeck.length === 0) {
                players.inDeck = shuffle[shuffleDeck];
            }
        }
    })*/
});

const port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log("Server Started.");
});
