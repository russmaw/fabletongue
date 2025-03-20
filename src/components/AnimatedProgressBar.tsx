import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from './Text';

interface AnimatedProgressBarProps {
  progress: number;
  label: string;
  color: string;
  height?: number;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  label,
  color,
  height = 24,
}) => {
  const theme = useTheme<Theme>();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar filling
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Sparkle effect when progress changes
    if (progress > 0) {
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [progress]);

  return (
    <View style={[styles.container, { height }]}>
      <View 
        style={[
          styles.progressBar,
          { 
            height,
            backgroundColor: theme.colors.scrollBeige,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
        
        {/* Sparkle effect */}
        <Animated.View
          style={[
            styles.sparkle,
            {
              opacity: sparkleOpacity,
              backgroundColor: theme.colors.amberGold,
              transform: [
                {
                  translateX: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, height * 8],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      
      <View style={styles.labelContainer}>
        <Text variant="caption" style={styles.label}>
          {label}
        </Text>
        <Text variant="caption" style={styles.percentage}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  progressBar: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 12,
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: '80%',
    top: '10%',
    borderRadius: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {
    opacity: 0.8,
  },
  percentage: {
    fontWeight: 'bold',
  },
});

export default AnimatedProgressBar; 