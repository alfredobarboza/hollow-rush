import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import TextModule from './TextModule';
import EventBus from './EventBus';
import Utils from './Utils';

class UIModule {
  constructor() {
    this.uiContainer = new Container();
    this.uiContainer.zIndex = 1;
    this.uiContainer.sortableChildren = true;

    EventBus.subscribe('app.load', ({ stage }) => {
      this.uiContainer.width = stage.width;
      this.uiContainer.height = stage.height;

      stage.addChild(this.uiContainer);
    });
  }

  healthBar = {
    displayProps: {
      x: 680, y: 45,
      width: 300, height: 30
    },
    draw: charState => {
      const { x, y, width, height } = this.healthBar.displayProps;

      const hpContainer = new Container();
      hpContainer.type = 'health';

      const { hp: currentHp } = charState;
      const { maxHp } = this.healthBar;

      // create two rectangles, one for bar background (offset) and one for actual % state
      const hpPercent = (currentHp / maxHp).toFixed(2);
      const barOffset = new Graphics().beginFill(0x333333).drawRect(x, y, width, height).endFill();
      const hpBar = new Graphics().beginFill(0xFF0000).drawRect(x, y, width * hpPercent, height).endFill();
      barOffset.alpha = hpBar.alpha = 0.6;

      hpContainer.addChild(barOffset);
      hpContainer.addChild(hpBar);

      // create text indicator
      const indicator = new TextModule(`${currentHp}/${maxHp}${charState.alive ? ` (${Math.ceil(hpPercent * 100)}%)` : ' 💀'}`);
      indicator.anchor.set(0.5);
      indicator.show(hpContainer, x + width / 2, y + height / 2);

      this.uiContainer.addChild(hpContainer);
    },
    display: character => {
      this.healthBar.maxHp = character.stats.hp;
      this.healthBar.draw(character.currentState);

      EventBus.subscribe('character.state.update', this.healthBar.update);
    },
    update: charState => {
      const existantDisplay = this.uiContainer.children.find(child => child.type === 'health');
      this.uiContainer.removeChild(existantDisplay);

      this.healthBar.draw(charState);
    }
  }

  inventory = {
    displayProps: {
      x: 827, y: 85,
      width: 153, height: 79
    },
    draw: charInventory => {
      const { x, y, width, height } = this.inventory.displayProps;

      const invContainer = new Container();
      invContainer.type = 'inventory';

      // create inventory box
      const box = new Container();
      box.alpha = 0.8;
      box.position.set(x, y);
      box.width = width;
      box.height = height;

      // add a background to the box
      const boxBackground = new Sprite(Texture.WHITE);
      boxBackground.width = width;
      boxBackground.height = height;
      boxBackground.tint = 0x222222;
      box.addChild(boxBackground);

      const rows = 4;
      const itemWidth = 32, itemHeight = 32;
      let paddingX, paddingY;

      // create shapes for all available slots
      for (let i = 0; i < rows * 2; i++) {
        paddingX = i % rows === 0 ? 5 : paddingX + 5;
        paddingY = Math.floor(i / rows) === 0 ? 5 : 10;

        const slot = new Graphics().beginFill(0x555555).drawRect(
          (i % rows) * itemWidth + paddingX, // x
          Math.floor(i / rows) * itemHeight + paddingY, // y
          itemWidth, // width
          itemHeight //height
        ).endFill();

        box.addChild(slot);
      }

      // fill slots with inventory items
      charInventory.forEach((item, index) => {
        paddingX = index % rows === 0 ? 5 : paddingX + 5;
        paddingY = Math.floor(index / rows) === 0 ? 5 : 10;

        // set item picture in slot
        const texture = Texture.from(item.imageUrl);
        const block = new Sprite(texture);
        block.position.set((index % rows) * itemWidth + paddingX, Math.floor(index / rows) * itemHeight + paddingY);
        block.interactive = true;
        block.cursor = 'none';

        // set item quantity in bottom right corner
        const amount = new TextModule(item.quantity);
        amount.anchor.set(1);

        // set events to display item name on hover
        block.mouseover = event => {
          const message = new TextModule(Utils.capitalize(item.name));
          block.message = message;
          message.show(invContainer, event.data.global.x, event.data.global.y);
        }

        block.mousemove = event => {
          if (!block.message) return;
          block.message.x = event.data.global.x;
          block.message.y = event.data.global.y;
        }

        block.mouseout = () => {
          invContainer.removeChild(block.message);
          delete block.message;
        }

        box.addChild(block);
        amount.show(box, block.x + block.width, block.y + block.height);
      });

      invContainer.addChild(box);
      this.uiContainer.addChild(invContainer);
    },
    display: character => {
      this.inventory.draw(character.inventory);

      EventBus.subscribe('character.inventory.update', this.inventory.update);
    },
    update: charInventory => {
      const existantDisplay = this.uiContainer.children.find(child => child.type === 'inventory');
      this.uiContainer.removeChild(existantDisplay);

      this.inventory.draw(charInventory);
    }
  }

  displayHealthBar(character) {
    this.healthBar.display(character);
  }

  displayInventory(character) {
    this.inventory.display(character);
  }
}

export default new UIModule();
