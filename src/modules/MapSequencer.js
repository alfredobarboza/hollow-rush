export default class MapSequencer {
  constructor(maps) {
    this.maps = maps;
    this.currentMap = 0;
    this.currentMapIndex = 0;

    this.generator = this.generateMapSequence();
    this.generator.next();
  }

  * generateMapSequence() {
    while (this.currentMapIndex <= this.maps.length) {
      const currentMap = this.maps[this.currentMapIndex];
      currentMap.load();

      yield currentMap;

      currentMap.unload();
      this.currentMapIndex++;
    }
  }

  getCurrent() {
    return this.maps[this.currentMapIndex];
  }

  loadNext() {
    const nextMap = this.generator.next();

    return nextMap.value;
  }

  loadMap(mapIndex) {
    const currentMap = this.maps[this.currentMapIndex];
    const nextMap = this.maps[mapIndex];

    if (!nextMap) return;

    currentMap.unload();
    nextMap.load();

    this.currentMapIndex = mapIndex;
  }
}
