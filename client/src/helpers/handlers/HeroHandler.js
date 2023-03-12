import Card from "../cards/Card";

export default class HeroHandler {
  constructor(scene) {
    this.hero = null;

    this.resetHeroAttacks = () => {
      this.hero.data.values.attackedThisTurn = false;
    };

    this.updateAttack = (value) => {
      this.hero.data.values.attack = Number(value);
      this.hero.list[1].setText(`ATK/${value}`);
    };

    this.updateDefense = (value) => {
      this.hero.data.values.defense = Number(value);
      this.hero.list[2].setText(`DEF/${value}`);
    };
  }
}
