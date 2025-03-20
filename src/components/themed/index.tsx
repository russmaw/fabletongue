import { createBox, createText, ThemeProvider, useTheme, useRestyle } from '@shopify/restyle';
import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../theme';

const Box = createBox<Theme>();
const Text = createText<Theme>();

export { Box, Text, ThemeProvider, useTheme, useRestyle };

// ... existing code ... 