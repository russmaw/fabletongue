import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface StoryRemindersProps {
  onClose?: () => void;
}

export const StoryReminders: React.FC<StoryRemindersProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const { settings, updateSettings } = store;
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleReminderTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      updateSettings({ reminderTime: date });
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }
    } else if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
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
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.m,
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
    timeButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginRight: theme.spacing.s,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.m,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: theme.spacing.m,
      width: '80%',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.m,
    },
    modalButton: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
    },
    modalButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
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
        <View style={styles.row}>
          <Text style={styles.label}>Daily Reminder</Text>
          <Switch
            value={settings.reminderTime !== null}
            onValueChange={(value) =>
              updateSettings({ reminderTime: value ? new Date() : null })
            }
          />
        </View>

        {settings.reminderTime && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Reminder Time</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeText}>
                  {formatTime(settings.reminderTime)}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              We'll send you a gentle reminder at {formatTime(settings.reminderTime)} every day
              to help maintain a consistent bedtime routine.
            </Text>
          </>
        )}
      </View>

      {Platform.OS === 'android' && showTimePicker && (
        <Modal
          transparent
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={settings.reminderTime || new Date()}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleReminderTimeChange}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'ios' && settings.reminderTime && showTimePicker && (
        <DateTimePicker
          value={settings.reminderTime}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleReminderTimeChange}
        />
      )}
    </View>
  );
}; 