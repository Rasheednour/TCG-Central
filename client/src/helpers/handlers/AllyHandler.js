import Ally from "../cards/Ally";

export default class AllyHandler {
    constructor(scene) {
        this.allies = [];
        this.allySprites = [];

        //play an ally from hand:
        this.playAlly = (gameObject) => {
            if(gameObject.data.values.played === true) {
                return false;
            }
            let newAlly = new Ally(scene,
                gameObject.data.values.name, 
                gameObject.data.values.cost, 
                gameObject.data.values.attack, 
                gameObject.data.values.defense, 
                gameObject.data.values.health, 
                gameObject.data.values.ability,
                gameObject.data.values.id);
            if(scene.PlayerHandler.resources >= newAlly.cost){
                //put the new Ally JS object into the allies array
                this.allies.push(newAlly);
                //spend the resources to play the card and move it from the Player's Hand to their list of Played Cards.
                scene.PlayerHandler.spendResources(newAlly.cost);
                scene.PlayerHandler.playCard(gameObject);
                //Keep track of the GameObject's id for display purposes.
                this.allySprites.push(gameObject.data.values.id);
                //tell the server that the card has been played so it can track remaining cards in hand.
                scene.socket.emit('cardPlayed', scene.socket.id, gameObject.data.values.name);
                return true;
            } else {
                return false;
            }   
        }

        this.updateHealth = (health, id) => {
            for(let i in scene.PlayerHandler.playedCards) {
                if(scene.PlayerHandler.playedCards[i].data.values.id === id) {
                    scene.PlayerHandler.playedCards[i].list[3].setText(`<3 ${health}`);
                }
            }
        }

        //temporary ally auto-attack:
        this.alliesAttack = () => {
            for(let i in this.allies) {
                this.allies[i].strike();
            }
        }

        //to kill an ally: remove the JavaScript object that represents the ally from the array.
        //set the correct sprite to non-visible, and stop tracking that sprite.
        this.deleteAlly = (id) => {
            for(let i in scene.PlayerHandler.playedCards) {
                if(scene.PlayerHandler.playedCards[i].data.values.id === id) {
                    scene.PlayerHandler.playedCards[i].visible = false;
                }
            }
            for(let i = 0; i< this.allies.length; i++){
                if(this.allies[i].id === id) {
                    this.allies.splice(i, 1);
                    this.allySprites.splice(i, 1);
                }
            }
            scene.dropZone.data.values.cards --;
        }
    }
}