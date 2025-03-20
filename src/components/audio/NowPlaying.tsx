import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Text from '../Text';
import { Ionicons } from '@expo/vector-icons';
import useBackgroundMusic from '../../services/BackgroundMusic';
import useAmbientSounds from '../../services/AmbientSounds';
import { MusicTrack, AmbientSound } from 'audio-types';

interface NowPlayingProps {
  compact?: boolean;
  showLabels?: boolean;
}

const TRACK_ICONS: Record<NonNullable<MusicTrack>, string> = {
  lullaby: 'moon',
  peaceful: 'leaf',
  adventure: 'compass',
  focus: 'bulb',
} as const;

const AMBIENT_ICONS: Record<AmbientSound, string> = {
  crickets: 'bug',
  rain: 'rainy',
  waves: 'water',
  wind: 'leaf',
  fire: 'flame',
  birds: 'sunny',
  stream: 'water',
  night: 'moon',
} as const;

export const NowPlaying: React.FC<NowPlayingProps> = ({
  compact = false,
  showLabels = true,
}) => {
  const theme = useTheme<Theme>();
  const {
    currentTrack: musicTrack,
    isEnabled: isMusicEnabled,
    toggleEnabled: toggleMusic,
  } = useBackgroundMusic();

  const {
    currentTrack: ambientTrack,
    isEnabled: isAmbientEnabled,
    toggleEnabled: toggleAmbient,
  } = useAmbientSounds();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.m,
      padding: compact ? theme.spacing.s : theme.spacing.m,
      ...theme.shadows.medium,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    icon: {
      marginRight: theme.spacing.s,
      width: 32,
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: compact ? 14 : 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: compact ? 12 : 14,
      color: theme.colors.textSecondary,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      padding: theme.spacing.s,
    },
  });

  const formatTrackName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View style={styles.container}>
      {musicTrack && TRACK_ICONS[musicTrack] && (
        <View style={styles.row}>
          <View style={styles.icon}>
            <Ionicons
              name={TRACK_ICONS[musicTrack]}
              size={24}
              color={theme.colors.text}
            />
          </View>
          <View style={styles.content}>
            {showLabels && (
              <>
                <Text style={styles.title}>
                  {formatTrackName(musicTrack)}
                </Text>
                <Text style={styles.subtitle}>
                  Background Music
                </Text>
              </>
            )}
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleMusic}
            >
              <Ionicons
                name={isMusicEnabled ? 'volume-high' : 'volume-mute'}
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {ambientTrack && AMBIENT_ICONS[ambientTrack] && (
        <View style={styles.row}>
          <View style={styles.icon}>
            <Ionicons
              name={AMBIENT_ICONS[ambientTrack]}
              size={24}
              color={theme.colors.text}
            />
          </View>
          <View style={styles.content}>
            {showLabels && (
              <>
                <Text style={styles.title}>
                  {formatTrackName(ambientTrack)}
                </Text>
                <Text style={styles.subtitle}>
                  Ambient Sound
                </Text>
              </>
            )}
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleAmbient}
            >
              <Ionicons
                name={isAmbientEnabled ? 'volume-high' : 'volume-mute'}
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!musicTrack && !ambientTrack && showLabels && (
        <Text style={styles.subtitle}>
          No audio playing
        </Text>
      )}
    </View>
  );
};

export default NowPlaying; 