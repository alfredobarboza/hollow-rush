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
  },
};

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

export default {
  itemTypes,
  characterActions
};
