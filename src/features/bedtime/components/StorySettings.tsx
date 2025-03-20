import React from 'react';
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { BedtimeSettings } from '../types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface StorySettingsProps {
  onClose?: () => void;
}

export const StorySettings: React.FC<StorySettingsProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const { settings, updateSettings } = store;

  const handleVoicePreferenceChange = (preference: BedtimeSettings['voicePreference']) => {
    updateSettings({ voicePreference: preference });
  };

  const handleReadingSpeedChange = (speed: BedtimeSettings['readingSpeed']) => {
    updateSettings({ readingSpeed: speed });
  };

  const handleReminderTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      updateSettings({ reminderTime: date });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background,
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
      marginBottom: theme.spacing.l,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    optionsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.xs,
    },
    option: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: 6,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    optionTextSelected: {
      color: theme.colors.white,
    },
    reminderContainer: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.m,
    },
    reminderText: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.s,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Story Settings</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Background Music</Text>
          <Switch
            value={settings.includeMusic}
            onValueChange={(value) => updateSettings({ includeMusic: value })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ambient Sounds</Text>
          <Switch
            value={settings.includeAmbientSounds}
            onValueChange={(value) => updateSettings({ includeAmbientSounds: value })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Auto-play Next Story</Text>
          <Switch
            value={settings.autoPlayNext}
            onValueChange={(value) => updateSettings({ autoPlayNext: value })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Narration</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Voice Preference</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                settings.voicePreference === 'male' && styles.optionSelected,
              ]}
              onPress={() => handleVoicePreferenceChange('male')}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.voicePreference === 'male' && styles.optionTextSelected,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                settings.voicePreference === 'female' && styles.optionSelected,
              ]}
              onPress={() => handleVoicePreferenceChange('female')}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.voicePreference === 'female' && styles.optionTextSelected,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reading Speed</Text>
          <View style={styles.optionsContainer}>
            {(['slow', 'normal', 'fast'] as const).map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.option,
                  settings.readingSpeed === speed && styles.optionSelected,
                ]}
                onPress={() => handleReadingSpeedChange(speed)}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.readingSpeed === speed && styles.optionTextSelected,
                  ]}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <View style={styles.reminderContainer}>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={settings.reminderTime || new Date()}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleReminderTimeChange}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                // On Android, you would typically show a modal with the time picker
                // This is just a placeholder
                console.log('Show Android time picker');
              }}
            >
              <Text style={styles.label}>
                Set Reminder Time
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.reminderText}>
            We'll remind you when it's time for your bedtime story!
          </Text>
        </View>
      </View>
    </View>
  );
}; 