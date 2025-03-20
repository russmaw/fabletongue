import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Text from '../Text';

interface StoryProgressProps {
  current: number;
  total: number;
  timeRemaining: number;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
  current,
  total,
  timeRemaining,
}) => {
  const theme = useTheme<Theme>();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: theme.spacing.m,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
    },
    progressContainer: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginHorizontal: theme.spacing.m,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      width: `${(current / total) * 100}%`,
    },
    text: {
      color: theme.colors.text,
      opacity: 0.8,
    },
    timeContainer: {
      backgroundColor: theme.colors.cardBackground,
      paddingHorizontal: theme.spacing.s,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadii.s,
      ...theme.shadows.small,
    },
  });

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.text}>
        {current} / {total}
      </Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} />
      </View>
      
      <View style={styles.timeContainer}>
        <Text variant="body" style={styles.text}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
    </View>
  );
};

export default StoryProgress; 