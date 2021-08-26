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
      ...super.getChildProperties(),
      attackVal: this.attackVal,
      weight: this.weight
    };
  }
}
