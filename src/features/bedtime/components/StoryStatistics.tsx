import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { StoryProgress } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface StoryStatisticsProps {
  onClose?: () => void;
}

export const StoryStatistics: React.FC<StoryStatisticsProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const progress = useBedtimeStore(state => state.progress);

  const calculateStatistics = (progress: StoryProgress[]) => {
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    const totalStories = new Set(progress.map(p => p.storyId)).size;
    const totalPages = progress.reduce((sum, p) => sum + p.completedPages.length, 0);
    const totalNotes = progress.reduce((sum, p) => sum + p.notes.length, 0);
    const totalBookmarks = progress.reduce((sum, p) => sum + p.bookmarks.length, 0);

    // Calculate reading streak
    const dates = progress
      .map(p => p.lastReadAt.toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const uniqueDates = [...new Set(dates)];
    let currentStreak = 0;
    let longestStreak = 0;
    let currentDate = new Date();

    for (const date of uniqueDates) {
      const dateObj = new Date(date);
      const diffDays = Math.floor((currentDate.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
        currentDate = dateObj;
      } else {
        break;
      }
    }

    return {
      totalTimeSpent,
      totalStories,
      totalPages,
      totalNotes,
      totalBookmarks,
      currentStreak,
      longestStreak,
    };
  };

  const stats = calculateStatistics(progress);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.s,
    },
    statItem: {
      width: '50%',
      paddingHorizontal: theme.spacing.s,
      marginBottom: theme.spacing.m,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    streakSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    streakItem: {
      alignItems: 'center',
    },
    streakIcon: {
      marginBottom: theme.spacing.s,
    },
    streakValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    streakLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
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
          <Text style={styles.sectionTitle}>Reading Activity</Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatTime(stats.totalTimeSpent)}
              </Text>
              <Text style={styles.statLabel}>Total Reading Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalStories}</Text>
              <Text style={styles.statLabel}>Stories Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalPages}</Text>
              <Text style={styles.statLabel}>Pages Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(stats.totalTimeSpent / (stats.totalPages || 1) / 60).toFixed(1)}m
              </Text>
              <Text style={styles.statLabel}>Avg. Time per Page</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Streak</Text>
          <View style={styles.streakSection}>
            <View style={styles.streakItem}>
              <Ionicons
                name="flame"
                size={32}
                color={theme.colors.primary}
                style={styles.streakIcon}
              />
              <Text style={styles.streakValue}>{stats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current{'\n'}Streak</Text>
            </View>
            <View style={styles.streakItem}>
              <Ionicons
                name="trophy"
                size={32}
                color={theme.colors.primary}
                style={styles.streakIcon}
              />
              <Text style={styles.streakValue}>{stats.longestStreak}</Text>
              <Text style={styles.streakLabel}>Longest{'\n'}Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement</Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalNotes}</Text>
              <Text style={styles.statLabel}>Notes Added</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalBookmarks}</Text>
              <Text style={styles.statLabel}>Bookmarks Created</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(stats.totalNotes / (stats.totalStories || 1)).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg. Notes per Story</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(stats.totalBookmarks / (stats.totalStories || 1)).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg. Bookmarks per Story</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}; 