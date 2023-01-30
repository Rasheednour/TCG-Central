//InteractiveHandler handles player interactions with game elements. Right now we can deal cards and drag them into dropZones.
export default class InteractiveHandler {
    constructor(scene) {

        //Interactions with deal cards button
        scene.dealCards.on('pointerdown', () => {
            scene.socket.emit("dealCards", scene.socket.id);
            scene.dealCards.disableInteractive();
        })

        scene.dealCards.on('pointerover', () => {
            scene.dealCards.setColor('#ff69b4');
        })

        scene.dealCards.on('pointerout', () => {
            scene.dealCards.setColor('#00ffff');
        })

        //Interactions for draggable elements (right now only cards)
        scene.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xff69b4);
            scene.children.bringToTop(gameObject);
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
           gameObject.setTint();
           if(!dropped) {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
           } 
        })

        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if (scene.gameHandler.isMyTurn && scene.gameHandler.gameState === 'Ready') {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                //currently once a card is dropped into a dropzone, it can't be dragged again.
                scene.input.setDraggable(gameObject, false);
                scene.socket.emit('cardPlayed', gameObject.data.values.name, scene.socket.id);
            }
            else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}