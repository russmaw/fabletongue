import { useEffect, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import useBackgroundMusic from '../services/BackgroundMusic';
import useSoundEffects from '../services/SoundEffects';
import useAmbientSounds from '../services/AmbientSounds';
import { useNetworkStore } from '../services/NetworkService';

interface AudioSystemState {
  isInitialized: boolean;
  error: string | null;
  isLoading: boolean;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useAudioSystem = () => {
  const [state, setState] = useState<AudioSystemState>({
    isInitialized: false,
    error: null,
    isLoading: true,
    retryCount: 0,
  });

  const backgroundMusic = useBackgroundMusic();
  const soundEffects = useSoundEffects();
  const ambientSounds = useAmbientSounds();
  const { isConnected } = useNetworkStore();

  const initializeAudio = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Initialize audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Pre-load critical sound effects
      await Promise.all([
        soundEffects.preloadCriticalSounds(),
        backgroundMusic.preloadCommonTracks(),
      ]);

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Audio initialization failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize audio system',
        retryCount: prev.retryCount + 1,
      }));

      // Retry initialization if under max retries
      if (state.retryCount < MAX_RETRIES) {
        setTimeout(() => {
          initializeAudio();
        }, RETRY_DELAY);
      }
    }
  }, []);

  const cleanup = useCallback(() => {
    try {
      backgroundMusic.cleanup();
      soundEffects.cleanup();
      ambientSounds.cleanup();
    } catch (error) {
      console.error('Audio cleanup failed:', error);
    }
  }, []);

  useEffect(() => {
    initializeAudio();
    return cleanup;
  }, []);

  // Handle network state changes
  useEffect(() => {
    if (!isConnected) {
      // Pause all audio when offline
      try {
        backgroundMusic.stopTrack();
        ambientSounds.stopAllSounds();
      } catch (error) {
        console.error('Failed to pause audio on network disconnect:', error);
      }
    } else if (state.isInitialized) {
      // Resume audio when back online (if it was playing before)
      try {
        backgroundMusic.resumeLastTrack();
        ambientSounds.resumeLastSounds();
      } catch (error) {
        console.error('Failed to resume audio on network reconnect:', error);
      }
    }
  }, [isConnected]);

  const reinitialize = useCallback(async () => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    await cleanup();
    await initializeAudio();
  }, []);

  return {
    ...state,
    reinitialize,
    cleanup,
  };
};

export default useAudioSystem; 