const server = require('express')();
const http = require('http').createServer(server);
const cors = require('cors');
const shuffle = require('shuffle-array');
let players = {};
let readyCheck = 0;
let gameState = 'Initializing';

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
});

io.on('connection', function(socket) {
    console.log('A player connected ' + socket.id);

    players[socket.id] = {
        inDeck: [],
        inHand: [],
    }

    socket.on('dealDeck', function(socketId) {
        players[socketId].inDeck = shuffle(["stonePath", "blazingGlory"]);
        console.log(players);
        io.emit('changeGameState', "Initializing");
    })

    socket.on('dealCards', function (socketId) {
        for (let i = 0; i < 5; i++) {
            //if deck is empty, reshuffle in cards. Change later, possibly to shuffle discard?
            if (players[socketId].inDeck.length === 0) {
                players[socketId]. inDeck = shuffle(["stonePath", "blazingGlory"]);
            }
            //deal top card from deck to hand
            players[socketId].inHand.push(players[socketId].inDeck.shift())
        }
        console.log(players);
        io.emit('dealCards', socketId, players[socketId].inHand);
        gameState = 'Ready';
        io.emit('changeGameState', 'Ready'); 
    })

    //right now, when a card is played, the turn changes. This will be changed.
    socket.on('cardPlayed', function (cardName, socketId) {
        io.emit('cardPlayed', cardName, socketId);
        io.emit('changeTurn');
    })
})

http.listen(3000, function () {
    console.log('Server Started.');   
})