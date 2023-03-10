//InteractiveHandler handles player interactions with game elements. Right now we can deal cards and drag them into dropZones.

import Ally from "../cards/Ally";

//This is where the starting hand size is kept. It's used on the pointerdown function for startGame.

export default class InteractiveHandler {
    constructor(scene) {

        scene.cardPreview = null;

        //Interactions with deal cards button
        scene.startGame.on('pointerdown', () => {
            scene.socket.emit("startGame", scene.socket.id, scene.RulesHandler.startGameCards);
            scene.startGame.disableInteractive();
        })

        scene.startGame.on('pointerover', () => {
            scene.startGame.setColor('#ff69b4');
        })

        scene.startGame.on('pointerout', () => {
            scene.startGame.setColor('#00ffff');
        })

        //use the end turn button to end the turn
        scene.endTurn.on('pointerdown', () => {
            if(scene.GameHandler.gameState === "Ready"){
                scene.GameHandler.changeTurn();
            }          
        })

        scene.endTurn.on('pointerover', () => {
            scene.endTurn.setColor('#ff69b4');
        })

        scene.endTurn.on('pointerout', () => {
            scene.endTurn.setColor('#00ffff');
        })

        //dragged objects follow mouse.
        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        //when we hover over the front of a card, we get a larger, easier to read highlight. 
        scene.input.on('pointerover', (event, gameObjects) => {
            let pointer = scene.input.activePointer;
            if (gameObjects[0].type === 'Image'  && gameObjects[0].data.list.name !== 'cardBack') {
                scene.cardPreview = scene.add.image(pointer.worldX, pointer.worldY, gameObjects[0].data.values.sprite).setScale(.5, .5);
            } else if(gameObjects[0].type === 'Container') {
                console.log("found a container!")
                scene.children.bringToTop(gameObjects[0]);
                gameObjects[0].setScale(.5, .5);
                
            } else if(gameObjects[0].parentContainer) {
                scene.children.bringToTop(gameObjects[0].parentContainer);
                gameObjects[0].parentContainer.setScale(.5, .5);
            }
        });

        scene.input.on('pointerout', (event, gameObjects) => {
        if(gameObjects[0].type === 'Container') {
                gameObjects[0].setScale(.25, .25)
            } else if(gameObjects[0].parentContainer) {
                gameObjects[0].parentContainer.setScale(.25, .25);
            }
        });

        //Interactions for draggable elements (right now only cards)
        scene.input.on('dragstart', (pointer, gameObject) => {
            scene.children.bringToTop(gameObject);
        })

        scene.input.on('dragend', (pointer, gameObject, dropped) => {
           if(!dropped) {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
           } 
        })

        scene.input.on('drop', (pointer, gameObject, dropZone) => {
            if(scene.GameHandler.isMyTurn &&
                dropZone.parentContainer &&
                gameObject.data.values.attackedThisTurn === false
                ) {
                    if(gameObject.data.values.type === "hero") {
                        for(let j = 0; j< scene.EnemyHandler.enemies.length; j++) {
                            if(dropZone.parentContainer.data.values.index === scene.EnemyHandler.enemies[j].index) {
                                scene.EnemyHandler.enemies[j].takeDamage(scene.HeroHandler.hero.data.values.attack - scene.EnemyHandler.enemies[j].defense);
                                gameObject.data.values.attackedThisTurn = true;
                                gameObject.x = gameObject.input.dragStartX;
                                gameObject.y = gameObject.input.dragStartY;
                            }
                        }
                    } else{
                        let ally;
                        for(let i = 0; i< scene.AllyHandler.allySprites.length; i++) {
                            if(scene.AllyHandler.allySprites[i] === gameObject.data.values.id){
                                for(let j = 0; j< scene.EnemyHandler.enemies.length; j++) {
                                    if(dropZone.parentContainer.data.values.index === scene.EnemyHandler.enemies[j].index) {
                                        scene.EnemyHandler.enemies[j].takeDamage(scene.AllyHandler.allies[i].attack - scene.EnemyHandler.enemies[j].defense);
                                        gameObject.data.values.attackedThisTurn = true;
                                        gameObject.x = gameObject.input.dragStartX;
                                        gameObject.y = gameObject.input.dragStartY;
                                        break;
                                    }
                                }
                            }
                        }
                    }    
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                } else if (scene.GameHandler.isMyTurn && 
                scene.GameHandler.gameState === 'Ready' && 
                scene.AllyHandler.allies.length < 5 &&
                scene.AllyHandler.playAlly(gameObject)) {
                    gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 150);
                    gameObject.y = dropZone.y;
                    //set the played status of the card to true, so it can't be played again by accident.
                    gameObject.data.values.played = true;
                    scene.dropZone.data.values.cards++;
            }
            else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })
    }
}