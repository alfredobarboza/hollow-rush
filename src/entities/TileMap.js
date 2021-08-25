import { Container, TilingSprite, Texture, BaseTexture, Sprite, Rectangle } from "pixi.js";

export default class TileMap extends Container {
  constructor(options) {
    super();

    this.options = options;
    this.tileTextures = [];
    this.mapContainer = new Container();

    this.setup();
  }

  setup() {
    const map = this.options.config;

    for (let i = 0; i < (map.pxHorizontal / map.tileSize) * (map.pxVertical / map.tileSize); i++) {
      let x = i % 14;
      let y = Math.floor(i / 14);
      this.tileTextures[i] = new Texture(
        BaseTexture.from(this.options.tilesetUrl),
        new Rectangle(x * map.tileSize, y * map.tileSize, map.tileSize, map.tileSize)
      );
    }

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y * map.width + x];
        const sprite = new Sprite(this.tileTextures[tile]);
        sprite.x = x * map.tileSize;
        sprite.y = y * map.tileSize;

        this.mapContainer.addChild(sprite);
      }
    }
  }

  load() {
    this.addBackground();
    this.addChild(this.mapContainer);
  }

  unload() {
    this.children.forEach(child => {
      this.removeChild(child);
    })
  }

  addBackground() {
    const map = this.options.config;
    const background = new TilingSprite(this.tileTextures[map.backgroundTile], map.width * map.tileSize, map.height * map.tileSize);
    this.background = background;

    this.addChild(this.background);
  }

  add(entity, x, y) {
    entity.setPosition(x, y);
    this.addChild(entity);
  }
}
