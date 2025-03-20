import React from 'react';
import { StyleSheet } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.1,
}) => {
  const theme = useTheme<Theme>();

  return (
    <RNSlider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      minimumTrackTintColor={theme.colors.primary}
      maximumTrackTintColor={theme.colors.border}
      thumbTintColor={theme.colors.primary}
      style={styles.slider}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
}); 