import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { StoryProgress as StoryProgressType } from '../types';
import { useBedtimeStore } from '../store';

interface StoryProgressProps {
  storyId: string;
  onComplete?: () => void;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
  storyId,
  onComplete,
}) => {
  const theme = useTheme<Theme>();
  const { progress } = useBedtimeStore();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  const storyProgress = progress.find(p => p.storyId === storyId);
  const totalPages = storyProgress?.completedPages.length || 0;
  const currentPage = storyProgress?.lastPageRead || 0;
  const progressPercentage = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Add sparkle effect when progress changes
    if (progressPercentage > 0) {
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Check for completion
    if (progressPercentage === 100 && onComplete) {
      onComplete();
    }
  }, [progressPercentage, onComplete]);

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.m,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    percentage: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    sparkle: {
      position: 'absolute',
      width: 4,
      height: '80%',
      backgroundColor: theme.colors.white,
      borderRadius: 2,
      top: '10%',
    },
    timeSpent: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.s,
      textAlign: 'right',
    },
  });

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m spent reading`;
    }
    return `${minutes}m spent reading`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.label}>Story Progress</Text>
        <Text style={styles.percentage}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sparkle,
              {
                opacity: sparkleAnim,
                transform: [
                  {
                    translateX: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 200],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>

      {storyProgress && (
        <Text style={styles.timeSpent}>
          {formatTimeSpent(storyProgress.timeSpent)}
        </Text>
      )}
    </View>
  );
}; 