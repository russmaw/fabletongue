import { Platform } from 'react-native';
import createTheme from '@shopify/restyle/dist/createTheme';

const palette = {
  // Primary colors
  mysticPurple: '#6A5ACD',
  spellPink: '#FF69B4',
  scrollBeige: '#F5F5DC',
  parchmentYellow: '#FFF8DC',
  inkBlack: '#2C1810',
  
  // Secondary colors
  forestGreen: '#228B22',
  crystalBlue: '#4169E1',
  rubyRed: '#A4303F',
  amberGold: '#FFD700',
  
  // Backgrounds
  mainBackground: '#F5F5F5',
  darkBackground: '#1A1A1A',
  cardBackground: '#FFFFFF',
  modalBackground: '#2C1810CC',
  
  // Text
  primaryText: '#2C1810',
  secondaryText: '#6B4E71',
  lightText: '#FFFFFF',
  darkText: '#333333',
  
  // Status
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',

  // Theme-specific colors
  primary: '#6A5ACD', // Using mysticPurple as primary
  primaryLight: '#8A7DCD', // Lighter version of primary
  secondary: '#FF69B4', // Using spellPink as secondary
  background: '#F5F5F5', // Using mainBackground
  card: '#FFFFFF', // Using cardBackground
  text: '#2C1810', // Using primaryText
  textSecondary: '#6B4E71', // Using secondaryText
  textLight: '#FFFFFF', // Using lightText
  textMuted: '#9E9E9E',
  white: '#FFFFFF',
  border: '#E0E0E0',
  inactive: '#9E9E9E',
} as const;

// Using system fonts initially
const fonts = {
  magical: Platform.select({
    ios: 'Zapfino',
    android: 'serif',
    default: 'serif',
  }),
  header: Platform.select({
    ios: 'Baskerville',
    android: 'serif',
    default: 'serif',
  }),
  body: Platform.select({
    ios: 'Palatino',
    android: 'serif',
    default: 'serif',
  }),
} as const;

export type Theme = {
  colors: typeof palette;
  spacing: {
    none: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  borderRadii: {
    none: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  shadows: {
    none: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    large: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  breakpoints: {
    phone: number;
    tablet: number;
  };
  textVariants: {
    header: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: keyof typeof palette;
    };
    subheader: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: keyof typeof palette;
    };
    body: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: keyof typeof palette;
    };
    magical: {
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      color: keyof typeof palette;
    };
  };
};

const baseTheme = {
  colors: palette,
  spacing: {
    none: 0,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    none: 0,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
  },
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 6.27,
      elevation: 6,
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    header: {
      fontFamily: fonts.header,
      fontSize: 34,
      lineHeight: 42.5,
      color: 'primaryText',
    },
    subheader: {
      fontFamily: fonts.header,
      fontSize: 28,
      lineHeight: 36,
      color: 'primaryText',
    },
    body: {
      fontFamily: fonts.body,
      fontSize: 16,
      lineHeight: 24,
      color: 'primaryText',
    },
    magical: {
      fontFamily: fonts.magical,
      fontSize: 20,
      lineHeight: 28,
      color: 'mysticPurple',
    },
  },
};

export const theme = createTheme(baseTheme);

export const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    ...palette,
    background: palette.darkBackground,
    card: palette.darkBackground,
    text: palette.lightText,
    textSecondary: palette.lightText,
    textLight: palette.lightText,
    textMuted: '#757575',
    primary: palette.mysticPurple,
    primaryLight: '#8A7DCD',
    secondary: palette.spellPink,
    border: '#424242',
    inactive: '#757575',
  },
});

export default theme; 