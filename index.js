const express = require("express");
const Firestore = require("@google-cloud/firestore");

//---------------------------- Google OAuth -----------------

// required libraries 
const json = require('./client_secret.json');
const {google} = require('googleapis');
const url = require('url');
const jwt_decode = require('jwt-decode');
const {expressjwt: jwt} = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require("cors");

const userPageURL = 'http://localhost:3000/user'


// get client ID, client SECRET, and redirect URI from the downloaded client_secret JSON file from GCP 
const CLIENT_ID = json.web.client_id;
const CLIENT_SECRET = json.web.client_secret;
const REDIRECT_URI = json.web.redirect_uris[0];

// create a new oauth2Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Access scopes
const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile'
];

// create a function to verify JWTs
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://www.googleapis.com/oauth2/v3/certs`
  }),

  // Validate the audience and the issuer.
  issuer: `https://accounts.google.com`,
  algorithms: ['RS256']
});


//---------------------------- Initiate DB and start Server -----------------

const db = new Firestore();
const app = express();
app.use(express.json());
// enable cross origin requests
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

app.get("/", async (req, res) => {
  res.json({ status: "tcgbackend is up and listening" });
});

//---------------------------- UTILITIES -----------------
function field_based_sorter(field) {
  return (one, two) => {
    if (field in one && field in two) {
      if (one < two) {
        return -1;
      }
      if (two < one) {
        return 1;
      }
      return 0;
    }
    if (field in one) {
      return -1;
    }
    if (field in two) {
      return 1;
    }
    return 0;
  };
}

function find_all_subsets_totalling(target, options, current_track, subsets) {
  //console.log('recursing on ' + target + ' with track ' + current_track + ' and subsets ' + subsets);
  if (current_track.length == 1 && current_track[0] == target) {
    subsets.push(current_track.slice(0, 1));
    return subsets;
  }
  for (let counter = 0; counter < options.length; counter++) {
    let total = 0;
    current_track.push(options[counter]);

    for (let acc_count = 0; acc_count < current_track.length; acc_count++) {
      total = total + current_track[acc_count];
    }
    //	console.log("finding subsets with total, current: " + total + " : " + current_track);
    if (total == target) {
      let new_valid = current_track.slice(0, current_track.length);
      subsets.push(new_valid);
      current_track.pop();
      return subsets;
    }
    if (total < target) {
      subsets = find_all_subsets_totalling(
        target,
        options,
        current_track.slice(0, current_track.length),
        subsets.slice(0, subsets.length)
      );
    }
    if (total > target) {
      current_track.pop();
      return subsets;
    }
    current_track.pop();
  }
  return subsets;
}

function find_all_caller(target_difficulty, array_of_enemy_levels) {
  let results = [];
  for (let counter = 0; counter < array_of_enemy_levels.length; counter++) {
    let starter = array_of_enemy_levels[counter];
    let starter_array = new Array();
    starter_array.push(starter);
    let subsets = new Array();
    //console.log(`calling for element: ${starter} of ${array_of_enemy_levels} with target ${target_difficulty}`);
    let subsets_for_starter = find_all_subsets_totalling(
      target_difficulty,
      array_of_enemy_levels,
      starter_array,
      subsets
    );
    //console.log("found first subsets: " + subsets_for_starter[0]);
    for (let count = 0; count < subsets_for_starter.length; count++) {
      results.push(subsets_for_starter[count]);
    }
  }
  return results;
}

function difficulty_level_gen(target_difficulty, array_of_enemy_levels) {
  let results = find_all_caller(
    target_difficulty,
    array_of_enemy_levels.sort()
  );
  //console.log("first call found" + results[0]);
  let HARD_LIMIT = 12; //To prevent infinite recursion from ridiculous inputs
  let counter = 0;
  while (results.length == 0 && counter < HARD_LIMIT) {
    counter++;
    //      console.log("while trihggered count " + counter);
    if (target_difficulty - counter > 1) {
      results = find_all_caller(
        target_difficulty - counter,
        array_of_enemy_levels
      );
    }
    let more_res = find_all_caller(
      target_difficulty + counter,
      array_of_enemy_levels
    );
    for (let i = 0; i < more_res.length; i++) {
      results.push(more_res[i]);
    }
  }
  return results;
}

function pick_random_from_array(target_array) {
  return target_array[Math.floor(Math.random() * target_array.length)];
}

function pick_random_prefer_later(target_array, factor = 4) {
  //Because random combos will make more encounters with many weaker enemies more likely
  //created this to intentionally pick later possibilities sooner (which will have bigger enemies)
  // larger weights will increase the chance of many small monsters.
  // WEIGHT MUST BE GREATER THAN 2
  let weight = factor;
  if (weight < 3) {
    weight = 3;
  }
  for (let counter = 1; counter <= target_array.length; counter++) {
    if (Math.floor(Math.random() * weight) == 1) {
      return target_array[target_array.length - counter];
    }
  }
  return target_array[0];
}

function generate_encounter(target, all_levels, enemies, big_pref = 4) {
  //console.log(`generating encounter: ${target}, ${all_levels}, ${enemies}`);
  let level_mix = pick_random_prefer_later(
    difficulty_level_gen(target, all_levels),
    big_pref
  );
  let enemy_list = [];
  for (let count = 0; count < level_mix.length; count++) {
    let level = level_mix[count];
    let start_index = Math.floor(Math.random() * enemies.length);
    //	console.log("start_index = " + start_index + " level is " + level);
    for (let counter = 0; counter < enemies.length; counter++) {
      if (
        level ==
        parseInt(enemies[(counter + start_index) % enemies.length]["level"])
      ) {
        //		console.log("found enemy " + ((counter + start_index) % enemies.length));
        enemy_list.push(enemies[(counter + start_index) % enemies.length]);
        break;
      }
    }
  }
  //  console.log("made enemy list " + enemy_list + " starting with " + enemy_list[0]);
  return enemy_list;
}


/* -------------Google OAuth Model Functions ------------- */

/*
A function that constructs an endpoint to the Google Oauth 2.0
returns: the authorization URL
*/
function obtainAuthUrl() {
      
  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true
  });

  return authorizationUrl;
}

 function getUser(userID) {
    let query = db.collection("users").where("userID", "==", userID);
    return query.get().then(snapshot => {
      console.log("snapshot is", snapshot);
      if (snapshot.empty) {
        return false;
      } else {
        return true
      }
    });
}

  function createUser(name, userID) {
    return db.collection("users").doc(userID).set({"name": name}).then(newUser=>{
      return newUser
    });
    
    
  }
//---------------------------------- GAMES --------------------------------

//GET all games - returns an object containing each game keyed to its game Id
app.get("/games", async (req, res) => {
  //console.log("games endpoint was hit");
  let query = db.collection("games");
  let snapshot = await query.get();
  if (snapshot.empty) {
    //console.log("no entries found for games");
    res.status(404);
    res.json({ error: "no games found" });
  }
  //console.log(`Found ${snapshot.size} games`);
  let allGames = [];
  snapshot.forEach((doc) => {
    let curGame = doc.data();
    curGame["game_id"] = doc.id;
    allGames.push(curGame);
  });
  allGames.sort(field_based_sorter("name"));
  res.json(allGames);
});

//POST Game - creates a new game, or if the game already exists overwrites that game
app.post("/games", async (req, res) => {
  let game = req.body;
  if ("game_id" in game) {
    let id = game["game_id"];
    delete game.game_id;
    let newGame = await db.collection("games").doc(id).set(game);
    res.json({ game_id: id });
  } else {
    let newGame = await db.collection("games").add(game);
    res.json({ game_id: newGame.id });
  }
});

//PUT and DELeTE GAME - leaving these out for now, since post can overwrite a game

//GET 1 game - add game_id attribute
app.get("/games/:gameId", async (req, res) => {
  let query = db.collection("games").doc(req.params.gameId);
  let doc = await query.get();
  if (doc.exists) {
    let game = doc.data();
    game["game_id"] = doc.id;
    res.json(game);
  } else {
    res.status(404);
    res.json({ error: "game not found" });
  }
});

//------------------------------- CARDS ------------------------------

//GET 1 card (dunno why this would get used but put it in for completeness)
app.get("/cards/:cardId", async (req, res) => {
  let card_id = req.params.cardId;
  let query = db.collection("cards").doc(card_id);
  let doc = await query.get();
  if (doc.exists) {
    let card = doc.data();
    card["card_id"] = doc.id;
    res.json(card);
  } else {
    res.status(404);
    res.json({ error: "card not found" });
  }
});

//GET ALL CARDS
//TODO - Maybe add user based limitation so this only gets public cards and cards user owns/made
app.get("/cards", async (req, res) => {
  let query = db.collection("cards");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "there are no cards... strange" });
  } else {
    let allCards = [];
    snapshot.forEach((doc) => {
      let curData = doc.data();
      curData["card_id"] = doc.id;
      allCards.push(curData);
    });
    allCards.sort(field_based_sorter("name"));
    res.json(allCards);
  }
});

//GET All cards for a given game
app.get("/games/:gameId/cards", async (req, res) => {
  let gameId = req.params.gameId;
  let query = db
    .collection("cards")
    .where("game_ids", "array-contains", gameId);
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no cards found for this game" });
  } else {
    let allCards = [];
    snapshot.forEach((doc) => {
      let curData = doc.data();
      curData["card_id"] = doc.id;
      allCards.push(curData);
    });
    allCards.sort(field_based_sorter("name"));

    // Now check if we are building a deck and build it if so
    if ("deck" in req.query) {
      let deck_size = parseInt(req.query.deck);
      let game_query = db.collection("games").doc(gameId);
      let game = await game_query.get();
      game = game.data();
      if (
        deck_size == NaN ||
        deck_size < game["rules"]["cards_per_deck_min"] ||
        deck_size > game["rules"]["cards_per_deck_max"]
      ) {
        res.status(400);
        res.json({ error: "invalid deck size" });
      } else {
        let char_name =
          req.query.character ||
          pick_random_from_array(game.characters)["name"];
        char_name = char_name.toUpperCase();
        let deck_count = 0;
        let iter_count = 0;
        let deck = [];
        let commons = [];
        let rares = [];
        let defaults = [];
        let cur_card;
        let avail_arr;

        //add default cards mins
        while (iter_count < allCards.length) {
          cur_card = allCards[iter_count];
          avail_arr = cur_card["availability"].split("_");
          cur_card["use_count"] = 0;

          if (
            avail_arr[0] == "DEFAULT" &&
            (avail_arr.length < 4 || avail_arr[3] == char_name)
          ) {
            deck_count = deck_count + parseInt(avail_arr[1]);
            for (let i = 0; i < parseInt(avail_arr[1]); i++) {
              deck.push(JSON.parse(JSON.stringify(cur_card)));
            }
            cur_card["use_count"] += parseInt(avail_arr[1]);
            if (cur_card["use_count"] < parseInt(avail_arr[2])) {
              defaults.push(cur_card);
            }
          } else if (avail_arr.length < 4 || avail_arr[3] == char_name) {
            if (avail_arr[0] == "COMMON") {
              commons.push(cur_card);
            }
            if (avail_arr[0] == "RARE") {
              rares.push(cur_card);
            }
          }
          iter_count++;
        }

        //if more cards can be added pick commons and rares
        let rare_freq = req.query["rareFrequency"] || 4;
        iter_count = 0;
        let cur_index = 0;
        let category_empty = false;
        while (deck_count < deck_size) {
          //use rare frequency to populate deck, pull from defaults if we run out of commons or rares
          category_empty = false;
          if (iter_count % rare_freq == 0) {
            //pick rare
            if (rares.length > 0) {
              cur_index = Math.floor(Math.random() * rares.length);
              cur_card = rares[cur_index];
              avail_arr = cur_card["availability"].split("_");
              deck.push(JSON.parse(JSON.stringify(cur_card)));
              cur_card["use_count"] = cur_card["use_count"] + 1;
              deck_count++;
              //get up to min number
              while (cur_card["use_count"] < parseInt(avail_arr[1])) {
                deck.push(JSON.parse(JSON.stringify(cur_card)));
                cur_card["use_count"] = cur_card["use_count"] + 1;
                deck_count++;
              }

              //check if at max, if so remove it from rares
              if (cur_card["use_count"] >= parseInt(avail_arr[2])) {
                rares.splice(cur_index, 1);
              }
            } else {
              category_empty = true; //set this to say we need to grab from common or default
            }
          }
          if (iter_count % rare_freq != 0 || category_empty) {
            //pick common
            category_empty = false;
            if (commons.length > 0) {
              cur_index = Math.floor(Math.random() * commons.length);
              cur_card = commons[cur_index];
              avail_arr = cur_card["availability"].split("_");
              deck.push(JSON.parse(JSON.stringify(cur_card)));
              cur_card["use_count"] = cur_card["use_count"] + 1;
              deck_count++;
              //get up to min number
              while (cur_card["use_count"] < parseInt(avail_arr[1])) {
                deck.push(JSON.parse(JSON.stringify(cur_card)));
                cur_card["use_count"] = cur_card["use_count"] + 1;
                deck_count++;
              }

              //check if at max, if so remove it from commons
              if (cur_card["use_count"] >= parseInt(avail_arr[2])) {
                commons.splice(cur_index, 1);
              }
            } else {
              category_empty = true; //set this to say we need to grab from common or default
            }
          }

          if (category_empty) {
            //pick from defaults if we didn't have defaults
            if (defaults.length > 0) {
              cur_index = Math.floor(Math.random() * defaults.length);
              cur_card = defaults[cur_index];
              avail_arr = cur_card["availability"].split("_");
              deck.push(JSON.parse(JSON.stringify(cur_card)));
              cur_card["use_count"] = cur_card["use_count"] + 1;
              deck_count++;
              //get up to min number
              while (cur_card["use_count"] < parseInt(avail_arr[1])) {
                deck.push(JSON.parse(JSON.stringify(cur_card)));
                cur_card["use_count"] = cur_card["use_count"] + 1;
                deck_count++;
              }

              //check if at max, if so remove it from defaults
              if (cur_card["use_count"] >= parseInt(avail_arr[2])) {
                defaults.splice(cur_index, 1);
              }
            }
          }

          //stop if we have run out of cards
          if (
            rares.length == 0 &&
            commons.length == 0 &&
            defaults.length == 0
          ) {
            res.status(400);
            res.json({ error: "cant build a deck with these specs" });
            return;
          }
          iter_count++;
        }

        //remove excess cards if necessary
        while (deck_count > deck_size) {
          deck = deck.splice(Math.floor(Math.random() * deck.length), 1);
          deck_count = deck_count - 1;
        }
        //set return value
        res.json(deck);
      }
    } else {
      res.json(allCards);
    }
  }
});

//POST new card to a given game
app.post("/games/:gameId/cards", async (req, res) => {
  //Checks if you are posting a card that already exists and updates instead if you are
  let card = req.body;
  if ("game_ids" in card) {
    if (!card["game_ids"].includes(req.params.gameId)) {
      card["game_ids"].push(req.params.gameId);
    }
  } else {
    card["game_ids"] = [req.params.gameId];
  }
  if ("card_id" in card) {
    let id = card["card_id"];
    delete card.card_id;
    let newCard = await db.collection("cards").doc(id).set(card);
    res.json({ card_id: id });
  } else {
    let newCard = await db.collection("cards").add(card);
    res.json({ card_id: newCard.id });
  }
});
//PUT card - OVERWRITES entire card data with provided info
// POST can do the same thing, so leaving this out for now

//DELETE card - HARD DELETE (for soft delete use PUT or POST and set deleted attribute to true)
app.delete("/cards/:cardId", async (req, res) => {
  let deletion = await db.collection("cards").doc(req.params.cardId).delete();
  res.json({ result: `deleted card: ${req.params.cardId}` });
});

//------------------------------- ENEMIES ------------------------------

//GET 1 enemy
app.get("/enemies/:enemyId", async (req, res) => {
  let enemy_id = req.params.enemyId;
  let query = db.collection("enemies").doc(enemy_id);
  let doc = await query.get();
  if (doc.exists) {
    let enemy = doc.data();
    enemy["enemy_id"] = doc.id;
    res.json(enemy);
  } else {
    res.status(404);
    res.json({ error: "enemy not found" });
  }
});

//GET ALL enemies
//TODO - Maybe add user based limitation so this only gets public enemies and enemies user owns/made
app.get("/enemies", async (req, res) => {
  let query = db.collection("enemies");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "there are no enemies... strange" });
  } else {
    let allenemies = [];
    snapshot.forEach((doc) => {
      let curData = doc.data();
      curData["enemy_id"] = doc.id;
      allenemies.push(curData);
    });
    allenemies.sort(field_based_sorter("name"));
    res.json(allenemies);
  }
});

//GET All enemies for a given game
// CAN BE USED TO GENERATE ENEMY LIST FOR A GIVEN DIFFICULT LEVEL OF BATTLE
// To return a random encounter of a given difficult include parameter "difficulty" which should be an int
// returns the closest difficulty level to the requested that it can generate
app.get("/games/:gameId/enemies", async (req, res) => {
  let gameId = req.params.gameId;
  let query = db
    .collection("enemies")
    .where("game_ids", "array-contains", gameId);
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no enemies found for this game" });
  } else {
    let allenemies = [];
    snapshot.forEach((doc) => {
      let curData = doc.data();
      //console.log("cur data " + curData);
      //console.log("cur data element name " + curData["name"] + " level " + curData["level"]);
      curData["enemy_id"] = doc.id;
      allenemies.push(curData);
    });

    // if a difficulty is provided return a batch of enemies that total that difficulty (or as close to it as possible)
    if ("difficulty" in req.query) {
      let target = parseInt(req.query.difficulty);
      if (target == NaN) {
        res.status(400);
        res.json({
          error: `invalid difficulty param: ${req.params.difficulty}`,
        });
      }
      let all_levels = [];
      //console.log(`All enemies: ${allenemies} with length: ${allenemies.length}`);
      //console.log("first enemy: " + allenemies[0]);
      let valid_enemies = [];
      for (let count = 0; count < allenemies.length; count++) {
        let enemy = allenemies[count];
        //console.log("checking if enemy has level: " + enemy['name'] + enemy['level']);
        if (enemy["level"]) {
          //	console.log("level in enemy" + enemy.name);
          let cur_level = parseInt(enemy["level"]);
          if (cur_level == NaN) {
            continue;
          }
          if (!(cur_level in all_levels)) {
            all_levels.push(cur_level);
          }
          valid_enemies.push(enemy);
        }
      }
      let factor = 4;
      if (
        "randomFactor" in req.query &&
        parseInt(req.query.randomFactor) != NaN
      ) {
        factor = parseInt(req.query.randomFactor);
      }
      allenemies = generate_encounter(
        target,
        all_levels,
        valid_enemies,
        factor
      );
    }

    allenemies.sort(field_based_sorter("name"));
    res.json(allenemies);
  }
});

//POST new enemy to a given game
app.post("/games/:gameId/enemies", async (req, res) => {
  //Checks if you are posting a enemy that already exists and updates instead if you are
  let enemy = req.body;
  if ("game_ids" in enemy) {
    if (!enemy["game_ids"].includes(req.params.gameId)) {
      enemy["game_ids"].push(req.params.gameId);
    }
  } else {
    enemy["game_ids"] = [req.params.gameId];
  }
  if ("enemy_id" in enemy) {
    let id = enemy["enemy_id"];
    delete enemy.enemy_id;
    let newenemy = await db.collection("enemies").doc(id).set(enemy);
    res.json({ enemy_id: id });
  } else {
    let newenemy = await db.collection("enemies").add(enemy);
    res.json({ enemy_id: newenemy.id });
  }
});
//PUT enemy - OVERWRITES entire enemy data with provided info
// POST can do the same thing, so leaving this out for now

//DELETE enemy - HARD DELETE (for soft delete use PUT or POST and set deleted attribute to true)
app.delete("/enemies/:enemyId", async (req, res) => {
  let deletion = await db
    .collection("enemies")
    .doc(req.params.enemyId)
    .delete();
  res.json({ result: `deleted enemy: ${req.params.enemyId}` });
});

//--------------------- USERS & OAUTH----------------------------
app.post("/users", async (req, res) => {
  let user = req.body;
  let id;
  if ("user_id" in user) {
    id = user["user_id"];
    delete user.user_id;
    let newUser = await db.collection("users").doc(id).set(user);
  } else {
    let newUser = await db.collection("users").add(user);
    id = newUser.id;
  }
  res.json({ user_id: id });
});

app.get("/users", async (req, res) => {
  let query = db.collection("users");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no users found" });
  } else {
    let allUsers = [];
    snapshot.forEach((doc) => {
      let curUser = doc.data();
      curUser["user_id"] = doc.id;
      allUsers.push(curUser);
    });
    allUsers.sort(field_based_sorter("name"));
    res.json(allUsers);
  }
});

app.get('/register', function(req, res){
  // construct Google Oauth endpoint
  const authUrl = obtainAuthUrl();
  res.redirect(authUrl);
});

/*
Redirect route from SignUpPage to the Google OAuth 2.0 endpoint
*/
app.get('/oauth', function(req,res){
  console.log(req.url);
  // Receive the callback from Google's OAuth 2.0 server.
  if (req.url.startsWith('/oauth')) {
      // Handle the OAuth 2.0 server response
      let q = url.parse(req.url, true).query;
  
      // Get access token
      oauth2Client.getToken(q.code).then(tokens => {
          oauth2Client.setCredentials(tokens);
          // get the JWT 
          const jwt = tokens.tokens.id_token;
          // decode the JWT
          const decodedJwt = jwt_decode(jwt);
          // obtain the value of sub and the name from the decoded JWT
          const userID = decodedJwt.sub;
          const name = decodedJwt.name;

          // before creating a new user, check if the user is already registered
          // get list of users
          getUser(userID).then(userExists => {
        
              // if the user doesn't exist in Firestore, create new user
              if (!userExists) {
                  // create a new user in Datastore with the above attributes
                  createUser(name, userID).then(user => {
                  // redirect to the user page and 
                  res.redirect(userPageURL + '#' + jwt);
                   });
              // if user already exists, don't create new user, and redirect to user page
              } else {
                res.json({"stat": "user exists","userID": userID, "jwt": jwt, "userName": name});
              }

          })
      });
  }
});

//--------------------- OPTIONS ----------------------------------

// Here are endpoints around retrieving and updating various option based fields
// ALL POST ENDPOINTS ARE SLIGHTLY PROTECTED (just to avoid allowing users to alter
// our customization option for cards and games)
// Slight protection is enacted by requiring a query param "code=tcgadmin" for now

UPDATE_CODE = "tcgadmin";

//-------- EFFECTS ------------
// Posting with same name as existing effect will overwrite
app.post("/effects", async (req, res) => {
  let effect = req.body;
  if (!("code" in req.query) || req.query.code != UPDATE_CODE) {
    res.status(401);
    res.json({
      error: "need to include the code query param with correct code",
    });
  } else if ("name" in effect) {
    effect["name"] = effect["name"].toUpperCase();
    let add_or_update = db
      .collection("effects")
      .doc(effect["name"])
      .set(effect);
    res.json({ effect_id: effect["name"] });
  } else {
    res.status(400);
    res.json({ error: "effect must have a name to be created/editted" });
  }
});

app.get("/effects", async (req, res) => {
  let query = db.collection("effects");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no effects found" });
  } else {
    let allEffects = [];
    snapshot.forEach((doc) => {
      let curUser = doc.data();
      allEffects.push(curUser);
    });
    allEffects.sort(field_based_sorter("name"));
    res.json(allEffects);
  }
});

//------------- ABILITIES
// Posting with same name as existing ability will overwrite
app.post("/abilities", async (req, res) => {
  let ability = req.body;
  if (!("code" in req.query) || req.query.code != UPDATE_CODE) {
    res.status(401);
    res.json({
      error: "need to include the code query param with correct code",
    });
  } else if ("name" in ability) {
    ability["name"] = ability["name"].toUpperCase();
    let add_or_update = db
      .collection("abilities")
      .doc(ability["name"])
      .set(ability);
    res.json({ ability_id: ability["name"] });
  } else {
    res.status(400);
    res.json({ error: "ability must have a name to be created/editted" });
  }
});

app.get("/abilities", async (req, res) => {
  let query = db.collection("abilities");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no abilities found" });
  } else {
    let allabilities = [];
    snapshot.forEach((doc) => {
      let curUser = doc.data();
      allabilities.push(curUser);
    });
    allabilities.sort(field_based_sorter("name"));
    res.json(allabilities);
  }
});

//-------- RULES ------------
// Posting with same name as existing rule will overwrite
app.post("/rules", async (req, res) => {
  let rule = req.body;
  if (!("code" in req.query) || req.query.code != UPDATE_CODE) {
    res.status(401);
    res.json({
      error: "need to include the code query param with correct code",
    });
  } else if ("name" in rule) {
    rule["name"] = rule["name"].toLowerCase();
    let add_or_update = db.collection("rules").doc(rule["name"]).set(rule);
    res.json({ rule_id: rule["name"] });
  } else {
    res.status(400);
    res.json({ error: "rule must have a name to be created/editted" });
  }
});

app.get("/rules", async (req, res) => {
  let query = db.collection("rules");
  let snapshot = await query.get();
  if (snapshot.empty) {
    res.status(404);
    res.json({ error: "no rules found" });
  } else {
    let allrules = [];
    snapshot.forEach((doc) => {
      let curUser = doc.data();
      allrules.push(curUser);
    });
    allrules.sort(field_based_sorter("name"));
    res.json(allrules);
  }
});
