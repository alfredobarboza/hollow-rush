import { Application, settings, SCALE_MODES } from 'pixi.js';
import { maps, enums } from './config';
import { SoundModule, Utils, MapSequencer, EventBus } from './modules';
import { Player, TileMap, NPC } from './entities';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

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

app.loader.onComplete.add(() => {
  EventBus.publish('app.load', { stage: app.stage });
});

app.loader
  .add('main', SPRITES.CHAR_SPRITESHEET)
  .add('enemy', SPRITES.ENEMY_SPRITESHEET)
  .add('attackSpritesheet', SPRITES.ATTACK_SPRITESHEET)
  .load((_, resources) => {
    const firstMap = new TileMap({ config: maps.FIRST_ARENA, tilesetUrl:  SPRITES.ARENA_MAP});
    const specialMap = new TileMap({ config: maps.SPECIAL_MAP, tilesetUrl: SPRITES.ENDING_MAP });

    const mapSequencer = new MapSequencer([firstMap, specialMap]);
    const currentMap = mapSequencer.getCurrent();

    const commonFrameMap = {
      right: { current: 8, min: 8, max: 11 },
      left: { current: 4, min: 4, max: 7 },
      bottom: { current: 0, min: 0, max: 3 },
      top: { current: 12, min: 12, max: 15 }
    };

    const player1 = new Player({
      textures: Object.values(resources.main.textures),
      class: 'rogue',
      frameMap: commonFrameMap
    });

    const npc = new NPC({
      textures: Object.values(resources.enemy.textures),
      class: 'paladin',
      frameMap: commonFrameMap,
      width: 32,
      height: 48,
      movementPattern: {
        directions: 'RRRRTTLLLLBBLLLLLLLLRRRRRRRR',
        timing: '2111221111221111111111111111'
      }
    });
    
    Utils.loadGameEntitiesToMap(currentMap);

    firstMap.add(player1, 32, 32);
    firstMap.add(npc, 512, 512);

    app.stage.addChild(currentMap);

    const portal = currentMap.mapEntities.find(entity => entity.name === ITEM_TYPES.SPECIALS.TELEPORTER);
    portal.onCollision = () => {
      const nextMap = mapSequencer.loadNext();

      nextMap.add(player1, 256, 256);
      app.stage.addChild(nextMap);
      SoundModule.play(AUDIO.INTRO);
    }

    const hazards = currentMap.mapEntities.filter(entity => entity.name === ITEM_TYPES.SPECIALS.WARNING);
    hazards.forEach(hzd => hzd.onCollision = () => player1.takeDamage(10));

    //SoundModule.play(AUDIO.INTRO);

    Utils.renderVersionIndicator(app.stage);
  });

Utils.debugEvents();
