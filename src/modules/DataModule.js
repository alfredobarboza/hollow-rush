import { 
  itemTypes as ITEM_TYPES,
  audioBytes as AUDIO,
  spriteUrls as SPRITES,
  mapNames as MAPS,
  playerClasses as CLASSES
} from '../config/enums';
import Item from '../entities/Item';
import Potion from '../entities/Potion';
import Weapon from '../entities/Weapon';

class DataModule {
  constructor() {
    this.gameEntities = [
      { 
        model: Weapon, // item class
        props: { id: 'axe1', name: ITEM_TYPES.WEAPONS.AXE, type: ITEM_TYPES.TYPES.WEAPON, spriteUrl: SPRITES.AXE_SPRITE }, // item properties
        map: { name: MAPS.FIRST_ARENA, x: 64, y: 32 } // map properties
      },
      { 
        model: Potion,
        props: { id: 'potion1', name: ITEM_TYPES.CONSUMABLES.POTION, type: ITEM_TYPES.TYPES.CONSUMABLE, spriteUrl: SPRITES.POTION_SPRITE, stackSize: 10 },
        map: { name: MAPS.FIRST_ARENA, x: 128, y: 32 }
      },
      { 
        model: Item,
        props: { id: 'portal1', name: ITEM_TYPES.SPECIALS.TELEPORTER, type: ITEM_TYPES.TYPES.SPECIAL, spriteUrl: SPRITES.PORTAL_SPRITE, grabbable: false },
        map: { name: MAPS.FIRST_ARENA, x: 922, y: 704 }
      },
      { 
        model: Item,
        props: { id: 'hazard1', name: ITEM_TYPES.SPECIALS.WARNING, type: ITEM_TYPES.TYPES.SPECIAL, spriteUrl: SPRITES.WARNING_SPRITE, grabbable: false },
        map: { name: MAPS.FIRST_ARENA, x: 256, y: 256 }
      }
    ];

    this.audioCfg = [
      { name: AUDIO.INTRO, src: '/assets/audios/examplec.wav', loop: false, volume: 0.1 },
      { name: AUDIO.GRAB_ITEM, src: '/assets/audios/grabItem.wav', loop: false, volume: 0.1 },
      { name: AUDIO.HIT, src: '/assets/audios/hit.wav', loop: false, volume: 0.1 },
      { name: AUDIO.DRINK_POTION, src: '/assets/audios/drink-potion.wav', loop: false, volume: 0.1 },
      { name: AUDIO.ATTACK, src: '/assets/audios/attack.wav', loop: false, volume: 0.1 },
      { name: AUDIO.GAME_OVER, src: '/assets/audios/gameover.wav', loop: false, volume: 0.1 }
    ];

    this.charSheets = [
      {
        name: CLASSES.ROGUE,
        attackValue: 20,
        hp: 85,
        mana: 50,
        speedMultiplier: 1
      },
      {
        name: CLASSES.GLADIATOR,
        attackValue: 10,
        hp: 150,
        mana: 20,
        speedMultiplier: 1
      },
      {
        name: CLASSES.PALADIN,
        attackValue: 15,
        hp: 120,
        mana: 100,
        speedMultiplier: 1
      },
      {
        name: CLASSES.MAGE,
        attackValue: 5,
        hp: 80,
        mana: 150,
        speedMultiplier: 1
      },
      {
        name: CLASSES.UNDEAD,
        attackValue: 8,
        hp: 200,
        mana: 0,
        speedMultiplier: 1
      }
    ];
  }
}

export default new DataModule();
