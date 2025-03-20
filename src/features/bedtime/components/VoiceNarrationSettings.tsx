import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { VoiceNarrationSettings as NarrationSettings } from '../types';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface VoiceNarrationSettingsProps {
  onClose?: () => void;
}

export const VoiceNarrationSettings: React.FC<VoiceNarrationSettingsProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const narrationSettings = useBedtimeStore(state => state.narrationSettings);
  const updateNarrationSettings = useBedtimeStore(state => state.updateNarrationSettings);

  const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.l,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.s,
    },
    section: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    value: {
      fontSize: 14,
      color: theme.colors.primary,
      marginHorizontal: theme.spacing.s,
    },
    sliderContainer: {
      marginVertical: theme.spacing.m,
    },
    sliderTrack: {
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginBottom: theme.spacing.s,
    },
    sliderFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    voiceOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    voiceLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    testButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 12,
      marginVertical: theme.spacing.m,
    },
    testingIndicator: {
      backgroundColor: theme.colors.primaryLight,
    },
    testButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.s,
    },
  });

  React.useEffect(() => {
    loadAvailableVoices();
  }, []);

  const loadAvailableVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableVoices(voices.filter(voice => voice.language.startsWith('en')));
    } catch (error) {
      console.error('Failed to load voices:', error);
      Alert.alert('Error', 'Failed to load available voices');
    }
  };

  const handleVoiceTest = async () => {
    if (isTestingVoice) return;

    try {
      setIsTestingVoice(true);
      const testText = 'Once upon a time, in a magical forest...';
      
      await Speech.speak(testText, {
        language: narrationSettings.voicePreference || 'en-US',
        pitch: narrationSettings.pitch || 1,
        rate: narrationSettings.speed || 1,
        onDone: () => setIsTestingVoice(false),
        onError: () => {
          setIsTestingVoice(false);
          Alert.alert('Error', 'Failed to test voice narration');
        },
      });
    } catch (error) {
      console.error('Voice test error:', error);
      setIsTestingVoice(false);
      Alert.alert('Error', 'Failed to test voice narration');
    }
  };

  const handleVoiceChange = async (voice: string) => {
    await updateNarrationSettings({ voice });
  };

  const handleSpeedChange = async (speed: number) => {
    await updateNarrationSettings({ speed });
  };

  const handlePitchChange = async (pitch: number) => {
    await updateNarrationSettings({ pitch });
  };

  const handleToggleNarration = async (enabled: boolean) => {
    await updateNarrationSettings({ enabled });
  };

  const testVoice = async () => {
    if (isTestingVoice) return;

    const testText = "This is a test of the voice narration settings.";
    setIsTestingVoice(true);

    try {
      await Speech.speak(testText, {
        language: narrationSettings.voice,
        pitch: narrationSettings.pitch,
        rate: narrationSettings.speed,
        onDone: () => setIsTestingVoice(false),
        onError: () => {
          setIsTestingVoice(false);
          Alert.alert(
            "Error",
            "Failed to test voice narration. Please try again."
          );
        },
      });
    } catch (error) {
      setIsTestingVoice(false);
      Alert.alert(
        "Error",
        "Failed to test voice narration. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Narration</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Enable Voice Narration</Text>
            <Switch
              value={narrationSettings.enabled || false}
              onValueChange={(value) => handleToggleNarration(value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : theme.colors.white}
            />
          </View>
        </View>

        {narrationSettings.enabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Settings</Text>
              
              <Text style={styles.label}>Speed</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill,
                      { 
                        width: `${((narrationSettings.speed || 1) - 0.5) / 1.5 * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      const currentSpeed = narrationSettings.speed || 1;
                      if (currentSpeed > 0.5) {
                        handleSpeedChange(Math.max(0.5, currentSpeed - 0.1));
                      }
                    }}
                  >
                    <Text style={styles.value}>Slower</Text>
                  </TouchableOpacity>
                  <Text style={styles.value}>
                    {(narrationSettings.speed || 1).toFixed(1)}x
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const currentSpeed = narrationSettings.speed || 1;
                      if (currentSpeed < 2) {
                        handleSpeedChange(Math.min(2, currentSpeed + 0.1));
                      }
                    }}
                  >
                    <Text style={styles.value}>Faster</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.label}>Pitch</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill,
                      { 
                        width: `${((narrationSettings.pitch || 1) - 0.5) / 1.5 * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      const currentPitch = narrationSettings.pitch || 1;
                      if (currentPitch > 0.5) {
                        handlePitchChange(Math.max(0.5, currentPitch - 0.1));
                      }
                    }}
                  >
                    <Text style={styles.value}>Lower</Text>
                  </TouchableOpacity>
                  <Text style={styles.value}>
                    {(narrationSettings.pitch || 1).toFixed(1)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const currentPitch = narrationSettings.pitch || 1;
                      if (currentPitch < 2) {
                        handlePitchChange(Math.min(2, currentPitch + 0.1));
                      }
                    }}
                  >
                    <Text style={styles.value}>Higher</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Selection</Text>
              {availableVoices.map((voice) => (
                <TouchableOpacity
                  key={voice.identifier}
                  style={styles.voiceOption}
                  onPress={() => handleSettingChange({ voice: voice.identifier })}
                >
                  <Text style={styles.voiceLabel}>{voice.name}</Text>
                  {settings.narrationSettings?.voice === voice.identifier && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.testButton,
                isTestingVoice && styles.testingIndicator,
              ]}
              onPress={handleVoiceTest}
              disabled={isTestingVoice}
            >
              <Ionicons
                name={isTestingVoice ? 'volume-high' : 'play'}
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.testButtonText}>
                {isTestingVoice ? 'Testing Voice...' : 'Test Voice'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}; 