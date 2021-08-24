import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";
import CollisionModule from '../modules/CollisionModule';


export default class Item extends Sprite {
    constructor(options) {
        super(Texture.from(options.spriteUrl));

        this.name = options.name;
        this.state = options.state;
        this.interactive = options.interactive;

        this.position.set(options.initialPos.x, options.initialPos.y);
    }

    setState(state) {
        this.state = state;
    }

    setPosition(posX, posY) {
        this.position.set(posX, posY);
    }

    detectCollisionWith(char) {
        let hasCollisioned = CollisionModule.hitTestRectangle(this, char, true);
    }

}
