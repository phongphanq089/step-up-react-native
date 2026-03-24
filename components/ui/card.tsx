import React from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme'

interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: 'flat' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  title?: string
}

export function Card({ children, variant = 'elevated', padding = 'md', title, style, ...rest }: CardProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const paddingValue = { none: 0, sm: Spacing.sm, md: Spacing.md, lg: Spacing.lg }[padding]

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: c.surface, borderRadius: Radius.lg, padding: paddingValue },
        variant === 'elevated' && Shadows.md,
        variant === 'outlined' && { borderWidth: 1, borderColor: c.border },
        style,
      ]}
      {...rest}
    >
      {title && (
        <Text style={[styles.title, { color: c.text, marginBottom: Spacing.sm }]}>{title}</Text>
      )}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  title: { fontSize: 17, fontWeight: '600' },
})
