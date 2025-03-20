import { Audio } from 'expo-av';
import { create } from 'zustand';
import { StoryMood, StoryScene } from '../hooks/useBedtimeStory';
import useBackgroundMusic from './BackgroundMusic';
import useAmbientSounds from './AmbientSounds';
import useSoundEffects from './SoundEffects';
import type { AmbientSound, AmbientSoundState } from 'audio-types';

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
  duration: number; // in minutes
  recommendedMood: StoryMood;
  recommendedScene: StoryScene;
}

export interface StoryPage {
  id: string;
  text: string;
  mood: StoryMood;
  scene: StoryScene;
  duration: number; // in seconds
  ambientSounds?: AmbientSound[];
}

interface BedtimeStoryState {
  currentStory: Story | null;
  currentPageIndex: number;
  isPlaying: boolean;
  timeRemaining: number;
  autoProgress: boolean;
  includeMusic: boolean;
  includeAmbientSounds: boolean;
  volume: number;
  error: string | null;
  isLoading: boolean;
}

interface BedtimeStoryActions {
  setStory: (story: Story) => void;
  startStory: () => void;
  pauseStory: () => void;
  nextPage: () => void;
  previousPage: () => void;
  setAutoProgress: (enabled: boolean) => void;
  setIncludeMusic: (enabled: boolean) => void;
  setIncludeAmbientSounds: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  completeStory: () => void;
  reset: () => void;
  clearError: () => void;
}

const INITIAL_STATE: BedtimeStoryState = {
  currentStory: null,
  currentPageIndex: 0,
  isPlaying: false,
  timeRemaining: 0,
  autoProgress: true,
  includeMusic: true,
  includeAmbientSounds: true,
  volume: 1,
  error: null,
  isLoading: false,
};

export const useBedtimeStoryStore = create<BedtimeStoryState & BedtimeStoryActions>((set, get) => {
  let storyTimer: NodeJS.Timeout | null = null;
  
  // Create store instances
  const backgroundMusic = useBackgroundMusic;
  const ambientSounds = useAmbientSounds;
  const soundEffects = useSoundEffects;

  // Helper function to stop all ambient sounds
  const stopAllAmbientSounds = async () => {
    try {
      const store = ambientSounds();
      const state = store as unknown as AmbientSoundState;
      for (const sound of state.activeSounds || []) {
        await store.stopSound(sound);
      }
    } catch (error) {
      console.error('Failed to stop ambient sounds:', error);
      set({ error: 'Failed to stop ambient sounds' });
    }
  };

  // Helper function to set volume for all ambient sounds
  const setAmbientVolumes = (volume: number) => {
    try {
      const store = ambientSounds();
      const state = store as unknown as AmbientSoundState;
      (state.activeSounds || []).forEach((sound: AmbientSound) => {
        store.setVolume(sound, volume);
      });
    } catch (error) {
      console.error('Failed to set ambient volumes:', error);
      set({ error: 'Failed to adjust sound volume' });
    }
  };

  // Helper function to clear timer
  const clearStoryTimer = () => {
    if (storyTimer) {
      clearInterval(storyTimer);
      storyTimer = null;
    }
  };

  // Helper function to handle errors
  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    set({ error: message, isLoading: false });
    clearStoryTimer();
  };

  return {
    ...INITIAL_STATE,

    setStory: (story: Story) => {
      try {
        set({
          currentStory: story,
          timeRemaining: story.duration * 60, // Convert minutes to seconds
          error: null,
          isLoading: false,
        });
      } catch (error) {
        handleError(error as Error, 'Failed to set story');
      }
    },

    startStory: async () => {
      const { currentStory, includeMusic, includeAmbientSounds } = get();
      if (!currentStory) {
        set({ error: 'No story selected' });
        return;
      }

      try {
        set({ isLoading: true, error: null });

        // Start background music if enabled
        if (includeMusic) {
          await backgroundMusic().playTrack('lullaby');
        }

        // Start ambient sounds if enabled
        if (includeAmbientSounds) {
          const currentPage = currentStory.pages[get().currentPageIndex];
          await Promise.all(
            (currentPage.ambientSounds || []).map(sound =>
              ambientSounds().playSound(sound)
            )
          );
        }

        // Play start sound effect
        await soundEffects().playSound('bedtimeStart');

        set({ isPlaying: true, isLoading: false });

        // Start the timer
        clearStoryTimer(); // Clear any existing timer
        storyTimer = setInterval(() => {
          const { timeRemaining, autoProgress, currentPageIndex, currentStory } = get();
          
          if (timeRemaining <= 0) {
            clearStoryTimer();
            get().completeStory();
            return;
          }

          // Auto progress to next page if enabled
          if (autoProgress && currentStory) {
            const currentPage = currentStory.pages[currentPageIndex];
            if (currentPage && timeRemaining % currentPage.duration === 0) {
              get().nextPage();
            }
          }

          set({ timeRemaining: timeRemaining - 1 });
        }, 1000);
      } catch (error) {
        handleError(error as Error, 'Failed to start story');
        await get().pauseStory(); // Ensure everything is stopped
      }
    },

    pauseStory: async () => {
      try {
        set({ isLoading: true, error: null });
        
        await backgroundMusic().stopTrack(); // Stop music
        await stopAllAmbientSounds(); // Stop ambient sounds
        clearStoryTimer(); // Clear the timer

        set({ isPlaying: false, isLoading: false });
      } catch (error) {
        handleError(error as Error, 'Failed to pause story');
      }
    },

    nextPage: async () => {
      const { currentStory, currentPageIndex, includeAmbientSounds } = get();
      if (!currentStory || currentPageIndex >= currentStory.pages.length - 1) return;

      try {
        set({ isLoading: true, error: null });

        // Stop current ambient sounds
        if (includeAmbientSounds) {
          await stopAllAmbientSounds();
        }

        // Start new page's ambient sounds
        const nextPage = currentStory.pages[currentPageIndex + 1];
        if (includeAmbientSounds && nextPage.ambientSounds) {
          await Promise.all(
            nextPage.ambientSounds.map(sound =>
              ambientSounds().playSound(sound)
            )
          );
        }

        set({
          currentPageIndex: currentPageIndex + 1,
          isLoading: false,
        });
      } catch (error) {
        handleError(error as Error, 'Failed to navigate to next page');
      }
    },

    previousPage: async () => {
      const { currentStory, currentPageIndex, includeAmbientSounds } = get();
      if (!currentStory || currentPageIndex <= 0) return;

      try {
        set({ isLoading: true, error: null });

        // Stop current ambient sounds
        if (includeAmbientSounds) {
          await stopAllAmbientSounds();
        }

        // Start new page's ambient sounds
        const prevPage = currentStory.pages[currentPageIndex - 1];
        if (includeAmbientSounds && prevPage.ambientSounds) {
          await Promise.all(
            prevPage.ambientSounds.map(sound =>
              ambientSounds().playSound(sound)
            )
          );
        }

        set({
          currentPageIndex: currentPageIndex - 1,
          isLoading: false,
        });
      } catch (error) {
        handleError(error as Error, 'Failed to navigate to previous page');
      }
    },

    setAutoProgress: (enabled: boolean) => {
      set({ autoProgress: enabled });
    },

    setIncludeMusic: (enabled: boolean) => {
      try {
        if (enabled && get().isPlaying) {
          backgroundMusic().playTrack('lullaby');
        } else if (!enabled) {
          backgroundMusic().stopTrack();
        }
        set({ includeMusic: enabled, error: null });
      } catch (error) {
        handleError(error as Error, 'Failed to toggle music');
      }
    },

    setIncludeAmbientSounds: async (enabled: boolean) => {
      const { currentStory, currentPageIndex, isPlaying } = get();

      try {
        if (enabled && isPlaying && currentStory) {
          const currentPage = currentStory.pages[currentPageIndex];
          await Promise.all(
            (currentPage.ambientSounds || []).map(sound =>
              ambientSounds().playSound(sound)
            )
          );
        } else if (!enabled) {
          await stopAllAmbientSounds();
        }

        set({ includeAmbientSounds: enabled, error: null });
      } catch (error) {
        handleError(error as Error, 'Failed to toggle ambient sounds');
      }
    },

    setVolume: (volume: number) => {
      try {
        backgroundMusic().setVolume(volume);
        setAmbientVolumes(volume);
        soundEffects().setVolume(volume);
        set({ volume, error: null });
      } catch (error) {
        handleError(error as Error, 'Failed to set volume');
      }
    },

    completeStory: async () => {
      try {
        set({ isLoading: true, error: null });
        
        await backgroundMusic().stopTrack(); // Stop music
        await stopAllAmbientSounds(); // Stop ambient sounds
        await soundEffects().playSound('bedtimeEnd'); // Play completion sound
        clearStoryTimer();

        set({ isPlaying: false, isLoading: false });
      } catch (error) {
        handleError(error as Error, 'Failed to complete story');
      }
    },

    reset: async () => {
      try {
        set({ isLoading: true, error: null });
        
        await backgroundMusic().stopTrack();
        await stopAllAmbientSounds();
        clearStoryTimer();

        set({ ...INITIAL_STATE });
      } catch (error) {
        handleError(error as Error, 'Failed to reset story');
      }
    },

    clearError: () => {
      set({ error: null });
    },
  };
}); 