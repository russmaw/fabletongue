import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useBedtimeStore } from '../store';
import { FeedbackOverlay } from '../../../components/FeedbackOverlay';

interface UserProfileProps {
  onClose?: () => void;
}

interface ProfileSection {
  title: string;
  icon: string;
  items: {
    label: string;
    value: string | number | boolean;
    type: 'text' | 'number' | 'toggle' | 'select';
    options?: string[];
    key: string;
  }[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profileData, setProfileData] = React.useState({
    name: 'Young Reader',
    age: 7,
    readingLevel: 'Intermediate',
    interests: ['Adventure', 'Fantasy', 'Animals'],
    preferences: {
      darkMode: false,
      autoPlay: true,
      showImages: true,
      fontSize: 16,
    },
    stats: {
      storiesRead: 42,
      timeSpent: '23h 45m',
      achievements: 12,
      streak: 7,
    },
  });

  const sections: ProfileSection[] = [
    {
      title: 'Personal Information',
      icon: 'person',
      items: [
        { label: 'Name', value: profileData.name, type: 'text', key: 'name' },
        { label: 'Age', value: profileData.age, type: 'number', key: 'age' },
        { label: 'Reading Level', value: profileData.readingLevel, type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], key: 'readingLevel' },
      ],
    },
    {
      title: 'Preferences',
      icon: 'settings',
      items: [
        { label: 'Dark Mode', value: profileData.preferences.darkMode, type: 'toggle', key: 'darkMode' },
        { label: 'Auto Play', value: profileData.preferences.autoPlay, type: 'toggle', key: 'autoPlay' },
        { label: 'Show Images', value: profileData.preferences.showImages, type: 'toggle', key: 'showImages' },
        { label: 'Font Size', value: profileData.preferences.fontSize, type: 'number', key: 'fontSize' },
      ],
    },
  ];

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Save profile data to store
      await store.updateProfile(profileData);
      setError(null);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string | number | boolean) => {
    setProfileData(prev => {
      const newData = { ...prev };
      if (key in prev) {
        (newData as any)[key] = value;
      } else if (key in prev.preferences) {
        newData.preferences = {
          ...prev.preferences,
          [key]: value,
        };
      }
      return newData;
    });
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
    avatarContainer: {
      alignItems: 'center',
      padding: theme.spacing.m,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primaryLight,
    },
    changeAvatarButton: {
      marginTop: theme.spacing.s,
    },
    changeAvatarText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: theme.spacing.m,
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      borderRadius: 12,
      marginBottom: theme.spacing.m,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
    section: {
      marginBottom: theme.spacing.m,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: theme.spacing.s,
    },
    sectionContent: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      borderRadius: 12,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    itemLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'right',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      margin: theme.spacing.m,
      padding: theme.spacing.m,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changeAvatarButton}>
            <Text style={styles.changeAvatarText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileData.stats.storiesRead}</Text>
            <Text style={styles.statLabel}>Stories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileData.stats.timeSpent}</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileData.stats.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileData.stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon as any} size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.items.map(item => (
                <View key={item.key} style={styles.item}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.type === 'toggle' ? (
                    <TouchableOpacity
                      onPress={() => handleValueChange(item.key, !item.value)}
                    >
                      <Ionicons
                        name={item.value ? 'checkmark-circle' : 'circle-outline'}
                        size={24}
                        color={item.value ? theme.colors.primary : theme.colors.textMuted}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={styles.input}
                      value={String(item.value)}
                      onChangeText={text => handleValueChange(item.key, item.type === 'number' ? Number(text) : text)}
                      keyboardType={item.type === 'number' ? 'numeric' : 'default'}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <FeedbackOverlay
        visible={isLoading}
        type="loading"
        message="Saving profile..."
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