import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme'

interface AlertDialogProps {
  visible: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  confirmDestructive?: boolean
}

export function AlertDialog({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmDestructive = false,
}: AlertDialogProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const scale = useRef(new Animated.Value(0.9)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start()
    } else {
      scale.setValue(0.9)
      opacity.setValue(0)
    }
  }, [visible])

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.9, duration: 150, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => onCancel())
  }, [onCancel])

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { backgroundColor: c.backdrop, opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <View style={styles.container} pointerEvents='box-none'>
        <Animated.View
          style={[
            styles.dialog,
            { backgroundColor: c.surface, transform: [{ scale }], opacity },
            Shadows.lg,
          ]}
        >
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          {message && <Text style={[styles.message, { color: c.textSecondary }]}>{message}</Text>}

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <View style={styles.actions}>
            <Pressable onPress={handleClose} style={styles.actionBtn}>
              <Text style={[styles.actionLabel, { color: c.textSecondary }]}>{cancelLabel}</Text>
            </Pressable>
            <View style={[styles.actionDivider, { backgroundColor: c.border }]} />
            <Pressable
              onPress={() => { onConfirm() }}
              style={styles.actionBtn}
            >
              <Text
                style={[
                  styles.actionLabel,
                  styles.actionLabelBold,
                  { color: confirmDestructive ? c.error : c.tint },
                ]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  dialog: { width: '100%', maxWidth: 340, borderRadius: Radius.xl, overflow: 'hidden' },
  title: {
    fontSize: Typography.size.lg, fontWeight: '600',
    textAlign: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
  },
  message: {
    fontSize: Typography.size.md, textAlign: 'center',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, lineHeight: 22,
  },
  divider: { height: 1 },
  actions: { flexDirection: 'row' },
  actionBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  actionDivider: { width: 1 },
  actionLabel: { fontSize: Typography.size.md },
  actionLabelBold: { fontWeight: '600' },
})
