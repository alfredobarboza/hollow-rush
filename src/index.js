import { Application, settings, SCALE_MODES } from 'pixi.js';
import { maps, enums } from './config';
import { KeyboardModule, SoundModule, Utils, MapSequencer, EventBus, UIModule } from './modules';
import { AnimatedCharacter, TileMap, Weapon, Item, Potion } from './entities';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const keyboard = new KeyboardModule();
const ITEM_TYPES = enums.itemTypes;
const AUDIO = enums.audioBytes;
const SPRITES = enums.spriteUrls;

// Create the application helper and add its render target to the page
const app = new Application({ width: 1024, height: 768, antialias: true });
app.stage.sortableChildren = true;
document.querySelector('#game').appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.margin = 0;
app.renderer.view.style.padding = 0;

const axe = new Weapon({
  name: ITEM_TYPES.WEAPONS.AXE,
  type: ITEM_TYPES.TYPES.WEAPON,
  spriteUrl: SPRITES.AXE_SPRITE
});

const healPotion = new Potion({
  name: ITEM_TYPES.CONSUMABLES.POTION,
  spriteUrl: SPRITES.POTION_SPRITE,
  type: ITEM_TYPES.TYPES.CONSUMABLE,
  stackSize: 10,
  soundSpriteUrl: AUDIO.DRINK_POTION
});

const portal = new Item({
  name: ITEM_TYPES.SPECIALS.TELEPORTER,
  spriteUrl: SPRITES.PORTAL_SPRITE,
  type: ITEM_TYPES.TYPES.SPECIAL,
  grabbable: false
});

const hazard = new Item({
  name: ITEM_TYPES.SPECIALS.WARNING,
  spriteUrl: SPRITES.WARNING_SPRITE,
  type: ITEM_TYPES.TYPES.SPECIAL,
  grabbable: false
});

app.loader.onComplete.add(() => {
  EventBus.publish('app.load', { stage: app.stage });
});

app.loader
  .add('spritesheet', SPRITES.CHAR_SPRITESHEET)
  .add('attackSpritesheet', SPRITES.ATTACK_SPRITESHEET)
  .load((loader, resources) => {
    const firstMap = new TileMap({ config: maps.FIRST_ARENA, tilesetUrl:  SPRITES.ARENA_MAP});
    const specialMap = new TileMap({ config: maps.SPECIAL_MAP, tilesetUrl: SPRITES.ENDING_MAP });

    const mapSequencer = new MapSequencer([firstMap, specialMap]);

    const defaultChar = new AnimatedCharacter({
      textures: Object.values(resources.spritesheet.textures),
      frameMap: {
        right: { current: 8, min: 8, max: 11 },
        left: { current: 4, min: 4, max: 7 },
        down: { current: 0, min: 0, max: 3 },
        up: { current: 12, min: 12, max: 15 }
      },
      width: 32,
      height: 32,
      class: 'rogue'
    });

    keyboard.registerMovement(app, defaultChar);

    firstMap.add(axe, 64, 32);
    firstMap.add(healPotion, 128, 32);
    firstMap.add(portal, firstMap.width - 64, firstMap.height - 64);
    firstMap.add(hazard, 256, 256);
    firstMap.add(defaultChar, 32, 32);

    UIModule.displayHealthBar(defaultChar);
    UIModule.displayInventory(defaultChar);

    app.stage.addChild(mapSequencer.getCurrent());

    portal.onCollision = () => {
      const nextMap = mapSequencer.loadNext();

      nextMap.add(defaultChar, 256, 256);
      app.stage.addChild(nextMap);
      SoundModule.play(AUDIO.INTRO);
    }

    hazard.onCollision = () => defaultChar.takeDamage(10);

    //SoundModule.play(AUDIO.INTRO);

    Utils.renderVersionIndicator(app.stage);
  });

Utils.debugEvents();
//Utils.displayOuterInventory();
