const express = require("express");
const Firestore = require("@google-cloud/firestore");

const db = new Firestore();
const app = express();
app.use(express.json());
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

//Pseudocode
// if current element can make total equal target, add how we got here and then continue to check other routes

function find_all_combinations(target, source_vals, current, completed) {
    for (let count = 0; count < source_vals.length;  count++){
	value = source_vals[count];
    let total = current.reduce(
      (callbackFn = (a, b) => {
        a + b;
      }),
      (initialValue = value)
    );
    if (total == target) {
      current.push(value);
      completed.push(current.slice());
      current.pop();
    } else if (total < target) {
      current.push(value);
      completed = find_all_combinations(
        target,
        source_vals,
        current,
        completed
      );
      current.pop();
    } else {
      break;
    }
    }
//    console.log("done with a find all call, completed is: " + completed);
  return completed;
}

function find_all_subsets_totalling(target, options, current_track, subsets){
    //console.log('recursing on ' + target + ' with track ' + current_track + ' and subsets ' + subsets);
    if (current_track.length == 1 && current_track[0] == target){
	subsets.push(current_track.slice(0,1));
	return subsets;
    }
    for (let counter = 0; counter < options.length; counter++){
	let total = 0;
	current_track.push(options[counter]);

	for (let acc_count = 0; acc_count < current_track.length; acc_count++){
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
	    subsets = find_all_subsets_totalling(target, options, current_track.slice(0, current_track.length), subsets.slice(0, subsets.length));
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
    for (let counter = 0; counter < array_of_enemy_levels.length;  counter++){
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
	for (let count = 0; count < subsets_for_starter.length; count++){
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
      if ((target_difficulty - counter) > 1) {
	  results =
              find_all_caller(target_difficulty - counter, array_of_enemy_levels);
      }
      let more_res = find_all_caller(target_difficulty + counter, array_of_enemy_levels);
      for (let i = 0; i < more_res.length; i++){
	  results.push(more_res[i]);
      }
  }
  return results;
}

function pick_random_from_array(target_array) {
  return target_array[Math.floor(Math.random() * target_array.length)];
}

function pick_random_prefer_later(target_array) {
    //Because random combos will make more encounters with many weaker enemies more likely
    //created this to intentionally pick later possibilities sooner (which will have bigger enemies)
    for (let counter = 1; counter <= target_array.length; counter++){
	if (Math.floor(Math.random() * 3) == 1) {
	    return target_array[target_array.length - counter];
	}
    }
    return target_array[0];
}

function generate_encounter(target, all_levels, enemies) {
    //console.log(`generating encounter: ${target}, ${all_levels}, ${enemies}`);
    let level_mix = pick_random_prefer_later(
    difficulty_level_gen(target, all_levels)
  );
  let enemy_list = [];
    for (let count = 0; count < level_mix.length; count++) {
	let level = level_mix[count];
	let start_index = Math.floor(Math.random() * enemies.length);
//	console.log("start_index = " + start_index + " level is " + level);
	for (let counter = 0; counter < enemies.length;  counter++) {
	    if (level == parseInt(enemies[(counter + start_index) % enemies.length]["level"])) {
//		console.log("found enemy " + ((counter + start_index) % enemies.length));
		enemy_list.push(enemies[(counter + start_index) % enemies.length]);
		break;
	    }
	}
    }
  //  console.log("made enemy list " + enemy_list + " starting with " + enemy_list[0]);
  return enemy_list;
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
    res.json(allCards);
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
	for (let count = 0; count < allenemies.length; count++){
	    let enemy = allenemies[count];
	    //console.log("checking if enemy has level: " + enemy['name'] + enemy['level']);
            if (enemy['level']) {
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
      allenemies = generate_encounter(target, all_levels, valid_enemies);
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

//--------------------- USERS ----------------------------
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
