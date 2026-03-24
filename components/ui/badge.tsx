import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Semantic } from '@/constants/theme'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

export function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
    default: { bg: c.backgroundTertiary, color: c.textSecondary },
    primary: { bg: c.infoBg, color: c.tint },
    success: { bg: c.successBg, color: Semantic.successDark },
    warning: { bg: c.warningBg, color: Semantic.warningDark },
    error: { bg: c.errorBg, color: Semantic.errorDark },
    info: { bg: c.infoBg, color: Semantic.infoDark },
  }

  const { bg, color } = variantStyles[variant]

  return (
    <View style={[
      styles.base,
      size === 'sm' ? styles.sm : styles.md,
      { backgroundColor: bg },
    ]}>
      <Text style={[styles.text, size === 'sm' ? styles.textSm : styles.textMd, { color }]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: Radius.full, alignSelf: 'flex-start' },
  sm: { paddingHorizontal: 8, paddingVertical: 2 },
  md: { paddingHorizontal: 12, paddingVertical: 4 },
  text: { fontWeight: '600' },
  textSm: { fontSize: 11 },
  textMd: { fontSize: 12 },
})
