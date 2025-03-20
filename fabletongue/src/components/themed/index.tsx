import { createBox, createText, createRestyleComponent, createVariant } from '@shopify/restyle';
import { TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Theme } from '../../theme';

export const Box = createBox<Theme>();
export const Text = createText<Theme>();

export const Button = createRestyleComponent<
  React.ComponentProps<typeof TouchableOpacity> & {
    variant?: 'primary' | 'secondary';
  },
  Theme
>([createVariant({ themeKey: 'buttonVariants' })], TouchableOpacity);

export const TextInput = createRestyleComponent<
  React.ComponentProps<typeof RNTextInput> & {
    variant?: 'default' | 'filled';
  },
  Theme
>([createVariant({ themeKey: 'inputVariants' })], RNTextInput); 