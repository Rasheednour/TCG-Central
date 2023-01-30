export default class UIHandler {
    constructor(scene) {
        this.buildGameText = () => {
            scene.dealCards = scene.add.text(960, 465, "Deal Cards").setFontSize(14).setFontFamily("Treubuchet MS");
        }

        this.buildUI = () => {
            this.buildGameText();
        }

    }
}