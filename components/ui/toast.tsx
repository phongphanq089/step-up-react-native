import { MaterialIcons } from '@expo/vector-icons'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/context/theme-context'
import { Colors, Radius, Semantic, Shadows, Spacing, Typography } from '@/constants/theme'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextType {
  show: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextType>({ show: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ item, onDone }: { item: ToastItem; onDone: (id: string) => void }) {
  const { theme } = useTheme()
  const c = Colors[theme]
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current

  const iconMap: Record<ToastVariant, keyof typeof MaterialIcons.glyphMap> = {
    success: 'check-circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  const colorMap: Record<ToastVariant, string> = {
    success: Semantic.success,
    error: Semantic.error,
    warning: Semantic.warning,
    info: Semantic.info,
  }

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
      ]).start(() => onDone(item.id))
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: c.surface, transform: [{ translateY }], opacity },
        Shadows.md,
      ]}
    >
      <MaterialIcons name={iconMap[item.variant]} size={20} color={colorMap[item.variant]} />
      <Text style={[styles.message, { color: c.text }]} numberOfLines={2}>{item.message}</Text>
    </Animated.View>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, variant }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View style={styles.container} pointerEvents='none'>
        {toasts.map(t => (
          <ToastItem key={t.id} item={t} onDone={remove} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 60, left: Spacing.md, right: Spacing.md,
    zIndex: 9999, gap: Spacing.sm,
  },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg, width: '100%',
  },
  message: { flex: 1, fontSize: Typography.size.sm },
})
