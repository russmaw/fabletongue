import { Audio } from 'expo-av';
import { StateCreator, create } from 'zustand';
import { AmbientSound, AmbientSoundState } from 'audio-types';

interface AmbientSoundStore extends AmbientSoundState {
  playSound: (sound: AmbientSound) => Promise<void>;
  stopSound: (sound: AmbientSound) => Promise<void>;
  setVolume: (sound: AmbientSound, volume: number) => void;
  toggleEnabled: () => void;
  cleanup: () => void;
}

type AmbientSoundStoreCreator = StateCreator<AmbientSoundStore>;

const AMBIENT_FILES: Record<AmbientSound, string> = {
  crickets: require('../../assets/audio/ambient/crickets.mp3'),
  rain: require('../../assets/audio/ambient/rain.mp3'),
  waves: require('../../assets/audio/ambient/waves.mp3'),
  wind: require('../../assets/audio/ambient/wind.mp3'),
  fire: require('../../assets/audio/ambient/fire.mp3'),
  birds: require('../../assets/audio/ambient/birds.mp3'),
  stream: require('../../assets/audio/ambient/stream.mp3'),
  night: require('../../assets/audio/ambient/night.mp3'),
};

const DEFAULT_VOLUMES: Record<AmbientSound, number> = {
  crickets: 0.4,
  rain: 0.5,
  waves: 0.5,
  wind: 0.4,
  fire: 0.4,
  birds: 0.4,
  stream: 0.4,
  night: 0.4,
};

const useAmbientSounds = create<AmbientSoundStore>((set, get): AmbientSoundStore => {
  const soundObjects: Partial<Record<AmbientSound, Audio.Sound>> = {};
  const volumes: Record<AmbientSound, number> = { ...DEFAULT_VOLUMES };

  const loadSound = async (ambient: AmbientSound) => {
    try {
      if (!soundObjects[ambient]) {
        const { sound } = await Audio.Sound.createAsync(
          AMBIENT_FILES[ambient],
          { 
            volume: volumes[ambient],
            isLooping: true,
            shouldPlay: false 
          }
        );
        soundObjects[ambient] = sound;
      }
      return soundObjects[ambient];
    } catch (error) {
      console.error(`Failed to load ambient sound ${ambient}:`, error);
      return null;
    }
  };

  return {
    isEnabled: true,
    activeSounds: [],
    volumes,

    playSound: async (ambient: AmbientSound) => {
      if (!get().isEnabled) return;

      try {
        const sound = await loadSound(ambient);
        if (sound) {
          await sound.setVolumeAsync(volumes[ambient]);
          await sound.playAsync();
          set({ activeSounds: [...get().activeSounds, ambient] });
        }
      } catch (error) {
        console.error(`Failed to play ambient sound ${ambient}:`, error);
      }
    },

    stopSound: async (ambient: AmbientSound) => {
      try {
        const sound = soundObjects[ambient];
        if (sound) {
          await sound.stopAsync();
          set({ 
            activeSounds: get().activeSounds.filter((s: AmbientSound) => s !== ambient) 
          });
        }
      } catch (error) {
        console.error(`Failed to stop ambient sound ${ambient}:`, error);
      }
    },

    setVolume: async (ambient: AmbientSound, volume: number) => {
      volumes[ambient] = volume;
      try {
        const sound = soundObjects[ambient];
        if (sound) {
          await sound.setVolumeAsync(volume);
        }
      } catch (error) {
        console.error(`Failed to set volume for ambient sound ${ambient}:`, error);
      }
    },

    toggleEnabled: () => {
      const newEnabled = !get().isEnabled;
      set({ isEnabled: newEnabled });
      
      if (!newEnabled) {
        // Stop all active sounds when disabled
        get().activeSounds.forEach((ambient: AmbientSound) => {
          soundObjects[ambient]?.stopAsync();
        });
        set({ activeSounds: [] });
      }
    },

    cleanup: () => {
      // Unload all sound objects
      Object.values(soundObjects).forEach(sound => {
        sound?.unloadAsync();
      });
    },
  };
});

export default useAmbientSounds; 