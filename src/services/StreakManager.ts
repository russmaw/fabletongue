import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface StreakState {
  currentStreak: number;
  lastPracticeDate: string | null;
  longestStreak: number;
  updateStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  loadStreak: () => Promise<void>;
}

const useStreakStore = create<StreakState>((set, get) => ({
  currentStreak: 0,
  lastPracticeDate: null,
  longestStreak: 0,

  updateStreak: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { currentStreak, lastPracticeDate, longestStreak } = get();

    let newStreak = currentStreak;
    let newLongestStreak = longestStreak;

    if (!lastPracticeDate) {
      // First practice
      newStreak = 1;
    } else {
      const lastDate = new Date(lastPracticeDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastPracticeDate === today) {
        // Already practiced today
        return;
      } else if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        // Practiced yesterday
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    // Update longest streak if current streak is longer
    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak;
    }

    // Save to state and storage
    const updates = {
      currentStreak: newStreak,
      lastPracticeDate: today,
      longestStreak: newLongestStreak,
    };

    set(updates);
    await AsyncStorage.setItem('streak', JSON.stringify(updates));
  },

  resetStreak: async () => {
    const updates = {
      currentStreak: 0,
      lastPracticeDate: null,
      longestStreak: get().longestStreak, // Keep longest streak record
    };

    set(updates);
    await AsyncStorage.setItem('streak', JSON.stringify(updates));
  },

  loadStreak: async () => {
    try {
      const stored = await AsyncStorage.getItem('streak');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check if streak is still valid
        if (data.lastPracticeDate) {
          const lastDate = new Date(data.lastPracticeDate);
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          
          if (lastDate < twoDaysAgo) {
            // Streak expired (no practice for 2+ days)
            await get().resetStreak();
            return;
          }
        }
        
        set(data);
      }
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  },
}));

export const initializeStreak = async () => {
  const store = useStreakStore.getState();
  await store.loadStreak();
};

export default useStreakStore; 