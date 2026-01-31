// Notion-inspired theme constants for consistent styling across the app

export const Colors = {
  // Primary colors - Notion-style subtle blue
  primary: '#2383E2',
  primaryDark: '#1F6FBD',
  primaryLight: '#5EAAF6',
  
  // Background colors - Notion's clean palette
  background: '#ffffffff',
  backgroundSecondary: '#fafafa',
  backgroundTertiary: '#F7F6F3',
  surface: '#ffffffff',
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
  
  // Status colors
  success: '#0F7B6C',
  warning: '#E6A23C',
  error: '#E03E3E',
  info: '#2383E2',
  
  // Accent colors - Notion's accent palette
  favorite: '#FFA344',
  purple: '#9065B0',
  pink: '#E255A1',
  red: '#E03E3E',
  brown: '#9F6B53',
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
