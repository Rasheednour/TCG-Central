const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const { readFileSync, writeFileSync } = require("fs");
const shuffle = require("shuffle-array");
const { callbackify } = require("util");
let players = {};
let gameState = "Initializing";

const io = require("socket.io")(http, {
  cors: {
    //origin: 'https://tcg-maker-phaser.herokuapp.com/',
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
server.use(serveStatic(__dirname + "/client/dist"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// function that takes data and path and saves the data as JSON file in the provided path
function writeFileNew(data, path) {
  const jsonString = JSON.stringify(data);
  writeFileSync(path, jsonString, function (err, result) {
    if (err) console.log("error, err");
  });
}

// Endpoint to receive data via POST request
server.post("/data", function (req, res) {
  const data = req.body;
  // get card data from the request body
  const cards = data.cards;
  let deckCards = [];
  let cardIDs = [];
  // create card objects to be saved for Phaser
  cards.forEach((card) => {
    if (card.type === "CREATURE") {
      const newCard = [
        "ally",
        card.name,
        card.card_id,
        card.cost,
        card.attack,
        card.defense,
        card.health,
        "",
      ];
      deckCards.push(newCard);
      if (!cardIDs.includes(card.card_id)) {
        cardIDs.push(card.card_id);
      }
    }
    // write card IDs as well as card data in two separate JSON files to be used by the client
    writeFileNew(cardIDs, "./client/src/assets/card_ids.json");
    writeFileNew(deckCards, "./client/src/assets/cards.json");
  });

  // io.emit('dataReceived', data);
  res.status(200).send(cardIDs);
});

server.get("/", function (req, res) {
  res.send("Server Listening...");
});

io.on("connection", function (socket) {
  console.log("A player connected " + socket.id);
  // read the card data from the local JSON file
  let rawData = readFileSync("./client/src/assets/cards.json");
  let cards = JSON.parse(rawData);

  players[socket.id] = {
    //Deck is where the cards should be loaded in.
    //Cards are as follows [card_type, card_name, card_sprite, cost, attack, defense, health, ability]
    deck: cards,
    inDeck: [],
    inHand: [],
    inPlay: [],
  };

  socket.on("dealDeck", function (socketId) {
    //where cards are currently loaded in.
    let deck = [];
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
