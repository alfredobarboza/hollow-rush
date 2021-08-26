import { AnimatedSprite, Ticker } from "pixi.js";
import enums from "../config/enums";
import KeyboardModule from "../modules/KeyboardModule";
import TextModule from "../modules/TextModule";

const BASE_ACCELERATION = 1;
const CHARACTER_ACTIONS = enums.characterActions;
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
    this.width = options.width;
    this.height = options.height;

    // region registering actions
    this.registerCharacterAction(CHARACTER_ACTIONS.ATTACK);
    this.registerCharacterAction(CHARACTER_ACTIONS.USE_ITEM);
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

  addItem(item, qtty) {
    // check if incoming item 
    // is already in the inventory
    const hasInputItem = this.items.some(currItem => currItem.name === item.name);

    // adds qtty to existing item 
    // or add item from scratch
    if (hasInputItem) {
      this.items = this.items.map(currItem => {
        if (currItem.name === item.name) {
          const qttyExceeds = item.quantity + qtty > currItem.maxStackSize;
          currItem.quantity = qttyExceeds ? currItem.maxStackSize : currItem.quantity + qtty;
        }
        return currItem;

      });
    } else {
      item.quantity = qtty;
      this.items = [...this.items, item];
    }
  }

  setPosition(posX, posY) {
    this.position.set(posX, posY);
  }

  registerCharacterAction(actionType) {
    let key, action;
    switch (actionType.NAME) {
      case CHARACTER_ACTIONS.ATTACK.NAME:
        key = CHARACTER_ACTIONS.ATTACK.KEY;
        action = () => {
          console.log('key:' + key);
        }
        break;
      case CHARACTER_ACTIONS.USE_ITEM.NAME:
        key = CHARACTER_ACTIONS.USE_ITEM.KEY;
        action = () => {
          console.log('key:' + key);
          // check if potions are available
          console.log('items before:', this.items);
          const hasQtty = this.items.some(item => item.name === 'potion' && item.quantity > 1);
          if (hasQtty) {
            this.items = this.items.map(item => {
              if (item.name === 'potion') {
                item.quantity--;
              }

              return item;
            });
          } else {
            this.items = this.items.filter(item => item.name !== 'potion');
          }
        }
        break;
      default:
        break;
    }
    keyboard.registerAction(key, action);
 }
}