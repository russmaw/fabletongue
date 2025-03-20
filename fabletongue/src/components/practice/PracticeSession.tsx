import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Box, Text } from '../themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import * as Haptics from 'expo-haptics';
import { VocabularyWord, Spell } from '../../types';
import { audioEffects } from '../../utils/audioEffects';
import { useGameStore } from '../../store';

interface PracticeSessionProps {
  word: VocabularyWord | Spell;
  onComplete: (success: boolean) => void;
}

type PracticeMode = 'translation' | 'context' | 'spell';

export const PracticeSession = ({ word, onComplete }: PracticeSessionProps) => {
  const theme = useTheme<Theme>();
  const [mode, setMode] = useState<PracticeMode>('translation');
  const [score, setScore] = useState(0);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));
  const masterWord = useGameStore(state => state.masterWord);

  const shake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    audioEffects.playEffect('magicFail');
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glow = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    audioEffects.playEffect('spellCast');
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkAnswer = (answer: string) => {
    if (answer.toLowerCase() === word.translation.toLowerCase()) {
      glow();
      setScore(score + 1);
      if (score >= 2) {
        audioEffects.playEffect('wordLearned');
        if ('original' in word) {
          masterWord(word);
        }
        onComplete(true);
      }
    } else {
      shake();
      setScore(Math.max(0, score - 1));
    }
  };

  const renderPracticeMode = () => {
    switch (mode) {
      case 'translation':
        return (
          <Box>
            <Text variant="header" color="primary" textAlign="center" marginBottom="l">
              Translate the Word
            </Text>
            <Text variant="subheader" color="textPrimary" textAlign="center" marginBottom="xl">
              {'original' in word ? word.original : word.word}
            </Text>
            <Box flexDirection="row" flexWrap="wrap" justifyContent="center">
              {generateOptions().map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => checkAnswer(option)}
                  style={styles.optionButton}
                >
                  <Text variant="body" color="textPrimary">
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </Box>
          </Box>
        );

      case 'context':
        return (
          <Box>
            <Text variant="header" color="primary" textAlign="center" marginBottom="l">
              Use in Context
            </Text>
            {/* Add context-based practice */}
          </Box>
        );

      case 'spell':
        return (
          <Box>
            <Text variant="header" color="primary" textAlign="center" marginBottom="l">
              Cast the Spell
            </Text>
            {/* Add spell casting practice */}
          </Box>
        );
    }
  };

  const generateOptions = (): string[] => {
    // In a real app, generate meaningful distractors
    return [
      word.translation,
      'Wrong Option 1',
      'Wrong Option 2',
      'Wrong Option 3',
    ].sort(() => Math.random() - 0.5);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeAnim }],
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      ]}
    >
      <LinearGradient
        colors={[theme.colors.cardPrimary, theme.colors.background]}
        style={styles.gradient}
      >
        <Box padding="l">
          {renderPracticeMode()}
          <Box flexDirection="row" justifyContent="space-between" marginTop="xl">
            <Text variant="caption" color="textSecondary">
              Progress: {score}/3
            </Text>
            <TouchableOpacity
              onPress={() => setMode(mode === 'translation' ? 'context' : 'translation')}
            >
              <Text variant="caption" color="primary">
                Change Mode
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C0B283',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    borderRadius: 16,
  },
  optionButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
}); 