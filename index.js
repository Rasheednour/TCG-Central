const express = require('express');
const Firestore = require('@google-cloud/firestore');

const db = new Firestore();
const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Running on port: ${port}`);
});

app.get('/', async (req, res) => {
    res.json({status: 'tcgbackend is up and listening'});
});


//---------------------------------- GAMES --------------------------------


//GET all games - returns an object containing each game keyed to its game Id
app.get('/games', async (req, res) => {
    console.log("games endpoint was hit");
    let query = db.collection('games');
    let snapshot = await query.get();
    if (snapshot.empty){
	console.log("no entries found for games");
	res.status(404);
	res.json({'error': 'no games found'});
    }
    console.log(`Found ${snapshot.size} games`);
    let allGames = [];
    snapshot.forEach(doc => {
	let curGame = doc.data();
	curGame['game_id'] = doc.id;
	allGames.push(curGame);
    });
    res.json(allGames);
});

//POST Game - creates a new game, or if the game already exists overwrites that game
app.post('/games', async (req, res) => {
    let game = req.body;
    if ('game_id' in game) {
	let id = game['game_id'];
	delete game.game_id;
	let newGame = await db.collection('games').doc(id).set(game);
	res.json({"game_id": id});
    } else {
	let newGame = await db.collection('games').add(game);
	res.json({'game_id': newGame.id});
    }
});

//PUT and DELeTE GAME - leaving these out for now, since post can overwrite a game

//GET 1 game - add game_id attribute
app.get('/games/:gameId', async (req, res) => {
    let query = db.collection('games').doc(req.params.gameId);
    let doc = await query.get();
    if (doc.exists()){
	let game = doc.data();
	game['game_id'] = doc.id;
	res.json(game);
    }
    else {
	res.status(404);
	res.json({'error': 'game not found'});
    }
}):


//------------------------------- CARDS ------------------------------


//GET 1 card (dunno why this would get used but put it in for completeness)
app.get('/cards/:cardId', async (req, res) => {
    let card_id = req.params.cardId;
    let query = db.collection('cards').doc(card_id);
    let doc = await query.get();
    if (card.exists){
	let card = doc.data();
	card['card_id'] = doc.id;
	res.json(card);
    }
    else {
	res.status(404);
	res.json({'error': 'card not found'})
    }
});

//GET All cards for a given game
app.get('/games/:gameId/cards', async (req, res) => {
    let gameId = req.params.gameId;
    let query = db.collection('cards').where("game_ids", "array-contains", gameId);
    let snapshot = await query.get();
    if (snapeshot.empty) {
	res.status(404);
	res.json({'error': 'no cards found for this game'});
    }
    else {
	let allCards = [];
	snapshot.forEach(doc => {
	    let curData = doc.data();
	    curData["card_id"] = doc.id;
	    allCards.push(curData);
	});
	res.json(allCards);
    }
});
	

//POST new card to a given game
app.post('/games/:gameId/cards', async (req, res) => {
    //Checks if you are posting a card that already exists and updates instead if you are
    let card = req.body;
    if ('game_ids' in card) {
	if (!card['game_ids'].includes(req.params.gameId)){
	    card['game_ids'].push(req.params.gameId);
	}
    }
    else {
	card['game_ids'] = [req.params.gameId];
    }
    if ("card_id" in card){
	let id = card['card_id'];
	delete card.card_id;
	let newCard = await db.collection('cards').doc(id).set(card);
	res.json({"card_id": id});
    }
    else {
	let newCard = await db.collection('cards').add(card);
	res.json({'card_id': newCard.id})
    }
});   
//PUT card - OVERWRITES entire card data with provided info
// POST can do the same thing, so leaving this out for now


//DELETE card - HARD DELETE (for soft delete use PUT or POST and set deleted attribute to true)
app.delete('/cards/:cardId', async (req, res) => {
    let deletion = await db.collection('cards').doc(req.params.cardId).delete();
    res.json({'result': `deleted card: ${req.params.cardId}`});
});

 
//--------------------- USERS ----------------------------
app.post('/users', async (req, res) => {
    let user = req.body;
    let id;
    if ('user_id' in user) {
	id = user['user_id'];
	delete user.user_id;
	let newUser = await db.collection('users').doc(id).set(user);
    }
    else {
	let newUser = await db.collection('users').add(user);
	id = newUser.id;
    }
    res.json({'user_id': id});
});

app.get('/users', async (req, res) => {
    let query = db.collection('users');
    let snapshot = await query.get();
    if (snapshot.empty){
	res.status(404);
	res.json({error: 'no users found'});
    }
    else {
	let allUsers = [];
	snapshot.forEach(doc => {
	    let curUser = doc.data();
	    curUser['user_id'] = doc.id;
	    allUsers.push(curUser);
	});
	res.json(allUsers);
    }
});
	 
