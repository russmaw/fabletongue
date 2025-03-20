import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { FavoriteStory } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteStoriesProps {
  onSelectStory: (story: FavoriteStory) => void;
}

export const FavoriteStories: React.FC<FavoriteStoriesProps> = ({ onSelectStory }) => {
  const theme = useTheme<Theme>();
  const { favorites, removeFavorite } = useBedtimeStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.l,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors.textMuted,
    },
    storyCard: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.m,
      margin: theme.spacing.s,
      padding: theme.spacing.m,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    storyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
    },
    storyInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.s,
    },
    infoText: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.s,
    },
    actionButton: {
      padding: theme.spacing.s,
      marginLeft: theme.spacing.s,
    },
  });

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="heart-outline"
          size={48}
          color={theme.colors.textMuted}
        />
        <Text style={styles.emptyText}>
          No favorite stories yet.{'\n'}
          Add stories to your favorites to see them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Stories</Text>
      </View>
      <ScrollView>
        {favorites.map((story) => (
          <View key={story.favoriteId} style={styles.storyCard}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <View style={styles.storyInfo}>
              <Text style={styles.infoText}>
                Last read: {formatDate(story.lastReadAt)}
              </Text>
              <Text style={styles.infoText}>
                Read {story.timesRead} times
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onSelectStory(story)}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => removeFavorite(story.favoriteId)}
              >
                <Ionicons
                  name="heart-dislike-outline"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}; 