export default function effectDescGen(card_info, form_string, effect) {
  let splitted = effect.split("_");
  let filled_string = form_string;
  const target_enum = {
    SPELLSELF: "the player",
    CREATURESELF: "this creature",
    ENEMYSELF: "this enemy",
    TARGET: "any single creature, enemy or player",
    ENEMIES: "all enemies",
    CREATURES: "all of the player's creatures",
    BOARD: "all creatures and enemies",
    ALL: "all creatures, enemies and the player",
    PLAYER: "the player",
    CREATURE: "a single creature controlled by the player",
    SPELL: "a single spell",
    ENEMY: "a single enemy",
    CARD: "a spell or creature",
  };
  const type_enum = {
    ACTIVATE: "activated",
    SUMMON: "played",
    DEATH: "destroyed",
    LINGER: "in play",
    TRIGGER: "occurs",
  };
  const card_type_enum = {
    SPELL: "spells",
    CREATURE: "creatures",
    ENEMY: "enemies",
  };
  filled_string = filled_string.replace("[CARD_NAME]", card_info.name);
  filled_string = filled_string.replace("[VALUE]", splitted[2]);
  filled_string = filled_string.replace(
    "[TARGET]",
    target_enum[
      splitted[3] == "SELF" ? card_info["type"] + splitted[3] : splitted[3]
    ]
  );
  filled_string = filled_string.replace(
    "[EFFECT_TYPE]",
    card_info["type"] === "ENEMY" ? "attacking" : type_enum[splitted[0]]
  );
  filled_string = filled_string.replace(
    "[CARD_TYPE]",
    card_type_enum[card_info["type"]]
  );
  if (card_info["type"] == "ENEMY") {
    filled_string = "(25% chance): " + filled_string;
  }
  return filled_string;
}
