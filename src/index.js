import { Application, settings, SCALE_MODES } from 'pixi.js';
import AnimatedCharacter from './entities/AnimatedCharacter';
import TileMap from './entities/TileMap';
import { maps, enums } from './config';
import KeyboardModule from './modules/KeyboardModule';
import SoundModule from './modules/SoundModule';
import Utils from './modules/Utils';
import Weapon from './entities/Weapon';
import ConsumableItem from './entities/ConsumableItem';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const keyboard = new KeyboardModule();
const ITEM_TYPES = enums.itemTypes;
// Create the application helper and add its render target to the page
const app = new Application({ width: 1024, height: 768, antialias: true });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.margin = 0;
app.renderer.view.style.padding = 0;

app.loader
  .add('tileset', 'assets/maps/map_tileset_32x32.png')
  .add('spritesheet', 'assets/chars/knight.json')
  .load((loader, resources) => {
    const firstMap = new TileMap({ config: maps.FIRST_ARENA, tileset: resources.tileset.texture });

    const defaultChar = new AnimatedCharacter({
      textures: Object.values(resources.spritesheet.textures),
      frameMap: {
        right: { current: 8, min: 8, max: 11 },
        left: { current: 4, min: 4, max: 7 },
        down: { current: 0, min: 0, max: 3 },
        up: { current: 12, min: 12, max: 15 }
      }
    });
    defaultChar.position.set(32, 32);

    const axe = new Weapon({
      name: ITEM_TYPES.WEAPONS.AXE,
      type: ITEM_TYPES.TYPES.WEAPON,
      spriteUrl: '/assets/img/axe.png',
      interactive: true,
      initialPos: {
        x: 64,
        y: 32
      }
    });

    const healPotion = new ConsumableItem({
      name: ITEM_TYPES.CONSUMABLES.POTION,
      spriteUrl: '/assets/img/potion.png',
      type: ITEM_TYPES.TYPES.CONSUMABLE,
      interactive: true,
      initialPos: {
        x: 128,
        y: 32
      }
    });

    keyboard.registerMovement(app, defaultChar);

    firstMap.addChild(defaultChar);

    firstMap.load();

    //SoundModule.play('intro');

    app.stage.addChild(firstMap);
    app.stage.addChild(axe);
    app.stage.addChild(healPotion);

    Utils.renderVersionIndicator(app.stage);
  });
