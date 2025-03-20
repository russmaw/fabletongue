import React, { useState } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Box, Text } from '../components/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import * as Haptics from 'expo-haptics';
import { Spell } from '../types';

interface SpellCardProps {
  spell: Spell;
  onPractice: (spell: Spell) => void;
}

const SpellCard = ({ spell, onPractice }: SpellCardProps) => {
  const theme = useTheme<Theme>();
  const [rotateAnim] = useState(new Animated.Value(0));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    onPractice(spell);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.spellCard, { transform: [{ rotate }] }]}>
        <LinearGradient
          colors={[theme.colors.cardPrimary, theme.colors.background]}
          style={[styles.cardGradient, theme.magicEffects.rune]}
        >
          <Box padding="m">
            <Text variant="subheader" color="primary" marginBottom="s">
              {spell.word}
            </Text>
            <Text variant="body" color="textSecondary" marginBottom="s">
              {spell.translation}
            </Text>
            <Text variant="caption" color="accent">
              Power Level: {spell.powerLevel}
            </Text>
            <Box
              style={[
                styles.masteryBar,
                { width: `${spell.mastery * 100}%`, backgroundColor: theme.colors.success },
              ]}
            />
          </Box>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const SpellbookScreen = () => {
  const theme = useTheme<Theme>();
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  // Sample spells - in real app, these would come from your game state
  const sampleSpells: Spell[] = [
    {
      id: '1',
      word: 'fuego',
      translation: 'fire',
      effect: 'Creates magical flames',
      powerLevel: 3,
      mastery: 0.7,
      lastPracticed: new Date(),
    },
    // Add more sample spells
  ];

  const handlePracticeSpell = (spell: Spell) => {
    // In real app, this would trigger a practice session
    setSelectedSpell(spell);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
    >
      <Box flex={1} padding="l">
        <Text variant="header" color="primary" marginBottom="xl">
          Your Spellbook
        </Text>
        <Box style={styles.spellGrid}>
          {sampleSpells.map((spell) => (
            <SpellCard
              key={spell.id}
              spell={spell}
              onPractice={handlePracticeSpell}
            />
          ))}
        </Box>
      </Box>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spellCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 8,
  },
  spellGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  masteryBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
}); 