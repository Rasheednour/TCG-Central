//import CardHandler from '../helpers/handlers/CardHandler';
import DeckHandler from "../helpers/handlers/DeckHandler";
import InteractiveHandler from "../helpers/handlers/InteractiveHandler";
import GameHandler from "../helpers/handlers/GameHandler";
import SocketHandler from "../helpers/handlers/SocketHandler";
import UIHandler from "../helpers/handlers/UIHandler";
import PlayerHandler from "../helpers/handlers/playerHandler";
import AllyHandler from "../helpers/handlers/allyHandler";
import EnemyHandler from "../helpers/handlers/EnemyHandler";
import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
//So far, everything in the game happens in one Phaser Scene, which we call a Game
export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  preload() {
    // get card IDs from local JSON file
    this.load.json("card_ids", "src/assets/card_ids.json");
    // add an event handler when the JSON file has completed loading
    this.load.on("filecomplete", (key, type, data) => {
      // check if this is the JSON file that was loaded previously
      if (key === "card_ids") {
        // get each card ID and send a request to Firebase to retrieve the card image download URL 
        this.myJsonData = data;
        const promises = [];
        data.forEach((card_id) => {
          const saveFolder = "cards";
          const imageRef = ref(storage, `${saveFolder}/${card_id + ".jpg"}`);
          const promise = getDownloadURL(imageRef).then((downloadURL) => {
            // preload the card image to Phaser
            return this.load.image(card_id, downloadURL);
          });
          promises.push(promise);
        });
        // execute all promises
        Promise.all(promises).then(() => {
          console.log("done");
        });
      }
    });

    // we can preload provided assets. We will eventually want to hook this up to our database.
    this.load.image(
      "0vPKtqOPZNCBiDb1cTMA",
      "https://firebasestorage.googleapis.com/v0/b/tcg-maker-backend.appspot.com/o/cards%2F0vPKtqOPZNCBiDb1cTMA.jpg?alt=media&token=71bb171d-764b-4173-ab2f-f04faf17ac54"
    );
    this.load.image("cardBack", "src/assets/Card_Back.png");
    this.load.image("blazingGlory", "src/assets/Blazing_Glory.png");
  }

  create() {
    // Everything is going to be dealt with through various handlers.
    this.EnemyHandler = new EnemyHandler(this);
    this.PlayerHandler = new PlayerHandler(this);
    this.AllyHandler = new AllyHandler(this);
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
