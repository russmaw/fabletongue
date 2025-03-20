import { useCallback, useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { useBedtimeStore } from './store';

interface VoiceNarrationHook {
  isNarrating: boolean;
  isPaused: boolean;
  startNarration: (text: string) => Promise<void>;
  pauseNarration: () => Promise<void>;
  resumeNarration: () => Promise<void>;
  stopNarration: () => Promise<void>;
  setVoice: (voice: string) => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  setPitch: (pitch: number) => Promise<void>;
  getAvailableVoices: () => Promise<Speech.Voice[]>;
}

export const useVoiceNarration = (): VoiceNarrationHook => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>('');
  const { narrationSettings, updateNarrationSettings } = useBedtimeStore();

  useEffect(() => {
    return () => {
      // Cleanup narration when component unmounts
      Speech.stop();
    };
  }, []);

  const startNarration = useCallback(async (text: string) => {
    if (!narrationSettings.enabled) return;

    try {
      await Speech.stop();
      setCurrentText(text);
      setIsNarrating(true);
      setIsPaused(false);

      await Speech.speak(text, {
        voice: narrationSettings.voice,
        rate: narrationSettings.speed,
        pitch: narrationSettings.pitch,
        onDone: () => {
          setIsNarrating(false);
          setIsPaused(false);
        },
        onError: (error: Error) => {
          console.error('Narration error:', error);
          setIsNarrating(false);
          setIsPaused(false);
        },
      });
    } catch (error: unknown) {
      console.error('Failed to start narration:', error);
      setIsNarrating(false);
    }
  }, [narrationSettings]);

  const pauseNarration = useCallback(async () => {
    try {
      await Speech.pause();
      setIsPaused(true);
    } catch (error: unknown) {
      console.error('Failed to pause narration:', error);
    }
  }, []);

  const resumeNarration = useCallback(async () => {
    try {
      await Speech.resume();
      setIsPaused(false);
    } catch (error: unknown) {
      console.error('Failed to resume narration:', error);
    }
  }, []);

  const stopNarration = useCallback(async () => {
    try {
      await Speech.stop();
      setIsNarrating(false);
      setIsPaused(false);
    } catch (error: unknown) {
      console.error('Failed to stop narration:', error);
    }
  }, []);

  const setVoice = useCallback(async (voice: string) => {
    try {
      await updateNarrationSettings({ voice });
      if (isNarrating && !isPaused) {
        // Restart narration with new voice
        await startNarration(currentText);
      }
    } catch (error: unknown) {
      console.error('Failed to set voice:', error);
    }
  }, [isNarrating, isPaused, currentText, updateNarrationSettings]);

  const setSpeed = useCallback(async (speed: number) => {
    try {
      await updateNarrationSettings({ speed });
      if (isNarrating && !isPaused) {
        // Restart narration with new speed
        await startNarration(currentText);
      }
    } catch (error: unknown) {
      console.error('Failed to set speed:', error);
    }
  }, [isNarrating, isPaused, currentText, updateNarrationSettings]);

  const setPitch = useCallback(async (pitch: number) => {
    try {
      await updateNarrationSettings({ pitch });
      if (isNarrating && !isPaused) {
        // Restart narration with new pitch
        await startNarration(currentText);
      }
    } catch (error: unknown) {
      console.error('Failed to set pitch:', error);
    }
  }, [isNarrating, isPaused, currentText, updateNarrationSettings]);

  const getAvailableVoices = useCallback(async () => {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error: unknown) {
      console.error('Failed to get available voices:', error);
      return [];
    }
  }, []);

  return {
    isNarrating,
    isPaused,
    startNarration,
    pauseNarration,
    resumeNarration,
    stopNarration,
    setVoice,
    setSpeed,
    setPitch,
    getAvailableVoices,
  };
}; 