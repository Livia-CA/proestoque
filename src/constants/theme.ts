import { Platform } from 'react-native';

const brandPrimary = '#7C3AED';
const brandPrimaryDark = '#5B21B6';
const textPrimary = '#111827';
const textSecondary = '#6B7280';
const borderDefault = '#D1D5DB';

export const Colors = {
  light: {
    text: textPrimary,
    background: '#F5F7FB',
    tint: brandPrimary,
    icon: '#8F95A3',
    tabIconDefault: '#8F95A3',
    tabIconSelected: brandPrimary,
  },
  dark: {
    text: '#E5E7EB',
    background: '#0F172A',
    tint: '#A78BFA',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#A78BFA',
  },
};

export const ProEstoqueTheme = {
  colors: {
    brandPrimary,
    brandPrimaryDark,
    brandPrimarySoft: '#EDE9FE',
    background: '#F5F7FB',
    surface: '#FFFFFF',
    textPrimary,
    textSecondary,
    textInverse: '#FFFFFF',
    borderDefault,
    borderFocused: '#8B5CF6',
    borderError: '#EF4444',
    successBg: '#DCFCE7',
    successText: '#047857',
    successBorder: '#86EFAC',
    danger: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
  typography: {
    h1: 32,
    h2: 24,
    h3: 18,
    body: 16,
    bodySm: 14,
    caption: 12,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Avenir Next',
  },
  default: {
    sans: 'sans-serif',
  },
  web: {
    sans: "'Avenir Next', 'Nunito Sans', 'Trebuchet MS', sans-serif",
  },
});
