import Item from './Item';

export default class ConsumableItem extends Item {
    constructor(options) {
        super(options);
        this.soundSprite = options.soundSpriteUrl || null;
        this.healVal = options.healVal;
    }

    getChildProperties() {
        const itemProperties = Item.prototype.getChildProperties();
        return {
            name: this.name,
            soundSprite: 1,
            healVal: 1,
            type: this.type
        }
    }
}