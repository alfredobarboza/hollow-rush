import TextModule from './TextModule';

class Utils {
  renderVersionIndicator(container, dark = false) {
    const padding = 5;
    const indicator = new TextModule(
      `Hollow Rush - Version ${APP_VERSION} (c) Firelink Solutions`, 
      {
        fontFamily: 'Georgia',
        fontSize: 12, 
        fill: 0xFFFFFF, 
        fontWeight: 'bold', 
        stroke: 0x000000, 
        strokeThickness: 1 
      }
    );

    if (dark) {
      indicator.changeStyle({ fill: 0x000000, stroke: 0xFFFFFF });
    }

    indicator.show(
      container, 
      container.width - indicator.width - padding,
      container.height - indicator.height - padding
    );
  }
}

export default new Utils();
