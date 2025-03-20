import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Svg, { Path, Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface StoryIllustrationProps {
  type: 'forest' | 'stars' | 'moon' | 'clouds' | 'animals';
  color?: string;
}

export const StoryIllustration: React.FC<StoryIllustrationProps> = ({
  type,
  color,
}) => {
  const theme = useTheme<Theme>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      width: width * 0.8,
      height: width * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const renderIllustration = () => {
    const fillColor = color || theme.colors.primary;

    switch (type) {
      case 'moon':
        return (
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="40"
              fill={fillColor}
              opacity={0.9}
            />
            <Circle
              cx="35"
              cy="35"
              r="10"
              fill={theme.colors.background}
              opacity={0.3}
            />
          </Svg>
        );

      case 'stars':
        return (
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <G>
              {Array.from({ length: 5 }).map((_, i) => (
                <Path
                  key={i}
                  d={`M ${50 + Math.cos(i * 72 * Math.PI / 180) * 40} ${50 + Math.sin(i * 72 * Math.PI / 180) * 40} L ${50} ${50}`}
                  stroke={fillColor}
                  strokeWidth="2"
                  opacity={0.8}
                />
              ))}
            </G>
          </Svg>
        );

      case 'clouds':
        return (
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Path
              d="M25,60 Q40,50 55,60 T85,60 Q95,60 95,50 Q95,40 85,40 Q75,40 75,50 Q65,30 45,40 Q35,20 25,40 Q15,40 15,50 Q15,60 25,60"
              fill={fillColor}
              opacity={0.6}
            />
          </Svg>
        );

      case 'forest':
        return (
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {Array.from({ length: 5 }).map((_, i) => (
              <Path
                key={i}
                d={`M${20 + i * 15},80 L${27 + i * 15},60 L${34 + i * 15},80 Z`}
                fill={fillColor}
                opacity={0.7 + i * 0.05}
              />
            ))}
          </Svg>
        );

      case 'animals':
        return (
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Simple sleeping animal silhouette */}
            <Path
              d="M30,60 Q45,50 60,60 Q70,60 70,50 Q70,40 60,40 Q45,40 30,50 Z"
              fill={fillColor}
              opacity={0.8}
            />
            <Circle cx="40" cy="45" r="2" fill={theme.colors.background} />
          </Svg>
        );

      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        },
      ]}
    >
      {renderIllustration()}
    </Animated.View>
  );
};

export default StoryIllustration; 