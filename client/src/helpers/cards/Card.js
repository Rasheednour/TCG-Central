import CardHandler from "../handlers/CardHandler";

export default class Card {
    constructor(scene) {
        this.render = (x, y, type) => {
            let sprite;
            if (type === 'playerCard') {
                sprite = this.playerCardSprite;
            } else {
                sprite = this.enemyCardSprite;
            }
            //cards will need more than name, type, and image in the future.
            let card = scene.add.image(x, y, sprite).setScale(.25, .25).setInteractive().setData({
                "name": this.name,
                "type": type,
                "sprite": sprite
            });
            if (type === 'playerCard') {
                scene.input.setDraggable(card);
            }
            return card;
        }
    }
}