import { Image, ImageProps } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { Colors, Radius, Shadows, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'

interface CardProps extends ViewProps {
  children: React.ReactNode
  variant?: 'flat' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  title?: string
  onPress?: () => void
  gradientColors?: readonly [string, string, ...string[]]
}

/**
 * Card component for grouping content.
 * Supports elevation, outlines, gradients, and pressable states.
 */
export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  title,
  style,
  onPress,
  gradientColors,
  ...rest
}: CardProps) {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]

  const paddingValue = {
    none: 0,
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
  }[padding]

  const cardStyle: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: gradientColors ? 'transparent' : c.surface,
      borderRadius: Radius.lg,
      padding: paddingValue,
    },
    variant === 'elevated' && !gradientColors ? Shadows.md : {},
    variant === 'outlined' ? { borderWidth: 1, borderColor: c.border } : {},
    style as ViewStyle,
  ]

  const content = (
    <ThemedView
      style={gradientColors ? { padding: paddingValue } : cardStyle}
      {...rest}
    >
      {title && (
        <ThemedText
          style={[styles.title, { color: c.text, marginBottom: Spacing.sm }]}
        >
          {title}
        </ThemedText>
      )}
      {children}
    </ThemedView>
  )

  const Container = onPress ? Pressable : View

  if (gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          { borderRadius: Radius.lg, overflow: 'hidden' },
          variant === 'elevated' && Shadows.md,
          style as ViewStyle,
        ]}
      >
        <Container onPress={onPress} style={{ width: '100%' }}>
          {content}
        </Container>
      </LinearGradient>
    )
  }

  return (
    <Container
      onPress={onPress}
      style={[
        { borderRadius: Radius.lg, overflow: 'hidden' },
        onPress ? undefined : cardStyle,
      ]}
    >
      {onPress ? <View style={cardStyle}>{content}</View> : content}
    </Container>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

Card.Header = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}) => <View style={[styles.header, style]}>{children}</View>

Card.Content = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}) => <View style={[styles.content, style]}>{children}</View>

Card.Footer = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}) => <View style={[styles.footer, style]}>{children}</View>

Card.Image = ({
  source,
  style,
  aspectRatio = 16 / 9,
  ...rest
}: ImageProps & { aspectRatio?: number }) => (
  <Image
    source={source}
    style={[{ width: '100%', aspectRatio }, style]}
    contentFit='cover'
    {...rest}
  />
)

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: '700' },
  header: {
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.1)',
    marginBottom: Spacing.sm,
  },
  content: {
    paddingVertical: Spacing.xs,
  },
  footer: {
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.1)',
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
