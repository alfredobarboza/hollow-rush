import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";
import CollisionModule from '../modules/CollisionModule';
import SoundModule from "../modules/SoundModule";

export default class Item extends Sprite {
  constructor(options) {
    super(Texture.from(options.spriteUrl));

    this.name = options.name;
    this.type = options.type;
    this.interactive = options.interactive !== false;
    this.grabbable = options.grabbable !== false;
    this.onCollision = options.onCollision;

    window.addEventListener('check:collision', this.checkCollision);
  }

  setState(state) {
    this.state = state;
  }

  setPosition(posX, posY) {
    this.position.set(posX, posY);
  }

  detectCollisionWith(char) {
    return CollisionModule.hitTestRectangle(this, char, true);
  }

  cleanup() {
    window.removeEventListener('check:collision', this.checkCollision)
    this.destroy();
  }

  // TODO check if we can move this somewhere else.
  checkCollision = ({ detail: character }) => {
    const hasCollided = this.detectCollisionWith(character);
    
    if (!hasCollided) return;

    if (this.grabbable) {
      SoundModule.play('grabItem');
      const amnt = this.stackSize || 1;

      //Add logic to all items
      character.addItem(this.getItemProperties(), amnt);
      this.cleanup();
    }

    if (this.onCollision instanceof Function) {
      this.onCollision();
    }
  }

  getItemProperties() {
    return { 
      name: this.name,
      type: this.type,
      grabbable: this.grabbable
    };
  }
}
