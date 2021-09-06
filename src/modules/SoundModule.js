import { Howl } from 'howler';
import DataModule from './DataModule';

class SoundModule {
  constructor() {
    // add all audio assets to sound obj to be consumed
    this.sounds = DataModule.audioCfg.map(sound => {
      const audio = Object.assign(new Howl(sound), { name: sound.name });
      return audio;
    });

  }

  play(audioName, volume) {
    const audio = this.sounds.find(sound => sound.name === audioName);

    if (!audio) return;
    
    if (volume) {
      audio.volume(volume);
    }
    
    audio.play();
  }

  stop(audioName) {
    const audio = this.sounds.find(sound => sound.name === audioName);

    if (!audio) return;
    
    audio.stop();
  }

}

export default new SoundModule();
