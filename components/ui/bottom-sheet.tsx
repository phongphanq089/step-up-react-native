/**
 * AppBottomSheet — Wrapper cho @gorhom/bottom-sheet
 *
 * Dùng BottomSheetModal + BottomSheetModalProvider để render TRÊN tab bar.
 *
 * 4 loại:
 * - SimpleSheet     — content đơn giản
 * - ScrollableSheet — cuộn nội dung dài (không conflict gesture)
 * - ActionSheet     — menu actions kiểu iOS
 * - FormSheet       — có TextInput, xử lý keyboard
 *
 * Setup trong _layout.tsx:
 *   import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
 *   <BottomSheetModalProvider> ... app ... </BottomSheetModalProvider>
 */

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Brand, Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'
import { MaterialIcons } from '@expo/vector-icons'
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AppBottomSheetRef {
  open: () => void
  close: () => void
  snapTo: (index: number) => void
}

export interface SheetAction {
  label: string
  icon?: keyof typeof MaterialIcons.glyphMap
  onPress: () => void
  destructive?: boolean
  disabled?: boolean
}

interface BaseSheetProps {
  snapPoints?: (string | number)[]
  title?: string
  children: React.ReactNode
  enableDynamicSizing?: boolean
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────

function SheetBackdrop(props: any) {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      pressBehavior='close'
    />
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function SheetHeader({
  title,
  onClose,
  c,
}: {
  title?: string
  onClose: () => void
  c: any
}) {
  if (!title) return null
  return (
    <View style={[styles.header, { borderBottomColor: c.border }]}>
      <Text style={[styles.headerTitle, { color: c.text }]}>{title}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
        <MaterialIcons name='close' size={20} color={c.textSecondary} />
      </TouchableOpacity>
    </View>
  )
}

// ─── 1. Simple Sheet ──────────────────────────────────────────────────────────

/**
 * Content tĩnh đơn giản, không cần scroll.
 * Dùng cho: thông báo, confirm, form nhỏ.
 */
export const SimpleSheet = forwardRef<AppBottomSheetRef, BaseSheetProps>(
  (
    {
      snapPoints = ['40%', '70%'],
      title,
      children,
      enableDynamicSizing = false,
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const c = Colors[theme]
    const sheetRef = useRef<BottomSheetModal>(null)
    const points = useMemo(() => snapPoints, [])

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
      snapTo: (i) => sheetRef.current?.snapToIndex(i),
    }))

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={enableDynamicSizing ? undefined : points}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose
        backdropComponent={SheetBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.border }}
      >
        <BottomSheetView style={styles.content}>
          <SheetHeader
            title={title}
            onClose={() => sheetRef.current?.dismiss()}
            c={c}
          />
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

// ─── 2. Scrollable Sheet ──────────────────────────────────────────────────────

/**
 * Nội dung dài có thể cuộn — kéo handle & scroll nội dung không conflict.
 */
export const ScrollableSheet = forwardRef<AppBottomSheetRef, BaseSheetProps>(
  ({ snapPoints = ['50%', '90%'], title, children }, ref) => {
    const { theme } = useTheme()
    const c = Colors[theme]
    const sheetRef = useRef<BottomSheetModal>(null)
    const points = useMemo(() => snapPoints, [])

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
      snapTo: (i) => sheetRef.current?.snapToIndex(i),
    }))

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={points}
        enablePanDownToClose
        backdropComponent={SheetBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.border }}
      >
        <SheetHeader
          title={title}
          onClose={() => sheetRef.current?.dismiss()}
          c={c}
        />
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)

// ─── 3. Action Sheet ──────────────────────────────────────────────────────────

/**
 * Danh sách actions — kiểu iOS Action Sheet.
 * Hỗ trợ icon, destructive, disabled.
 *
 * NOTE: Dùng .map() thay vì BottomSheetFlatList để tránh lỗi _scrollRef null.
 */
interface ActionSheetProps {
  actions: SheetAction[]
  title?: string
  cancelLabel?: string
}

export const ActionSheet = forwardRef<AppBottomSheetRef, ActionSheetProps>(
  ({ actions, title, cancelLabel = 'Cancel' }, ref) => {
    const { theme } = useTheme()
    const c = Colors[theme]
    const sheetRef = useRef<BottomSheetModal>(null)

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
      snapTo: (i) => sheetRef.current?.snapToIndex(i),
    }))

    return (
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={SheetBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.border }}
      >
        <BottomSheetView>
          {title && (
            <Text
              style={[
                styles.actionTitle,
                { color: c.textSecondary, borderBottomColor: c.border },
              ]}
            >
              {title}
            </Text>
          )}

          {/* Plain map — avoid BottomSheetFlatList _scrollRef null crash */}
          {actions.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                item.onPress()
                sheetRef.current?.dismiss()
              }}
              disabled={item.disabled}
              style={[styles.actionItem, { borderBottomColor: c.border }]}
              activeOpacity={0.7}
            >
              {item.icon && (
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={
                    item.destructive
                      ? c.error
                      : item.disabled
                        ? c.textDisabled
                        : c.text
                  }
                  style={styles.actionIcon}
                />
              )}
              <Text
                style={[
                  styles.actionLabel,
                  {
                    color: item.destructive
                      ? c.error
                      : item.disabled
                        ? c.textDisabled
                        : c.text,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Cancel */}
          <TouchableOpacity
            onPress={() => sheetRef.current?.dismiss()}
            style={[styles.cancelBtn, { borderTopColor: c.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelLabel, { color: c.tint }]}>
              {cancelLabel}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

// ─── 4. Form Sheet ────────────────────────────────────────────────────────────

/**
 * Sheet có TextInput bên trong.
 * keyboardBehavior='interactive' — keyboard và sheet di chuyển cùng nhau.
 *
 * NOTE: Dùng TextInput thông thường từ react-native thay vì BottomSheetTextInput
 * vì BottomSheetTextInput gây lỗi "currentlyFocusedInput is not a function" trên RN mới.
 */
interface FormSheetProps {
  snapPoints?: (string | number)[]
  title?: string
  children: React.ReactNode
  onSubmit?: () => void
  submitLabel?: string
}

export const FormSheet = forwardRef<AppBottomSheetRef, FormSheetProps>(
  (
    {
      snapPoints = ['60%', '90%'],
      title,
      children,
      onSubmit,
      submitLabel = 'Submit',
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const c = Colors[theme]
    const sheetRef = useRef<BottomSheetModal>(null)
    const points = useMemo(() => snapPoints, [])

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.present(),
      close: () => sheetRef.current?.dismiss(),
      snapTo: (i) => sheetRef.current?.snapToIndex(i),
    }))

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={points}
        enablePanDownToClose
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
        backdropComponent={SheetBackdrop}
        backgroundStyle={{ backgroundColor: c.surface }}
        handleIndicatorStyle={{ backgroundColor: c.border }}
      >
        <SheetHeader
          title={title}
          onClose={() => sheetRef.current?.dismiss()}
          c={c}
        />
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {children}
          {onSubmit && (
            <TouchableOpacity
              onPress={() => {
                onSubmit()
                sheetRef.current?.dismiss()
              }}
              style={[styles.submitBtn, { backgroundColor: Brand.primary }]}
              activeOpacity={0.85}
            >
              <Text style={styles.submitLabel}>{submitLabel}</Text>
            </TouchableOpacity>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)

// ─── Re-export gorhom primitives for custom use ───────────────────────────────
// NOTE: BottomSheetTextInput is intentionally NOT re-exported — it causes
// "RNTextInput.default.State.currentlyFocusedInput is not a function" on newer RN.
// Use regular TextInput from react-native inside sheets instead.
export { BottomSheetModalProvider, GestureHandlerRootView }

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl },
  scrollContent: { paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  headerTitle: { fontSize: Typography.size.lg, fontWeight: '600', flex: 1 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: Typography.size.sm,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionIcon: { marginRight: Spacing.md },
  actionLabel: { fontSize: Typography.size.lg },
  cancelBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 8,
  },
  cancelLabel: { fontSize: Typography.size.lg, fontWeight: '600' },
  submitBtn: {
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  submitLabel: {
    color: '#fff',
    fontSize: Typography.size.md,
    fontWeight: '700',
  },
})
