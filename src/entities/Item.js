import { Sprite, Texture } from "pixi.js";
import { v4 as UUID } from 'uuid';

export default class Item extends Sprite {
  constructor(options) {
    super(Texture.from(options.spriteUrl));

    this.id = UUID();
    this.name = options.name;
    this.type = options.type;
    this.interactive = options.interactive !== false;
    this.grabbable = options.grabbable !== false;
    this.imageUrl = options.spriteUrl;
    this.onCollision = options.onCollision;
  }

  setState(state) {
    this.state = state;
  }

  setPosition(posX, posY) {
    this.position.set(posX, posY);
  }

  getItemProperties() {
    return { 
      name: this.name,
      type: this.type,
      grabbable: this.grabbable
    };
  }
}
