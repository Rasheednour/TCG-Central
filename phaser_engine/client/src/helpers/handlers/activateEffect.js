import playSpell from "./playSpell";

const positivity_matrix = {
  HEAL: true,
  DAMAGE: false,
  DRAIN: false,
  BUFFATK: true,
  BUFFDEF: true,
  DRAINATK: false,
  DRAINDEF: false,
};

export default function activateEffect(
  ability,
  scene,
  this_ally_index,
  card_type
) {
  let split_eff = ability.split("_");
  let cost = 0;
  let target = split_eff[3];
  let value = split_eff[2];
  let effect = split_eff[1];
  let ally_index =
    target == "SELF" && card_type == "ally" ? this_ally_index : -1;
  let enemy_index =
    target == "SELF" && card_type == "enemy" ? this_ally_index : -1;
  if (target == "TARGET" || target == "CREATURE" || target == "ENEMY") {
    let num_options;
    let pick;
    if (
      (card_type == "ally" &&
        target == "TARGET" &&
        positivity_matrix[effect]) ||
      (card_type == "enemy" &&
        target == "TARGET" &&
        !positivity_matrix[effect]) ||
      target == "CREATURE"
    ) {
      num_options = scene.AllyHandler.allies.length;
      if (target == "TARGET") {
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
  if ((effect == "DRAW" || effect == "DISCARD") && target == "PLAYER") {
    return playSpell(target, value, effect, cost, -1, -1, scene);
  } else {
    return playSpell(
      target,
      value,
      effect,
      cost,
      enemy_index,
      ally_index,
      scene
    );
  }
}
