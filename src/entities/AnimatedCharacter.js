import { AnimatedSprite, Ticker } from "pixi.js";
import KeyboardModule from "../modules/KeyboardModule";

const BASE_ACCELERATION = 1;
const keyboard = new KeyboardModule();
/**
 * TODO:
 * check which properties to keep in char and/or which to get from options obj
 * extract generic like accel calc to cfg file outside of this
 */
export default class AnimatedCharacter extends AnimatedSprite {

  constructor(options) {
    super(options.textures);

    this.ticker = Ticker.shared;
    this.autoUpdate = false;
    this.interactive = true;
    this.frameMap = options.frameMap;
    this.speed = 0; // starting speed
    this.maxSpeed = 1; // max speed - tiles per second
    this.speedMultiplier = options.speedMultiplier || 32; // depends on tile size - default: 32
    this.items = [];
    this.event = new CustomEvent('check:collision', { detail: this });

    this.executeAction();
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  animate(direction) {
    // detect the range of frames for the char direction
    let frame = this.frameMap[direction];
    frame.current = frame.current < frame.max ? frame.current + 1 : frame.min;

    this.gotoAndPlay(frame.current);
  }

  move(direction) {
    const isHorizontal = ['left', 'right'].includes(direction);
    const isPositive = ['right', 'down'].includes(direction);

    // move the character to the correct direction and update animation frame
    const axis = isHorizontal ? 'x' : 'y';
    const acceleration = this.getAcceleration(this.speed, this.maxSpeed * this.speedMultiplier);
    const newPosition = this.calculateDisplacement(this.position[axis], this.speed, acceleration, isPositive);

    this.position[axis] = newPosition;
    this.speed += acceleration;

    window.dispatchEvent(this.event);
  }

  calculateDisplacement(currentPosition, velocity, acceleration, positive) {
    const displacement = velocity + acceleration;

    let newPosition;
    if (positive) {
      newPosition = currentPosition + displacement;
    } else {
      newPosition = currentPosition - displacement;
    }

    return newPosition;
  }

  getAcceleration(speed, maxSpeed) {
    // no acceleration if already at max speed
    if (speed >= maxSpeed) return 0;

    // acceleration formula: Δv / Δt; return always positive, with no decimals
    return Math.abs(Math.ceil((maxSpeed - speed) / (BASE_ACCELERATION * this.ticker.deltaTime)));
  }

  addItem(item) {

    console.log('item added: ' + item.name);
    this.items.push(item);
  }

  executeAction() {
    keyboard.registerAction('Space', () => {
      // add logic to action
    });
  }
}