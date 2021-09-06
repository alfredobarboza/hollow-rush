import { Ticker } from 'pixi.js';
import AnimatedCharacter from './AnimatedCharacter';
import { characterTypes as CHARACTER_TYPES, directions as DIRECTIONS } from '../config/enums';
import { Utils, CollisionModule } from '../modules';

const ticker = Ticker.shared;

export default class NPC extends AnimatedCharacter {
  constructor(options) {
    super(options);

    this.friendly = options.friendly ?? false;
    this.characterType = this.friendly ? CHARACTER_TYPES.TYPES.FRIENDLY_NPC : CHARACTER_TYPES.TYPES.ENEMY_NPC;
    this.lastMovement = null;
    this.movementPattern = options.movementPattern;

    this.startMoving(this.movementPattern);
  }

  handleInteraction(entity) {
    super.handleInteraction(entity);

    // check if entity is a player
    if (entity.characterType === CHARACTER_TYPES.TYPES.PLAYER) {
      const oppositeDirection = Utils.getOppositeDirection(this.lastMovement);
      const movementHandlers = this.getMovementHandlers(false);

      // "bounce" to the same tile
      movementHandlers[oppositeDirection]();
      this.move(this.position.x + this.vx, this.position.y + this.vy);

      // will stop moving and attack/interact here
    }
  }

  startMoving({ directions, timing }) {
    // map direction tokens (R/L/B/T) with actual directions
    const directionMap = { R: DIRECTIONS.RIGHT, L: DIRECTIONS.LEFT, B: DIRECTIONS.BOTTOM, T: DIRECTIONS.TOP };

    // get array of directions & timings
    const movementDirections = directions.split('').map(dir => directionMap[dir]);
    const timings = timing.split('').map(sec => Number(sec));

    let tick = 0, lastTick = 0, movementIndex = 0;

    ticker.add(delta => {
      // get the current tick (time after last loop execution) and delay based on set timings
      const currentTick = Math.floor(tick);
      const delay = timings[movementIndex % timings.length];

      // execute every x seconds based on delay value and framerate
      tick += ((1 / 60) * delta) / delay;

      if (currentTick !== lastTick) {
        // get current direction to move, moduled to loop back if at the end of the array
        const movement = movementDirections[movementIndex % movementDirections.length];

        // set vx and vy based on direction
        this.getMovementHandlers()[movement]();

        const mapTileCollision = CollisionModule.hitTestMapTile(this.container.options.config, this, movement);

        if (!mapTileCollision) {
          // move if it doesn't collide
          const newX = this.position.x + this.vx;
          const newY = this.position.y + this.vy;
          
          this.move(newX, newY);
        }

        // keep looping through the array either way
        this.lastMovement = movement;
        movementIndex++;
      }

      lastTick = currentTick;
    });
  }
}
