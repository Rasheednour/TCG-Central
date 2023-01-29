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

app.get('/games', async (req, res) => {
    console.log("games endpoint was hit");
    let query = db.collection('games');
    let snapshot = await query.get();
    if (snapshot.empty){
	console.log("no entries found for games");
	res.json({'error': 'no games found'});
    }
    console.log(`Found ${snapshot.size} games`);
    let allGames = {};
    snapshot.forEach(doc => {
	allGames[doc.id] = doc.data();
    });
    res.json(allGames);
});

//GET All cards for a given game
app.get('/games/:gameId/cards', async (req, res) => {
    let gameId = req.params.gameId;
    let query = db.collection('cards').where("game_ids", "array_contains", gameId);
    let snapshot = await query.get();
    let allCards = {};
    snapshot.forEach(doc => {
	let curData = doc.data();
	curData["card_id"] = doc.id;
	allCards[doc.id] = curData;
    });
    res.json(allCards);
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


//DELETE card - HARD DELETE (for soft delete use PUT)
app.delete('/cards/:cardId', async (req, res) => {
    let deletion = await db.collection('cards').doc(req.params.cardId).delete();
    res.json({'result': `deleted card: ${req.params.cardId}`});
});

 
