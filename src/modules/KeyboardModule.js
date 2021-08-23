import CollisionModule from './CollisionModule';
import SoundModule from './SoundModule';

const getKeyValues = wasd => ({
  RIGHT: wasd ? 'd' : 'ArrowRight',
  LEFT: wasd ? 'a' : 'ArrowLeft',
  DOWN: wasd ? 's' : 'ArrowDown',
  UP: wasd ? 'w' : 'ArrowUp'
});

export default class KeyboardModule {
  register(app, character, wasd = false) {
    document.addEventListener('keydown', e => {
      const currentMap = app.stage.children.find(child => child.visible);
      const mapCfg = currentMap.options.config;
      const currentTile = Math.floor(character.getBounds().y / mapCfg.tileSize) * mapCfg.width + Math.floor(character.getBounds().x / mapCfg.tileSize);
      const mapBoundsCollision = CollisionModule.contain(character, currentMap, true);

      const KEYS = getKeyValues(wasd);
      // Add walking sound
      //SoundModule.play('test2');
      switch (e.key) {
        case KEYS.RIGHT:
          if (!mapBoundsCollision?.has('right') && !mapCfg.collision[currentTile + 1]) {
            character.move('right');
          }
          character.animate('right');
          break;
        case KEYS.LEFT:
          if (!mapBoundsCollision?.has('left') && !mapCfg.collision[currentTile - 1]) {
            character.move('left');
          }
          character.animate('left');
          break;
        case KEYS.DOWN:
          if (!mapBoundsCollision?.has('bottom') && !mapCfg.collision[currentTile + mapCfg.width]) {
            character.move('down');
          }
          character.animate('down');
          break;
        case KEYS.UP:
          if (!mapBoundsCollision?.has('top') && !mapCfg.collision[currentTile - mapCfg.width]) {
            character.move('up');
          }
          character.animate('up');
          break;
        default:
          console.log('pelotudo ponete las manos');
          break;
      }
    });

    document.addEventListener('keyup', e => {
      // console.log('decelerate');
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        character.setSpeed(Math.floor(character.getSpeed() * 0.2));
      }
    });
  }
}
