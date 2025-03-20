import { create } from 'zustand';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoiceInputState, VoiceInputCallbacks, SpeechResultsEvent, SpeechErrorEvent } from '../types/audio';

const STORAGE_KEY = '@voice_settings';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useVoiceInputStore = create<VoiceInputState & {
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  setCallbacks: (callbacks: VoiceInputCallbacks) => void;
  setLocale: (locale: string) => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  clearError: () => void;
}>((set, get) => {
  let callbacks: VoiceInputCallbacks = {};

  const handleError = (error: string) => {
    set({ error, isListening: false, isLoading: false });
    callbacks.onError?.(error);
  };

  return {
    isListening: false,
    results: [],
    partialResults: [],
    error: null,
    isAvailable: false,
    isLoading: false,
    locale: 'en-US',

    startListening: async () => {
      try {
        set({ isLoading: true, error: null });

        if (!get().isAvailable) {
          throw new Error('Voice recognition is not available');
        }

        let retries = 0;
        while (retries < MAX_RETRIES) {
          try {
            await Voice.start(get().locale);
            set({ isListening: true, isLoading: false });
            callbacks.onStart?.();
            break;
          } catch (error) {
            retries++;
            if (retries === MAX_RETRIES) {
              throw error;
            }
            await delay(RETRY_DELAY);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to start voice recognition';
        handleError(errorMessage);
      }
    },

    stopListening: async () => {
      try {
        if (get().isListening) {
          await Voice.stop();
          set({ isListening: false });
          callbacks.onEnd?.();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to stop voice recognition';
        handleError(errorMessage);
      }
    },

    setCallbacks: (newCallbacks: VoiceInputCallbacks) => {
      callbacks = newCallbacks;
    },

    setLocale: async (locale: string) => {
      try {
        set({ locale });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ locale }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save locale setting';
        handleError(errorMessage);
      }
    },

    initialize: async () => {
      try {
        set({ isLoading: true, error: null });

        // Check if voice recognition is available
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          throw new Error('Voice recognition is not available on this device');
        }

        // Set up event listeners
        Voice.onSpeechStart = () => {
          set({ isListening: true });
          callbacks.onStart?.();
        };

        Voice.onSpeechEnd = () => {
          set({ isListening: false });
          callbacks.onEnd?.();
        };

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value) {
            set({ results: e.value });
            callbacks.onResults?.(e.value);
          }
        };

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value) {
            set({ partialResults: e.value });
            callbacks.onPartialResults?.(e.value);
          }
        };

        Voice.onSpeechError = (e: SpeechErrorEvent) => {
          const errorMessage = e.error?.message || 'Unknown voice recognition error';
          handleError(errorMessage);
        };

        // Load saved settings
        const settings = await AsyncStorage.getItem(STORAGE_KEY);
        if (settings) {
          const { locale } = JSON.parse(settings);
          if (locale) {
            set({ locale });
          }
        }

        set({ isAvailable: true, isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize voice input';
        handleError(errorMessage);
      }
    },

    cleanup: async () => {
      try {
        // Remove event listeners
        Voice.onSpeechStart = null;
        Voice.onSpeechEnd = null;
        Voice.onSpeechResults = null;
        Voice.onSpeechError = null;

        // Stop listening if active
        if (get().isListening) {
          await Voice.stop();
        }

        // Destroy voice instance
        await Voice.destroy();

        // Reset state
        set({
          isListening: false,
          results: [],
          partialResults: [],
          error: null,
          isAvailable: false,
          isLoading: false,
          locale: 'en-US',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup voice input';
        handleError(errorMessage);
      }
    },

    clearError: () => {
      set({ error: null });
    },
  };
});

export default useVoiceInputStore; 