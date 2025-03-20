import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import NightSky from '../components/animations/NightSky';
import StoryProgress from '../components/story/StoryProgress';
import StoryIllustration from '../components/story/StoryIllustration';
import VoiceInput from '../components/story/VoiceInput';
import AmbientControls from '../components/audio/AmbientControls';
import useBedtimeStory from '../hooks/useBedtimeStory';
import useBackgroundMusic from '../services/BackgroundMusic';

export const BedtimeStoryScreen: React.FC = () => {
  const theme = useTheme<Theme>();
  const { 
    currentStory,
    currentPage,
    totalPages,
    storyText,
    nextPage,
    previousPage,
    isComplete,
    handleVoiceInput,
  } = useBedtimeStory();
  
  const { playTrack } = useBackgroundMusic();

  useEffect(() => {
    // Start playing lullaby music when the story begins
    playTrack('lullaby');
    return () => {
      // Clean up music when leaving the screen
      playTrack(null);
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.m,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 24,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    storyContainer: {
      flex: 1,
      marginVertical: theme.spacing.m,
    },
    text: {
      fontSize: 18,
      color: theme.colors.text,
      lineHeight: 28,
      marginVertical: theme.spacing.m,
    },
    controls: {
      position: 'absolute',
      bottom: theme.spacing.m,
      left: theme.spacing.m,
      right: theme.spacing.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    ambientContainer: {
      position: 'absolute',
      top: theme.spacing.m,
      right: theme.spacing.m,
      zIndex: 10,
    },
  });

  return (
    <View style={styles.container}>
      <NightSky />
      
      <View style={styles.ambientContainer}>
        <AmbientControls compact showLabels={false} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentStory?.title}</Text>
          <StoryProgress 
            current={currentPage} 
            total={totalPages}
          />
        </View>

        <View style={styles.storyContainer}>
          <StoryIllustration 
            storyId={currentStory?.id} 
            page={currentPage}
          />
          <Text style={styles.text}>
            {storyText}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.controls}>
        <VoiceInput
          onResult={handleVoiceInput}
          onError={(error) => console.error('Voice input error:', error)}
        />
      </View>
    </View>
  );
};

export default BedtimeStoryScreen; 