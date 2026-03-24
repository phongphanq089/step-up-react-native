import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  label: string
  onPress?: () => void
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const isDisabled = disabled || loading

  const containerStyle = [
    styles.base,
    styles[`size_${size}`],
    variant === 'primary' && { backgroundColor: Brand.primary },
    variant === 'secondary' && { backgroundColor: Brand.secondary },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: c.tint,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    isDisabled && styles.disabled,
    fullWidth && { width: '100%' as const },
  ]

  const textColor =
    variant === 'primary'
      ? '#fff'
      : variant === 'secondary'
        ? Brand.black
        : c.tint

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        containerStyle,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size='small' />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.label,
              styles[`label_${size}`],
              { color: textColor },
            ]}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  size_sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minHeight: 32,
  },
  size_md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    minHeight: 52,
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
  inner: { flexDirection: 'row', alignItems: 'center' },
  iconLeft: { marginRight: Spacing.xs },
  iconRight: { marginLeft: Spacing.xs },
  label: { fontWeight: '600' },
  label_sm: { fontSize: Typography.size.sm },
  label_md: { fontSize: Typography.size.md },
  label_lg: { fontSize: Typography.size.lg },
})
