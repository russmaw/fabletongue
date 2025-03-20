import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Challenge } from '../types/challenges';

interface ChallengeState {
  currentChallenge: Challenge | null;
  challengeHistory: Challenge[];
  isLoading: boolean;
  error: string | null;
  setCurrentChallenge: (challenge: Challenge) => void;
  completeChallenge: (challengeId: string) => Promise<void>;
  generateNewChallenge: () => Promise<Challenge>;
  loadChallenges: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = '@challenges';
const MAX_HISTORY = 50; // Maximum number of challenges to keep in history

const saveChallenges = async (challenges: Challenge[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
  } catch (error) {
    console.error('Failed to save challenges:', error);
    throw new Error('Failed to save challenges to storage');
  }
};

const loadChallengesFromStorage = async (): Promise<Challenge[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load challenges:', error);
    throw new Error('Failed to load challenges from storage');
  }
};

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  currentChallenge: null,
  challengeHistory: [],
  isLoading: false,
  error: null,

  setCurrentChallenge: (challenge: Challenge) => {
    try {
      set({ currentChallenge: challenge, error: null });
    } catch (error) {
      set({ error: 'Failed to set current challenge' });
      console.error('Error setting current challenge:', error);
    }
  },

  completeChallenge: async (challengeId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { challengeHistory, currentChallenge } = get();
      
      if (!currentChallenge || currentChallenge.id !== challengeId) {
        throw new Error('Invalid challenge ID');
      }

      // Mark challenge as completed
      const completedChallenge = {
        ...currentChallenge,
        completedAt: new Date().toISOString(),
      };

      // Update history, keeping only the most recent challenges
      const updatedHistory = [completedChallenge, ...challengeHistory]
        .slice(0, MAX_HISTORY);

      // Save to storage
      await saveChallenges(updatedHistory);

      // Update state
      set({
        challengeHistory: updatedHistory,
        currentChallenge: null,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete challenge';
      set({ error: errorMessage, isLoading: false });
      console.error('Error completing challenge:', error);
    }
  },

  generateNewChallenge: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get completed challenges to avoid duplicates
      const { challengeHistory } = get();
      const completedIds = new Set(challengeHistory.map(c => c.id));

      // Generate challenge (implement your generation logic here)
      const newChallenge = await generateChallenge(completedIds);

      set({ 
        currentChallenge: newChallenge,
        isLoading: false,
      });

      return newChallenge;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate challenge';
      set({ error: errorMessage, isLoading: false });
      console.error('Error generating challenge:', error);
      throw error;
    }
  },

  loadChallenges: async () => {
    try {
      set({ isLoading: true, error: null });

      const challenges = await loadChallengesFromStorage();
      set({ 
        challengeHistory: challenges,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load challenges';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading challenges:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Helper function to generate a new challenge
async function generateChallenge(completedIds: Set<string>): Promise<Challenge> {
  try {
    // Implement your challenge generation logic here
    // This is a placeholder implementation
    const challenge: Challenge = {
      id: Date.now().toString(),
      type: 'translation',
      difficulty: 'medium',
      content: {
        text: 'Sample challenge text',
        translation: 'Sample translation',
      },
      points: 100,
      createdAt: new Date().toISOString(),
    };

    // Ensure no duplicate challenges
    if (completedIds.has(challenge.id)) {
      throw new Error('Duplicate challenge generated');
    }

    return challenge;
  } catch (error) {
    console.error('Error in challenge generation:', error);
    throw new Error('Failed to generate a new challenge');
  }
}

export default useChallengeStore; 