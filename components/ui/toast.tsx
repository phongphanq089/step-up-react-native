import { MaterialIcons } from '@expo/vector-icons'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, useWindowDimensions, Platform } from 'react-native'
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  FadeInDown, 
  FadeOutDown,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  interpolate
} from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Semantic, Shadows, Spacing, Typography, Brand } from '@/constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'message'
export type ToastPosition = 'top' | 'bottom'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  position: ToastPosition
  duration?: number
}

interface ToastContextType {
  show: (message: string, options?: { variant?: ToastVariant; position?: ToastPosition; duration?: number }) => void
  hide: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({ 
  show: () => {},
  hide: () => {} 
})

export function useToast() {
  return useContext(ToastContext)
}

const SWIPE_THRESHOLD = 50

function ToastItemComponent({ item, onDone }: { item: ToastItem; onDone: (id: string) => void }) {
  const { theme } = useTheme()
  const { width: windowWidth } = useWindowDimensions()
  const c = Colors[theme]
  
  const translateX = useSharedValue(0)
  const isPressed = useSharedValue(false)

  const iconMap: Record<ToastVariant, keyof typeof MaterialIcons.glyphMap | null> = {
    success: 'check-circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
    message: null,
  }
  
  const colorMap: Record<ToastVariant, string> = {
    success: Semantic.success,
    error: Semantic.error,
    warning: Semantic.warning,
    info: Semantic.info,
    message: c.text,
  }

  const handleDismiss = useCallback(() => {
    onDone(item.id)
  }, [item.id, onDone])

  useEffect(() => {
    const duration = item.duration || 3000
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)
    return () => clearTimeout(timer)
  }, [handleDismiss, item.duration])

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true
    })
    .onUpdate((event) => {
      translateX.value = event.translationX
    })
    .onEnd((event) => {
      isPressed.value = false
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          event.translationX > 0 ? windowWidth : -windowWidth, 
          { duration: 200 },
          () => runOnJS(handleDismiss)()
        )
      } else {
        translateX.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: interpolate(isPressed.value ? 1 : 0, [0, 1], [1, 0.98]) }
    ],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, windowWidth * 0.7],
      [1, 0]
    )
  }))

  const EntryTransition = item.position === 'top' ? FadeInUp : FadeInDown
  const ExitTransition = item.position === 'top' ? FadeOutUp : FadeOutDown

  // Background and Text colors based on variant
  const getColors = () => {
    if (item.variant === 'message') {
      return {
        bg: theme === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        text: c.text,
        icon: c.text,
        border: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      }
    }
    
    // For success, error, warning, info -> use full color background
    const baseColor = colorMap[item.variant]
    return {
      bg: baseColor,
      text: Brand.white,
      icon: Brand.white,
      border: 'transparent',
    }
  }

  const activeColors = getColors()

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={EntryTransition.springify().damping(15)}
        exiting={ExitTransition.duration(200)}
        layout={Layout.springify().damping(15)}
        style={[
          styles.toast,
          { 
            backgroundColor: activeColors.bg,
            borderColor: activeColors.border,
            borderWidth: activeColors.border === 'transparent' ? 0 : 1,
          },
          animatedStyle,
          Shadows.md,
        ]}
      >
        {iconMap[item.variant] && (
          <MaterialIcons 
            name={iconMap[item.variant]!} 
            size={22} 
            color={activeColors.icon} 
          />
        )}
        <Text style={[styles.message, { color: activeColors.text }]} numberOfLines={3}>
          {item.message}
        </Text>
      </Animated.View>
    </GestureDetector>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const insets = useSafeAreaInsets()

  const show = useCallback((message: string, options?: { variant?: ToastVariant; position?: ToastPosition; duration?: number }) => {
    const id = Math.random().toString(36).substring(7)
    const variant = options?.variant || 'info'
    const position = options?.position || 'top'
    const duration = options?.duration
    
    setToasts(prev => [...prev, { id, message, variant, position, duration }])
  }, [])

  const hide = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const topToasts = toasts.filter(t => t.position === 'top')
  const bottomToasts = toasts.filter(t => t.position === 'bottom')

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      
      {/* Top Toast Container */}
      <View 
        style={[
          styles.container, 
          { top: Platform.OS === 'ios' ? insets.top : insets.top + 10 }
        ]} 
        pointerEvents="box-none"
      >
        {topToasts.map(t => (
          <ToastItemComponent key={t.id} item={t} onDone={hide} />
        ))}
      </View>

      {/* Bottom Toast Container */}
      <View 
        style={[
          styles.container, 
          { bottom: Platform.OS === 'ios' ? insets.bottom + 60 : insets.bottom + 70 }
        ]} 
        pointerEvents="box-none"
      >
        {bottomToasts.map(t => (
          <ToastItemComponent key={t.id} item={t} onDone={hide} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 999999,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    borderRadius: Radius.xl,
    width: '100%',
    maxWidth: 500, // For tablet support
  },
  message: { 
    flex: 1, 
    fontSize: Typography.size.sm + 1,
    fontWeight: '500',
    lineHeight: 20,
  },
})
