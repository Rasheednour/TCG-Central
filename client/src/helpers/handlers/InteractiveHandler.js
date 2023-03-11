//InteractiveHandler handles player interactions with game elements. Right now we can deal cards and drag them into dropZones.

import Ally from "../cards/Ally";
import playSpell from "./playSpell";

//This is where the starting hand size is kept. It's used on the pointerdown function for startGame.

const positivity_matrix = {
  HEAL: true,
  DAMAGE: false,
  DRAIN: false,
  BUFFATK: true,
  BUFFDEF: true,
  DRAINATK: false,
  DRAINDEF: false,
};

export default class InteractiveHandler {
  constructor(scene) {
    scene.cardPreview = null;

    //Interactions with deal cards button
    scene.startGame.on("pointerdown", () => {
      scene.socket.emit(
        "startGame",
        scene.socket.id,
        scene.RulesHandler.startGameCards
      );
      scene.startGame.disableInteractive();
    });

    scene.startGame.on("pointerover", () => {
      scene.startGame.setColor("#ff69b4");
    });

    scene.startGame.on("pointerout", () => {
      scene.startGame.setColor("#00ffff");
    });

    //use the end turn button to end the turn
    scene.endTurn.on("pointerdown", () => {
      if (scene.GameHandler.gameState === "Ready") {
        scene.GameHandler.changeTurn();
      }
    });

    scene.endTurn.on("pointerover", () => {
      scene.endTurn.setColor("#ff69b4");
    });

    scene.endTurn.on("pointerout", () => {
      scene.endTurn.setColor("#00ffff");
    });

    //dragged objects follow mouse.
    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      //trying alternate approach from internet, it doesnt solve problem....
      //   gameObject.x = pointer.x;
      //   gameObject.y = pointer.y;
    });

    //when we hover over the front of a card, we get a larger, easier to read highlight.
    scene.input.on("pointerover", (event, gameObjects) => {
      let pointer = scene.input.activePointer;
      if (
        gameObjects[0].type === "Image" &&
        gameObjects[0].data.list.name !== "cardBack"
      ) {
        scene.cardPreview = scene.add
          .image(
            pointer.worldX,
            pointer.worldY,
            gameObjects[0].data.values.sprite
          )
          .setScale(0.5, 0.5);
      } else if (gameObjects[0].type === "Container") {
        console.log("found a container!");
        scene.children.bringToTop(gameObjects[0]);
        gameObjects[0].setScale(0.5, 0.5);
      } else if (gameObjects[0].parentContainer) {
        scene.children.bringToTop(gameObjects[0].parentContainer);
        gameObjects[0].parentContainer.setScale(0.5, 0.5);
      }
    });

    scene.input.on("pointerout", (event, gameObjects) => {
      if (gameObjects[0].type === "Container") {
        gameObjects[0].setScale(0.25, 0.25);
      } else if (gameObjects[0].parentContainer) {
        gameObjects[0].parentContainer.setScale(0.25, 0.25);
      }
    });

    //Interactions for draggable elements (right now only cards)
    scene.input.on("dragstart", (pointer, gameObject) => {
      console.log("drag start", gameObject);
      scene.children.bringToTop(gameObject);
    });

    scene.input.on("dragend", (pointer, gameObject, dropped) => {
      console.log("drag end with this info", pointer, gameObject, dropped);
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    scene.input.on("drop", (pointer, gameObject, dropZone) => {
      console.log("card dropped", gameObject, dropZone);
      if (
        scene.GameHandler.isMyTurn &&
        dropZone.parentContainer &&
        dropZone.parentContainer.data.values.type == "enemy" &&
        gameObject.data.values.attackedThisTurn === false
      ) {
        //DEALING WITH: when cards are played on enemies
        if (gameObject.data.values.type === "hero") {
          for (let j = 0; j < scene.EnemyHandler.enemies.length; j++) {
            if (
              dropZone.parentContainer.data.values.index ===
              scene.EnemyHandler.enemies[j].index
            ) {
              scene.EnemyHandler.enemies[j].takeDamage(
                scene.HeroHandler.hero.data.values.attack -
                  scene.EnemyHandler.enemies[j].defense
              );
              gameObject.data.values.attackedThisTurn = true;
              gameObject.x = gameObject.input.dragStartX;
              gameObject.y = gameObject.input.dragStartY;
            }
          }
        } else if (gameObject.data.values.type === "ally") {
          let ally;
          for (let i = 0; i < scene.AllyHandler.allySprites.length; i++) {
            if (
              scene.AllyHandler.allySprites[i] === gameObject.data.values.id
            ) {
              for (let j = 0; j < scene.EnemyHandler.enemies.length; j++) {
                if (
                  dropZone.parentContainer.data.values.index ===
                  scene.EnemyHandler.enemies[j].index
                ) {
                  scene.EnemyHandler.enemies[j].takeDamage(
                    scene.AllyHandler.allies[i].attack -
                      scene.EnemyHandler.enemies[j].defense
                  );
                  gameObject.data.values.attackedThisTurn = true;
                  gameObject.x = gameObject.input.dragStartX;
                  gameObject.y = gameObject.input.dragStartY;
                  break;
                }
              }
            }
          }
        } else if (
          gameObject.data.values.type === "spell" &&
          gameObject.data.values.cost <= scene.PlayerHandler.resources
        ) {
          //Do I need to iterate through the hand like iterating through the allies when an ally attacks?
          //for (let i = 0; i < scene.AllyHandler.allySprites.length; i++) {
          // if (scene.PlayerHandler.playerHand)
          console.log("spell played", gameObject);
          let abilities = gameObject.data.values.ability;
          let cost = gameObject.data.values.cost;
          let cost_paid = false;
          for (let eff_count = 0; eff_count < abilities.length; eff_count++) {
            //iterate through the abilities associated with the spell
            // For now all abilities will be summon (in future this may need to be adjusted if introduce other spell types)
            let split_eff = abilities[eff_count].split("_");
            let target = split_eff[3] == "SELF" ? "PLAYER" : split_eff[3];
            let value = split_eff[2];
            let effect = split_eff[1];

            if (target == "TARGET" || target == "ENEMY") {
              //targetted spell, check the overlap
              for (let j = 0; j < scene.EnemyHandler.enemies.length; j++) {
                if (
                  dropZone.parentContainer.data.values.index ===
                  scene.EnemyHandler.enemies[j].index
                ) {
                  console.log("spell played on enemy", j);

                  //scene.EnemyHandler.enemies[j]
                  if (playSpell(target, value, effect, cost, j, -1, scene)) {
                    gameObject.data.values.attackedThisTurn = true;
                    gameObject.data.values.played = true;
                    gameObject.visible = false;
                    if (!cost_paid) {
                      scene.PlayerHandler.spendResources(
                        gameObject.data.values.cost
                      );
                      cost_paid = true;
                    }
                    scene.PlayerHandler.playCard(gameObject);
                    scene.socket.emit(
                      "cardPlayed",
                      scene.socket.id,
                      gameObject.data.values.name
                    );
                  }
                  break;
                }
              }
            } else if (target == "CREATURE") {
              console.log(
                "tried to play a spell that targets player creatures on an enemy"
              );
            } else {
              //We are in an effect that does not specify a target, so will attempt to play
              if (
                ((effect == "DRAW" || effect == "DISCARD") &&
                  target == "PLAYER") ||
                playSpell(target, value, effect, cost, -1, -1, scene)
              ) {
                gameObject.data.values.attackedThisTurn = true;
                gameObject.data.values.played = true;
                gameObject.visible = false;
                if (!cost_paid) {
                  scene.PlayerHandler.spendResources(
                    gameObject.data.values.cost
                  );
                  cost_paid = true;

                  scene.PlayerHandler.playCard(gameObject);
                  scene.socket.emit(
                    "cardPlayed",
                    scene.socket.id,
                    gameObject.data.values.name
                  );
                }
                if (
                  (effect == "DRAW" || effect == "DISCARD") &&
                  target == "PLAYER"
                ) {
                  playSpell(target, value, effect, cost, -1, -1, scene);
                }
              }
            }
          }
        }
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      } else if (
        scene.GameHandler.isMyTurn &&
        scene.GameHandler.gameState === "Ready"
      ) {
        //DEALS WITH: playing cards in play zone
        if (
          gameObject.data.values.type === "ally" &&
          scene.AllyHandler.allies.length < 5 &&
          scene.AllyHandler.playAlly(gameObject)
        ) {
          gameObject.x = dropZone.x - 350 + dropZone.data.values.cards * 150;
          gameObject.y = dropZone.y;
          //set the played status of the card to true, so it can't be played again by accident.
          gameObject.data.values.played = true;
          scene.dropZone.data.values.cards++;
        } else if (
          gameObject.data.values.type === "spell" &&
          gameObject.data.values.cost <= scene.PlayerHandler.resources
        ) {
          let cost_paid = false;
          for (
            let eff_index = 0;
            eff_index < gameObject.data.values.ability.length;
            eff_index++
          ) {
            let split_eff =
              gameObject.data.values.ability[eff_index].split("_");
            let cost = gameObject.data.values.cost;
            let target = split_eff[3] == "SELF" ? "PLAYER" : split_eff[3];
            let value = split_eff[2];
            let effect = split_eff[1];
            let ally_index = -1;
            let enemy_index = -1;
            //If dropped on player and target tyope is TARGET change target type to PLAYER
            // if (
            //   target == "TARGET" &&
            //   dropZone.parentContainer &&
            //   dropZone.parentContainer.data.values.type == "hero"
            // ) {
            //   target = "PLAYER";
            // }
            //Deal with spell dropped on an ally
            // if (target == "TARGET" || target == "CREATURE") {
            //   if (
            //     dropZone.parentContainer &&
            //     dropZone.parentContainer.data.values.type == "ally"
            //   ) {
            //     for (let i = 0; i < scene.AllyHandler.allySprites.length; i++) {
            //       console.log(
            //         "comparing ally",
            //         scene.AllyHandler.allySprites[i],
            //         "with dropzone",
            //         dropZone.parentContainer.data.values
            //       );
            //       if (
            //         scene.AllyHandler.allySprites[i] ===
            //         dropZone.parentContainer.data.values.id
            //       ) {
            //         if (
            //           playSpell(target, value, effect, cost, -1, i, scene) &&
            //           !cost_paid
            //         ) {
            //           gameObject.data.values.attackedThisTurn = true;
            //           gameObject.data.values.played = true;
            //           gameObject.visible = false;

            //           scene.PlayerHandler.spendResources(
            //             gameObject.data.values.cost
            //           );
            //           cost_paid = true;

            //           scene.PlayerHandler.playCard(gameObject);
            //           scene.socket.emit(
            //             "cardPlayed",
            //             scene.socket.id,
            //             gameObject.data.values.name
            //           );
            //         }
            //       }
            //     }
            //   }
            // }
            if (target == "TARGET" || target == "CREATURE") {
              //Can't get drop zones to work without disabling draggability, so going for reasonable randomness for MVP
              //if it is a positive spell pick a random player or ally, if negative pick random enemy
              let num_options;
              let pick;
              if (positivity_matrix[effect]) {
                num_options = scene.AllyHandler.allies.length;
                if (!dropZone) {
                  num_options++;
                }
                pick = Math.floor(Math.random() * num_options);
                if (pick < scene.AllyHandler.allies.length) {
                  ally_index = pick;
                } else {
                  target = "PLAYER";
                }
              } else {
                num_options = scene.EnemyHandler.enemies.length;
                pick = Math.floor(Math.random() * num_options);
                enemy_index = pick;
              }
            }
            if (
              ((effect == "DRAW" || effect == "DISCARD") &&
                target == "PLAYER") ||
              playSpell(
                target,
                value,
                effect,
                cost,
                enemy_index,
                ally_index,
                scene
              )
            ) {
              gameObject.data.values.attackedThisTurn = true;
              gameObject.data.values.played = true;
              gameObject.visible = false;
              if (!cost_paid) {
                scene.PlayerHandler.spendResources(gameObject.data.values.cost);
                cost_paid = true;

                scene.PlayerHandler.playCard(gameObject);
                scene.socket.emit(
                  "cardPlayed",
                  scene.socket.id,
                  gameObject.data.values.name
                );
              }
              if (
                (effect == "DRAW" || effect == "DISCARD") &&
                target == "PLAYER"
              ) {
                playSpell(target, value, effect, cost, -1, -1, scene);
              }
            }
          }
          if (!cost_paid) {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
          }
        } else {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
