import { Audio } from 'expo-av';
import useSoundEffects from './SoundEffects';
import useBackgroundMusic from './BackgroundMusic';

class AudioInitialization {
  private static instance: AudioInitialization;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AudioInitialization {
    if (!AudioInitialization.instance) {
      AudioInitialization.instance = new AudioInitialization();
    }
    return AudioInitialization.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Initialize sound effects
      const soundEffects = useSoundEffects.getState();
      await soundEffects.loadSounds();

      // Initialize background music
      const backgroundMusic = useBackgroundMusic.getState();
      await backgroundMusic.loadMusic();

      this.isInitialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Error initializing audio system:', error);
      throw error;
    }
  }

  async cleanup() {
    if (!this.isInitialized) return;

    try {
      // Cleanup sound effects
      const soundEffects = useSoundEffects.getState();
      await soundEffects.cleanup();

      // Cleanup background music
      const backgroundMusic = useBackgroundMusic.getState();
      await backgroundMusic.cleanup();

      this.isInitialized = false;
      console.log('Audio system cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up audio system:', error);
      throw error;
    }
  }
}

export default AudioInitialization; 