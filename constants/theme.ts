import { Platform } from 'react-native'

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const Brand = {
  primary: '#166FDD',
  primaryLight: '#4338ca',
  primaryDark: '#7c3aed',
  secondary: '#FFD33D',
  secondaryLight: '#f59e0b',
  secondaryDark: '#FFD33D',
  black: '#25292E',
  white: '#FFFFFF',
}

// ─── Neutral Palette ──────────────────────────────────────────────────────────
export const Neutral = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
}

// ─── Semantic Colors ──────────────────────────────────────────────────────────
export const Semantic = {
  success: '#22C55E',
  successLight: '#22C55E',
  successDark: '#22C55E',
  warning: '#F59E0B',
  warningLight: '#F59E0B',
  warningDark: '#F59E0B',
  error: '#EF4444',
  errorLight: '#EF4444',
  errorDark: '#EF4444',
  info: '#3B82F6',
  infoLight: '#3B82F6',
  infoDark: '#3B82F6',
}

// ─── Colors by Theme ──────────────────────────────────────────────────────────
export const Colors = {
  light: {
    //color
    colorPrimary: Brand.primaryLight,
    colorSecondary: Brand.secondaryLight,
    // General
    text: Neutral[900],
    textSecondary: Neutral[500],
    textDisabled: Neutral[300],
    // Backgrounds
    background: Brand.white,
    backgroundSecondary: Neutral[50],
    backgroundTertiary: Neutral[100],
    surface: Brand.white,
    surfaceRaised: Brand.white,
    // Borders
    border: Neutral[200],
    borderStrong: Neutral[300],
    // Brand
    tint: Brand.primary,
    // Navigation
    headerBackground: Brand.white,
    headerText: Neutral[900],
    tabBackground: Brand.white,
    icon: Neutral[500],
    tabIconDefault: Neutral[500],
    tabIconSelected: Brand.primary,
    // Overlays
    backdrop: 'rgba(0,0,0,0.5)',
    // Semantic
    success: Semantic.success,
    successBg: Semantic.successLight,
    warning: Semantic.warning,
    warningBg: Semantic.warningLight,
    error: Semantic.error,
    errorBg: Semantic.errorLight,
    info: Semantic.info,
    infoBg: Semantic.infoLight,
    // Gradients
    gradients: {
      primary: ['#166FDD', '#4338ca'],
      secondary: ['#FFD33D', '#f59e0b'],
      surface: [Brand.white, Neutral[50]],
      fade: ['rgba(255,255,255,0)', Brand.white],
    } as const,
  },
  dark: {
    //color
    colorPrimary: Brand.primaryDark,
    colorSecondary: Brand.secondaryDark,
    text: Neutral[50],
    textSecondary: Neutral[400],
    textDisabled: Neutral[600],
    background: Neutral[900],
    backgroundSecondary: Neutral[800],
    backgroundTertiary: Neutral[700],
    surface: Neutral[800],
    surfaceRaised: Neutral[700],
    border: Neutral[700],
    borderStrong: Neutral[600],
    tint: Brand.primaryLight,
    headerBackground: Brand.black,
    headerText: Brand.white,
    tabBackground: Brand.black,
    icon: Neutral[400],
    tabIconDefault: Neutral[400],
    tabIconSelected: Brand.primaryLight,
    backdrop: 'rgba(0,0,0,0.7)',
    success: Semantic.success,
    successBg: Semantic.successDark,
    warning: Semantic.warning,
    warningBg: Semantic.warningDark,
    error: Semantic.error,
    errorBg: Semantic.errorDark,
    info: Semantic.infoDark,
    infoBg: Semantic.infoDark,
    // Gradients
    gradients: {
      primary: ['#7c3aed', '#4338ca'],
      secondary: ['#FFD33D', '#f59e0b'],
      surface: [Neutral[800], Neutral[900]],
      fade: ['rgba(17,24,39,0)', Neutral[900]],
    } as const,
  },
}

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
}

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
}

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const Fonts = {
  Playfair: {
    regular: 'Roboto-Regular',
    bold: 'Roboto-Bold',
    semiBold: 'Roboto-SemiBold',
    black: 'Roboto-Black',
    extraBold: 'Roboto-ExtraBold',
    italic: 'Roboto-Italic',
    medium: 'Roboto-Medium',
  },
  rounded: 'Roboto-Regular',
  mono: 'Roboto-Regular',
  system: Platform.select({
    ios: { sans: 'system-ui', serif: 'ui-serif' },
    default: { sans: 'normal', serif: 'serif' },
  }),
}
