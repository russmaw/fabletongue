import React, { useState } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import { Box, Text, Button } from '../components/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import * as Haptics from 'expo-haptics';
import { Quest, VocabularyWord } from '../types';

const { width } = Dimensions.get('window');

interface QuestCardProps {
  quest: Quest;
  onSelect: (quest: Quest) => void;
}

const QuestCard = ({ quest, onSelect }: QuestCardProps) => {
  const theme = useTheme<Theme>();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(quest);
  };

  return (
    <Animated.View style={[styles.questCard, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[theme.colors.cardPrimary, theme.colors.background]}
        style={[styles.cardGradient, theme.magicEffects.rune]}
      >
        <Box padding="l">
          <Text variant="subheader" color="primary" marginBottom="s">
            {quest.title}
          </Text>
          <Text variant="body" color="textSecondary" marginBottom="m">
            {quest.description}
          </Text>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text variant="caption" color="accent">
              Level: {quest.maslowLevel}
            </Text>
            <Text variant="caption" color={quest.completed ? 'success' : 'warning'}>
              {quest.completed ? 'Completed' : `Progress: ${quest.progress}%`}
            </Text>
          </Box>
          <Button
            onPress={handlePress}
            style={[styles.button, theme.magicEffects.glow]}
          >
            <Text variant="body" color="background">
              Begin Quest
            </Text>
          </Button>
        </Box>
      </LinearGradient>
    </Animated.View>
  );
};

export const QuestScreen = () => {
  const theme = useTheme<Theme>();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // Sample quests - in real app, these would come from your game state
  const sampleQuests: Quest[] = [
    {
      id: '1',
      title: 'The Ancient Scroll',
      description: 'Discover the secrets of an ancient magical scroll containing powerful words of knowledge.',
      maslowLevel: 'physiological',
      targetWords: ['scroll', 'ancient', 'magic'],
      rewards: { experience: 100 },
      progress: 0,
      completed: false,
    },
    // Add more sample quests
  ];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
    >
      <Box flex={1} padding="l">
        <Text variant="header" color="primary" marginBottom="xl">
          Available Quests
        </Text>
        {sampleQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onSelect={setSelectedQuest}
          />
        ))}
      </Box>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#C0B283',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
}); 