import { Audio } from 'expo-av';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundEffect {
  id: string;
  sound: Audio.Sound;
  isLoaded: boolean;
}

interface SoundEffectsState {
  effects: Map<string, SoundEffect>;
  isEnabled: boolean;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = '@sound_effects';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useSoundEffectsStore = create<SoundEffectsState & {
  loadEffect: (id: string, assetPath: string) => Promise<void>;
  playEffect: (id: string) => Promise<void>;
  stopEffect: (id: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleEnabled: () => Promise<void>;
  cleanup: () => Promise<void>;
  clearError: () => void;
}>((set, get) => ({
  effects: new Map(),
  isEnabled: true,
  volume: 0.5,
  isLoading: false,
  error: null,

  loadEffect: async (id: string, assetPath: string) => {
    try {
      set({ isLoading: true, error: null });
      const { effects, volume } = get();

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require(`../assets/sounds/${assetPath}`),
            { volume }
          );

          effects.set(id, {
            id,
            sound,
            isLoaded: true,
          });

          set({ effects, isLoading: false });
          break;
        } catch (error) {
          retries++;
          if (retries === MAX_RETRIES) throw error;
          await delay(RETRY_DELAY);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sound effect';
      set({ error: errorMessage, isLoading: false });
      console.error(`Error loading sound effect ${id}:`, error);
    }
  },

  playEffect: async (id: string) => {
    try {
      const { effects, isEnabled } = get();
      if (!isEnabled) return;

      const effect = effects.get(id);
      if (!effect) {
        throw new Error(`Sound effect ${id} not found`);
      }

      if (!effect.isLoaded) {
        throw new Error(`Sound effect ${id} not loaded`);
      }

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          await effect.sound.setVolumeAsync(get().volume);
          await effect.sound.playFromPositionAsync(0);
          break;
        } catch (error) {
          retries++;
          if (retries === MAX_RETRIES) throw error;
          await delay(RETRY_DELAY);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to play sound effect';
      set({ error: errorMessage });
      console.error(`Error playing sound effect ${id}:`, error);
    }
  },

  stopEffect: async (id: string) => {
    try {
      const { effects } = get();
      const effect = effects.get(id);
      if (effect?.isLoaded) {
        await effect.sound.stopAsync();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop sound effect';
      set({ error: errorMessage });
      console.error(`Error stopping sound effect ${id}:`, error);
    }
  },

  setVolume: async (volume: number) => {
    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      const { effects } = get();

      // Update volume for all loaded effects
      await Promise.all(
        Array.from(effects.values())
          .filter(effect => effect.isLoaded)
          .map(effect => effect.sound.setVolumeAsync(normalizedVolume))
      );

      set({ volume: normalizedVolume });

      // Save volume setting
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        volume: normalizedVolume,
        isEnabled: get().isEnabled,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set volume';
      set({ error: errorMessage });
      console.error('Error setting volume:', error);
    }
  },

  toggleEnabled: async () => {
    try {
      const { isEnabled, effects } = get();
      const newEnabled = !isEnabled;

      if (!newEnabled) {
        // Stop all playing effects
        await Promise.all(
          Array.from(effects.values())
            .filter(effect => effect.isLoaded)
            .map(effect => effect.sound.stopAsync())
        );
      }

      set({ isEnabled: newEnabled });

      // Save enabled setting
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        volume: get().volume,
        isEnabled: newEnabled,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle sound effects';
      set({ error: errorMessage });
      console.error('Error toggling sound effects:', error);
    }
  },

  cleanup: async () => {
    try {
      const { effects } = get();

      // Unload all sound effects
      await Promise.all(
        Array.from(effects.values())
          .filter(effect => effect.isLoaded)
          .map(async (effect) => {
            try {
              await effect.sound.unloadAsync();
            } catch (error) {
              console.error(`Error unloading sound effect ${effect.id}:`, error);
            }
          })
      );

      set({
        effects: new Map(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup sound effects';
      set({ error: errorMessage });
      console.error('Error during cleanup:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const initializeSoundEffects = async () => {
  try {
    // Load saved settings
    const settings = await AsyncStorage.getItem(STORAGE_KEY);
    if (settings) {
      const { volume, isEnabled } = JSON.parse(settings);
      
      if (volume !== undefined) {
        await useSoundEffectsStore((state) => state.setVolume(volume));
      }
      
      if (isEnabled !== undefined) {
        useSoundEffectsStore((state) => ({ ...state, isEnabled }));
      }
    }
  } catch (error) {
    console.error('Failed to initialize sound effects:', error);
    useSoundEffectsStore((state) => ({ ...state, error: 'Failed to initialize sound effects' }));
  }
};

export default useSoundEffectsStore; 