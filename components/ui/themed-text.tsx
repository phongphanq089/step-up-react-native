import { StyleSheet, Text, type TextProps } from 'react-native'

import { Fonts } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
  size?: number
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  size,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        size ? { fontSize: size } : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.Playfair.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: Fonts.Playfair.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.Playfair.bold,
    fontSize: 32,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: Fonts.Playfair.semiBold,
    fontSize: 20,
  },
  link: {
    fontFamily: Fonts.Playfair.regular,
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
})
