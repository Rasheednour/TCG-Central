import Ally from "../cards/Ally";

export default class AllyHandler {
    constructor(scene) {
        this.allies = [];
        this.allyIndex = 0;
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
                this.allyIndex);
            if(scene.PlayerHandler.resources >= newAlly.cost){
                this.allies.push(newAlly);
                scene.PlayerHandler.spendResources(newAlly.cost);
                this.allySprites.push(gameObject.data.values.id);
                this.allyIndex = this.allyIndex + 1;
                return true;
            } else {
                return false;
            }   
        }

        this.updateHealth = (health, index) => {
            for(let i in scene.PlayerHandler.playerHand) {
                if(scene.PlayerHandler.playerHand[i].data.values.id === this.allySprites[index]) {
                    scene.PlayerHandler.playerHand[i].list[3].setText(`<3 ${health}`);
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
        this.deleteAlly = (index) => {
            for(let i in scene.PlayerHandler.playerHand) {
                if(scene.PlayerHandler.playerHand[i].data.values.id === this.allySprites[index]) {
                    scene.PlayerHandler.playerHand[i].visible = false;
                }
            }
            this.allies.splice(index, 1);
            this.allySprites.splice(index, 1);
            this.allyIndex --;
            scene.dropZone.data.values.cards --;
            for(let i in this.allies) {
                if(this.allies[i].index > index) {
                    this.allies[i].index --;
                }
            }
        }
    }
}