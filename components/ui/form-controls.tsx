import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

// ─── Radio ────────────────────────────────────────────────────────────────────

interface RadioOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

interface RadioGroupProps<T extends string> {
  options: RadioOption<T>[]
  value: T
  onChange: (val: T) => void
  label?: string
}

export function RadioGroup<T extends string>({ options, value, onChange, label }: RadioGroupProps<T>) {
  const { theme } = useTheme()
  const c = Colors[theme]

  return (
    <View>
      {label && <Text style={[styles.groupLabel, { color: c.text }]}>{label}</Text>}
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <Pressable
            key={opt.value}
            onPress={() => !opt.disabled && onChange(opt.value)}
            style={[styles.radioRow, opt.disabled && styles.disabled]}
          >
            <View style={[styles.radioOuter, { borderColor: selected ? Brand.primary : c.border }]}>
              {selected && <View style={[styles.radioInner, { backgroundColor: Brand.primary }]} />}
            </View>
            <Text style={[styles.radioLabel, { color: opt.disabled ? c.textDisabled : c.text }]}>
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
  disabled?: boolean
  indeterminate?: boolean
}

export function Checkbox({ checked, onChange, label, disabled, indeterminate }: CheckboxProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = () => {
    if (disabled) return
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start()
    onChange(!checked)
  }

  const active = checked || indeterminate
  const boxColor = active ? Brand.primary : c.border
  const boxBg = active ? Brand.primary : 'transparent'

  return (
    <Pressable onPress={handlePress} style={[styles.checkRow, disabled && styles.disabled]}>
      <Animated.View
        style={[
          styles.checkBox,
          { borderColor: boxColor, backgroundColor: boxBg, transform: [{ scale }] },
        ]}
      >
        {indeterminate ? (
          <View style={styles.indeterminateLine} />
        ) : checked ? (
          <Text style={styles.checkMark}>✓</Text>
        ) : null}
      </Animated.View>
      {label && <Text style={[styles.checkLabel, { color: disabled ? c.textDisabled : c.text }]}>{label}</Text>}
    </Pressable>
  )
}

// ─── Switch ───────────────────────────────────────────────────────────────────

interface SwitchProps {
  value: boolean
  onChange: (val: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ value, onChange, label, disabled }: SwitchProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const translate = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(translate, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start()
  }, [value])

  const trackColor = translate.interpolate({
    inputRange: [0, 1],
    outputRange: [c.border, Brand.primary],
  })

  const thumbTranslate = translate.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      style={[styles.switchRow, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track2, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]} />
      </Animated.View>
      {label && (
        <Text style={[styles.switchLabel, { color: disabled ? c.textDisabled : c.text }]}>{label}</Text>
      )}
    </Pressable>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  groupLabel: { fontSize: Typography.size.md, fontWeight: '600', marginBottom: Spacing.sm },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  radioLabel: { fontSize: Typography.size.md },
  disabled: { opacity: 0.4 },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  checkBox: {
    width: 20, height: 20, borderRadius: Radius.xs, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  indeterminateLine: { width: 10, height: 2, backgroundColor: '#fff', borderRadius: 1 },
  checkLabel: { fontSize: Typography.size.md },

  switchRow: { flexDirection: 'row', alignItems: 'center' },
  track2: {
    width: 48, height: 28, borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  switchLabel: { marginLeft: Spacing.sm, fontSize: Typography.size.md },
})
