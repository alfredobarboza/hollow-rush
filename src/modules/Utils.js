import TextModule from './TextModule';
import EventBus from './EventBus';
import DataModule from './DataModule';
import { directions as DIRECTIONS } from '../config/enums';

class Utils {
  renderVersionIndicator(container, dark = false) {
    const padding = 5;
    const indicator = new TextModule(`Hollow Rush - Version ${APP_VERSION} (c) Firelink Solutions`);

    if (dark) {
      indicator.changeStyle({ fill: 0x000000, stroke: 0xFFFFFF });
    }

    indicator.show(
      container, 
      container.width - indicator.width - padding,
      container.height - indicator.height - padding
    );
  }

  debugEvents() {
    if (!DEBUG_MODE) return;

    EventBus.subscribe('#', (_, envelope) => {
      console.log('%cEvent occured:', 'font-weight:bold;color:green;', envelope);
    });
  }

  displayOuterInventory() {
    const gameDataElem = document.querySelector('#game-data');

    const title = document.createElement('h2');
    title.appendChild(document.createTextNode('Character Inventory'));
    gameDataElem.appendChild(title);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'inventory';
    itemsContainer.innerHTML = 'No Items';

    gameDataElem.appendChild(title);
    gameDataElem.appendChild(itemsContainer);

    EventBus.subscribe('player.inventory.#', inventory => {
      const testDiv = document.querySelector('.inventory');
      testDiv.innerHTML = '';
    
      if (!inventory.length) testDiv.innerHTML = 'No Items';
    
      inventory.forEach(item => {
        const container = document.createElement('div');
        container.className = 'inventory-item';
        
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.title = item.name;
    
        const span = document.createElement('p');
        const text = document.createTextNode(`(x${item.quantity})`);
        span.appendChild(text);
    
        container.appendChild(img);
        container.appendChild(span);
    
        testDiv.appendChild(container);
      });
    });
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  loadGameEntitiesToMap(map) {
    DataModule.gameEntities.forEach(entity => {
      if (map.name === entity.map.name) {
        const Model = entity.model;
        const instance = new Model({ ...entity.props });

        map.add(instance, entity.map.x, entity.map.y);
      }
    });
  }

  getOppositeDirection(direction) {
    if (!direction) return null;

    if (direction === DIRECTIONS.LEFT) return DIRECTIONS.RIGHT;
    if (direction === DIRECTIONS.RIGHT) return DIRECTIONS.LEFT;
    if (direction === DIRECTIONS.TOP) return DIRECTIONS.BOTTOM;
    if (direction === DIRECTIONS.BOTTOM) return DIRECTIONS.TOP;
  }
}

export default new Utils();
