import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

type ChipVariant = 'filled' | 'outline' | 'soft'

interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  onRemove?: () => void
  icon?: keyof typeof MaterialIcons.glyphMap
  variant?: ChipVariant
  disabled?: boolean
}

export function Chip({
  label,
  selected = false,
  onPress,
  onRemove,
  icon,
  variant = 'soft',
  disabled = false,
}: ChipProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const bgColor =
    variant === 'filled'
      ? selected ? Brand.primary : c.backgroundTertiary
      : variant === 'soft'
      ? selected ? c.infoBg : c.backgroundTertiary
      : 'transparent'

  const textColor =
    variant === 'filled'
      ? selected ? '#fff' : c.text
      : selected ? c.tint : c.text

  const borderColor = selected ? c.tint : c.border

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.chip,
        { backgroundColor: bgColor, borderColor },
        variant === 'outline' && styles.outlined,
        disabled && styles.disabled,
      ]}
    >
      {icon && (
        <MaterialIcons name={icon} size={14} color={textColor} style={styles.chipIcon} />
      )}
      <Text style={[styles.chipLabel, { color: textColor }]}>{label}</Text>
      {onRemove && (
        <Pressable onPress={disabled ? undefined : onRemove} hitSlop={6} style={styles.removeBtn}>
          <MaterialIcons name='close' size={14} color={textColor} />
        </Pressable>
      )}
    </Pressable>
  )
}

// ─── Chip Group ───────────────────────────────────────────────────────────────

interface ChipGroupProps {
  chips: string[]
  selected: string[]
  onToggle: (chip: string) => void
  scrollable?: boolean
}

export function ChipGroup({ chips, selected, onToggle, scrollable = false }: ChipGroupProps) {
  const content = (
    <View style={[styles.group, scrollable && { flexWrap: 'nowrap' }]}>
      {chips.map((chip) => (
        <Chip
          key={chip}
          label={chip}
          selected={selected.includes(chip)}
          onPress={() => onToggle(chip)}
          variant='soft'
        />
      ))}
    </View>
  )

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {content}
      </ScrollView>
    )
  }
  return content
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  outlined: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  chipIcon: { marginRight: 4 },
  chipLabel: { fontSize: Typography.size.sm, fontWeight: '500' },
  removeBtn: { marginLeft: 4 },
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
})
