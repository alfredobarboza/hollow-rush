import { AnimatedSprite } from "pixi.js";

export default class AnimatedCharacter extends AnimatedSprite {
  constructor(options) {
    super(options.textures);

    this.autoUpdate = false;
    this.animationSpeed = 0.05;
    this.interactive = true;
    this.frameMap = options.frameMap;

    document.addEventListener('keydown', e => {
      switch(e.key) {
        case 'ArrowRight':
          this.move('right');
          break;
        case 'ArrowLeft':
          this.move('left');
          break;
        case 'ArrowDown':
          this.move('down');
          break;
        case 'ArrowUp':
          this.move('up');
          break;
        default:
          console.log('pelotudo ponete las manos');
          break;
      }
    });
  }
  
  move = (direction) => {
    const isHorizontal = ['left', 'right'].includes(direction);
    const isPositive = ['right', 'down'].includes(direction);
  
    // detect the range of frames for the char direction
    let frame = this.frameMap[direction];
    frame.current = frame.current < frame.max ? frame.current + 1 : frame.min;
  
    // move the character to the correct direction and update animation frame
    const axis = isHorizontal ? 'x' : 'y';
    const newPos = isPositive ? this.position[axis] + 5 : this.position[axis] - 5;
    this.position[axis] = newPos;
    this.gotoAndPlay(frame.current);
  }
}
