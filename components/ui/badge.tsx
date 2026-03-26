import { Colors, Radius } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import React from 'react'
import { StyleSheet } from 'react-native'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'

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
    primary: { bg: c.colorPrimary, color: c.text },
    success: { bg: c.successBg, color: c.text },
    warning: { bg: c.warningBg, color: c.text },
    error: { bg: c.errorBg, color: c.text },
    info: { bg: c.infoBg, color: c.text },
  }

  const { bg, color } = variantStyles[variant]

  return (
    <ThemedView
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: bg },
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color },
        ]}
      >
        {label}
      </ThemedText>
    </ThemedView>
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
