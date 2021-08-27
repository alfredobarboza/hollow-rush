import { Application, settings, SCALE_MODES } from 'pixi.js';
import { maps, enums } from './config';
import { KeyboardModule, SoundModule, Utils, MapSequencer } from './modules';
import { AnimatedCharacter, TileMap, Weapon, Item, ConsumableItem } from './entities';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const keyboard = new KeyboardModule();
const ITEM_TYPES = enums.itemTypes;

// Create the application helper and add its render target to the page
const app = new Application({ width: 1024, height: 768, antialias: true });
document.querySelector('#game').appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.margin = 0;
app.renderer.view.style.padding = 0;

const axe = new Weapon({
  name: ITEM_TYPES.WEAPONS.AXE,
  type: ITEM_TYPES.TYPES.WEAPON,
  spriteUrl: '/assets/items/axe.png'
});

const healPotion = new ConsumableItem({
  name: ITEM_TYPES.CONSUMABLES.POTION,
  spriteUrl: '/assets/items/potion.png',
  type: ITEM_TYPES.TYPES.CONSUMABLE,
  stackSize: 10
});

const portal = new Item({
  name: ITEM_TYPES.SPECIALS.TELEPORTER,
  spriteUrl: '/assets/items/portal.png',
  type: ITEM_TYPES.TYPES.SPECIAL,
  grabbable: false
});

app.loader
  .add('spritesheet', 'assets/chars/knight.json')
  .load((loader, resources) => {
    const firstMap = new TileMap({ config: maps.FIRST_ARENA, tilesetUrl: 'assets/maps/map_tileset_32x32.png' });
    const specialMap = new TileMap({ config: maps.SPECIAL_MAP, tilesetUrl: 'assets/maps/map_tileset_32x32.png' });

    const mapSequencer = new MapSequencer([ firstMap, specialMap ]);

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

    firstMap.add(defaultChar, 32, 32);
    firstMap.add(axe, 64, 32);
    firstMap.add(healPotion, 128, 32);
    firstMap.add(portal, firstMap.width - 64, firstMap.height - 64);

    app.stage.addChild(mapSequencer.getCurrent());

    portal.onCollision = () => {
      const nextMap = mapSequencer.loadNext();
      
      nextMap.add(defaultChar, 256, 256);
      app.stage.addChild(nextMap);
      SoundModule.play('intro');
    }

    //SoundModule.play('intro');

    Utils.renderVersionIndicator(app.stage);
  });

Utils.debugEvents();
Utils.displayOuterInventory();
