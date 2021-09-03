import ConsumableItem from './ConsumableItem';

export default class Potion extends ConsumableItem {
  constructor(options) {
    super(options);

    this.healVal = options.healVal || 10;
  }

  getItemProperties() {
    return {
      ...super.getItemProperties(),
      healVal: this.healVal
    };
  }
}
