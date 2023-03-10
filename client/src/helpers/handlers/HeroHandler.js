import Card from "../cards/Card"

export default class HeroHandler {
    constructor(scene) {
        this.hero = null;

        this.resetHeroAttacks = () => {
            this.hero.data.values.attackedThisTurn = false;
        }
    }
}