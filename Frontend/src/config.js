export const CONFIG = {
  BACKEND_URL: "https://tcg-backend-app-2nzzlueilq-lz.a.run.app",
  BACKEND_CODE: "tcgadmin",
  ACCESS_TOKEN: null,
  DEFAULT_ENEMY: {
    defense: 10,
    attack: 20,
    health: 40,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Dragon_on_the_Dragon_Bridge_in_Ljubljana-3906673.jpg",
    level: 8,
    name: "NEW ENEMY",
    effect: [],
    game_ids: [],
  },
  DEFAULT_CARD: {
    health: 3,
    attack: 2,
    defense: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/75/A_curious_kitten_%28Pixabay%29.jpg",
    type: "CREATURE",
    cost: 0,
    availability: "COMMON_1_5",
    game_ids: [],
    name: "NEW CARD",
    effect: [],
  },
};
