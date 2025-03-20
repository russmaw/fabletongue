import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  scale: Animated.Value;
}

export const NightSky: React.FC = () => {
  const theme = useTheme<Theme>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    // Create stars
    starsRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      opacity: new Animated.Value(Math.random()),
      scale: new Animated.Value(1),
    }));

    // Animate stars
    const animateStars = () => {
      starsRef.current.forEach((star, index) => {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(star.opacity, {
              toValue: Math.random() * 0.5 + 0.5,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: Math.random() * 0.3 + 0.2,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(star.scale, {
              toValue: Math.random() * 0.3 + 0.8,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(star.scale, {
              toValue: 1,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          // Loop animation
          setTimeout(() => animateStars(), Math.random() * 1000);
        });
      });
    };

    animateStars();
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width,
      height,
      backgroundColor: theme.colors.background,
    },
    star: {
      position: 'absolute',
      backgroundColor: theme.colors.white,
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.container}>
      {starsRef.current.map((star, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              transform: [{ scale: star.scale }],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default NightSky; 