//PlayerHandler should handle information about the player itself: health totals, etc.

export default class PlayerHandler {
  constructor(scene) {
    //Stats affected by rules
    this.health = 20;
    this.resourceGrowth = 1;

    //things that we keep track of during the game
    this.resources = 1;
    this.maxResources = 1;

    //this is where the rendered player cards end up.
    this.playerHand = [];

    //this keeps track of cards that have been played.
    this.playedCards = [];

    this.takeDamage = (damageNumber) => {
      this.health = this.health - damageNumber;
      if (this.health < 1) {
        scene.GameHandler.gameOver();
      }
      scene.UIHandler.updatePlayerHealth(this.health);
    };

    //this moves a card from the playerHand array to the playedCards array,
    //so that we can track which cards remain in hand.
    this.playCard = (playedCard) => {
      console.log("We made it to the function!");
      console.log(playedCard.data.values);
      for (let i = 0; i < this.playerHand.length; i++) {
        if (playedCard.data.values.id == this.playerHand[i].data.values.id) {
          this.playedCards.push(playedCard);

          this.playerHand.splice(i, 1);
          console.log(this.playedCards);
        }
      }
    };

    this.spendResources = (cost) => {
      this.resources = this.resources - cost;
      scene.UIHandler.updatePlayerResources(this.resources);
    };

    this.resetResources = () => {
      this.maxResources = this.maxResources + this.resourceGrowth;
      this.resources = this.maxResources;
      scene.UIHandler.updatePlayerResources(this.resources);
    };

    this.resetHand = () => {
      for (let i in this.playerHand) {
        this.playerHand[i].setVisible(false);
        this.playerHand[i].setInteractive(false);
      }
      this.playerHand = [];
    };
  }
}
