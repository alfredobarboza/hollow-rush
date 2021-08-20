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

loader.add('spritesheet', 'assets/default-char.json').load((loader, resources) => {
  const textures = Object.values(resources?.spritesheet?.textures);
  const defaultChar = new AnimatedSprite(textures);
  defaultChar.autoUpdate = false;
  defaultChar.on('mouseMove', () => {
    console.log('#tecla');
  })
  console.log('#defaultChar:', defaultChar);
  document.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowRight':
        defaultChar.position.x += 5;
        break;
      case 'ArrowLeft':
        defaultChar.position.x -= 5;
        break;
      case 'ArrowDown':
        defaultChar.position.y += 5;
        break;
      case 'ArrowUp':
        defaultChar.position.y -= 5;
        break;
      default:
        console.log('pelotudo ponete las manos');
        break;
    }
  });

  defaultChar.animationSpeed = 0.1;
  app.stage.addChild(defaultChar);

  defaultChar.interactive = true;

  defaultChar.play();
});


