import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Text from '../Text';
import { Ionicons } from '@expo/vector-icons';
import useAmbientSounds, { AmbientSound } from '../../services/AmbientSounds';

interface AmbientControlsProps {
  compact?: boolean;
  showLabels?: boolean;
}

const AMBIENT_ICONS: Record<AmbientSound, string> = {
  crickets: 'bug',
  rain: 'rainy',
  waves: 'water',
  wind: 'leaf',
  fire: 'flame',
  birds: 'sunny',
  stream: 'water',
  night: 'moon',
};

export const AmbientControls: React.FC<AmbientControlsProps> = ({
  compact = false,
  showLabels = true,
}) => {
  const theme = useTheme<Theme>();
  const {
    currentTrack,
    isEnabled,
    playSound,
    stopSound,
    toggleEnabled,
  } = useAmbientSounds();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.m,
      padding: compact ? theme.spacing.s : theme.spacing.m,
      ...theme.shadows.medium,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.m,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.s,
    },
    soundButton: {
      width: compact ? 40 : 60,
      height: compact ? 40 : 60,
      borderRadius: theme.borderRadii.s,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
    },
    label: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
  });

  const handleSoundPress = (sound: AmbientSound) => {
    if (currentTrack === sound) {
      stopSound();
    } else {
      playSound(sound);
    }
  };

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.title}>Ambient Sounds</Text>
          <TouchableOpacity onPress={toggleEnabled}>
            <Ionicons
              name={isEnabled ? "volume-high" : "volume-mute"}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.grid}>
        {(Object.keys(AMBIENT_ICONS) as AmbientSound[]).map((sound) => (
          <TouchableOpacity
            key={sound}
            style={[
              styles.soundButton,
              currentTrack === sound && styles.activeButton,
            ]}
            onPress={() => handleSoundPress(sound)}
            disabled={!isEnabled}
          >
            <Ionicons
              name={AMBIENT_ICONS[sound] as any}
              size={compact ? 20 : 24}
              color={
                currentTrack === sound
                  ? theme.colors.white
                  : theme.colors.text
              }
            />
            {showLabels && !compact && (
              <Text style={styles.label}>
                {sound.charAt(0).toUpperCase() + sound.slice(1)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AmbientControls; 