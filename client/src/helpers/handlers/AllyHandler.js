import SampleAlly from "../cards/SampleAlly";

export default class AllyHandler {
    constructor(scene) {
        this.allies = [];
        this.allyIndex = 0;

        //play an ally from hand:
        this.playAlly = (name) => {
            let allies = {
                //This is where we will load the ally types
                Sample_Ally: new SampleAlly(scene)
            }
            let newAlly = allies[name];
            this.allies[this.allyIndex] = newAlly;
            this.allyIndex = this.allyIndex + 1;
        }

        //temporary ally auto-attack:
        this.alliesAttack = () => {
            for(let i in this.allies) {
                this.allies[i].strike();
            }
        }

        this.destroyAlly = (index) => {
            this.allies.splice(index, 1);
            for(let i in this.allies) {
                if(this.allies[i].index > index) {
                    this.allies[i].index --;
                }
            }
        }
    }
}