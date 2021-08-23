class DataModule {
    constructor() {
        //TODO: Refactor all hardcoded const values to a propery here
        this.charOptions;
        this.tileMap;

        this.audioCfg = [
            { name: 'test1', src: '/assets/audios/examplea.wav', loop: false, volume: 0.1 },
            { name: 'test2', src: '/assets/audios/exampleb.wav', loop: false, volume: 0.1 },
            { name: 'intro', src: '/assets/audios/examplec.wav', loop: false, volume: 0.1 }
        ];
    }
}

export default new DataModule();
