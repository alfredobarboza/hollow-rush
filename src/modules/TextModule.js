import { Text, TextStyle } from 'pixi.js';

export default class TextModule extends Text {
  constructor(text, style = {}) {
    const defaultStyle = {
      fontFamily: 'Georgia',
      fontSize: 12, 
      fill: 0xFFFFFF, 
      fontWeight: 'bold', 
      stroke: 0x000000, 
      strokeThickness: 1 
    };

    const textStyle = { ...defaultStyle, ...style };

    super(text, new TextStyle(textStyle));

    this.style = textStyle;
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
