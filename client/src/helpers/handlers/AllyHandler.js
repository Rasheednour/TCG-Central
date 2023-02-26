import SampleAlly from "../cards/SampleAlly";

export default class AllyHandler {
    constructor(scene) {
        this.allies = [];
        this.allyIndex = 0;
        this.allySprites = [];

        //play an ally from hand:
        this.playAlly = (gameObject) => {
            let allies = {
                //This is where we will load the ally types
                Sample_Ally: new SampleAlly(scene, this.allyIndex)
            }
            let newAlly = allies[gameObject.data.values.name];
            if(scene.PlayerHandler.resources >= newAlly.cost){
                this.allies[this.allyIndex] = newAlly;
                scene.PlayerHandler.spendResources(newAlly.cost);
                this.allySprites[this.allyIndex] = gameObject.data.values.id;
                this.allyIndex = this.allyIndex + 1;
                return true;
            } else {
                return false;
            }
            
        }

        //temporary ally auto-attack:
        this.alliesAttack = () => {
            for(let i in this.allies) {
                this.allies[i].strike();
            }
        }

        this.deleteAlly = (index) => {
            for(let i in scene.PlayerHandler.playerHand) {
                if(scene.PlayerHandler.playerHand[i].data.values.id === this.allySprites[index]) {
                    scene.PlayerHandler.playerHand[i].visible = false;
                }
            }
            this.allies = this.allies.splice(index, 1);
            this.allSprites = this.allySprites.splice(index, 1);
            scene.dropZone.data.values.cards --;
            for(let i in this.allies) {
                if(this.allies[i].index > index) {
                    this.allies[i].index --;
                }
            }
        }
    }
}