import { initializeChallenges } from './ChallengeManager';
import { initializeProgress } from './ProgressManager';
import { initializeStreak } from './StreakManager';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface InitializationError {
  system: string;
  error: Error;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const initializeAudioSystem = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  } catch (error) {
    throw new Error(`Audio system initialization failed: ${error.message}`);
  }
};

const retryWithDelay = async (
  fn: () => Promise<void>,
  system: string,
  retries = MAX_RETRIES
): Promise<void> => {
  try {
    await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying ${system} initialization... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryWithDelay(fn, system, retries - 1);
    }
    throw new Error(`${system} initialization failed after ${MAX_RETRIES} attempts`);
  }
};

const clearStorageIfCorrupted = async () => {
  try {
    await AsyncStorage.getAllKeys();
  } catch (error) {
    console.warn('Storage appears to be corrupted, clearing...');
    await AsyncStorage.clear();
  }
};

export const initializeApp = async () => {
  const errors: InitializationError[] = [];
  
  // First, check and fix storage if needed
  await clearStorageIfCorrupted();

  // Initialize critical systems first
  try {
    await retryWithDelay(initializeAudioSystem, 'Audio System');
  } catch (error) {
    errors.push({ system: 'Audio', error });
    // Audio is critical, throw error
    throw new Error('Failed to initialize audio system. Please restart the app.');
  }

  // Initialize other systems with individual error handling
  const systems = [
    { name: 'Challenges', init: initializeChallenges },
    { name: 'Progress', init: initializeProgress },
    { name: 'Streak', init: initializeStreak },
  ];

  await Promise.all(
    systems.map(async ({ name, init }) => {
      try {
        await retryWithDelay(init, name);
      } catch (error) {
        errors.push({ system: name, error });
        console.error(`${name} initialization failed:`, error);
      }
    })
  );

  // Log initialization status
  if (errors.length > 0) {
    console.error('App initialized with errors:', errors);
    // If critical systems failed, throw error
    if (errors.some(e => e.system === 'Progress')) {
      throw new Error('Failed to initialize core systems. Please restart the app.');
    }
  } else {
    console.log('App initialization complete');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}; 