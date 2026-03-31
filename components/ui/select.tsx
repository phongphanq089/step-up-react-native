import {
  Brand,
  Colors,
  Radius,
  Semantic,
  Spacing,
  Typography,
} from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string | number
  icon?: keyof typeof MaterialIcons.glyphMap
  description?: string
  color?: string
  disabled?: boolean
}

export type SelectVariant = 'default' | 'filled' | 'outlined' | 'ghost'
export type SelectSize = 'sm' | 'md' | 'lg'

interface BaseSelectProps {
  label?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
  variant?: SelectVariant
  size?: SelectSize
  prefixIcon?: keyof typeof MaterialIcons.glyphMap
}

export type SelectProps =
  | (BaseSelectProps & {
      multiple?: false
      value?: string | number
      onChange?: (value: string | number | undefined) => void
    })
  | (BaseSelectProps & {
      multiple: true
      value?: (string | number)[]
      onChange?: (value: (string | number)[]) => void
      maxSelect?: number
    })


// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHeightForSize(size: SelectSize) {
  return size === 'sm' ? 44 : size === 'lg' ? 64 : 54
}

function getPaddingForSize(size: SelectSize) {
  return size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.lg : Spacing.md
}

function getFontSizeForSize(size: SelectSize) {
  return size === 'sm'
    ? Typography.size.sm
    : size === 'lg'
      ? Typography.size.lg
      : Typography.size.md
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Select(props: SelectProps) {
  const {
    label,
    options,
    placeholder = 'Select an option',
    error,
    hint,
    disabled,
    required,
    searchable = false,
    searchPlaceholder = 'Search...',
    noResultsText = 'No results found',
    variant = 'default',
    size = 'md',
    prefixIcon,
  } = props
  const { theme } = useTheme()
  const c = Colors[theme]
  const isDark = theme === 'dark'

  const sheetRef = useRef<BottomSheetModal>(null)
  const [search, setSearch] = useState('')

  const multiple = props.multiple === true
  const value = props.value
  const maxSelect = props.multiple ? props.maxSelect : undefined

  // Normalize to array for unified logic
  const selected = useMemo<(string | number)[]>(() => {
    if (!value && value !== 0) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  const selectedOptions = useMemo(
    () => options.filter((o) => selected.includes(o.value)),
    [options, selected],
  )

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q),
    )
  }, [options, search])

  const handleOpen = useCallback(() => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    sheetRef.current?.present()
  }, [disabled])

  const handleSelect = useCallback(
    (val: string | number) => {
      if (props.multiple) {
        const isSelected = selected.includes(val)
        let next: (string | number)[]
        if (isSelected) {
          next = selected.filter((v) => v !== val)
        } else {
          if (props.maxSelect && selected.length >= props.maxSelect) return
          next = [...selected, val]
        }
        Haptics.selectionAsync()
        props.onChange?.(next)
      } else {
        Haptics.selectionAsync()
        const singleV: string | number | undefined = val
        const singleOnChange = props.onChange as ((v: string | number | undefined) => void) | undefined
        singleOnChange?.(singleV)
        sheetRef.current?.dismiss()
        setTimeout(() => setSearch(''), 300)
      }
    },
    [props, selected],
  )

  const handleDone = useCallback(() => {
    sheetRef.current?.dismiss()
    setTimeout(() => setSearch(''), 300)
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  )

  // ── Trigger display ──
  const triggerLabel = selectedOptions.length
    ? multiple
      ? selectedOptions.map((o) => o.label).join(', ')
      : selectedOptions[0].label
    : placeholder

  const hasValue = selectedOptions.length > 0

  // ── Variant styles ──
  const triggerBg = (() => {
    if (variant === 'filled')
      return isDark ? c.backgroundSecondary : c.backgroundTertiary
    if (variant === 'outlined') return 'transparent'
    if (variant === 'ghost') return 'transparent'
    return isDark ? c.backgroundSecondary : c.backgroundTertiary
  })()

  const triggerBorderColor = (() => {
    if (error) return Semantic.error
    if (variant === 'outlined') return c.border
    if (variant === 'ghost') return 'transparent'
    return 'transparent'
  })()

  const triggerBorderWidth =
    variant === 'outlined' ? 1.5 : variant === 'ghost' ? 0 : 0

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: c.textSecondary }]}>
          {label}
          {required && <Text style={{ color: Semantic.error }}> *</Text>}
        </Text>
      )}

      {/* Trigger */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={({ pressed }) => [
          styles.trigger,
          {
            height: getHeightForSize(size),
            paddingHorizontal: getPaddingForSize(size),
            backgroundColor: triggerBg,
            borderColor: pressed ? Brand.primary : triggerBorderColor,
            borderWidth: pressed ? 1.5 : triggerBorderWidth,
            opacity: disabled ? 0.5 : 1,
            borderRadius:
              size === 'sm' ? Radius.sm : size === 'lg' ? Radius.xl : Radius.lg,
          },
        ]}
      >
        <View style={styles.triggerContent}>
          {prefixIcon && (
            <MaterialIcons
              name={prefixIcon}
              size={18}
              color={hasValue ? Brand.primary : c.textSecondary}
              style={{ marginRight: 8 }}
            />
          )}
          {!multiple && selectedOptions[0]?.icon && (
            <MaterialIcons
              name={selectedOptions[0].icon}
              size={18}
              color={selectedOptions[0].color ?? Brand.primary}
              style={{ marginRight: 8 }}
            />
          )}
          {multiple && selectedOptions.length > 0 && (
            <View
              style={[styles.multiCount, { backgroundColor: Brand.primary }]}
            >
              <Text style={styles.multiCountText}>
                {selectedOptions.length}
              </Text>
            </View>
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.triggerText,
              {
                fontSize: getFontSizeForSize(size),
                color: hasValue ? c.text : c.textSecondary,
                fontWeight: hasValue ? '500' : '400',
              },
            ]}
          >
            {triggerLabel}
          </Text>
        </View>
        <MaterialIcons name='expand-more' size={22} color={c.textSecondary} />
      </Pressable>

      {/* Error / Hint */}
      {error ? (
        <Text style={[styles.helper, { color: Semantic.error }]}>
          <MaterialIcons name='error-outline' size={12} /> {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.helper, { color: c.textSecondary }]}>{hint}</Text>
      ) : null}

      {/* ── Bottom Sheet ── */}
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={searchable ? ['60%', '90%'] : ['50%', '80%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.borderStrong, width: 40 }}
        enablePanDownToClose
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
      >
        <BottomSheetView style={[styles.sheet, { backgroundColor: c.surface }]}>
          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: c.text }]}>
              {label || placeholder}
            </Text>
            {multiple && (
              <Pressable
                onPress={handleDone}
                style={[styles.doneBtn, { backgroundColor: Brand.primary }]}
              >
                <Text style={styles.doneBtnText}>Done ({selected.length})</Text>
              </Pressable>
            )}
          </View>

          {/* Search */}
          {searchable && (
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDark
                    ? c.backgroundSecondary
                    : c.backgroundTertiary,
                },
              ]}
            >
              <MaterialIcons name='search' size={20} color={c.textSecondary} />
              <TextInput
                placeholder={searchPlaceholder}
                placeholderTextColor={c.textDisabled}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: c.text }]}
                returnKeyType='search'
                clearButtonMode='while-editing'
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <MaterialIcons
                    name='cancel'
                    size={18}
                    color={c.textSecondary}
                  />
                </Pressable>
              )}
            </View>
          )}

          {/* Options List — using standard FlatList (no BottomSheetFlatList to avoid crashes) */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item.value)
              return (
                <Pressable
                  onPress={() => !item.disabled && handleSelect(item.value)}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: pressed
                        ? isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.03)'
                        : isSelected
                          ? Brand.primary + '12'
                          : 'transparent',
                      opacity: item.disabled ? 0.4 : 1,
                    },
                  ]}
                >
                  {/* Option Icon */}
                  {item.icon && (
                    <View
                      style={[
                        styles.optionIcon,
                        {
                          backgroundColor: isSelected
                            ? Brand.primary
                            : isDark
                              ? c.backgroundSecondary
                              : c.backgroundTertiary,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={18}
                        color={
                          isSelected ? '#fff' : (item.color ?? c.textSecondary)
                        }
                      />
                    </View>
                  )}

                  {/* Option Color Dot (when no icon but color is provided) */}
                  {!item.icon && item.color && (
                    <View
                      style={[styles.colorDot, { backgroundColor: item.color }]}
                    />
                  )}

                  {/* Text */}
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? Brand.primary : c.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text
                        style={[styles.optionDesc, { color: c.textSecondary }]}
                      >
                        {item.description}
                      </Text>
                    )}
                  </View>

                  {/* Check */}
                  {isSelected ? (
                    <View
                      style={[styles.check, { backgroundColor: Brand.primary }]}
                    >
                      <MaterialIcons name='check' size={13} color='#fff' />
                    </View>
                  ) : (
                    <View
                      style={[styles.checkEmpty, { borderColor: c.border }]}
                    />
                  )}
                </Pressable>
              )
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons
                  name='search-off'
                  size={48}
                  color={c.textDisabled}
                />
                <Text style={[styles.emptyText, { color: c.textSecondary }]}>
                  {noResultsText}
                </Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.xs },

  label: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },

  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  triggerText: { flex: 1 },
  multiCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 5,
  },
  multiCountText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  helper: {
    fontSize: Typography.size.xs,
    marginTop: 5,
    marginLeft: 2,
  },

  // ── Sheet ──
  sheet: { flex: 1, paddingHorizontal: Spacing.lg },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sheetTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
  },
  doneBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: Typography.size.sm,
    fontWeight: '700',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    height: 48,
    marginBottom: Spacing.md,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.size.md,
    paddingVertical: 8,
  },

  // ── Options ──
  listContent: { paddingBottom: 48 },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginVertical: 2,
    gap: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 4,
  },
  optionText: { flex: 1 },
  optionLabel: { fontSize: Typography.size.md },
  optionDesc: { fontSize: Typography.size.xs, marginTop: 2, lineHeight: 16 },

  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },

  // ── Empty ──
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: {
    marginTop: 12,
    fontSize: Typography.size.md,
    fontWeight: '500',
  },
})
