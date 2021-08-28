class DataModule {
    constructor() {
        //TODO: Refactor all hardcoded const values to a propery here
        this.tileMap;

        this.audioCfg = [
            { name: 'test1', src: '/assets/audios/examplea.wav', loop: false, volume: 0.1 },
            { name: 'test2', src: '/assets/audios/exampleb.wav', loop: false, volume: 0.1 },
            { name: 'intro', src: '/assets/audios/examplec.wav', loop: false, volume: 0.1 },
            { name: 'grabItem', src: '/assets/audios/grabItem.wav', loop: false, volume: 0.1 },
        ];

        this.charSheets = [
            {
                name: 'rogue',
                attackValue: 20,
                hp: 85,
                mana: 50
            },
            {
                name: 'gladiator',
                attackValue: 10,
                hp: 150,
                mana: 20
            },
            {
                name: 'paladin',
                attackValue: 15,
                hp: 120,
                mana: 100
            },
            {
                name: 'mage',
                attackValue: 5,
                hp: 80,
                mana: 150
            },
            {
                name: 'undead',
                attackValue: 8,
                hp: 200,
                mana: 0
            },
        ]
    }
}

export default new DataModule();
