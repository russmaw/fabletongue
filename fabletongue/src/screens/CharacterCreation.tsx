import React, { useState } from 'react';
import { Box, Text, TextInput, Button } from '../components/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import * as Haptics from 'expo-haptics';
import { Character, MaslowLevel } from '../types';

const { width, height } = Dimensions.get('window');

export const CharacterCreation = ({ onCharacterCreated }: { onCharacterCreated: (character: Character) => void }) => {
  const theme = useTheme<Theme>();
  const [description, setDescription] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const handleCreateCharacter = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // In a real implementation, we'd call our AI service here to interpret the character
    const character: Character = {
      id: Date.now().toString(),
      description,
      nativeLanguage: 'English', // Hardcoded for now
      targetLanguage,
      currentMaslowLevel: 'physiological' as MaslowLevel,
      journeyProgress: {
        external: {
          stage: 'call',
          progress: 0,
        },
        internal: {
          stage: 'need',
          progress: 0,
        },
      },
      inventory: [],
      knownSpells: [],
      masteredWords: [],
    };

    onCharacterCreated(character);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
    >
      <Box flex={1} padding="l" justifyContent="center">
        <Text variant="header" textAlign="center" marginBottom="xl">
          Begin Your Magical Journey
        </Text>
        
        <Box 
          backgroundColor="cardPrimary" 
          padding="l" 
          borderRadius="l"
          style={theme.magicEffects.rune}
        >
          <Text variant="subheader" marginBottom="m">
            Describe Your Character
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="I am a wandering scholar seeking ancient magical knowledge..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text variant="subheader" marginTop="l" marginBottom="m">
            Choose Your Target Language
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Spanish, French, Japanese..."
            placeholderTextColor={theme.colors.textMuted}
            value={targetLanguage}
            onChangeText={setTargetLanguage}
          />

          <Button
            onPress={handleCreateCharacter}
            disabled={!description || !targetLanguage}
            style={[
              styles.button,
              theme.magicEffects.glow,
              (!description || !targetLanguage) && styles.buttonDisabled
            ]}
          >
            <Text variant="body" color="background">
              Forge Your Destiny
            </Text>
          </Button>
        </Box>
      </Box>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#DCD0C0',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#C0B283',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 