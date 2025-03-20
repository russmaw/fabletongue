import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { StoryProgress } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: (progress: StoryProgress[]) => boolean;
  reward?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_story',
    title: 'First Story',
    description: 'Complete your first bedtime story',
    icon: '🌟',
    requirement: (progress) => progress.some((p) => p.completedPages.length > 0),
  },
  {
    id: 'story_streak',
    title: 'Story Streak',
    description: 'Read stories for 7 consecutive days',
    icon: '🔥',
    requirement: (progress) => {
      const dates = progress.map((p) => p.lastReadAt.toDateString());
      const uniqueDates = new Set(dates);
      return uniqueDates.size >= 7;
    },
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Read 10 different stories',
    icon: '📚',
    requirement: (progress) => {
      const uniqueStories = new Set(progress.map((p) => p.storyId));
      return uniqueStories.size >= 10;
    },
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Spend over 10 hours reading stories',
    icon: '🦉',
    requirement: (progress) => {
      const totalSeconds = progress.reduce((sum, p) => sum + p.timeSpent, 0);
      return totalSeconds >= 36000; // 10 hours in seconds
    },
  },
  {
    id: 'note_taker',
    title: 'Note Taker',
    description: 'Add 5 notes to your stories',
    icon: '📝',
    requirement: (progress) => {
      const totalNotes = progress.reduce((sum, p) => sum + p.notes.length, 0);
      return totalNotes >= 5;
    },
  },
  {
    id: 'bookmark_collector',
    title: 'Bookmark Collector',
    description: 'Add 10 bookmarks across your stories',
    icon: '🔖',
    requirement: (progress) => {
      const totalBookmarks = progress.reduce((sum, p) => sum + p.bookmarks.length, 0);
      return totalBookmarks >= 10;
    },
  },
];

interface StoryAchievementsProps {
  onClose?: () => void;
}

export const StoryAchievements: React.FC<StoryAchievementsProps> = ({
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const { progress } = store;

  const earnedAchievements = achievements.filter((achievement) =>
    achievement.requirement(progress)
  );

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
    progress: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.l,
    },
    progressText: {
      fontSize: 16,
      color: theme.colors.textMuted,
    },
    progressCount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    achievementsList: {
      flex: 1,
    },
    achievementItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
    },
    achievementIcon: {
      fontSize: 32,
      marginRight: theme.spacing.m,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    achievementDescription: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    achievementReward: {
      fontSize: 12,
      color: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    lockedAchievement: {
      opacity: 0.5,
    },
    lockedIcon: {
      position: 'absolute',
      right: theme.spacing.m,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
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

      <View style={styles.progress}>
        <Text style={styles.progressText}>Achievements Earned</Text>
        <Text style={styles.progressCount}>
          {earnedAchievements.length} / {achievements.length}
        </Text>
      </View>

      <ScrollView style={styles.achievementsList}>
        {achievements.map((achievement) => {
          const isEarned = achievement.requirement(progress);
          return (
            <View
              key={achievement.id}
              style={[
                styles.achievementItem,
                !isEarned && styles.lockedAchievement,
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.reward && isEarned && (
                  <Text style={styles.achievementReward}>
                    Reward: {achievement.reward}
                  </Text>
                )}
              </View>
              {!isEarned && (
                <Ionicons
                  name="lock-closed"
                  size={24}
                  color={theme.colors.textMuted}
                  style={styles.lockedIcon}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}; 