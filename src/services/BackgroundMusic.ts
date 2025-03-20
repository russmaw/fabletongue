import { Audio } from 'expo-av';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BackgroundMusicState {
  currentTrack: string | null;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  error: string | null;
  loadedSounds: Map<string, Audio.Sound>;
  playTrack: (trackName: string) => Promise<void>;
  stopTrack: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  preloadTracks: (tracks: string[]) => Promise<void>;
  cleanup: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@bgm_settings';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useBackgroundMusicStore = create<BackgroundMusicState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  isLoading: false,
  error: null,
  loadedSounds: new Map(),

  playTrack: async (trackName: string) => {
    try {
      set({ isLoading: true, error: null });
      const { loadedSounds, currentTrack, volume } = get();

      // Stop current track if playing
      if (currentTrack) {
        const currentSound = loadedSounds.get(currentTrack);
        if (currentSound) {
          await currentSound.stopAsync();
        }
      }

      let sound = loadedSounds.get(trackName);
      if (!sound) {
        // Load the sound if not preloaded
        let retries = 0;
        while (retries < MAX_RETRIES) {
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              require(`../assets/music/${trackName}.mp3`),
              { volume, isLooping: true }
            );
            sound = newSound;
            loadedSounds.set(trackName, newSound);
            break;
          } catch (error) {
            retries++;
            if (retries === MAX_RETRIES) throw error;
            await delay(RETRY_DELAY);
          }
        }
      }

      if (!sound) {
        throw new Error(`Failed to load track: ${trackName}`);
      }

      await sound.setVolumeAsync(volume);
      await sound.playAsync();

      set({
        currentTrack: trackName,
        isPlaying: true,
        isLoading: false,
      });

      // Save current track to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentTrack: trackName,
        volume,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to play track';
      set({ error: errorMessage, isLoading: false });
      console.error('Error playing track:', error);
    }
  },

  stopTrack: async () => {
    try {
      const { currentTrack, loadedSounds } = get();
      if (currentTrack) {
        const sound = loadedSounds.get(currentTrack);
        if (sound) {
          await sound.stopAsync();
          set({ currentTrack: null, isPlaying: false });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop track';
      set({ error: errorMessage });
      console.error('Error stopping track:', error);
    }
  },

  setVolume: async (volume: number) => {
    try {
      const { currentTrack, loadedSounds } = get();
      const normalizedVolume = Math.max(0, Math.min(1, volume));

      if (currentTrack) {
        const sound = loadedSounds.get(currentTrack);
        if (sound) {
          await sound.setVolumeAsync(normalizedVolume);
        }
      }

      set({ volume: normalizedVolume });

      // Save volume setting
      const settings = await AsyncStorage.getItem(STORAGE_KEY);
      const currentSettings = settings ? JSON.parse(settings) : {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...currentSettings,
        volume: normalizedVolume,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set volume';
      set({ error: errorMessage });
      console.error('Error setting volume:', error);
    }
  },

  preloadTracks: async (tracks: string[]) => {
    try {
      set({ isLoading: true, error: null });
      const { loadedSounds, volume } = get();

      await Promise.all(tracks.map(async (track) => {
        if (!loadedSounds.has(track)) {
          let retries = 0;
          while (retries < MAX_RETRIES) {
            try {
              const { sound } = await Audio.Sound.createAsync(
                require(`../assets/music/${track}.mp3`),
                { volume, isLooping: true }
              );
              loadedSounds.set(track, sound);
              break;
            } catch (error) {
              retries++;
              if (retries === MAX_RETRIES) {
                console.error(`Failed to preload track ${track}:`, error);
                // Continue with other tracks instead of throwing
                break;
              }
              await delay(RETRY_DELAY);
            }
          }
        }
      }));

      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to preload tracks';
      set({ error: errorMessage, isLoading: false });
      console.error('Error preloading tracks:', error);
    }
  },

  cleanup: async () => {
    try {
      const { loadedSounds } = get();
      // Unload all sounds
      await Promise.all(Array.from(loadedSounds.values()).map(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.error('Error unloading sound:', error);
        }
      }));

      set({
        loadedSounds: new Map(),
        currentTrack: null,
        isPlaying: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup sounds';
      set({ error: errorMessage });
      console.error('Error during cleanup:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export const initializeBackgroundMusic = async () => {
  try {
    // Set up audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    // Load saved settings
    const settings = await AsyncStorage.getItem(STORAGE_KEY);
    if (settings) {
      const { currentTrack, volume } = JSON.parse(settings);
      
      if (volume !== undefined) {
        await useBackgroundMusicStore((state) => state.setVolume(volume));
      }
      
      if (currentTrack) {
        await useBackgroundMusicStore((state) => state.playTrack(currentTrack));
      }
    }
  } catch (error) {
    console.error('Failed to initialize background music:', error);
    useBackgroundMusicStore((state) => ({ ...state, error: 'Failed to initialize background music' }));
  }
};

export default useBackgroundMusicStore; 