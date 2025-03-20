import { useState, useEffect, useCallback } from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { Platform } from 'react-native';
import useSoundEffects from '../services/SoundEffects';

interface VoiceState {
  isListening: boolean;
  results: string[];
  partialResults: string[];
  error: string | null;
}

interface VoiceOptions {
  continuous?: boolean;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceInput = (options: VoiceOptions = {}) => {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    results: [],
    partialResults: [],
    error: null,
  });

  const { playSound } = useSoundEffects();

  const onSpeechResults = useCallback(
    (event: SpeechResultsEvent) => {
      const results = event.value ?? [];
      setState(prev => ({ ...prev, results }));
      
      if (results.length > 0 && options.onResult) {
        options.onResult(results[0]);
      }
    },
    [options.onResult]
  );

  const onSpeechPartialResults = useCallback((event: SpeechResultsEvent) => {
    setState(prev => ({
      ...prev,
      partialResults: event.value ?? [],
    }));
  }, []);

  const onSpeechError = useCallback(
    (event: SpeechErrorEvent) => {
      const error = event.error?.message || 'Unknown error';
      setState(prev => ({ ...prev, error, isListening: false }));
      
      if (options.onError) {
        options.onError(error);
      }
    },
    [options.onError]
  );

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSpeechResults, onSpeechPartialResults, onSpeechError]);

  const startListening = async () => {
    try {
      await Voice.isAvailable();
      
      // Configure voice recognition based on platform
      if (Platform.OS === 'ios') {
        await Voice.start('en-US');
      } else {
        await Voice.start('en-US', {
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 1000,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1500,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        });
      }

      setState(prev => ({ ...prev, isListening: true, error: null }));
      await playSound('click');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error starting voice recognition',
        isListening: false,
      }));
      
      if (options.onError) {
        options.onError('Error starting voice recognition');
      }
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setState(prev => ({ ...prev, isListening: false }));
      await playSound('click');
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const cancelListening = async () => {
    try {
      await Voice.cancel();
      setState(prev => ({
        ...prev,
        isListening: false,
        results: [],
        partialResults: [],
      }));
    } catch (error) {
      console.error('Error canceling voice recognition:', error);
    }
  };

  const resetState = () => {
    setState({
      isListening: false,
      results: [],
      partialResults: [],
      error: null,
    });
  };

  return {
    ...state,
    startListening,
    stopListening,
    cancelListening,
    resetState,
  };
};

export default useVoiceInput; 