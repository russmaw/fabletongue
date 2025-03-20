import { Audio } from 'expo-av';

interface SoundEffect {
  sound: Audio.Sound;
  isLoaded: boolean;
}

class AudioEffects {
  private effects: { [key: string]: SoundEffect } = {};

  async loadSoundEffects() {
    try {
      const effectsToLoad = {
        spellCast: require('../assets/sounds/spell-cast.mp3'),
        questComplete: require('../assets/sounds/quest-complete.mp3'),
        itemAcquired: require('../assets/sounds/item-acquired.mp3'),
        wordLearned: require('../assets/sounds/word-learned.mp3'),
        levelUp: require('../assets/sounds/level-up.mp3'),
        magicFail: require('../assets/sounds/magic-fail.mp3'),
        bookOpen: require('../assets/sounds/book-open.mp3'),
        menuSelect: require('../assets/sounds/menu-select.mp3'),
      };

      for (const [key, source] of Object.entries(effectsToLoad)) {
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: false,
          volume: 0.5,
        });

        this.effects[key] = {
          sound,
          isLoaded: true,
        };
      }
    } catch (error) {
      console.error('Error loading sound effects:', error);
    }
  }

  async playEffect(effectName: string) {
    try {
      const effect = this.effects[effectName];
      if (effect?.isLoaded) {
        await effect.sound.replayAsync();
      }
    } catch (error) {
      console.error(`Error playing sound effect ${effectName}:`, error);
    }
  }

  async unloadSoundEffects() {
    try {
      for (const effect of Object.values(this.effects)) {
        if (effect.isLoaded) {
          await effect.sound.unloadAsync();
        }
      }
      this.effects = {};
    } catch (error) {
      console.error('Error unloading sound effects:', error);
    }
  }
}

export const audioEffects = new AudioEffects(); 