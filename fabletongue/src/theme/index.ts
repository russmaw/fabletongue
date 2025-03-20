import { createTheme } from '@shopify/restyle';

export const palette = {
  // Primary Colors
  mysticPurple: '#6A3EA1',
  storyGold: '#FFB86B',
  
  // Secondary Colors
  sageGreen: '#2D9474',
  nightBlue: '#1B2D45',
  
  // Accent Colors
  spellPink: '#FF7C7C',
  scrollBeige: '#F5E6D3',
  
  // Functional Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Status Colors
  success: '#2D9474',
  error: '#FF7C7C',
  warning: '#FFB86B',
  info: '#6A3EA1',
};

const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.white,
    mainForeground: palette.nightBlue,
    primaryButton: palette.mysticPurple,
    secondaryButton: palette.storyGold,
    cardBackground: palette.scrollBeige,
    accentBackground: palette.spellPink,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
  },
  textVariants: {
    defaults: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 24,
      color: 'mainForeground',
    },
    header: {
      fontFamily: 'Crimson Pro',
      fontWeight: 'bold',
      fontSize: 32,
      lineHeight: 42,
      color: 'mainForeground',
    },
    subheader: {
      fontFamily: 'Crimson Pro',
      fontWeight: '600',
      fontSize: 24,
      lineHeight: 32,
      color: 'mainForeground',
    },
    body: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 24,
      color: 'mainForeground',
    },
    caption: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 20,
      color: 'mainForeground',
    },
    magical: {
      fontFamily: 'Luminari',
      fontSize: 20,
      lineHeight: 28,
      color: 'mysticPurple',
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
});

export type Theme = typeof theme;
export default theme;

// Animation constants
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 450,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Shadows
export const shadows = {
  light: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    small: '0 2px 4px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.2)',
    large: '0 10px 15px rgba(0, 0, 0, 0.2)',
  },
};

// Gradients
export const gradients = {
  primary: `linear-gradient(135deg, ${palette.mysticPurple}, ${palette.storyGold})`,
  secondary: `linear-gradient(135deg, ${palette.sageGreen}, ${palette.nightBlue})`,
  accent: `linear-gradient(135deg, ${palette.spellPink}, ${palette.scrollBeige})`,
};

// Magic Effects
export const magicEffects = {
  glow: {
    boxShadow: `0 0 10px ${palette.mysticPurple}`,
  },
  sparkle: {
    animation: 'sparkle 1.5s ease-in-out infinite',
  },
  float: {
    animation: 'float 3s ease-in-out infinite',
  },
};

// CSS Keyframes
export const keyframes = `
  @keyframes sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

// Export theme utilities
export const getSpacing = (value: keyof Theme['spacing']) => theme.spacing[value];
export const getColor = (value: keyof Theme['colors']) => theme.colors[value];
export const getBorderRadius = (value: keyof Theme['borderRadii']) => theme.borderRadii[value]; 