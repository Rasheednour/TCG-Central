function applyAllEnemies(effect, value, scene) {
  for (
    let enemy_index = 0;
    enemy_index < scene.EnemyHandler.enemies.length;
    enemy_index++
  ) {
    if (!applyToEnemy(effect, value, scene, enemy_index)) {
      return false;
    }
  }
  return true;
}

function applyAllAllies(effect, value, scene) {
  for (
    let ally_index = 0;
    ally_index < scene.AllyHandler.allies.length;
    ally_index++
  ) {
    if (!applyToAlly(effect, value, scene, ally_index)) {
      return false;
    }
  }
  return true;
}

function applyToEnemy(effect, value, scene, enemy_index) {
  let val;
  switch (effect) {
    case "DAMAGE":
      scene.EnemyHandler.enemies[enemy_index].takeDamage(
        Number(value) - scene.EnemyHandler.enemies[enemy_index].defense
      );
      return true;
    case "HEAL":
      scene.EnemyHandler.enemies[enemy_index].takeDamage(Number(value) * -1);
      return true;
    case "BUFFATK":
      scene.EnemyHandler.updateAttack(
        scene.EnemyHandler.enemies[enemy_index].attack + Number(value),
        enemy_index
      );
      return true;
    case "DRAINATK":
      val = scene.EnemyHandler.enemies[enemy_index].attack - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.EnemyHandler.updateAttack(val, enemy_index);
      return true;
    case "BUFFDEF":
      scene.EnemyHandler.updateDefense(
        scene.EnemyHandler.enemies[enemy_index].defense + Number(value),
        enemy_index
      );
      return true;
    case "DRAINDEF":
      val = scene.EnemyHandler.enemies[enemy_index].defense - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.EnemyHandler.updateDefense(val, enemy_index);
      return true;
    case "DRAIN":
      scene.EnemyHandler.enemies[enemy_index].takeDamage(Number(value));
    default:
      return false;
  }
}

function applyToAlly(effect, value, scene, ally_index) {
  let val;
  switch (effect) {
    case "DAMAGE":
      scene.AllyHandler.allies[ally_index].takeDamage(
        Number(value) - scene.AllyHandler.allies[ally_index].defense
      );
      return true;
    case "HEAL":
      scene.AllyHandler.allies[ally_index].takeDamage(Number(value) * -1);
      return true;
    case "BUFFATK":
      scene.AllyHandler.updateAttack(
        scene.AllyHandler.allies[ally_index].attack + Number(value),
        ally_index
      );
      return true;
    case "DRAINATK":
      val = scene.AllyHandler.allies[ally_index].attack - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.AllyHandler.updateAttack(val, ally_index);
      return true;
    case "BUFFDEF":
      scene.AllyHandler.updateDefense(
        scene.AllyHandler.allies[ally_index].defense + Number(value),
        ally_index
      );
      return true;
    case "DRAINDEF":
      val = scene.AllyHandler.allies[ally_index].defense - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.AllyHandler.updateDefense(val, ally_index);
      return true;
    case "DRAIN":
      scene.AllyHandler.allies[ally_index].takeDamage(Number(value));
    default:
      return false;
  }
}

function applyToPlayer(effect, value, scene) {
  let val;
  switch (effect) {
    case "HEAL":
      scene.PlayerHandler.takeDamage(Number(value) * -1);
      return true;
    case "BUFFATK":
      scene.HeroHandler.updateAttack(
        scene.HeroHandler.hero.data.values.attack + Number(value)
      );
      return true;
    case "DRAINATK":
      val = scene.HeroHandler.hero.data.values.attack - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.HeroHandler.updateAttack(val);
      return true;
    case "BUFFDEF":
      scene.HeroHandler.updateDefense(
        scene.HeroHandler.hero.data.values.defense + Number(value)
      );
      return true;
    case "DRAINDEF":
      val = scene.HeroHandler.hero.data.values.defense - Number(value);
      if (val < 0) {
        val = 0;
      }
      scene.HeroHandler.updateDefense(val);
      return true;
    case "DAMAGE":
      val = Number(value) - scene.HeroHandler.hero.data.values.defense;
      if (val < 0) {
        val = 0;
      }
      scene.PlayerHandler.takeDamage(val);
      return true;
    case "DRAIN":
      scene.PlayerHandler.takeDamage(Number(value));
      return true;
    case "DRAW":
      scene.socket.emit("drawCards", scene.socket.id, Number(value));
      return true;
    case "DISCARD":
      //For now just discards a random card
      let card;
      for (let i = 0; i < Number(value); i++) {
        if (scene.PlayerHandler.playerHand.length > 0) {
          card =
            scene.PlayerHandler.playerHand[
              Math.floor(Math.random() * scene.PlayerHandler.playerHand.length)
            ];
          scene.PlayerHandler.playCard(card);
          card.visible = false;
          scene.socket.emit(
            "cardPlayed",
            scene.socket.id,
            card.data.values.name
          );
        }
      }
      return true;
    default:
      return false;
  }
}

export default function playSpell(
  target,
  value,
  effect,
  cost,
  enemy_index,
  ally_index,
  scene
) {
  //USE -1 for default values to not use, ie enemy and ally index
  let a, b, c;
  //If spell can be played returns true.  enacts the effect of the spell
  // but DOES NOT deal with paying resources or updating cards/game state aside from the effect of the spell
  if (enemy_index > -1) {
    return applyToEnemy(effect, value, scene, enemy_index);
  } else if (ally_index > -1) {
    //Deal with card played on ally
    return applyToAlly(effect, value, scene, ally_index);
  } else {
    switch (target) {
      case "PLAYER":
        return applyToPlayer(effect, value, scene);
      case "ENEMIES":
        return applyAllEnemies(effect, value, scene);
      case "CREATURES":
        return applyAllAllies(effect, value, scene);
      case "BOARD":
        a = applyAllEnemies(effect, value, scene);
        b = applyAllAllies(effect, value, scene);
        return a || b;
      case "ALL":
        a = applyAllEnemies(effect, value, scene);
        b = applyAllAllies(effect, value, scene);
        c = applyToPlayer(effect, value, scene);
        return a || b || c;
      default:
        return false;
    }
  }

  return false;
}
