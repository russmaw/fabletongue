import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useBedtimeStore } from '../store';
import { FeedbackOverlay } from '../../../components/FeedbackOverlay';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

// Configure default notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationManagerProps {
  onClose?: () => void;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  time?: Date;
  days?: number[];
  type: 'reminder' | 'achievement' | 'progress' | 'social';
  icon: keyof typeof Ionicons.glyphMap;
  sound?: string;
  image?: string;
  actions?: {
    title: string;
    identifier: string;
  }[];
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [selectedSetting, setSelectedSetting] = React.useState<string | null>(null);

  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    {
      id: 'daily-reminder',
      title: 'Daily Reading Reminder',
      description: 'Get reminded to read at your preferred time',
      enabled: true,
      time: new Date(new Date().setHours(20, 0, 0, 0)),
      type: 'reminder',
      icon: 'time',
      sound: 'default',
      actions: [
        {
          title: 'Start Reading',
          identifier: 'START_READING',
        },
        {
          title: 'Remind Later',
          identifier: 'REMIND_LATER',
        },
      ],
    },
    {
      id: 'achievement',
      title: 'Achievement Alerts',
      description: 'Get notified when you earn new achievements',
      enabled: true,
      type: 'achievement',
      icon: 'trophy',
      sound: 'achievement.wav',
      image: 'achievement-badge',
      actions: [
        {
          title: 'View Achievement',
          identifier: 'VIEW_ACHIEVEMENT',
        },
        {
          title: 'Share',
          identifier: 'SHARE_ACHIEVEMENT',
        },
      ],
    },
    {
      id: 'weekly-progress',
      title: 'Weekly Progress Report',
      description: 'Receive a summary of your reading progress',
      enabled: true,
      time: new Date(new Date().setHours(18, 0, 0, 0)),
      days: [0], // Sunday
      type: 'progress',
      icon: 'stats-chart',
      image: 'progress-chart',
      actions: [
        {
          title: 'View Details',
          identifier: 'VIEW_PROGRESS',
        },
      ],
    },
    {
      id: 'friend-activity',
      title: 'Friend Activity',
      description: 'Stay updated with your friends\' reading progress',
      enabled: false,
      type: 'social',
      icon: 'people',
      actions: [
        {
          title: 'View Activity',
          identifier: 'VIEW_ACTIVITY',
        },
      ],
    },
  ]);

  React.useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (status !== 'granted') {
        setError('Permission to send notifications was denied');
        return;
      }

      // Set up notification categories/actions
      await Notifications.setNotificationCategoryAsync('reading', [
        {
          identifier: 'START_READING',
          buttonTitle: 'Start Reading',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: 'REMIND_LATER',
          buttonTitle: 'Remind Later',
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
      ]);

      // Listen for notification responses
      const subscription = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

      return () => {
        subscription.remove();
      };
    } catch (err) {
      setError('Failed to set up notifications');
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const actionId = response.actionIdentifier;
    const data = response.notification.request.content.data;

    switch (actionId) {
      case 'START_READING':
        // Navigate to reading screen
        break;
      case 'REMIND_LATER':
        // Reschedule notification
        scheduleReminder(settings[0], 30); // Remind in 30 minutes
        break;
      case 'VIEW_ACHIEVEMENT':
        // Navigate to achievements screen
        break;
      case 'SHARE_ACHIEVEMENT':
        // Open share dialog
        break;
      case 'VIEW_PROGRESS':
        // Navigate to progress screen
        break;
      case 'VIEW_ACTIVITY':
        // Navigate to activity screen
        break;
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setIsLoading(true);
      const settingIndex = settings.findIndex(s => s.id === id);
      if (settingIndex === -1) return;

      const setting = settings[settingIndex];
      const newEnabled = !setting.enabled;

      if (newEnabled) {
        if (setting.type === 'reminder') {
          await scheduleReminder(setting);
        } else {
          await enableNotificationType(setting.type);
        }
      } else {
        await Notifications.cancelScheduledNotificationAsync(setting.id);
      }

      setSettings(prev => {
        const newSettings = [...prev];
        newSettings[settingIndex] = {
          ...setting,
          enabled: newEnabled,
        };
        return newSettings;
      });

      // Update store with new settings
      await store.updateNotificationSettings(settings);
    } catch (err) {
      setError('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleReminder = async (setting: NotificationSetting, delayMinutes?: number) => {
    if (!setting.time && !delayMinutes) return;

    const trigger = delayMinutes
      ? {
          type: SchedulableTriggerInputTypes.INTERVAL,
          seconds: delayMinutes * 60,
          repeats: false,
        }
      : {
          type: SchedulableTriggerInputTypes.CALENDAR,
          hour: setting.time!.getHours(),
          minute: setting.time!.getMinutes(),
          repeats: true,
        };

    await Notifications.scheduleNotificationAsync({
      identifier: setting.id,
      content: {
        title: setting.title,
        body: setting.description,
        sound: setting.sound,
        badge: 1,
        data: { type: setting.type },
        ...(setting.image && Platform.OS === 'ios' && {
          attachments: [{
            identifier: `${setting.id}-image`,
            url: setting.image,
            type: 'image' as const,
          }],
        }),
        categoryIdentifier: setting.type === 'reminder' ? 'reading' : undefined,
      },
      trigger,
    });
  };

  const enableNotificationType = async (type: NotificationSetting['type']) => {
    // Configure notification settings based on type
    switch (type) {
      case 'achievement':
        // Enable achievement notifications in the store
        await store.updateAchievementNotifications(true);
        break;
      case 'progress':
        // Schedule weekly progress notifications
        await scheduleProgressReport();
        break;
      case 'social':
        // Enable social notifications in the store
        await store.updateSocialNotifications(true);
        break;
    }
  };

  const scheduleProgressReport = async () => {
    await Notifications.scheduleNotificationAsync({
      identifier: 'weekly-progress',
      content: {
        title: 'Weekly Reading Progress',
        body: 'Check out your reading achievements this week!',
        sound: true,
        badge: 1,
        data: { type: 'progress' },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.CALENDAR,
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  const handleTimeChange = async (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime && selectedSetting) {
      try {
        setIsLoading(true);
        const settingIndex = settings.findIndex(s => s.id === selectedSetting);
        if (settingIndex === -1) return;

        const setting = settings[settingIndex];
        setSettings(prev => {
          const newSettings = [...prev];
          newSettings[settingIndex] = {
            ...setting,
            time: selectedTime,
          };
          return newSettings;
        });

        if (setting.enabled) {
          await Notifications.cancelScheduledNotificationAsync(setting.id);
          await scheduleReminder(setting);
        }

        // Update store with new settings
        await store.updateNotificationSettings(settings);
      } catch (err) {
        setError('Failed to update notification time');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    closeButton: {
      padding: theme.spacing.s,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      marginTop: theme.spacing.m,
      borderRadius: 12,
      overflow: 'hidden',
    },
    setting: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingIcon: {
      marginRight: theme.spacing.m,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    timeButton: {
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: 8,
      marginLeft: theme.spacing.m,
    },
    timeText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {settings.map(setting => (
            <View key={setting.id} style={styles.setting}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name={setting.icon}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>
                  {setting.description}
                </Text>
              </View>
              {setting.time && setting.enabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    setSelectedSetting(setting.id);
                    setShowTimePicker(true);
                  }}
                >
                  <Text style={styles.timeText}>
                    {setting.time.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              )}
              <Switch
                value={setting.enabled}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.white}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={
            settings.find(s => s.id === selectedSetting)?.time || new Date()
          }
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor: theme.colors.card,
            padding: theme.spacing.m,
          }}
        >
          <DateTimePicker
            value={
              settings.find(s => s.id === selectedSetting)?.time || new Date()
            }
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            display="spinner"
          />
        </View>
      )}

      <FeedbackOverlay
        visible={isLoading}
        type="loading"
        message="Updating notification settings..."
      />
      <FeedbackOverlay
        visible={!!error}
        type="error"
        message={error || ''}
        onDismiss={() => setError(null)}
      />
    </View>
  );
}; 