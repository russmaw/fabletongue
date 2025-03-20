import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Text from '../Text';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-community/voice';
import { Ionicons } from '@expo/vector-icons';
import { VoiceInputCallbacks } from '../../types/audio';

interface VoiceInputProps extends VoiceInputCallbacks {
  size?: number;
  showText?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onError,
  size = 60,
  showText = true,
}) => {
  const theme = useTheme<Theme>();
  const [isListening, setIsListening] = useState(false);
  const [partialResults, setPartialResults] = useState<string[]>([]);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setPartialResults([]);
        onResult?.(text);
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setPartialResults(e.value);
      }
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsListening(false);
      onError?.(e.error?.message || 'Unknown error');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setPartialResults([]);
        await Voice.start('en-US');
      }
    } catch (error) {
      onError?.('Failed to start voice recognition');
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: isListening ? theme.colors.primary : theme.colors.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.medium,
    },
    text: {
      marginTop: theme.spacing.s,
      color: theme.colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={toggleListening}
      activeOpacity={0.7}
    >
      <View style={styles.button}>
        {isListening ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Ionicons
            name="mic"
            size={size * 0.5}
            color={theme.colors.text}
          />
        )}
      </View>
      {showText && (
        <Text style={styles.text}>
          {isListening
            ? partialResults.length > 0
              ? partialResults[0]
              : 'Listening...'
            : 'Tap to speak'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default VoiceInput; 