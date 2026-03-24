import { MaterialIcons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

type ModalVariant = 'center' | 'bottom' | 'fullscreen'

interface AppModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  variant?: ModalVariant
  children: React.ReactNode
}

export function AppModal({ visible, onClose, title, variant = 'center', children }: AppModalProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const insets = useSafeAreaInsets()
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.92)).current
  const slideY = useRef(new Animated.Value(80)).current

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      variant === 'center'
        ? Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 })
        : Animated.timing(slideY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start()
  }, [opacity, scale, slideY, variant])

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      variant === 'center'
        ? Animated.timing(scale, { toValue: 0.92, duration: 180, useNativeDriver: true })
        : Animated.timing(slideY, { toValue: 80, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose())
  }, [opacity, scale, slideY, variant, onClose])

  useEffect(() => {
    if (visible) {
      animateIn()
    } else {
      opacity.setValue(0)
      scale.setValue(0.92)
      slideY.setValue(80)
    }
  }, [visible])

  const animatedTransform =
    variant === 'center' ? [{ scale }] : [{ translateY: slideY }]

  // Safe area padding for different variants
  const topPad = insets.top
  const bottomPad = Math.max(insets.bottom, 8)

  const renderContent = () => {
    if (variant === 'fullscreen') {
      return (
        <Animated.View
          style={[
            styles.fullscreen,
            { backgroundColor: c.surface, opacity },
            // iOS: respect top notch + home bar
            { paddingTop: topPad, paddingBottom: bottomPad },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>{title}</Text>
            <Pressable onPress={animateOut} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name='close' size={22} color={c.textSecondary} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      )
    }

    if (variant === 'bottom') {
      return (
        <View style={styles.bottomContainer} pointerEvents='box-none'>
          <Animated.View
            style={[
              styles.bottomContent,
              {
                backgroundColor: c.surface,
                opacity,
                transform: animatedTransform,
                // iOS home bar padding
                paddingBottom: bottomPad,
              },
              Shadows.lg,
            ]}
          >
            <View style={[styles.header, { borderBottomColor: c.border }]}>
              <Text style={[styles.title, { color: c.text }]}>{title}</Text>
              <Pressable onPress={animateOut} style={styles.closeBtn} hitSlop={8}>
                <MaterialIcons name='close' size={22} color={c.textSecondary} />
              </Pressable>
            </View>
            {children}
          </Animated.View>
        </View>
      )
    }

    // center
    return (
      <View style={styles.centerContainer} pointerEvents='box-none'>
        <Animated.View
          style={[
            styles.centerContent,
            { width: SCREEN_WIDTH - 48, backgroundColor: c.surface, opacity, transform: animatedTransform },
            Shadows.lg,
          ]}
        >
          <View style={[styles.header, { borderBottomColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>{title}</Text>
            <Pressable onPress={animateOut} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name='close' size={22} color={c.textSecondary} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </View>
    )
  }

  return (
    <Modal transparent visible={visible} onRequestClose={animateOut} statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.backdrop, opacity }]}>
          {variant !== 'fullscreen' && (
            <Pressable style={StyleSheet.absoluteFill} onPress={animateOut} />
          )}
        </Animated.View>

        {renderContent()}
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: {
    maxHeight: SCREEN_HEIGHT * 0.8,
    overflow: 'hidden',
    borderRadius: Radius.xl,
  },
  bottomContainer: { flex: 1, justifyContent: 'flex-end' },
  bottomContent: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  fullscreen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  title: { fontSize: Typography.size.lg, fontWeight: '600', flex: 1 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
})
