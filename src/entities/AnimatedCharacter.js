import { AnimatedSprite, Ticker } from "pixi.js";
import {
  itemTypes as ITEM_TYPES,
  audioBytes as AUDIO,
  characterTypes as CHARACTER_TYPES,
  directions as DIRECTIONS
} from "../config/enums";
import { EventBus, SoundModule, DataModule } from "../modules";
import { v4 as UUID } from 'uuid';

const BASE_ACCELERATION = 1;
const ticker = Ticker.shared;

export default class AnimatedCharacter extends AnimatedSprite {
  constructor(options) {
    super(options.textures);

    this.id = UUID();
    this.characterType = options.characterType || CHARACTER_TYPES.TYPES.PLAYER;
    this.autoUpdate = false;
    this.frameMap = options.frameMap;
    this.inventory = [];
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.stats = DataModule.charSheets.find(charClass => charClass.name === options.class);
    this.currentState = { hp: this.stats.hp, alive: true, speed: 32 };
    this.netDps = 0; // calculation to apply damage to other entities
    this.vx = 0;
    this.vy = 0;
  }

  getSpeed() {
    return this.currentState.speed;
  }

  setSpeed(speed) {
    this.currentState.speed = speed;
  }

  animate(direction) {
    // detect the range of frames for the char direction
    let frame = this.frameMap[direction];
    frame.current = frame.current < frame.max ? frame.current + 1 : frame.min;

    this.gotoAndPlay(frame.current);
  }

  move(posX, posY) {
    if (this.position.x === posX && this.position.y === posY) return;
    
    this.position.set(posX, posY);
    EventBus.publish('character.move', this);
  }

  stop() {
    this.vx = 0;
    this.vy = 0;
  }

  getAcceleration(speed, maxSpeed) {
    // no acceleration if already at max speed
    if (speed >= maxSpeed) return 0;

    // acceleration formula: Δv / Δt; return always positive, with no decimals
    return Math.abs(Math.ceil((maxSpeed - speed) / (BASE_ACCELERATION * ticker.deltaTime)));
  }

  handleInteraction(entity) {
    // execute custom action callback if present
    if (entity.onCollision instanceof Function) {
      entity.onCollision();
    }
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

    EventBus.publish('character.state.update', this.currentState);
    return true;
  }

  attack() {
    let charWeapon, dpsMultiplier;
    dpsMultiplier = this.stats.attackValue;

    // sort available weapons and return the one equipped
    // TODO: for npc, get from other site
    charWeapon = this.inventory.filter(item =>
      item.name === ITEM_TYPES.WEAPONS.AXE ||
      item.name === ITEM_TYPES.WEAPONS.MACE ||
      item.name === ITEM_TYPES.WEAPONS.SWORD
    ).find(item => item.isEquipped);

    // calculate net dps to affect other entity
    this.netDps = (charWeapon?.attackVal || 1) * dpsMultiplier;

    // create attack sprite
    // const attackSprite = new AnimatedSprite(this.testSprite, false);
    // attackSprite.height = this.height;
    // attackSprite.width = this.width;

    // append to parent container
    // this.parent.addChild(attackSprite);

    // detect which direction the character is facing and display correct sprite
    // WIP
    // attackSprite.position['x'] = true ? this.position['x'] + 32 : this.position['x'];
    // attackSprite.position['y'] = true ? this.position['y'] : this.position['y'] + 32;


    SoundModule.play(AUDIO.ATTACK);

  }

  getMovementHandlers(animate = true) {
    const displacement = this.currentState.speed * this.stats.speedMultiplier;

    return {
      [DIRECTIONS.RIGHT]: () => {
        this.vx = displacement;
        this.vy = 0;
        if (animate) this.animate(DIRECTIONS.RIGHT);
      },
      [DIRECTIONS.LEFT]: () => {
        this.vx = -displacement;
        this.vy = 0;
        if (animate) this.animate(DIRECTIONS.LEFT);
      },
      [DIRECTIONS.TOP]: () => {
        this.vx = 0;
        this.vy = -displacement;
        if (animate) this.animate(DIRECTIONS.TOP);
      },
      [DIRECTIONS.BOTTOM]: () => {
        this.vx = 0;
        this.vy = displacement;
        if (animate) this.animate(DIRECTIONS.BOTTOM);
      }
    };
  }
}
