import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Box, Text } from '../components/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Character, MaslowLevel } from '../types';

interface ProgressBarProps {
  progress: number;
  color: string;
  height?: number;
}

const ProgressBar = ({ progress, color, height = 8 }: ProgressBarProps) => (
  <Box
    style={[
      styles.progressBarContainer,
      { height },
    ]}
  >
    <Box
      style={[
        styles.progressBar,
        {
          width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          backgroundColor: color,
        },
      ]}
    />
  </Box>
);

interface MaslowProgressProps {
  level: MaslowLevel;
  progress: number;
}

const MaslowProgress = ({ level, progress }: MaslowProgressProps) => {
  const theme = useTheme<Theme>();
  
  const getLevelColor = (level: MaslowLevel) => {
    switch (level) {
      case 'physiological': return theme.colors.error;
      case 'safety': return theme.colors.warning;
      case 'belonging': return theme.colors.accent;
      case 'esteem': return theme.colors.success;
      case 'selfActualization': return theme.colors.legendary;
    }
  };

  return (
    <Box marginVertical="m">
      <Text variant="body" color="textSecondary" marginBottom="s">
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Text>
      <ProgressBar
        progress={progress}
        color={getLevelColor(level)}
      />
    </Box>
  );
};

export const ProfileScreen = () => {
  const theme = useTheme<Theme>();

  // Sample character data - in real app, this would come from your game state
  const character: Character = {
    id: '1',
    description: 'A wandering scholar seeking ancient knowledge',
    nativeLanguage: 'English',
    targetLanguage: 'Spanish',
    currentMaslowLevel: 'belonging',
    journeyProgress: {
      external: { stage: 'challenges', progress: 0.6 },
      internal: { stage: 'growth', progress: 0.4 },
    },
    inventory: [],
    knownSpells: [],
    masteredWords: [],
  };

  const maslowProgress = {
    physiological: 1,
    safety: 0.8,
    belonging: 0.4,
    esteem: 0.2,
    selfActualization: 0,
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
    >
      <ScrollView>
        <Box padding="l">
          <Text variant="header" color="primary" marginBottom="m">
            Character Profile
          </Text>
          
          <Box
            backgroundColor="cardPrimary"
            padding="l"
            borderRadius="l"
            style={theme.magicEffects.rune}
            marginBottom="l"
          >
            <Text variant="subheader" color="textPrimary" marginBottom="m">
              Journey Details
            </Text>
            <Text variant="body" color="textSecondary">
              {character.description}
            </Text>
            <Text variant="body" color="accent" marginTop="m">
              Learning: {character.targetLanguage}
            </Text>
          </Box>

          <Box
            backgroundColor="cardPrimary"
            padding="l"
            borderRadius="l"
            style={theme.magicEffects.rune}
            marginBottom="l"
          >
            <Text variant="subheader" color="textPrimary" marginBottom="m">
              Hero's Journey Progress
            </Text>
            <Text variant="body" color="textSecondary" marginBottom="s">
              External Journey
            </Text>
            <ProgressBar
              progress={character.journeyProgress.external.progress}
              color={theme.colors.primary}
            />
            <Text variant="caption" color="textSecondary" marginTop="xs">
              Stage: {character.journeyProgress.external.stage}
            </Text>

            <Text variant="body" color="textSecondary" marginTop="m" marginBottom="s">
              Internal Journey
            </Text>
            <ProgressBar
              progress={character.journeyProgress.internal.progress}
              color={theme.colors.accent}
            />
            <Text variant="caption" color="textSecondary" marginTop="xs">
              Stage: {character.journeyProgress.internal.stage}
            </Text>
          </Box>

          <Box
            backgroundColor="cardPrimary"
            padding="l"
            borderRadius="l"
            style={theme.magicEffects.rune}
          >
            <Text variant="subheader" color="textPrimary" marginBottom="m">
              Maslow's Journey
            </Text>
            {(Object.keys(maslowProgress) as MaslowLevel[]).map((level) => (
              <MaslowProgress
                key={level}
                level={level}
                progress={maslowProgress[level]}
              />
            ))}
          </Box>
        </Box>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
}); 