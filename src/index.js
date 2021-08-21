import { Application, Sprite, Loader, Texture, AnimatedSprite } from 'pixi.js';

// Create the application helper and add its render target to the page
const app = new Application({ width: 640, height: 360, antialias: true });
document.body.appendChild(app.view);

app.renderer.resize(640, 480);
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.margin = 0;
app.renderer.view.style.padding = 0;

// Loader
const loader = Loader.shared;

const moveCharacter = (character, frameMap, direction) => {
  const isHorizontal = ['left', 'right'].includes(direction);
  const isPositive = ['right', 'down'].includes(direction);

  // detect the range of frames for the char direction
  let frame = frameMap[direction];
  frame.current = frame.current < frame.max ? frame.current + 1 : frame.min;

  // move the character to the correct direction and update animation frame
  const axis = isHorizontal ? 'x' : 'y';
  const newPos = isPositive ? character.position[axis] + 5 : character.position[axis] - 5;
  character.position[axis] = newPos;
  character.gotoAndPlay(frame.current);
}

loader.add('spritesheet', 'assets/default-char.json').load((loader, resources) => {
  console.log('resources:', resources);
  const textures = Object.values(resources?.spritesheet?.textures);
  const defaultChar = new AnimatedSprite(textures);
  defaultChar.autoUpdate = false;

  let frameMap = { 
    right: { current: 8, min: 8, max: 11 }, 
    left: { current: 4, min: 4, max: 7 }, 
    down: { current: 0, min: 0, max: 3 }, 
    up: { current: 12, min: 12, max: 15 } 
  };

  document.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowRight':
        moveCharacter(defaultChar, frameMap, 'right');
        break;
      case 'ArrowLeft':
        moveCharacter(defaultChar, frameMap, 'left');
        break;
      case 'ArrowDown':
        moveCharacter(defaultChar, frameMap, 'down');
        break;
      case 'ArrowUp':
        moveCharacter(defaultChar, frameMap, 'up');
        break;
      default:
        console.log('pelotudo ponete las manos');
        break;
    }
  });

  defaultChar.animationSpeed = 0.05;
  app.stage.addChild(defaultChar);

  defaultChar.interactive = true;
  defaultChar.updateAnchor = true;
  defaultChar.play();
});
