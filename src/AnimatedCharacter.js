import { AnimatedSprite, Ticker } from "pixi.js";

const MAP_WIDTH = 600;
const MAP_HEIGHT = 400;
const ACCELERATION = 1;
const DECELERATION = 1;

/**
 * TODO:
 * check which properties to keep in char
 * remove map dimensions from here
 * deceleration
 * refactor move method out of bounds & if nesting
 * extract generic like accel calc to X outside of this
 */
export default class AnimatedCharacter extends AnimatedSprite {
  constructor(options) {
    super(options.textures);

    this.ticker = Ticker.shared;
    this.autoUpdate = false;
    this.animationSpeed = 0.05;
    this.interactive = true;
    this.frameMap = options.frameMap;
    this.speed = 0;
    this.maxspeed = 30;

    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowRight':
          this.move('right');
          break;
        case 'ArrowLeft':
          this.move('left');
          break;
        case 'ArrowDown':
          this.move('down');
          break;
        case 'ArrowUp':
          this.move('up');
          break;
        default:
          console.log('pelotudo ponete las manos');
          break;
      }
    });

    // TODO: Calculate inverse acceleration
    document.addEventListener('keyup', e => {
      // console.log('decelerate');     
    });

  }

  move = direction => {
    const isHorizontal = ['left', 'right'].includes(direction);
    const isPositive = ['right', 'down'].includes(direction);

    // detect the range of frames for the char direction
    let frame = this.frameMap[direction];
    frame.current = frame.current < frame.max ? frame.current + 1 : frame.min;

    // move the character to the correct direction and update animation frame
    const axis = isHorizontal ? 'x' : 'y';
    const newPos = isPositive ? this.position[axis] + 1 : this.position[axis] - 1;


    // check for canvas boundary
    let outOfBounds = this.checkBoundaries(isHorizontal, newPos);

    //console.log('outOfBounds?', outOfBounds);

    if (isPositive) {

      const maxBound = isHorizontal ? MAP_WIDTH : MAP_HEIGHT;

      if (!outOfBounds) {
        const testpos = this.position[axis] + this.addAcceleration();
        //console.log('testpos:', testpos);
        const newAxisPos = testpos >= maxBound ? maxBound : testpos;
        //console.log('newPos (+):', newAxisPos);

        this.position[axis] = newAxisPos;
      }
      //this.position[axis] = outOfBounds ? this.position[axis] : newPos + this.addAcceleration();  
    } else {
      if (!outOfBounds) {
        const testpos = this.position[axis] - this.addAcceleration();
        const newAxisPos = testpos <= 0 ? 0 : testpos;
        //console.log('newPos (-):', newAxisPos);

        this.position[axis] = newAxisPos;
      }
    }

    this.gotoAndPlay(frame.current);
  }

  // TODO: Put in a Utils
  addAcceleration = () => {
    // increase speed if less than max speed

    if (this.speed < this.maxspeed) {
      this.speed += this.acceleration * this.ticker.deltaTime;
    }

    //console.log('will add accel:', this.speed);

    return this.speed;
  }

  // TODO: Move to a canvas related class/module
  checkBoundaries = (horizontal, nextCoordinates) => {
    if ((horizontal && nextCoordinates < 0) || (horizontal && nextCoordinates > MAP_WIDTH)) {
      //console.log('out of bounds');
      this.speed = 0;
      return true;
    } else if ((!horizontal && nextCoordinates < 0) || (!horizontal && nextCoordinates > MAP_HEIGHT)) {
      //console.log('out of bounds');
      this.speed = 0;
      return true;
    } else {
      return false;
    }
  }
}
