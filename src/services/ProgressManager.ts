import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Challenge, ChallengeProgress } from '../types/challenges';

interface ProgressState {
  userProgress: Map<string, ChallengeProgress>;
  isLoading: boolean;
  error: string | null;
  dailyStreak: number;
  lastCompletedDate: string | null;
  totalXP: number;
  updateProgress: (challengeId: string, score: number) => Promise<void>;
  loadProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEYS = {
  PROGRESS: '@progress',
  STREAK: '@streak',
  LAST_COMPLETED: '@lastCompleted',
  TOTAL_XP: '@totalXP',
};

const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
    throw new Error(`Failed to save ${key} to storage`);
  }
};

const loadFromStorage = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error);
    throw new Error(`Failed to load ${key} from storage`);
  }
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  userProgress: new Map(),
  isLoading: false,
  error: null,
  dailyStreak: 0,
  lastCompletedDate: null,
  totalXP: 0,

  updateProgress: async (challengeId: string, score: number) => {
    try {
      set({ isLoading: true, error: null });

      const { userProgress, dailyStreak, lastCompletedDate, totalXP } = get();
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Update challenge progress
      const progress: ChallengeProgress = {
        userId: 'current_user', // Replace with actual user ID
        challengeId,
        startedAt: now.toISOString(),
        completedAt: now.toISOString(),
        attempts: 1,
        score,
      };

      const updatedProgress = new Map(userProgress);
      updatedProgress.set(challengeId, progress);

      // Update streak
      let newStreak = dailyStreak;
      if (lastCompletedDate !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastCompletedDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      // Update total XP
      const newTotalXP = totalXP + score;

      // Save all updates to storage
      await Promise.all([
        saveToStorage(STORAGE_KEYS.PROGRESS, Array.from(updatedProgress.entries())),
        saveToStorage(STORAGE_KEYS.STREAK, newStreak),
        saveToStorage(STORAGE_KEYS.LAST_COMPLETED, today),
        saveToStorage(STORAGE_KEYS.TOTAL_XP, newTotalXP),
      ]);

      // Update state
      set({
        userProgress: updatedProgress,
        dailyStreak: newStreak,
        lastCompletedDate: today,
        totalXP: newTotalXP,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update progress';
      set({ error: errorMessage, isLoading: false });
      console.error('Error updating progress:', error);
    }
  },

  loadProgress: async () => {
    try {
      set({ isLoading: true, error: null });

      const [progressData, streak, lastCompleted, totalXP] = await Promise.all([
        loadFromStorage(STORAGE_KEYS.PROGRESS),
        loadFromStorage(STORAGE_KEYS.STREAK),
        loadFromStorage(STORAGE_KEYS.LAST_COMPLETED),
        loadFromStorage(STORAGE_KEYS.TOTAL_XP),
      ]);

      // Convert progress array back to Map with proper typing
      const progressMap = new Map<string, ChallengeProgress>(
        (progressData || []) as [string, ChallengeProgress][]
      );

      set({
        userProgress: progressMap,
        dailyStreak: streak || 0,
        lastCompletedDate: lastCompleted || null,
        totalXP: totalXP || 0,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load progress';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading progress:', error);
    }
  },

  resetProgress: async () => {
    try {
      set({ isLoading: true, error: null });

      // Clear all storage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.removeItem(STORAGE_KEYS.STREAK),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_COMPLETED),
        AsyncStorage.removeItem(STORAGE_KEYS.TOTAL_XP),
      ]);

      // Reset state
      set({
        userProgress: new Map(),
        dailyStreak: 0,
        lastCompletedDate: null,
        totalXP: 0,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset progress';
      set({ error: errorMessage, isLoading: false });
      console.error('Error resetting progress:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useProgressStore; 