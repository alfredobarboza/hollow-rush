import Item from './Item';

export default class Weapon extends Item {
  constructor(options) {
    super(options);
    this.soundSprite = options.soundSpriteUrl || null;
    this.attackVal = options.attackVal || 1;
    this.weight = options.weight;
  }

  getItemProperties() {
    return {
      ...super.getItemProperties(),
      attackVal: this.attackVal,
      weight: this.weight
    };
  }
}
