import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
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

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  label?: string
  onPress?: () => void
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  gradient?: readonly [string, string, ...string[]]
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
  gradient,
  style,
}: ButtonProps) {
  const { theme } = useTheme() as { theme: 'light' | 'dark' }
  const c = Colors[theme]
  const isDisabled = disabled || loading
  const isGradient = variant === 'gradient'
  const gradientColors = gradient ?? c.gradients.primary
  const isIconOnly = !label && (!!leftIcon || !!rightIcon)

  const containerStyle = [
    styles.base,
    styles[`size_${size}`],
    variant === 'primary' && { backgroundColor: c.colorPrimary },
    variant === 'secondary' && { backgroundColor: c.colorSecondary },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: c.colorPrimary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    isGradient && { backgroundColor: 'transparent' },
    isDisabled && styles.disabled,
    fullWidth && { width: '100%' as const },
    isIconOnly && styles.iconOnly,
  ]

  const textColor =
    variant === 'primary' || isGradient
      ? '#fff'
      : variant === 'secondary'
        ? c.text
        : c.colorPrimary

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={textColor} size='small' />
      ) : (
        <View style={styles.inner}>
          {leftIcon && (
            <View
              style={[styles.iconContainer, !isIconOnly && styles.iconLeft]}
            >
              {typeof leftIcon === 'string' ? (
                <MaterialIcons
                  name={leftIcon as any}
                  size={isIconOnly ? 24 : 20}
                  color={textColor}
                />
              ) : (
                leftIcon
              )}
            </View>
          )}

          {label && (
            <Text
              style={[
                styles.label,
                styles[`label_${size}`],
                { color: textColor },
              ]}
            >
              {label}
            </Text>
          )}

          {rightIcon && (
            <View
              style={[styles.iconContainer, !isIconOnly && styles.iconRight]}
            >
              {typeof rightIcon === 'string' ? (
                <MaterialIcons
                  name={rightIcon as any}
                  size={isIconOnly ? 24 : 20}
                  color={textColor}
                />
              ) : (
                rightIcon
              )}
            </View>
          )}
        </View>
      )}
    </>
  )

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        { width: fullWidth ? '100%' : 'auto' },
        style as any,
      ]}
    >
      {({ pressed }) =>
        isGradient ? (
          <LinearGradient
            colors={gradientColors as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              containerStyle,
              pressed && !isDisabled && styles.pressed,
              style as any,
            ]}
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            style={[containerStyle, pressed && !isDisabled && styles.pressed]}
          >
            {content}
          </View>
        )
      }
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
  iconContainer: { justifyContent: 'center', alignItems: 'center' },
  iconLeft: { marginRight: Spacing.xs },
  iconRight: { marginLeft: Spacing.xs },
  iconOnly: {
    paddingHorizontal: 0,
    width: 44, // Default square for md
    height: 44,
    borderRadius: Radius.full,
  },
  label: { fontWeight: '600' },
  label_sm: { fontSize: Typography.size.sm },
  label_md: { fontSize: Typography.size.md },
  label_lg: { fontSize: Typography.size.lg },
})
