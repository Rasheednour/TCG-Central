import DeckHandler from "../helpers/handlers/DeckHandler";
import InteractiveHandler from "../helpers/handlers/InteractiveHandler";
import GameHandler from "../helpers/handlers/GameHandler";
import SocketHandler from "../helpers/handlers/SocketHandler";
import UIHandler from "../helpers/handlers/UIHandler";
import PlayerHandler from "../helpers/handlers/playerHandler";
import AllyHandler from "../helpers/handlers/allyHandler";
import EnemyHandler from "../helpers/handlers/EnemyHandler";
import RulesHandler from "../helpers/handlers/RulesHandler";
import HeroHandler from "../helpers/handlers/HeroHandler";
import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import axios from "axios";

const BACKEND_API = "https://tcgbackend-s2kqyb5vna-wl.a.run.app/";

//So far, everything in the game happens in one Phaser Scene, which we call a Game
export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  // calls the backend to generate a deck of cards
  getCards() {
    // format backend URL
    const cardsUrl = `${BACKEND_API}games/${this.gameId}/cards?deck=${this.deckSize}&character=${this.characterId}`;
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
  getEnemies() {
    // format backend URL
    const enemyUrl = `${BACKEND_API}games/${this.gameId}/enemies?difficulty=${this.difficulty}`;
    return axios.get(enemyUrl).then((res) => {
      return res.data;
    });
  }

  // calls the backend to fetch game rules using a game's ID
  getGameRules() {
    // format backend URL
    const gameUrl = `${BACKEND_API}games/${this.gameId}`;
    return axios.get(gameUrl).then((res) => {
      const gameCharacters = res.data.characters;
      gameCharacters.forEach((character) => {
        if (character.id === this.characterId) {
          this.character = character;
        }
      });
      return res.data.rules;
    });
  }

  // parses and extracts information from the card objects fetched from the backend
  parseCards() {
    // create a list to store parsed card data for use by Phaser's server
    const parsedCards = [];
    // create a list to store only the card IDs for use in generatin download URLs
    const cardIds = [];

    // iterate through card object to extract data
    let count = 0;
    this.cards.forEach((card) => {
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

      // save both lists in class properties to be accessed by other handlers
      this.cardDeck = parsedCards;
      this.cardIds = cardIds;
    });
    console.log("cardDeck in game.js is:", this.cardDeck);
  }

  // parses and extracts information from the enemy objects fetched from the backend
  parseEnemies() {
    // create a list to store parsed enemy data for use by enemyHandler
    const parsedEnemies = [];
    // create a list to store only the enemy IDs for use in generatin download URLs
    const enemyIds = [];

    // iterate through enemy object to extract data
    this.enemies.forEach((enemy) => {
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

      // save both lists in class properties to be accessed by other handlers
      this.enemyList = parsedEnemies;
      this.enemyIds = enemyIds;
    });
  }
  // calls Firebase to fetch list of download URLs of card images
  // preloads card images using the download URLs
  preloadCards() {
    // first get all card URLs from Firebase
    const cardFolder = "cards";
    const promises = [];
    this.cardIds.forEach((card_id) => {
      const imageRef = ref(storage, `${cardFolder}/${card_id + ".jpg"}`);
      const promise = getDownloadURL(imageRef).then((downloadURL) => {
        // preload the card image to Phaser
        return this.load.image(card_id, downloadURL);
      });
      promises.push(promise);
    });
    // execute all promises
    Promise.all(promises).then(() => {
      this.finishedPreload = true;
    });

    this.load.on('complete', () => {
      this.allAssetsPreloaded = true;
      this.create();
      // Move to the create function here
    });
  }

  // calls Firebase to fetch list of download URLs of enemy images
  // preloads enemy card images using the download URLs
  preloadEnemies() {
    // first get all enemy URLs from Firebase
    const enemyFolder = "enemies";
    const promises = [];
    this.enemyIds.forEach((enemyId) => {
      const imageRef = ref(storage, `${enemyFolder}/${enemyId + ".jpg"}`);
      const promise = getDownloadURL(imageRef).then((downloadURL) => {
        // preload the card image to Phaser
        return this.load.image(enemyId, downloadURL);
      });
      promises.push(promise);
    });
    // execute all promises
    Promise.all(promises).then(() => {
      console.log("enemy images preloaded");
    });

  }

  // main preload function responsible for fetching game/cards/enemies data and preloading all card/enemy images
  preload() {
    // Get the query string parameters from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Retrieve the value of game parameters from the URL and save it in class properties
    this.gameId = urlParams.get("gameId");
    this.characterId = urlParams.get("characterId");
    this.deckSize = urlParams.get("deckSize");
    this.difficulty = urlParams.get("difficulty");

    // call various functions to obtain card list, enemy encounters, and game rules from the backend
    Promise.all([this.getCards(), this.getEnemies(), this.getGameRules()])
      .then(([cards, enemies, rules]) => {
        // Store cards, enemies, and game rules in class properties for later use
        this.cards = cards;
        this.enemies = enemies;
        this.gameRules = rules;

        // parse card objects
        this.parseCards();
        // parse enemy objects
        this.parseEnemies();
        // preload card images
        this.preloadCards();
        // preload enemy images
        this.preloadEnemies();

        while (!this.cardDeck && !this.gameRules && !this.finishedPreload) {
          continue;
        }
      })
      .catch((error) => {
        console.log("fetch error" + error);
      });
      
    this.load.image("gameBackground", "src/assets/Game_Background.png");

  }

  create() {
    if (!this.allAssetsPreloaded) {
      return
    }
    // add game background
    this.add.image(600, 500, 'gameBackground');
    // Everything is going to be dealt with through various handlers.
    this.EnemyHandler = new EnemyHandler(this);
    this.PlayerHandler = new PlayerHandler(this);
    this.HeroHandler = new HeroHandler(this);
    this.AllyHandler = new AllyHandler(this);
    this.RulesHandler = new RulesHandler(this);
    //this.CardHandler = new CardHandler();
    this.DeckHandler = new DeckHandler(this);
    this.GameHandler = new GameHandler(this);
    this.SocketHandler = new SocketHandler(this);
    this.UIHandler = new UIHandler(this);
    this.UIHandler.buildUI();
    this.InteractiveHandler = new InteractiveHandler(this);
    this.GameHandler.spawnEnemies();
  }

  update() {}
}
