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
        inDeck: [],
        inHand: [],
        inPlay: [],
    }

    socket.on('dealDeck', function(socketId) {
        //where cards are currently loaded in.
        players[socketId].inDeck = shuffle(["Sample_Ally"]);
        console.log(players);
        io.emit('changeGameState', "Initializing");
    })

    socket.on('startGame', function (socketId) {
        for (let i = 0; i < 5; i++) {
            //if deck is empty, reshuffle in cards. Change later, possibly to shuffle discard?
            if (players[socketId].inDeck.length === 0) {
                players[socketId]. inDeck = shuffle(["Sample_Ally"]);
            }
            //deal top card from deck to hand
            players[socketId].inHand.push(players[socketId].inDeck.shift())
        }
        console.log(players);
        io.emit('startGame', socketId, players[socketId].inHand);
        gameState = 'Ready';
        io.emit('changeGameState', 'Ready'); 
    })

    socket.on('cardPlayed', function (cardName) {
        io.emit('cardPlayed', cardName);
    })
})

const port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('Server Started.');   
})