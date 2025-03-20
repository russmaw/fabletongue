import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Text from '../Text';
import Slider from '@react-native-community/slider';
import useBackgroundMusic from '../../services/BackgroundMusic';
import useSoundEffects from '../../services/SoundEffects';
import useAmbientSounds from '../../services/AmbientSounds';

interface VolumeControlProps {
  label: string;
  value: number;
  isEnabled: boolean;
  onValueChange: (value: number) => void;
  onToggle: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  label,
  value,
  isEnabled,
  onValueChange,
  onToggle,
}) => {
  const theme = useTheme<Theme>();

  return (
    <View style={styles.volumeControl}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ 
            false: theme.colors.inactive, 
            true: theme.colors.primary 
          }}
        />
      </View>
      {isEnabled && (
        <View style={styles.sliderContainer}>
          <Slider
            value={value}
            onValueChange={onValueChange}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.inactive}
            thumbTintColor={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
};

export const AudioSettings: React.FC = () => {
  const theme = useTheme<Theme>();
  const {
    isEnabled: isMusicEnabled,
    volume: musicVolume,
    setVolume: setMusicVolume,
    toggleEnabled: toggleMusic,
  } = useBackgroundMusic();

  const {
    isEnabled: isSoundEnabled,
    volume: soundVolume,
    setVolume: setSoundVolume,
    toggleEnabled: toggleSound,
  } = useSoundEffects();

  const {
    isEnabled: isAmbientEnabled,
    volume: ambientVolume,
    setVolume: setAmbientVolume,
    toggleEnabled: toggleAmbient,
  } = useAmbientSounds();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.m,
      padding: theme.spacing.m,
      ...theme.shadows.medium,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    volumeControl: {
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    sliderContainer: {
      paddingHorizontal: theme.spacing.s,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Settings</Text>
      
      <VolumeControl
        label="Background Music"
        value={musicVolume}
        isEnabled={isMusicEnabled}
        onValueChange={setMusicVolume}
        onToggle={toggleMusic}
      />

      <VolumeControl
        label="Sound Effects"
        value={soundVolume}
        isEnabled={isSoundEnabled}
        onValueChange={setSoundVolume}
        onToggle={toggleSound}
      />

      <VolumeControl
        label="Ambient Sounds"
        value={ambientVolume}
        isEnabled={isAmbientEnabled}
        onValueChange={setAmbientVolume}
        onToggle={toggleAmbient}
      />
    </View>
  );
};

export default AudioSettings; 