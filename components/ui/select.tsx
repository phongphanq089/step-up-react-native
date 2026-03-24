import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string | number
  icon?: keyof typeof MaterialIcons.glyphMap
  description?: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
}

/**
 * Premium Select Component
 * Sử dụng BottomSheet cho cảm giác native, hỗ trợ Haptics và Search.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Chọn một tùy chọn',
  error,
  disabled,
  required,
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
  noResultsText = 'Không tìm thấy kết quả',
}: SelectProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const isDark = theme === 'dark'

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [search, setSearch] = useState('')

  // Tìm option đang được chọn
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  )

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lowerSearch = search.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.description?.toLowerCase().includes(lowerSearch),
    )
  }, [options, search])

  const handleOpen = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      bottomSheetModalRef.current?.present()
    }
  }, [disabled])

  const handleSelect = useCallback(
    (val: string | number) => {
      Haptics.selectionAsync()
      onChange?.(val)
      bottomSheetModalRef.current?.dismiss()
      // Reset search sau khi đóng
      setTimeout(() => setSearch(''), 300)
    },
    [onChange],
  )

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

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: c.textSecondary }]}>
          {label}
          {required && <Text style={{ color: Colors.light.error }}> *</Text>}
        </Text>
      )}

      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={
          selectedOption ? `Đang chọn: ${selectedOption.label}` : placeholder
        }
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: isDark
              ? c.backgroundSecondary
              : c.backgroundTertiary,
            borderColor: error
              ? Colors.light.error
              : pressed
                ? Brand.primary
                : 'transparent',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.triggerContent}>
          {selectedOption?.icon && (
            <MaterialIcons
              name={selectedOption.icon}
              size={20}
              color={Brand.primary}
              style={{ marginRight: 10 }}
            />
          )}
          <Text
            style={[
              styles.valueText,
              {
                color: selectedOption ? c.text : c.textSecondary,
                fontWeight: selectedOption ? '500' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <MaterialIcons name='unfold-more' size={22} color={c.textSecondary} />
      </Pressable>

      {error && (
        <Text style={[styles.errorText, { color: Colors.light.error }]}>
          {error}
        </Text>
      )}

      {/* Bottom Sheet Picker */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={searchable ? ['60%', '90%'] : ['45%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.borderStrong, width: 40 }}
        enablePanDownToClose
        keyboardBehavior='extend'
        keyboardBlurBehavior='restore'
      >
        <BottomSheetView
          style={[styles.sheetContent, { backgroundColor: c.surface }]}
        >
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: c.text }]}>
              {label || placeholder}
            </Text>
          </View>

          {searchable && (
            <View
              style={[
                styles.searchWrapper,
                {
                  backgroundColor: isDark
                    ? c.backgroundSecondary
                    : c.backgroundTertiary,
                },
              ]}
            >
              <MaterialIcons name='search' size={20} color={c.textSecondary} />
              <BottomSheetTextInput
                placeholder={searchPlaceholder}
                placeholderTextColor={c.textDisabled}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: c.text }]}
                returnKeyType='search'
                clearButtonMode='while-editing'
              />
            </View>
          )}

          <BottomSheetFlatList
            data={filteredOptions}
            keyExtractor={(item: any) => item.value.toString()}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: any) => {
              const isSelected = item.value === value
              return (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  style={({ pressed }) => [
                    styles.optionItem,
                    {
                      backgroundColor: pressed
                        ? isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.03)'
                        : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.optionMain}>
                    {item.icon && (
                      <View
                        style={[
                          styles.iconBox,
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
                          color={isSelected ? '#FFF' : c.textSecondary}
                        />
                      </View>
                    )}
                    <View style={styles.optionTextContainer}>
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
                          style={[
                            styles.optionDesc,
                            { color: c.textSecondary },
                          ]}
                        >
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <MaterialIcons name='check' size={14} color='#FFF' />
                    </View>
                  )}
                </Pressable>
              )
            }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
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

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  valueText: {
    fontSize: Typography.size.md,
    flex: 1,
  },
  errorText: {
    fontSize: Typography.size.xs,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sheetHeader: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    height: 48,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: Typography.size.md,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginVertical: 2,
  },
  optionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.size.md,
  },
  optionDesc: {
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: Typography.size.md,
    fontWeight: '500',
  },
})
