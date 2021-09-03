import Item from './Item';

export default class ConsumableItem extends Item {
  constructor(options) {
    super(options);
    
    this.soundSprite = options.soundSpriteUrl || null;
    this.quantity = options.quantity || 1;
    this.maxStack = options.maxStack || 10;
    this.stackSize = options.stackSize || 1;
  }

  getItemProperties() {
    return {
      ...super.getItemProperties(),
      quantity: this.quantity
    };
  }
}
