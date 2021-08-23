import { sound } from '@pixi/sound';

const AUDIO_FOLDER = '/assets/';
const FILE_EXT = '.wav';

export default class SoundModule {
    constructor(options) {
        this.urls = options.audioList;

        // add all audio assets to sound obj to be consumed
        // this sound variable is global
        this.urls.forEach((curr) => {
            sound.add(curr, AUDIO_FOLDER + curr + FILE_EXT);
            sound.play(curr);
        });
    }
}




