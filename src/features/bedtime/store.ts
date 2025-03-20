import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BedtimeState,
  BedtimeActions,
  BedtimeStoryState,
  VoiceNarrationSettings,
  ParentControls,
  NotificationSettings,
  BedtimeSettings,
  StoryNote,
} from './types';

const STORAGE_KEYS = {
  FAVORITES: '@bedtime_favorites',
  PROGRESS: '@bedtime_progress',
  NARRATION: '@bedtime_narration',
  CONTROLS: '@bedtime_controls',
  NOTIFICATIONS: '@bedtime_notifications',
  SETTINGS: '@bedtime_settings',
};

const DEFAULT_NARRATION_SETTINGS: VoiceNarrationSettings = {
  enabled: false,
  voice: 'en-US',
  speed: 1,
  pitch: 1,
};

const DEFAULT_PARENT_CONTROLS: ParentControls = {
  maxDuration: 30,
  allowedTimeRange: {
    start: '19:00',
    end: '21:00',
  },
  requireParentUnlock: false,
  restrictedContent: [],
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dailyReminder: {
    enabled: true,
    time: '20:00',
  },
  achievements: {
    enabled: true,
  },
  weeklyProgress: {
    enabled: true,
    dayOfWeek: 1,
    time: '18:00',
  },
  socialUpdates: {
    enabled: false,
  },
};

const DEFAULT_SETTINGS: BedtimeSettings = {
  includeMusic: true,
  includeAmbientSounds: true,
  volume: 0.7,
  autoPlayNext: false,
  reminderTime: null,
  voicePreference: null,
  readingSpeed: 'normal',
};

const initialState: BedtimeStoryState = {
  favorites: [],
  progress: [],
  currentStory: null,
  settings: DEFAULT_SETTINGS,
  narrationSettings: DEFAULT_NARRATION_SETTINGS,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  parentControls: DEFAULT_PARENT_CONTROLS,
};

type Store = BedtimeState & BedtimeActions;

export const useBedtimeStore = create<Store>((set, get) => {
  // Load initial state from AsyncStorage
  const loadState = async () => {
    try {
      const [
        favorites,
        progress,
        narrationSettings,
        notificationSettings,
        parentControls,
        settings,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.NARRATION),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.CONTROLS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);

      set({
        favorites: favorites ? JSON.parse(favorites) : initialState.favorites,
        progress: progress ? JSON.parse(progress) : initialState.progress,
        narrationSettings: narrationSettings
          ? JSON.parse(narrationSettings)
          : initialState.narrationSettings,
        notificationSettings: notificationSettings
          ? JSON.parse(notificationSettings)
          : initialState.notificationSettings,
        parentControls: parentControls
          ? JSON.parse(parentControls)
          : initialState.parentControls,
        settings: settings ? JSON.parse(settings) : initialState.settings,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ error: 'Failed to load state', isLoading: false });
    }
  };

  // Load state when store is created
  loadState();

  return {
    ...initialState,
    isLoading: true,
    error: null,

    setCurrentStory: (storyId: string | null) => set({ currentStory: storyId }),

    addToFavorites: (storyId: string) =>
      set((state) => {
        const newFavorites = [...state.favorites, storyId];
        AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
        return { favorites: newFavorites };
      }),

    removeFromFavorites: (storyId: string) =>
      set((state) => {
        const newFavorites = state.favorites.filter((id) => id !== storyId);
        AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
        return { favorites: newFavorites };
      }),

    updateProgress: (storyId: string, pageNumber: number) =>
      set((state) => {
        const existingProgress = state.progress.find((p) => p.storyId === storyId);
        const now = new Date();

        let newProgress;
        if (existingProgress) {
          newProgress = state.progress.map((p) =>
            p.storyId === storyId
              ? {
                  ...p,
                  lastPageRead: pageNumber,
                  completedPages: [...new Set([...p.completedPages, pageNumber])],
                  lastReadAt: now,
                }
              : p
          );
        } else {
          newProgress = [
            ...state.progress,
            {
              storyId,
              lastPageRead: pageNumber,
              completedPages: [pageNumber],
              timeSpent: 0,
              lastReadAt: now,
              bookmarks: [],
              notes: [],
            },
          ];
        }

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    addBookmark: (storyId: string, pageNumber: number) =>
      set((state) => {
        const progress = state.progress.find((p) => p.storyId === storyId);
        if (!progress) return state;

        const newProgress = state.progress.map((p) =>
          p.storyId === storyId
            ? {
                ...p,
                bookmarks: [...new Set([...p.bookmarks, pageNumber])],
              }
            : p
        );

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    removeBookmark: (storyId: string, pageNumber: number) =>
      set((state) => {
        const progress = state.progress.find((p) => p.storyId === storyId);
        if (!progress) return state;

        const newProgress = state.progress.map((p) =>
          p.storyId === storyId
            ? {
                ...p,
                bookmarks: p.bookmarks.filter((b) => b !== pageNumber),
              }
            : p
        );

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    addNote: (storyId: string, note: Omit<StoryNote, 'id' | 'createdAt'>) =>
      set((state) => {
        const progress = state.progress.find((p) => p.storyId === storyId);
        if (!progress) return state;

        const newNote: StoryNote = {
          id: Date.now().toString(),
          createdAt: new Date(),
          ...note,
        };

        const newProgress = state.progress.map((p) =>
          p.storyId === storyId
            ? {
                ...p,
                notes: [...p.notes, newNote],
              }
            : p
        );

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    removeNote: (storyId: string, noteId: string) =>
      set((state) => {
        const progress = state.progress.find((p) => p.storyId === storyId);
        if (!progress) return state;

        const newProgress = state.progress.map((p) =>
          p.storyId === storyId
            ? {
                ...p,
                notes: p.notes.filter((n) => n.id !== noteId),
              }
            : p
        );

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    updateSettings: (settings: Partial<BedtimeSettings>) =>
      set((state) => {
        const newSettings = { ...state.settings, ...settings };
        AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
        return { settings: newSettings };
      }),

    updateNarrationSettings: async (settings: Partial<VoiceNarrationSettings>) => {
      try {
        set({ isLoading: true, error: null });
        const currentSettings = get().narrationSettings;
        const updatedSettings = { ...currentSettings, ...settings };
        await AsyncStorage.setItem(STORAGE_KEYS.NARRATION, JSON.stringify(updatedSettings));
        set({ narrationSettings: updatedSettings, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to update narration settings', isLoading: false });
      }
    },

    updateNotificationSettings: async (settings: NotificationSettings) => {
      try {
        set({ isLoading: true, error: null });
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
        set({ notificationSettings: settings, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to update notification settings', isLoading: false });
      }
    },

    updateAchievementNotifications: async (enabled: boolean) => {
      try {
        set({ isLoading: true, error: null });
        const settings = get().notificationSettings;
        const updatedSettings = {
          ...settings,
          achievements: { ...settings.achievements, enabled },
        };
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedSettings));
        set({ notificationSettings: updatedSettings, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to update achievement notifications', isLoading: false });
      }
    },

    updateSocialNotifications: async (enabled: boolean) => {
      try {
        set({ isLoading: true, error: null });
        const settings = get().notificationSettings;
        const updatedSettings = {
          ...settings,
          socialUpdates: { ...settings.socialUpdates, enabled },
        };
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedSettings));
        set({ notificationSettings: updatedSettings, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to update social notifications', isLoading: false });
      }
    },

    updateParentControls: async (controls: Partial<ParentControls>) => {
      try {
        set({ isLoading: true, error: null });
        const currentControls = get().parentControls;
        const updatedControls = { ...currentControls, ...controls };
        await AsyncStorage.setItem(STORAGE_KEYS.CONTROLS, JSON.stringify(updatedControls));
        set({ parentControls: updatedControls, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to update parent controls', isLoading: false });
      }
    },

    incrementTimeSpent: (storyId: string, seconds: number) =>
      set((state) => {
        const progress = state.progress.find((p) => p.storyId === storyId);
        if (!progress) return state;

        const newProgress = state.progress.map((p) =>
          p.storyId === storyId
            ? {
                ...p,
                timeSpent: p.timeSpent + seconds,
              }
            : p
        );

        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return { progress: newProgress };
      }),

    reset: () => {
      Object.values(STORAGE_KEYS).forEach((key) => AsyncStorage.removeItem(key));
      set(initialState);
    },
  };
}); 