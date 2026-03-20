/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

// 1. Định nghĩa Palette màu chủ đạo (Brand Palette)
const Brand = {
  primary: '#166fddff',
  secondary: '#ffd33d',
  black: '#25292e',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    800: '#1f2937',
    900: '#111827',
  },
}

export const Colors = {
  light: {
    text: Brand.gray[900],
    background: Brand.white,
    tint: Brand.primary,
    headerBackground: Brand.white,
    headerText: Brand.black,
    tabBackground: Brand.white,
    icon: Brand.gray[500],
    tabIconDefault: Brand.gray[500],
    tabIconSelected: Brand.primary,
  },
  dark: {
    text: Brand.gray[100],
    background: Brand.gray[900],
    tint: Brand.white,
    headerBackground: Brand.black,
    headerText: Brand.white,
    tabBackground: Brand.black,
    icon: Brand.gray[500],
    tabIconDefault: Brand.gray[500],
    tabIconSelected: Brand.secondary,
  },
}

export const Fonts = {
  Playfair: {
    regular: 'PlayfairDisplay-Regular',
    bold: 'PlayfairDisplay-Bold',
    semiBold: 'PlayfairDisplay-SemiBold',
    black: 'PlayfairDisplay-Black',
    extraBold: 'PlayfairDisplay-ExtraBold',
    italic: 'PlayfairDisplay-Italic',
    medium: 'PlayfairDisplay-Medium',
  },
  // Các phím cũ để tương thích với code hiện tại (ví dụ: explore.tsx)
  rounded: 'PlayfairDisplay-Regular',
  mono: 'PlayfairDisplay-Regular',
  // Hệ thống fallback
  system: Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
    },
    default: {
      sans: 'normal',
      serif: 'serif',
    },
  }),
}
