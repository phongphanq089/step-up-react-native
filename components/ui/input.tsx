import React, { forwardRef, useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, Radius, Semantic } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

export interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: keyof typeof MaterialIcons.glyphMap
  rightIcon?: keyof typeof MaterialIcons.glyphMap
  onRightIconPress?: () => void
  helperText?: string
  required?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      helperText,
      secureTextEntry,
      style,
      required,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const c = Colors[theme]
    const [isFocused, setIsFocused] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const isPassword = secureTextEntry !== undefined

    const getBorderColor = () => {
      if (error) return Semantic.error
      if (isFocused) return c.tint
      return c.border
    }

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: error ? Semantic.error : c.text }]}>
            {label}
            {required && <Text style={{ color: Semantic.error }}> *</Text>}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: c.backgroundSecondary,
              borderColor: getBorderColor(),
            },
          ]}
        >
          {leftIcon && (
            <MaterialIcons
              name={leftIcon}
              size={20}
              color={error ? Semantic.error : c.textSecondary}
              style={styles.leftIcon}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: c.text },
              leftIcon && { paddingLeft: 0 },
              (rightIcon || isPassword) && { paddingRight: 0 },
              style,
            ]}
            placeholderTextColor={c.textSecondary}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            secureTextEntry={isPassword && !isPasswordVisible}
            {...props}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.rightIcon}
              hitSlop={8}
            >
              <MaterialIcons
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={c.textSecondary}
              />
            </Pressable>
          ) : rightIcon ? (
            <Pressable
              onPress={onRightIconPress}
              style={styles.rightIcon}
              disabled={!onRightIconPress}
              hitSlop={8}
            >
              <MaterialIcons
                name={rightIcon}
                size={20}
                color={error ? Semantic.error : c.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: Semantic.error }]}>{error}</Text>
        ) : helperText ? (
          <Text style={[styles.helperText, { color: c.textSecondary }]}>{helperText}</Text>
        ) : null}
      </View>
    )
  }
)

Input.displayName = 'Input'

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    minHeight: 48,
    ...Platform.select({
      ios: { paddingVertical: 12 },
      android: { paddingVertical: 8 },
    }),
  },
  input: {
    flex: 1,
    fontSize: Typography.size.md,
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  rightIcon: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: Typography.size.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: Typography.size.xs,
    marginTop: 4,
  },
})
