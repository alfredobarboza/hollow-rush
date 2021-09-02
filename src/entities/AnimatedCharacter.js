import { AnimatedSprite, Ticker } from "pixi.js";
import {
  characterActions as CHARACTER_ACTIONS,
  itemTypes as ITEM_TYPES,
  audioBytes as AUDIO
} from "../config/enums";
import { EventBus, KeyboardModule, SoundModule, DataModule } from "../modules";
import { v4 as UUID } from 'uuid';

const MAX_INVENTORY_SIZE = 8;
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

    this.id = UUID();
    this.ticker = Ticker.shared;
    this.autoUpdate = false;
    this.interactive = true;
    this.frameMap = options.frameMap;
    this.speedMultiplier = options.speedMultiplier || 32; // depends on tile size - default: 32
    this.inventory = [];
    this.width = options.width;
    this.height = options.height;
    this.stats = DataModule.charSheets.find(charClass => charClass.name === options.class);
    this.currentState = { hp: this.stats.hp, alive: true };
  }

  getSpeed() {
    return this.stats.speed;
  }

  setSpeed(speed) {
    this.stats.speed = speed;
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
    const acceleration = this.getAcceleration(this.stats.speed, this.stats.maxSpeed * this.speedMultiplier);
    const newPosition = this.calculateDisplacement(this.position[axis], this.stats.speed, acceleration, isPositive);

    this.position[axis] = newPosition;
    this.stats.speed += acceleration;

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
    if (entity.grabbable && this.inventory.length < MAX_INVENTORY_SIZE) {
      SoundModule.play(AUDIO.GRAB_ITEM);
      const amount = entity.stackSize || 1;

      this.addToInventory(entity, amount);
      this.container.remove(entity);
    }

    // execute custom action callback if present
    if (entity.onCollision instanceof Function) {
      entity.onCollision();
    }
  }

  addToInventory(item, qtty) {
    // check if incoming item is already in the inventory
    const hasInputItem = this.inventory.some(currItem => currItem.name === item.name);

    // adds qtty to existing item or add item from scratch
    if (hasInputItem) {
      this.inventory = this.inventory.map(currItem => {
        if (currItem.name === item.name) {
          const qttyExceeds = item.quantity + qtty > currItem.maxStackSize;
          currItem.quantity = qttyExceeds ? currItem.maxStackSize : currItem.quantity + qtty;
        }
        return currItem;

      });
    } else {
      item.quantity = qtty;
      this.inventory = [...this.inventory, item];
    }

    // depending on what did we get, bind to a keyboard action to use when pressed
    switch (item.type) {
      case ITEM_TYPES.TYPES.CONSUMABLE:
        this.registerCharacterAction(CHARACTER_ACTIONS.USE_ITEM, item.id);
        break;
      case ITEM_TYPES.TYPES.WEAPON:
        this.registerCharacterAction(CHARACTER_ACTIONS.ATTACK, item.id);
        break;
      default:
        break;
    }

    EventBus.publish('character.inventory.update', this.inventory);
  }

  setPosition(posX, posY) {
    this.position.set(posX, posY);
  }

  takeDamage(amount = 1) {
    if (amount >= this.currentState.hp) {
      this.takeFatalDamage();
    } else {
      this.currentState.hp -= amount;
      SoundModule.play(AUDIO.HIT);
      EventBus.publish('character.state.update', this.currentState);
    }
  }

  takeFatalDamage() {
    this.currentState.hp = 0;
    this.currentState.alive = false;

    SoundModule.play(AUDIO.GAME_OVER);
    EventBus.publish('character.state.update', this.currentState);
    this.container.remove(this);
  }

  heal(amount) {
    // if at max HP don't heal
    if (this.currentState.hp === this.stats.hp) return false;

    // if after healing we go over the max HP
    // top up HP
    if (amount + this.currentState.hp >= this.stats.hp) {
      this.currentState.hp = this.stats.hp;
      // otherwise add pot healing amount
    } else {
      this.currentState.hp += amount;
    }

    SoundModule.play(AUDIO.DRINK_POTION);
    EventBus.publish('character.state.update', this.currentState);
    return true;
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
          // check if item has qtty
          const hasQtty = this.inventory.some(item => item.id === itemId && item.quantity >= 1);
          if (hasQtty) {
            this.inventory = this.inventory.map(item => {
              if (item.name === ITEM_TYPES.CONSUMABLES.POTION) {
                let hasHealed = this.heal(10);
                if (hasHealed) item.quantity--;
              }
              return item;
            }).filter(updatedItems => !!updatedItems.quantity);

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
