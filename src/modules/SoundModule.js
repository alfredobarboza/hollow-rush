import { Howl, Howler } from 'howler';
import DataModule from './DataModule';

class SoundModule {
  constructor() {
    // add all audio assets to sound obj to be consumed
    this.sounds = DataModule.audioCfg.map(sound => {
      const audio = Object.assign(new Howl(sound), { name: sound.name });
      return audio;
    });

  }

  play(audioName) {
    const audio = this.sounds.find(sound => sound.name === audioName);
    console.log(audio);
    if (audio) {
      audio.play();
    }
  }

}

export default new SoundModule();