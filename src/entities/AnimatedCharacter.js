import { AnimatedSprite, Ticker } from "pixi.js";
import { characterActions as CHARACTER_ACTIONS, itemTypes as ITEM_TYPES } from "../config/enums";
import { EventBus, KeyboardModule, SoundModule } from "../modules";
import { v4 as UUID } from 'uuid';

const BASE_ACCELERATION = 1;
//const CHARACTER_ACTIONS = enums.characterActions;
//const ITEM_TYPES = enums.itemTypes;
const keyboard = new KeyboardModule();
/**
 * TODO:
 * check which properties to keep in char and/or which to get from options obj
 * extract generic like accel calc to cfg file outside of this
 */
export default class AnimatedCharacter extends AnimatedSprite {
  constructor(options) {
    super(options.textures);

    this.id = UUID();
    this.ticker = Ticker.shared;
    this.autoUpdate = false;
    this.interactive = true;
    this.frameMap = options.frameMap;
    this.speed = 0; // starting speed
    this.maxSpeed = 1; // max speed - tiles per second
    this.speedMultiplier = options.speedMultiplier || 32; // depends on tile size - default: 32
    this.inventory = [];
    this.width = options.width;
    this.height = options.height;
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

    EventBus.publish('character.move', this);
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

  handleInteraction(entity) {
    // check if entity can be added to inventory
    if (entity.grabbable) {
      SoundModule.play('grabItem');
      const amount = entity.stackSize || 1;

      this.addToInventory(entity, amount);
      this.container.remove(entity);

      // depending on what did we get, bind to a keyboard action to use when pressed
      switch (entity.type) {
        case ITEM_TYPES.TYPES.CONSUMABLE:
          this.registerCharacterAction(CHARACTER_ACTIONS.USE_ITEM, entity.id);
          break;
        case ITEM_TYPES.TYPES.WEAPON:
          this.registerCharacterAction(CHARACTER_ACTIONS.ATTACK, entity.id);
          break;
        default:
          break;
      }
    }

    // execute custom action callback if present
    if (entity.onCollision instanceof Function) {
      entity.onCollision();
    }
  }

  addToInventory(item, qtty) {
    // check if incoming item is already in the inventory
    const hasInputItem = this.inventory.some(currItem => currItem.id === item.id);

    // adds qtty to existing item or add item from scratch
    if (hasInputItem) {
      this.inventory = this.inventory.map(currItem => {
        if (currItem.id === item.id) {
          const qttyExceeds = item.quantity + qtty > currItem.maxStackSize;
          currItem.quantity = qttyExceeds ? currItem.maxStackSize : currItem.quantity + qtty;
        }
        return currItem;

      });
    } else {
      item.quantity = qtty;
      this.inventory = [...this.inventory, item];
    }

    EventBus.publish('character.inventory.update', this.inventory);
  }

  setPosition(posX, posY) {
    this.position.set(posX, posY);
  }

  registerCharacterAction(actionType, itemId) {
    let key, action;
    switch (actionType.NAME) {
      case CHARACTER_ACTIONS.ATTACK.NAME:
        key = CHARACTER_ACTIONS.ATTACK.KEY;
        action = () => {
          console.log('ATTACK!');
        }
        break;
      case CHARACTER_ACTIONS.USE_ITEM.NAME:
        key = CHARACTER_ACTIONS.USE_ITEM.KEY;
        action = () => {
          // check if potions are available
          const hasQtty = this.inventory.some(item => item.id === itemId && item.quantity > 1);
          if (hasQtty) {
            this.inventory = this.inventory.map(item => {
              if (item.name === 'potion') {
                item.quantity--;
              }

              return item;
            });
          } else {
            this.inventory = this.inventory.filter(item => item.id !== itemId);
          }

          EventBus.publish('character.inventory.update', this.inventory);
        }
        break;
      default:
        break;
    }
    keyboard.registerAction(key, action);
  }
}
