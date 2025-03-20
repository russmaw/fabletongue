import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

type LoadingVariant = 'text' | 'card' | 'list' | 'story' | 'profile';

interface LoadingStateProps {
  variant?: LoadingVariant;
  lines?: number;
  animated?: boolean;
  containerStyle?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'text',
  lines = 1,
  animated = true,
  containerStyle,
}) => {
  const theme = useTheme<Theme>();
  const { width } = useWindowDimensions();
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      const shimmerLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerLoop.start();

      return () => {
        shimmerLoop.stop();
      };
    }
  }, [animated]);

  const getSkeletonStyle = (index: number): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      height: variant === 'card' ? 120 : 16,
      backgroundColor: theme.colors.border,
      borderRadius: variant === 'card' ? 8 : 4,
      overflow: 'hidden',
    };

    // Vary widths for text lines to create a more natural look
    if (variant === 'text' && lines > 1) {
      const widthPercentage = index === lines - 1 ? '60%' : '100%';
      return [baseStyle, { width: widthPercentage }];
    }

    // Story variant has a larger first item for cover image
    if (variant === 'story' && index === 0) {
      return [baseStyle, { height: 200, marginBottom: theme.spacing.m }];
    }

    // Profile variant has a circular avatar and varying text widths
    if (variant === 'profile') {
      if (index === 0) {
        return [baseStyle, { width: 80, height: 80, borderRadius: 40 }];
      }
      const widthPercentage = index === 1 ? '40%' : index === 2 ? '70%' : '50%';
      return [baseStyle, { width: widthPercentage }];
    }

    // List variant has consistent height but varying widths
    if (variant === 'list') {
      const widthPercentage = index % 2 === 0 ? '100%' : '70%';
      return [baseStyle, { width: widthPercentage }];
    }

    return [baseStyle];
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const renderSkeletonItems = () => {
    const items = [];
    const itemCount = variant === 'list' ? 5 : lines;

    for (let i = 0; i < itemCount; i++) {
      items.push(
        <View
          key={i}
          style={[
            styles.skeletonItem,
            ...getSkeletonStyle(i),
            i < itemCount - 1 && { marginBottom: theme.spacing.s },
          ]}
        >
          {animated && (
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />
          )}
        </View>
      );
    }

    return items;
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.m,
    },
    skeletonItem: {
      position: 'relative',
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background,
      opacity: 0.3,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {renderSkeletonItems()}
    </View>
  );
}; 