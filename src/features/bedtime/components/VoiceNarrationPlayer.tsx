import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useBedtimeStore } from '../store';
import { FeedbackOverlay } from '../../../components/FeedbackOverlay';

interface VoiceNarrationPlayerProps {
  text: string;
  onPlaybackStart?: () => void;
  onPlaybackComplete?: () => void;
}

export const VoiceNarrationPlayer: React.FC<VoiceNarrationPlayerProps> = ({
  text,
  onPlaybackStart,
  onPlaybackComplete,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [availableVoices, setAvailableVoices] = React.useState<Speech.Voice[]>([]);
  const [currentVoice, setCurrentVoice] = React.useState<Speech.Voice | null>(null);
  const [rate, setRate] = React.useState(0.8);
  const [pitch, setPitch] = React.useState(1.0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadVoices();
    return () => {
      Speech.stop();
    };
  }, []);

  const loadVoices = async () => {
    try {
      setIsLoading(true);
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices);
      // Set default voice based on device language
      const deviceLanguage = Platform.OS === 'ios' ? 
        voices.find(v => v.language === 'en-US') : 
        voices.find(v => v.identifier === 'en-us-x-sfg#female_1-local');
      setCurrentVoice(deviceLanguage || voices[0]);
    } catch (err) {
      setError('Failed to load voices');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    try {
      if (isPaused) {
        await Speech.resume();
        setIsPaused(false);
      } else {
        onPlaybackStart?.();
        await Speech.speak(text, {
          voice: currentVoice?.identifier,
          rate,
          pitch,
          onStart: () => setIsPlaying(true),
          onDone: () => {
            setIsPlaying(false);
            onPlaybackComplete?.();
          },
          onStopped: () => setIsPlaying(false),
          onError: () => {
            setIsPlaying(false);
            setError('Playback failed');
          },
        });
      }
    } catch (err) {
      setError('Failed to start playback');
    }
  };

  const handlePause = async () => {
    try {
      await Speech.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } catch (err) {
      setError('Failed to pause playback');
    }
  };

  const handleStop = async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
      setIsPaused(false);
    } catch (err) {
      setError('Failed to stop playback');
    }
  };

  const adjustRate = (increment: boolean) => {
    setRate(prev => {
      const newRate = increment ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newRate, 0.5), 2.0);
    });
  };

  const adjustPitch = (increment: boolean) => {
    setPitch(prev => {
      const newPitch = increment ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newPitch, 0.5), 2.0);
    });
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    playButton: {
      backgroundColor: theme.colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: theme.spacing.m,
    },
    controlButton: {
      backgroundColor: theme.colors.primaryLight,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    adjustmentContainer: {
      marginBottom: theme.spacing.s,
    },
    adjustmentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    label: {
      color: theme.colors.textMuted,
      fontSize: 14,
      flex: 1,
    },
    value: {
      color: theme.colors.text,
      fontSize: 14,
      marginHorizontal: theme.spacing.s,
      minWidth: 40,
      textAlign: 'center',
    },
    adjustButton: {
      backgroundColor: theme.colors.primaryLight,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleStop}
            disabled={!isPlaying && !isPaused}
          >
            <Ionicons
              name="stop"
              size={24}
              color={!isPlaying && !isPaused ? theme.colors.textMuted : theme.colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? handlePause : handlePlay}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.adjustmentContainer}>
          <View style={styles.adjustmentRow}>
            <Text style={styles.label}>Speed</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustRate(false)}
              disabled={rate <= 0.5}
            >
              <Ionicons
                name="remove"
                size={20}
                color={rate <= 0.5 ? theme.colors.textMuted : theme.colors.white}
              />
            </TouchableOpacity>
            <Text style={styles.value}>{rate.toFixed(1)}x</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustRate(true)}
              disabled={rate >= 2.0}
            >
              <Ionicons
                name="add"
                size={20}
                color={rate >= 2.0 ? theme.colors.textMuted : theme.colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.adjustmentRow}>
            <Text style={styles.label}>Pitch</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustPitch(false)}
              disabled={pitch <= 0.5}
            >
              <Ionicons
                name="remove"
                size={20}
                color={pitch <= 0.5 ? theme.colors.textMuted : theme.colors.white}
              />
            </TouchableOpacity>
            <Text style={styles.value}>{pitch.toFixed(1)}x</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustPitch(true)}
              disabled={pitch >= 2.0}
            >
              <Ionicons
                name="add"
                size={20}
                color={pitch >= 2.0 ? theme.colors.textMuted : theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FeedbackOverlay
        visible={isLoading}
        type="loading"
        message="Loading voices..."
      />
      <FeedbackOverlay
        visible={!!error}
        type="error"
        message={error || ''}
        onDismiss={() => setError(null)}
      />
    </>
  );
}; 