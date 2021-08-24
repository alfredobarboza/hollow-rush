import { Text, TextStyle } from 'pixi.js';

export default class TextModule extends Text {
  constructor(text, style = {}) {
    super(text, new TextStyle(style));

    this.style = style;
    this.visible = false;
    this.lastContainer = null;
  }

  show(container = this.lastContainer, x = this.position.x, y = this.position.y) {
    this.visible = true;
    this.position.set(x, y);

    if (!this.lastContainer) {
      container?.addChild(this);
      this.lastContainer = container;
    }
  }

  changeStyle(newStyle) {
    this.style = { 
      ...this.style, 
      ...newStyle 
    };
  }

  hide() {
    this.visible = false;
  }
}
