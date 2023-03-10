const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static')
const shuffle = require('shuffle-array');
let players = {};
let gameState = 'Initializing';

const io = require('socket.io')(http, {
    cors: {
        //origin: 'https://tcg-maker-phaser.herokuapp.com/',
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
});

server.use(cors());
server.use(serveStatic(__dirname + "/client/dist"));

io.on('connection', function(socket) {
    console.log('A player connected ' + socket.id);

    players[socket.id] = {
        //Deck is where the cards should be loaded in.
        //Cards are as follows [card_type, card_name, card_sprite, cost, attack, defense, health, ability]
        deck: [["ally", "Sample_Ally", "stonePath", 1, 1, 0, 2, ""]],
        hero: [["hero", "Sample_Hero", "stonePath", 0, 1, 0, 20, ""]],
        inDeck: [],
        inHand: [],
        inPlay: [],
    }

    socket.on('dealDeck', function(socketId) {
        //where cards are currently loaded in.
        let deck = [];
        for(let i = 0; i< players[socketId].deck.length; i++) {
            deck[i] = players[socketId].deck[i];
        }
        players[socketId].inDeck = shuffle(deck);
        console.log(players);
        io.emit('changeGameState', "Initializing");
    })

    //starts the game by dealing the player numCards cards.
    socket.on('startGame', function (socketId, numCards) {
        for (let i = 0; i < numCards; i++) {
            //if deck is empty, reshuffle in cards. Change later, possibly to shuffle discard?
            if (players[socketId].inDeck.length === 0) {
                let deck = [];
                for(let j = 0; j< players[socketId].deck.length; j++) {
                    deck[j] = players[socketId].deck[j];
                }
                players[socketId].inDeck = shuffle(deck);
            }
            //deal top card from deck to hand
            players[socketId].inHand.push(players[socketId].inDeck.shift())
        }
        console.log(players);
        io.emit('startGame', socketId, players[socketId].inHand, players[socketId].hero);
        gameState = 'Ready';
        io.emit('changeGameState', 'Ready'); 
    })

    socket.on('cardPlayed', function (socketId, cardName) {
        for(let i = 0; i< players[socketId].inHand.length; i++) {
            console.log(`checking for ${players[socketId].inHand[i][2]}`);
            if(players[socketId].inHand[i][1] == cardName) {
                players[socketId].inPlay.push(players[socketId].inHand[i]);
                players[socketId].inHand.splice(i,1);
                break;
            }
        }
        console.log(players);
    })

    socket.on('drawCards', function(socketId, numCards) {
        for(let i = 0; i < numCards; i++) {
            if(players[socketId].inDeck.length === 0) {
                let deck = [];
                for(let j = 0; j< players[socketId].deck.length; j++) {
                    deck[j] = players[socketId].deck[j];
                }
                players[socketId].inDeck = shuffle(deck);
            }
            players[socketId].inHand.push(players[socketId].inDeck.shift())
        }
        io.emit('resetHand', socketId, players[socketId].inHand);
    })
})



const port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('Server Started.');   
})