export const itemTypes = {
  TYPES: {
    WEAPON: 'weapon',
    CONSUMABLE: 'consumable',
    SPECIAL: 'special'
  },
  WEAPONS: {
    SWORD: 'Sword',
    AXE: 'Axe',
    MACE: 'Mace'
  },
  CONSUMABLES: {
    POTION: 'Potion',
    KEY: 'Key'
  },
  SPECIALS: {
    TELEPORTER: 'Teleporter',
    WARNING: 'Warning'
  },
};

export const characterTypes = {
  TYPES: {
    PLAYER: 'player',
    ENEMY_NPC: 'enemy',
    FRIENDLY_NPC: 'friendly'
  }
};

export const audioBytes = {
  INTRO: 'intro',
  GRAB_ITEM: 'grabItem',
  HIT: 'hit',
  DRINK_POTION: 'drinkPotion',
  ATTACK: 'attack',
  GAME_OVER: 'gameOver'
};

export const characterActions = {
  MOVE_LEFT: {
    KEY: 'ArrowLeft',
    ALT_KEY: 'a'
  },
  MOVE_RIGHT: {
    KEY: 'ArrowRight',
    ALT_KEY: 'd'
  },
  MOVE_UP: {
    KEY: 'ArrowUp',
    ALT_KEY: 'w'
  },
  MOVE_DOWN: {
    KEY: 'ArrowDown',
    ALT_KEY: 's'
  },
  ATTACK: {
    KEY: 'Space',
    NAME: 'attack'
  },
  USE_ITEM: {
    KEY: 'KeyF',
    NAME: 'use'
  }
};

export const spriteUrls = {
  POTION_SPRITE: '/assets/items/potion.png',
  PORTAL_SPRITE: '/assets/items/portal.png',
  AXE_SPRITE: '/assets/items/axe.png',
  WARNING_SPRITE: '/assets/items/warning.png',
  CHAR_SPRITESHEET: 'assets/chars/knight.json',
  ENEMY_SPRITESHEET: 'assets/chars/enemy.json',
  ATTACK_SPRITESHEET: 'assets/items/attack-sprites.json',
  ARENA_MAP: 'assets/maps/map_tileset_32x32.png',
  ENDING_MAP: 'assets/maps/map_tileset_32x32.png'
};

export const mapNames = {
  FIRST_ARENA: 'arena_1',
  ENDING: 'special'
};

export const directions = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};

export const playerClasses = {
  ROGUE: 'rogue',
  GLADIATOR: 'gladiator',
  PALADIN: 'paladin',
  MAGE: 'mage',
  UNDEAD: 'undead'
};

export default {
  itemTypes,
  characterActions,
  audioBytes,
  spriteUrls,
  mapNames,
  directions,
  playerClasses
};
