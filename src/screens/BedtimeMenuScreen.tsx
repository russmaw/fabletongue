import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { NightSky } from '../components/animations/NightSky';
import Slider from '../components/Slider';
import { StoryIllustration } from '../components/story/StoryIllustration';

interface BedtimeMenuScreenProps {
  navigation: any;
}

export const BedtimeMenuScreen: React.FC<BedtimeMenuScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme<Theme>();
  const [duration, setDuration] = useState(20);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [includeAmbientSounds, setIncludeAmbientSounds] = useState(true);
  const [autoProgress, setAutoProgress] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.l,
    },
    header: {
      marginBottom: theme.spacing.l,
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    subtitle: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: theme.spacing.l,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.l,
      padding: theme.spacing.m,
      ...theme.shadows.medium,
    },
    sectionTitle: {
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.m,
    },
    label: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    value: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: theme.spacing.s,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadii.m,
      padding: theme.spacing.m,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.colors.white,
      fontSize: 18,
      marginLeft: theme.spacing.s,
    },
    illustrationContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.l,
    },
  });

  const startStory = () => {
    navigation.navigate('BedtimeStory', {
      settings: {
        targetDuration: duration,
        includeMusic,
        includeAmbientSounds,
        autoProgress,
      },
    });
  };

  return (
    <View style={styles.container}>
      <NightSky />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bedtime Stories</Text>
          <Text style={styles.subtitle}>
            Relax and drift into peaceful dreams with our soothing stories
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          <StoryIllustration type="moon" color={theme.colors.primary} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story Settings</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration} minutes</Text>
          </View>
          
          <Slider
            minimumValue={10}
            maximumValue={30}
            step={5}
            value={duration}
            onValueChange={setDuration}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
          />

          <View style={styles.row}>
            <Text style={styles.label}>Background Music</Text>
            <Switch
              value={includeMusic}
              onValueChange={setIncludeMusic}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ambient Sounds</Text>
            <Switch
              value={includeAmbientSounds}
              onValueChange={setIncludeAmbientSounds}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Auto Progress</Text>
            <Switch
              value={autoProgress}
              onValueChange={setAutoProgress}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={startStory}>
          <Ionicons
            name="moon"
            size={24}
            color={theme.colors.white}
          />
          <Text style={styles.buttonText}>Begin Story</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BedtimeMenuScreen; 