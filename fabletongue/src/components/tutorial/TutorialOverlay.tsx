import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { TutorialStep, TutorialSection } from '../../services/tutorialService';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Box } from '../themed';
import * as Haptics from 'expo-haptics';

interface TutorialOverlayProps {
  currentSection: TutorialSection;
  onStepComplete: (stepId: string) => void;
  onSectionComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  currentSection,
  onStepComplete,
  onSectionComplete,
}) => {
  const theme = useTheme<Theme>();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [opacity] = useState(new Animated.Value(0));
  const [position] = useState(new Animated.Value(0));

  const currentStep = currentSection.steps[currentStepIndex];

  useEffect(() => {
    animateIn();
  }, [currentStepIndex]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(position, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(position, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep.requiredForProgress) {
      await onStepComplete(currentStep.id);
    }

    if (currentStepIndex < currentSection.steps.length - 1) {
      animateOut(() => {
        setCurrentStepIndex(prev => prev + 1);
      });
    } else {
      animateOut(() => {
        onSectionComplete();
      });
    }
  };

  const getPositionStyle = () => {
    const translateY = position.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    switch (currentStep.position) {
      case 'top':
        return { top: 20 };
      case 'bottom':
        return { bottom: 20 };
      case 'left':
        return { left: 20 };
      case 'right':
        return { right: 20 };
      default:
        return { bottom: 20 };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <Animated.View
        style={[
          styles.tutorialBox,
          getPositionStyle(),
          {
            opacity,
            transform: [{
              translateY: position.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <Box
          padding="m"
          borderRadius="m"
          backgroundColor="cardBackground"
          shadowColor="shadowColor"
          shadowOpacity={0.2}
          shadowOffset={{ width: 0, height: 2 }}
          shadowRadius={8}
          elevation={5}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {currentStep.title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>
            {currentStep.description}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {currentStepIndex === currentSection.steps.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.progress}>
            {currentStepIndex + 1} / {currentSection.steps.length}
          </Text>
        </Box>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tutorialBox: {
    position: 'absolute',
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progress: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
}); 