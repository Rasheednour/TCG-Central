import Phaser from "phaser";
import Game from "./scenes/game.js";
require("babel-core/register");
require("babel-polyfill");
import { storage } from "./config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import axios from "axios";

const BACKEND_API = "https://tcg-backend-app-2nzzlueilq-lz.a.run.app/";

// Get the query string parameters from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Retrieve the value of game parameters from the URL and save it in class properties
const gameId = urlParams.get("gameId");
const characterId = urlParams.get("characterId");
const deckSize = urlParams.get("deckSize");
const difficulty = urlParams.get("difficulty");
let gameCharacter;

// calls the backend to generate a deck of cards
function getCards() {
  // format backend URL
  const cardsUrl = `${BACKEND_API}games/${gameId}/cards?deck=${deckSize}&character=${characterId}`;
  // send GET request to fetch a deck of cards
  return axios
    .get(cardsUrl)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log("fetch error" + error);
    });
}

// calls the backend to generate an enemy encounter
function getEnemies() {
  // format backend URL
  const enemyUrl = `${BACKEND_API}games/${gameId}/enemies?difficulty=${difficulty}`;
  return axios
    .get(enemyUrl)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log("fetch error" + error);
    });
}

// calls the backend to fetch game rules using a game's ID
function getGameRules() {
  // format backend URL
  const gameUrl = `${BACKEND_API}games/${gameId}`;
  return axios
    .get(gameUrl)
    .then((res) => {
      const gameCharacters = res.data.characters;
      gameCharacters.forEach((character) => {
        if (character.id === characterId) {
          gameCharacter = character;
        }
      });
      return res.data.rules;
    })
    .catch((error) => {
      console.log("fetch error" + error);
    });
}

// parses and extracts information from the card objects fetched from the backend
function parseCards(cards) {
  // create a list to store parsed card data for use by Phaser's server
  const parsedCards = [];
  // create a list to store only the card IDs for use in generatin download URLs
  const cardIds = [];

  // iterate through card object to extract data
  let count = 0;
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
        card.effect || [],
        count,
      ];
      count += 1;
      parsedCards.push(newCard);
      if (!cardIds.includes(card.card_id)) {
        cardIds.push(card.card_id);
      }
    } else {
      const newCard = [
        "spell",
        card.name,
        card.card_id,
        card.cost,
        0,
        0,
        0,
        card.effect,
        count,
      ];
      count += 1;
      parsedCards.push(newCard);
      if (!cardIds.includes(card.card_id)) {
        cardIds.push(card.card_id);
      }
    }
  });
  // save both lists in class properties to be accessed by other handlers
  return [parsedCards, cardIds];
}

// parses and extracts information from the enemy objects fetched from the backend
function parseEnemies(enemies) {
  // create a list to store parsed enemy data for use by enemyHandler
  const parsedEnemies = [];
  // create a list to store only the enemy IDs for use in generatin download URLs
  const enemyIds = [];
  // iterate through enemy object to extract data
  enemies.forEach((enemy) => {
    // create a list storing enemy info and add list to parsedEnemies.
    const newEnemy = [
      enemy.enemy_id,
      enemy.name,
      enemy.attack,
      enemy.defense,
      enemy.health,
      "",
    ];
    parsedEnemies.push(newEnemy);
    // extract enemyId and add to enemyIds
    if (!enemyIds.includes(enemy.enemy_id)) {
      enemyIds.push(enemy.enemy_id);
    }
  });
  // save both lists in class properties to be accessed by other handlers
  return [parsedEnemies, enemyIds];
}

// gets Firebase download URLs for a list of enemyIDs
async function getEnemyUrls(enemyIds) {
  // first get all enemy URLs from Firebase
  let enemyUrls = [];
  const enemyFolder = "enemies";
  for (const enemyId of enemyIds) {
    const imageRef = ref(storage, `${enemyFolder}/${enemyId + ".jpg"}`);
    const url = await getDownloadURL(imageRef);
    enemyUrls.push([enemyId, url]);
  }
  return enemyUrls;
}
// gets Firebase download URLs for a list of cardIDs
async function getCardUrls(cardIds) {
  // first get all enemy URLs from Firebase
  let cardUrls = [];
  const cardFolder = "cards";
  for (const cardId of cardIds) {
    const imageRef = ref(storage, `${cardFolder}/${cardId + ".jpg"}`);
    const url = await getDownloadURL(imageRef);
    cardUrls.push([cardId, url]);
  }
  return cardUrls;
}

// creates a config object and starts a Phaser game by injecting all fetched data to the Game class
function startGame(
  cardDeck,
  enemyList,
  character,
  gameRules,
  enemyUrls,
  cardUrls
) {
  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      width: 1200,
      height: 1000,
    },
    scene: [
      new Game(cardDeck, enemyList, character, gameRules, enemyUrls, cardUrls),
    ],
  };

  const game = new Phaser.Game(config);
}

// fetches all required data from the backend and Firebase
async function fetchData() {
  const cards = await getCards();
  const enemies = await getEnemies();
  const gameRules = await getGameRules();
  const parsedCardData = parseCards(cards);
  const parsedEnemyData = parseEnemies(enemies);
  const cardDeck = parsedCardData[0];
  const cardIds = parsedCardData[1];
  const enemyList = parsedEnemyData[0];
  const enemyIds = parsedEnemyData[1];
  const enemyUrls = await getEnemyUrls(enemyIds);
  const cardUrls = await getCardUrls(cardIds);

  // call the function responsible for starting the game scene and provide all fetched data
  startGame(cardDeck, enemyList, gameCharacter, gameRules, enemyUrls, cardUrls);
}

// start data fetch and then start the Game
fetchData();
