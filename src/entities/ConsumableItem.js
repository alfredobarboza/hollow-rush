import Item from './Item';

export default class ConsumableItem extends Item {
    constructor(options) {
        super(options);
        this.soundSprite = options.soundSpriteUrl || null;
        this.healVal = options.healVal;
        this.quantity = 1;
        this.maxStack = options.maxStack || 10;
        this.stackSize = options.stackSize || 1;
    }

    getChildProperties() {
        return {
            name: this.name,
            soundSprite: 1,
            healVal: 1,
            type: this.type,
            quantity: this.quantity
        }
    }
}