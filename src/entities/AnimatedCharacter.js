import { AnimatedSprite, Ticker } from "pixi.js";
import {
  itemTypes as ITEM_TYPES,
  audioBytes as AUDIO,
  directions as DIRECTIONS,
  characterTypes as CHARACTER_TYPES
} from "../config/enums";
import { EventBus, SoundModule, DataModule, CollisionModule } from "../modules";
import { v4 as UUID } from 'uuid';

const BASE_ACCELERATION = 1;
const ticker = Ticker.shared;

export default class AnimatedCharacter extends AnimatedSprite {
  constructor(options) {
    super(options.textures);

    this.id = UUID();
    this.name = options.name;
    this.characterType = options.characterType;
    this.interactive = true;
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
    this.lastDirection = null;

    // Subscribe to keyboard input for movement
    EventBus.subscribe('movement.direction.#', this.updateLastDirection);
    // EventBus.subscribe('#.attack', this.registerAttack);
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
      EventBus.publish('character.state.update', { id: this.id, currentState: this.currentState });
    }
  }

  takeFatalDamage() {
    this.currentState.hp = 0;
    this.currentState.alive = false;

    EventBus.publish('character.state.update', { id: this.id, currentState: this.currentState });
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

    EventBus.publish('character.state.update', { id: this.id, currentState: this.currentState });
    return true;
  }

  attack() {
    const dpsMultiplier = this.stats.attackValue;

    // sort available weapons and return the one equipped
    // TODO: for npc, get from other site
    const charWeapon = this.inventory.filter(item =>
      item.name === ITEM_TYPES.WEAPONS.AXE ||
      item.name === ITEM_TYPES.WEAPONS.MACE ||
      item.name === ITEM_TYPES.WEAPONS.SWORD
    ).find(item => item.isEquipped);

    // calculate net dps to affect other entity
    this.netDps = (charWeapon?.attackVal || 1) * dpsMultiplier;

    SoundModule.play(AUDIO.ATTACK);
  }

  updateLastDirection = (lastKeyboardDirection) => {
    this.lastDirection = lastKeyboardDirection;
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

  // Event: 'player.attack'
  registerAttack = ({ attackArea, dps: damage }) => {
    if (this.currentState.alive && this.characterType === CHARACTER_TYPES.TYPES.ENEMY_NPC) {

      const collides = CollisionModule.hitTestRectangle(attackArea, this, true);

      //inform dps to receiving entity
      if (collides) this.takeDamage(damage);
    }
  }
}
