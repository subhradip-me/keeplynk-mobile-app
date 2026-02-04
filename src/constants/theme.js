// Notion-inspired theme constants for consistent styling across the app

// Shared colors (theme-independent)
export const Colors = {
  // Primary colors
  primary: '#2383E2',
  primaryDark: '#1F6FBD',
  primaryLight: '#5EAAF6',
  
  // Status colors
  success: '#0F7B6C',
  successDark: '#0A5C50',
  warning: '#E6A23C',
  warningDark: '#C58A2F',
  error: '#E03E3E',
  errorDark: '#C13434',
  info: '#2383E2',
  
  // Accent colors - Notion's accent palette
  favorite: '#FFA344',
  purple: '#9065B0',
  pink: '#E255A1',
  red: '#E03E3E',
  brown: '#9F6B53',
};

export const LightTheme = {
  // Background colors - Notion's clean palette
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  backgroundTertiary: '#F7F6F3',
  surface: '#FFFFFF',
  surfaceHover: '#F7F6F3',
  
  // Text colors - Notion's text hierarchy
  textPrimary: '#37352F',
  textSecondary: '#787774',
  textTertiary: '#9B9A97',
  textDisabled: '#C5C4C0',
  
  // Border colors - Very subtle
  border: '#E9E9E7',
  borderLight: '#F1F1EF',
  divider: '#EBEBEA',
  
  // Primary colors
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  primaryLight: Colors.primaryLight,
  
  // Status colors
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
  
  // Accent colors
  favorite: Colors.favorite,
  purple: Colors.purple,
  pink: Colors.pink,
  red: Colors.red,
  brown: Colors.brown,
};

export const DarkTheme = {
  // Background colors - Dark mode palette (using reversed scale)
  background: '#0F0F0F',          // 900 - Darkest background
  backgroundSecondary: '#1C1C1C', // 800 - Secondary surfaces
  backgroundTertiary: '#3C3C3C',  // 700 - Tertiary/elevated surfaces
  surface: '#2C2C2C',             // 800 - Card/modal surfaces 1C1C1C
  surfaceHover: '#1C1C1C',        // 700 - Hover state for surfaces
  
  // Text colors - Dark mode text hierarchy
  textPrimary: '#F4F4F4',         // 100 - Highest contrast text
  textSecondary: '#BFBFBF',       // 300 - Secondary text
  textTertiary: '#9B9B9B',        // 400 - Tertiary text
  textDisabled: '#7A7A7A',        // 500 - Disabled text
  
  // Border colors - Subtle dark borders
  border: '#5A5A5A',              // 600 - Default borders
  borderLight: '#3C3C3C',         // 700 - Subtle borders
  divider: '#3C3C3C',             // 700 - Divider lines
  
  // Primary colors (slightly adjusted for dark mode)
  primary: Colors.primaryLight,
  primaryDark: Colors.primary,
  primaryLight: '#7BB8FA',
  
  // Status colors (brighter for dark mode)
  success: '#10A37F',
  warning: '#F5B94D',
  error: '#F15B5B',
  info: Colors.primaryLight,
  
  // Accent colors (slightly brighter for dark mode)
  favorite: '#FFB366',
  purple: '#A57BC8',
  pink: '#F170B8',
  red: '#F15B5B',
  brown: '#B8836A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  huge: 40,
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Notion uses very subtle shadows
export const Shadows = {
  none: {},
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.024,
    shadowRadius: 2,
    elevation: 1,
  },
  small: {
    shadowColor: '#00000012',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#00000015',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
};
