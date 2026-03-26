/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

export function useThemeColor<T extends keyof typeof Colors.light & keyof typeof Colors.dark>(
  props: { light?: string; dark?: string },
  colorName: T
): (typeof Colors.light)[T] | string {
  const { theme } = useTheme() as { theme: 'light' | 'dark' };
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // @ts-ignore - Colors[theme] is light | dark, but they share the same keys
    return Colors[theme][colorName];
  }
}
