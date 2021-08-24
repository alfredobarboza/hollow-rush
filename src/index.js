import { Application, settings, SCALE_MODES } from 'pixi.js';
import AnimatedCharacter from './entities/AnimatedCharacter';
import TileMap from './entities/TileMap';
import { maps } from './config';
import KeyboardModule from './modules/KeyboardModule';
import SoundModule from './modules/SoundModule';
import Utils from './modules/Utils';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const keyboard = new KeyboardModule();

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
    //console.log('firstMap:', firstMap);

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

    keyboard.registerMovement(app, defaultChar);

    firstMap.addChild(defaultChar);
    firstMap.load();

    //SoundModule.play('intro');

    app.stage.addChild(firstMap);

    Utils.renderVersionIndicator(app.stage);
  });
