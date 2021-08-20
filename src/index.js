import { Application, Sprite } from 'pixi.js';

// Create the application helper and add its render target to the page
const app = new Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Create the sprite and add it to the stage
const sprite = Sprite.from('assets/bunny.png');
console.log('sprite:', sprite);
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add(delta => {
  elapsed += delta;
  sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});
