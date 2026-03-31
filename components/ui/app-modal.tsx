import { MaterialIcons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

type ModalVariant = 'center' | 'bottom' | 'top' | 'fullscreen'
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type AnimationType = 'fade' | 'zoom' | 'slide'

interface AppModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  variant?: ModalVariant
  size?: ModalSize
  animationType?: AnimationType
  children: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
  hideCloseButton?: boolean
  backdropDismiss?: boolean
}

export function AppModal({
  visible,
  onClose,
  title,
  subtitle,
  variant = 'center',
  size = 'md',
  animationType,
  children,
  footer,
  scrollable = false,
  hideCloseButton = false,
  backdropDismiss = true,
}: AppModalProps) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const insets = useSafeAreaInsets()
  
  const opacity = useRef(new Animated.Value(0)).current
  const translate = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.92)).current
  const panY = useRef(new Animated.Value(0)).current

  const defaultAnimation = animationType || (variant === 'center' ? 'zoom' : 'slide')

  const getInitialTranslate = () => {
    if (variant === 'bottom') return 100
    if (variant === 'top') return -100
    return 20
  }

  const animateIn = useCallback(() => {
    translate.setValue(getInitialTranslate())
    panY.setValue(0)
    Animated.parallel([
      Animated.timing(opacity, { 
        toValue: 1, 
        duration: 250, 
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }),
      defaultAnimation === 'zoom' 
        ? Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 })
        : Animated.timing(translate, { 
            toValue: 0, 
            duration: 300, 
            useNativeDriver: true,
            easing: Easing.out(Easing.poly(5))
          }),
    ]).start()
  }, [opacity, scale, translate, variant, defaultAnimation])

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      defaultAnimation === 'zoom'
        ? Animated.timing(scale, { toValue: 0.92, duration: 200, useNativeDriver: true })
        : Animated.timing(translate, { 
            toValue: getInitialTranslate(), 
            duration: 250, 
            useNativeDriver: true 
          }),
    ]).start(() => {
      onClose()
      panY.setValue(0)
    })
  }, [opacity, scale, translate, variant, defaultAnimation, onClose])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => variant === 'bottom',
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return variant === 'bottom' && Math.abs(gestureState.dy) > 10
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.5) {
          animateOut()
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start()
        }
      },
    })
  ).current

  useEffect(() => {
    if (visible) {
      animateIn()
    } else {
      opacity.setValue(0)
      scale.setValue(0.92)
      translate.setValue(getInitialTranslate())
    }
  }, [visible])

  const getModalWidth = () => {
    if (variant === 'fullscreen' || variant === 'bottom' || variant === 'top') return SCREEN_WIDTH
    const sizes = { sm: 300, md: 360, lg: 440, xl: 520, full: SCREEN_WIDTH - 40 }
    return Math.min(sizes[size], SCREEN_WIDTH - 32)
  }

  const renderHeader = () => {
    if (!title && hideCloseButton && variant !== 'bottom') return null
    return (
      <View {...(variant === 'bottom' ? panResponder.panHandlers : {})}>
        {variant === 'bottom' && <View style={[styles.handle, { backgroundColor: c.border }]} />}
        <View style={[styles.header, { borderBottomColor: c.border, paddingTop: variant === 'bottom' ? 4 : Spacing.md }]}>
          <View style={styles.headerTitleContainer}>
            {title && <Text style={[styles.title, { color: c.text }]}>{title}</Text>}
            {subtitle && <Text style={[styles.subtitle, { color: c.textSecondary }]}>{subtitle}</Text>}
          </View>
          {!hideCloseButton && (
            <Pressable onPress={animateOut} style={styles.closeBtn} hitSlop={12}>
              <MaterialIcons name='close' size={22} color={c.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    if (!footer) return null
    return (
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        {footer}
      </View>
    )
  }

  const ContentWrapper = scrollable ? ScrollView : View
  const contentProps = scrollable ? { 
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.scrollContent 
  } : {}

  const modalStyle = [
    styles.modalBase,
    variant === 'fullscreen' && styles.fullscreen,
    variant === 'bottom' && styles.bottom,
    variant === 'top' && styles.top,
    variant === 'center' && styles.center,
    {
      backgroundColor: c.surface,
      width: getModalWidth(),
      opacity,
      transform: [
        ...(defaultAnimation === 'zoom' ? [{ scale }] : [{ translateY: translate }]),
        { translateY: panY }
      ],
    },
    variant !== 'fullscreen' && Shadows.lg,
    variant === 'fullscreen' && { paddingTop: insets.top, paddingBottom: insets.bottom },
    variant === 'bottom' && { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingBottom: insets.bottom },
    variant === 'top' && { borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl, paddingTop: insets.top },
    variant === 'center' && { borderRadius: Radius.xl, maxHeight: SCREEN_HEIGHT * 0.85 },
  ]

  return (
    <Modal transparent visible={visible} onRequestClose={animateOut} statusBarTranslucent animationType='none'>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.backdrop, opacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={backdropDismiss ? animateOut : undefined} />
        </Animated.View>

        <View style={styles[`container_${variant}`]} pointerEvents='box-none'>
          <Animated.View style={modalStyle}>
            {renderHeader()}
            <ContentWrapper {...contentProps} style={styles.content}>
              {children}
            </ContentWrapper>
            {renderFooter()}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container_center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container_bottom: { flex: 1, justifyContent: 'flex-end' },
  container_top: { flex: 1, justifyContent: 'flex-start' },
  container_fullscreen: { flex: 1 },
  
  modalBase: { overflow: 'hidden' },
  fullscreen: { flex: 1 },
  bottom: { width: '100%' },
  top: { width: '100%' },
  center: {},

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitleContainer: { flex: 1 },
  title: { fontSize: Typography.size.lg, fontWeight: '600' },
  subtitle: { fontSize: Typography.size.sm, marginTop: 2, opacity: 0.7 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flexShrink: 1 },
  scrollContent: { padding: Spacing.md },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
})


