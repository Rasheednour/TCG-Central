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
	res.json({});
    }
    console.log(`Found ${snapshot.size} games`);
    let allGames = {};
    snapshot.forEach(doc => {
	allGames[doc.id] = doc.data();
    });
    res.json(allGames);
});

