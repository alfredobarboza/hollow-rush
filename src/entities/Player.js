import { Ticker } from 'pixi.js';
import AnimatedCharacter from './AnimatedCharacter';
import { 
  characterTypes as CHARACTER_TYPES, 
  characterActions as CHARACTER_ACTIONS,
  itemTypes as ITEM_TYPES,
  audioBytes as AUDIO
} from '../config/enums';
import { CollisionModule, KeyboardModule, UIModule, SoundModule, Utils, EventBus } from '../modules';

const MAX_INVENTORY_SIZE = 8;
const ticker = Ticker.shared;
const keyboard = new KeyboardModule();

export default class Player extends AnimatedCharacter {
  constructor(options) {
    super(options);

    this.characterType = CHARACTER_TYPES.TYPES.PLAYER;
    this.inventory = [];

    UIModule.displayHealthBar(this);
    UIModule.displayInventory(this);

    keyboard.registerMovement(this.getMovementHandlers());
    ticker.add(this.tickerLoop);
  }

  handleInteraction = entity => {
    super.handleInteraction(entity);

    // check if entity can be added to inventory
    if (entity.grabbable && this.inventory.length < MAX_INVENTORY_SIZE) {
      SoundModule.play(AUDIO.GRAB_ITEM);
      const amount = entity.stackSize || 1;

      this.addToInventory(entity, amount);
      this.container.remove(entity);
    }

    // check if entity is a NPC or another player
    if (!!entity.characterType) {
      const oppositeDirection = Utils.getOppositeDirection(keyboard.lastMovementDirection);
      const movementHandlers = this.getMovementHandlers(false);

      // "bounce" to the same tile
      movementHandlers[oppositeDirection]();
      this.move(this.position.x + this.vx, this.position.y + this.vy);
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
        this.registerPlayerAction(CHARACTER_ACTIONS.USE_ITEM, item.id);
        break;
      case ITEM_TYPES.TYPES.WEAPON:
        this.registerPlayerAction(CHARACTER_ACTIONS.ATTACK, item.id);
        break;
      default:
        break;
    }

    EventBus.publish('player.inventory.update', this.inventory);
  }

  registerPlayerAction(actionType, itemId) {
    let key, action;
    switch (actionType.NAME) {
      case CHARACTER_ACTIONS.ATTACK.NAME:
        key = CHARACTER_ACTIONS.ATTACK.KEY;
        action = () => {
          this.attack();
          // publish event to affect other entities
          //EventBus.publish('player.attack', this);
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
                const hasHealed = this.heal(item.healVal);
                if (hasHealed) {
                  SoundModule.play(AUDIO.DRINK_POTION);
                  item.quantity--;
                }
              }
              return item;
            }).filter(updatedItems => !!updatedItems.quantity);

          } else {
            this.inventory = this.inventory.filter(item => item.id !== itemId);
          }

          EventBus.publish('player.inventory.update', this.inventory);
        }
        break;
      default:
        break;
    }
    keyboard.registerAction(key, action);
  }

  tickerLoop = () => {
    if (!keyboard.lastMovementDirection) return;
    
    const boundaryCollision = CollisionModule.contain(this, this.container);
    const mapTileCollision = CollisionModule.hitTestMapTile(this.container.options.config, this, keyboard.lastMovementDirection);
    
    if (!boundaryCollision?.has(keyboard.lastMovementDirection) && !mapTileCollision) {
      const newX = this.position.x + this.vx;
      const newY = this.position.y + this.vy;
      
      this.move(newX, newY);
    }
  
    this.vx = 0;
    this.vy = 0;
  }
}
