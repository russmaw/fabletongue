import React from 'react';
import { Text as RNText } from 'react-native';
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
  useRestyle,
} from '@shopify/restyle';
import { Theme } from '../theme';

const variant = createVariant<Theme>({
  themeKey: 'textVariants',
});

type RestyleProps = VariantProps<Theme, 'textVariants'>;

const Text = createRestyleComponent<RestyleProps & React.ComponentProps<typeof RNText>, Theme>([variant], RNText);

export default Text; 