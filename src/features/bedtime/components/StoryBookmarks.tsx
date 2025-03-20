import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { StoryProgress } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface StoryBookmarksProps {
  storyId: string;
  onSelectPage: (page: number) => void;
}

export const StoryBookmarks: React.FC<StoryBookmarksProps> = ({
  storyId,
  onSelectPage,
}) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const { progress, addBookmark, removeBookmark } = store;

  const storyProgress = progress.find((p: StoryProgress) => p.storyId === storyId);
  const bookmarks = storyProgress?.bookmarks || [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    bookmarkCount: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    bookmarksList: {
      flex: 1,
    },
    bookmarkItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pageNumber: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    deleteButton: {
      padding: theme.spacing.xs,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.bookmarkCount}>
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.bookmarksList}>
        {bookmarks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No bookmarks yet.{'\n'}
              Add bookmarks while reading to save your favorite pages!
            </Text>
          </View>
        ) : (
          bookmarks.map((pageNumber: number) => (
            <TouchableOpacity
              key={pageNumber}
              style={styles.bookmarkItem}
              onPress={() => onSelectPage(pageNumber)}
            >
              <Text style={styles.pageNumber}>Page {pageNumber}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeBookmark(storyId, pageNumber)}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}; 