import { Application, Loader, Renderer } from 'pixi.js';
import AnimatedCharacter from './AnimatedCharacter';

// Create the application helper and add its render target to the page
const app = new Application({ width: 640, height: 480, antialias: true });
document.body.appendChild(app.view);
console.log(app.view.height);

app.renderer.resize(640, 480);
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.margin = 0;
app.renderer.view.style.padding = 0;

// Loader
const loader = Loader.shared;


loader.add('spritesheet', 'assets/knight.json').load((loader, resources) => {
  //console.log('resources:', resources);
  const textures = Object.values(resources?.spritesheet?.textures);
  const defaultChar = new AnimatedCharacter({
    textures,
    frameMap: { 
      right: { current: 8, min: 8, max: 11 }, 
      left: { current: 4, min: 4, max: 7 }, 
      down: { current: 0, min: 0, max: 3 }, 
      up: { current: 12, min: 12, max: 15 } 
    }
  });

  app.stage.addChild(defaultChar);
  defaultChar.play();
});
