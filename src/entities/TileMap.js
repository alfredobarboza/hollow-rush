import { Container, TilingSprite, Texture, BaseTexture, Sprite, Rectangle } from "pixi.js";
import { CollisionModule, EventBus } from "../modules";

export default class TileMap extends Container {
  constructor(options) {
    super();

    this.name = options.config.name;
    this.options = options;
    this.sortableChildren = true;
    this.tileTextures = [];
    this.mapContainer = new Container();
    this.mapContainer.zIndex = 1;
    this.mapEntities = [];

    this.setup();
  }

  setup() {
    const map = this.options.config;

    // generate textures
    for (let i = 0; i < (map.pxHorizontal / map.tileSize) * (map.pxVertical / map.tileSize); i++) {
      let x = i % 14;
      let y = Math.floor(i / 14);
      this.tileTextures[i] = new Texture(
        BaseTexture.from(this.options.tilesetUrl),
        new Rectangle(x * map.tileSize, y * map.tileSize, map.tileSize, map.tileSize)
      );
    }

    // generate sprites and add to container
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
    this.visible = true;
    this.addBackground();
    this.addChild(this.mapContainer);
    this.registerEntityCollisions();
    EventBus.publish('map.load', this);
  }

  unload() {
    this.visible = false;
    this.children.forEach(child => {
      this.removeChild(child);
    });
  }

  addBackground() {
    const map = this.options.config;
    this.background = new TilingSprite(this.tileTextures[map.backgroundTile], map.width * map.tileSize, map.height * map.tileSize);

    this.addChild(this.background);
  }

  add(entity, x, y) {
    EventBus.publish('map.entity.add', entity);

    entity.position.set(x, y);
    entity.container = this;

    this.mapEntities = [...this.mapEntities, entity];

    this.addChild(entity);
  }

  remove(entity) {
    EventBus.publish('map.entity.remove', entity);

    this.mapEntities = this.mapEntities.filter(item => item.id !== entity.id);

    this.removeChild(entity);
  } 

  registerEntityCollisions = () => {
    EventBus.subscribe('#.move', entity => {
      //console.log('%cEntity moved:', 'font-weight:bold;color:cyan;', entity);
      const collisions = this.mapEntities
        // except with itself
        .filter(item => item.id !== entity.id)
        // check if it has collided with something and return it
        .filter(item => CollisionModule.hitTestRectangle(entity, item, true));
      
      if (collisions.length && entity.handleInteraction instanceof Function) {
        // for now, collisions with more than one entity at the same time will never happen
        //console.log('%cEntity collided with:', 'font-weight:bold;color:cyan;', collisions[0]);
        entity.handleInteraction(collisions[0]);
      }
    });
  }
}
