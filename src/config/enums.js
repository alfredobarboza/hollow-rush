export const itemTypes = {
  TYPES: {
    WEAPON: 'weapon',
    CONSUMABLE: 'consumable',
    SPECIAL: 'special'
  },
  WEAPONS: {
    SWORD: 'sword',
    AXE: 'axe',
    MACE: 'mace'
  },
  CONSUMABLES: {
    POTION: 'potion',
    KEY: 'key'
  },
  SPECIALS: {
    TELEPORTER: 'teleporter',
    WARNING: 'warning'
  }
};

export const audioBytes = {
  INTRO: 'intro',
  GRAB_ITEM: 'grabItem',
  HIT: 'hit',
  DRINK_POTION: 'drinkPotion',
  ATTACK: 'attack',
  GAME_OVER: 'gameOver'
}

export const characterActions = {
  ATTACK: {
    KEY: 'Space',
    NAME: 'attack'
  },
  USE_ITEM: {
    KEY: 'KeyF',
    NAME: 'use'
  }
}

export const spriteUrls = {
  POTION_SPRITE: '/assets/items/potion.png',
  PORTAL_SPRITE: '/assets/items/portal.png',
  AXE_SPRITE: '/assets/items/axe.png',
  WARNING_SPRITE: '/assets/items/warning.png',
  CHAR_SPRITESHEET: 'assets/chars/knight.json',
  ATTACK_SPRITESHEET: 'assets/items/attack-sprites.json',
  ARENA_MAP: 'assets/maps/map_tileset_32x32.png',
  ENDING_MAP: 'assets/maps/map_tileset_32x32.png'
}

export default {
  itemTypes,
  characterActions,
  audioBytes,
  spriteUrls
};
