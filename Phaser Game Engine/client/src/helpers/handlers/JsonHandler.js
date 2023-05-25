export default class JsonHandler {
    constructor(scene) {
        // Player deck array and enemy array:
        this.player_deck = [];
        this.enemies = [];

        //Game Rules:
        this.decking_mechanic = null;
        this.encounter_type = "";
        this.battle_mechanic = "";
        this.resource_end = 0;
        this.resource_inc = 0;
        this.resource_name = "";
        this.resource_persist = "";
        this.resource_start = 0;
        this.starting_hand = 0;
        this.starting_health = 0;
        this.turn_draw = 0;

        //Character Information:
        this.character_name = "";
        this.character_attack = 0;
        this.character_defense = 0;
        this.character_health_mod = 0;
        this.character_ability = "";

        this.ParseJson = (jsonGameObject) => {
            parsedJson = JSON.parse(jsonGameObject);

            //set player deck:
            this.player_deck = parsedJson.cards;

            //set enemies:
            this.enemies = parsedJson.enemies;

            //set game rules:
            this.decking_mechanic = parsedJson.decking_mechanic;
            this.encounter_type = parsedJson.encounter_type
            this.resource_end = parsedJson
            
        }
    }
}