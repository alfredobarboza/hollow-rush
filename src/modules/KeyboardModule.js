import { EventBus } from '.';
import { characterActions as CHARACTER_ACTIONS, directions as DIRECTIONS } from '../config/enums';

const getMovementKeys = alt => ({
  RIGHT: alt ? CHARACTER_ACTIONS.MOVE_RIGHT.ALT_KEY : CHARACTER_ACTIONS.MOVE_RIGHT.KEY,
  LEFT: alt ? CHARACTER_ACTIONS.MOVE_LEFT.ALT_KEY : CHARACTER_ACTIONS.MOVE_LEFT.KEY,
  DOWN: alt ? CHARACTER_ACTIONS.MOVE_DOWN.ALT_KEY : CHARACTER_ACTIONS.MOVE_DOWN.KEY,
  UP: alt ? CHARACTER_ACTIONS.MOVE_UP.ALT_KEY : CHARACTER_ACTIONS.MOVE_UP.KEY
});

export default class KeyboardModule {
  constructor() {
    this.lastMovementDirection = null;
  }

  registerMovement(handlers = {}, alt = false) {
    const KEYS = getMovementKeys(alt);
    const isDirectionKey = key => Object.values(KEYS).includes(key);

    document.addEventListener('keydown', e => {
      if (!isDirectionKey(e.key)) return;

      // Add walking sound
      // if (!this.lastMovementDirection) SoundModule.play(AUDIO.STEPS);

      switch (e.key) {
        case KEYS.RIGHT:
          if (handlers[DIRECTIONS.RIGHT]) handlers[DIRECTIONS.RIGHT]();
          this.lastMovementDirection = DIRECTIONS.RIGHT;
          break;
        case KEYS.LEFT:
          if (handlers[DIRECTIONS.LEFT]) handlers[DIRECTIONS.LEFT]();
          this.lastMovementDirection = DIRECTIONS.LEFT;
          break;
        case KEYS.DOWN:
          if (handlers[DIRECTIONS.BOTTOM]) handlers[DIRECTIONS.BOTTOM]();
          this.lastMovementDirection = DIRECTIONS.BOTTOM;
          break;
        case KEYS.UP: 
          if (handlers[DIRECTIONS.TOP]) handlers[DIRECTIONS.TOP]();
          this.lastMovementDirection = DIRECTIONS.TOP;
          break;
        default:
          break;
      }

      EventBus.publish('movement.direction.update', this.lastMovementDirection);
    });
    
    document.addEventListener('keyup', e => {
      if (!isDirectionKey(e.key)) return;

      // SoundModule.stop(AUDIO.STEPS);

      if (handlers.none) handlers.none();
      this.lastMovementDirection = null;
    });
  }

  registerAction(key, onKeyDown = null, onKeyUp = null) {
    if (onKeyDown instanceof Function) {
      document.addEventListener('keydown', (e) => {
        if (e.code === key) onKeyDown();
      });
    }

    if (onKeyUp instanceof Function) {
      document.addEventListener('keyup', (e) => {
        if (e.code === key) onKeyUp();
      });
    }
  }
}
