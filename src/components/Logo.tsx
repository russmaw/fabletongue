import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from './Text';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 120,
  animated = true 
}) => {
  const theme = useTheme<Theme>();
  const glowOpacity = React.useRef(new Animated.Value(0.4)).current;
  const rotation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 1500,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Subtle rotation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            backgroundColor: theme.colors.mysticPurple,
            width: size * 1.2,
            height: size * 1.2,
          },
        ]}
      />
      
      {/* Main logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ rotate: spin }],
            width: size,
            height: size,
            backgroundColor: theme.colors.scrollBeige,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: theme.colors.inkBlack,
          },
        ]}
      >
        <Text 
          variant="magical" 
          style={[
            styles.logoText,
            { fontSize: size * 0.4 }
          ]}
        >
          FT
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    textAlign: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    transform: [{ scale: 1.2 }],
  },
});

export default Logo; 