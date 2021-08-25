import Item from './Item';

export default class Weapon extends Item {
    constructor(options) {
        super(options);
        this.soundSprite = options.soundSpriteUrl || null;
        this.attackVal = options.attackVal;
        this.weight = options.weight;
    }

    getChildProperties() {
        return {
            name: this.name,
            attackVal: 1,
            weight: 1,
            type: this.type
        }
    }
}