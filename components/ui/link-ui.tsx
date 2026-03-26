import { Colors } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { Href, Link } from 'expo-router'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { TextProps } from 'react-native-svg'
import { HStack } from './stack'
import { ThemedText } from './themed-text'

export type LinkUiProps = TextProps & {
  href: Href
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  gap?: number
  bg?: 'transparent' | 'default'
}

export function LinkUi({
  href,
  children,
  icon,
  iconPosition,
  gap = 6,
  bg,

  ...rest
}: LinkUiProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const bgStyle: ViewStyle =
    bg === 'default'
      ? {
          backgroundColor: c.background,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme === 'light' ? '#eee' : '#333',
        }
      : {
          backgroundColor: 'transparent',
        }
  return (
    <Link href={href} style={{ backgroundColor: 'transparent' }}>
      <HStack
        spacing={gap}
        align='center'
        justify='space-between'
        style={[styles.container, bgStyle]}
      >
        {iconPosition === 'left' && icon}

        <ThemedText style={[{ color: c.colorSecondary }]} {...rest}>
          {children}
        </ThemedText>

        {iconPosition === 'right' && icon}
      </HStack>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})
