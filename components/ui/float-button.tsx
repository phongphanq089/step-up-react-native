import React, { useCallback, useRef, useState } from 'react'
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Colors, Shadows, Brand, Typography, Spacing } from '@/constants/theme'
import { useTheme } from '@/context/theme-context'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FloatButtonPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'bottom-center'

export interface SpeedDialAction {
  /** Icon hiển thị trong action button */
  icon: keyof typeof MaterialIcons.glyphMap
  /** Label tooltip bên cạnh button (optional) */
  label?: string
  onPress: () => void
  color?: string
  disabled?: boolean
}

// ─── Simple FAB ───────────────────────────────────────────────────────────────

interface FloatButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap
  label?: string
  onPress: () => void
  position?: FloatButtonPosition
  color?: string
  size?: number
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  offset?: { x: number; y: number }
}

/**
 * Simple FAB — single button, no children.
 */
export function FloatButton({
  icon,
  label,
  onPress,
  position = 'bottom-right',
  color = Brand.primary,
  size = 56,
  disabled = false,
  style,
  offset = { x: 20, y: 20 },
}: FloatButtonProps) {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onPress()
    }
  }

  const posStyle = getPositionStyle(position, offset)
  const isExtended = !!label

  return (
    <View
      style={[styles.wrapper, posStyle, position === 'bottom-center' && styles.centerWrapper]}
      pointerEvents='box-none'
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: color,
            height: size,
            minWidth: size,
            borderRadius: size / 2,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale: pressed ? 0.92 : 1 }],
          },
          isExtended && styles.extendedPadding,
          style,
        ]}
      >
        <MaterialIcons name={icon} size={size * 0.45} color='#FFF' />
        {isExtended && (
          <Text style={[styles.label, { fontSize: size * 0.28 }]}>{label}</Text>
        )}
      </Pressable>
    </View>
  )
}

// ─── Speed Dial FAB ───────────────────────────────────────────────────────────

interface SpeedDialProps {
  /** Actions xuất hiện khi mở rộng — hiển thị từ dưới lên trên */
  actions: SpeedDialAction[]
  /** Icon khi đóng */
  icon?: keyof typeof MaterialIcons.glyphMap
  position?: FloatButtonPosition
  color?: string
  /** Kích thước main button */
  size?: number
  /** Kích thước các action buttons */
  actionSize?: number
  offset?: { x: number; y: number }
}

// ─── Internal: reusable main button ──────────────────────────────────────────

function MainFAB({
  icon,
  size,
  color,
  rotationDeg,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap
  size: number
  color: string
  rotationDeg: Animated.AnimatedInterpolation<string>
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
        Platform.select({
          ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
          android: { elevation: 8 },
        }),
      ]}
    >
      <Animated.View style={{ transform: [{ rotate: rotationDeg }] }}>
        <MaterialIcons name={icon} size={size * 0.46} color='#FFF' />
      </Animated.View>
    </Pressable>
  )
}

/**
 * Speed Dial FAB
 *
 * Nhấn nút chính để expand/collapse các action items theo chiều dọc.
 * Animation: staggered slide-up + fade + scale.
 */
export function SpeedDial({
  actions,
  icon = 'add',
  position = 'bottom-right',
  color = Brand.primary,
  size = 56,
  actionSize = 48,
  offset = { x: 20, y: 20 },
}: SpeedDialProps) {
  const { theme } = useTheme()
  const c = Colors[theme]

  const [open, setOpen] = useState(false)

  // Main button rotation (+ → ×)
  const rotation = useRef(new Animated.Value(0)).current
  // Backdrop opacity
  const backdropOpacity = useRef(new Animated.Value(0)).current
  // Each action: translateY + opacity + scale
  // "top" positions: actions expand downward (translateY starts at -20)
  // "bottom" / "center" positions: actions expand upward (translateY starts at +20)
  const isTop = position === 'top-right' || position === 'top-left'
  const initialTranslateY = isTop ? -20 : 20

  const animValues = useRef(
    actions.map(() => ({
      translateY: new Animated.Value(initialTranslateY),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.7),
    }))
  ).current

  const openDial = useCallback(() => {
    setOpen(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // For bottom positions stagger top→bottom (reverse); for top positions stagger top→bottom natural order
    const orderedAnims = isTop ? animValues : [...animValues].reverse()

    Animated.parallel([
      Animated.timing(rotation, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.stagger(
        55,
        orderedAnims.map((v) =>
          Animated.parallel([
            Animated.spring(v.translateY, { toValue: 0, useNativeDriver: true, bounciness: 7 }),
            Animated.timing(v.opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.spring(v.scale, { toValue: 1, useNativeDriver: true, bounciness: 7 }),
          ])
        )
      ),
    ]).start()
  }, [isTop])

  const closeDial = useCallback(() => {
    Animated.parallel([
      Animated.timing(rotation, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ...animValues.map((v) =>
        Animated.parallel([
          Animated.timing(v.translateY, { toValue: initialTranslateY, duration: 160, useNativeDriver: true }),
          Animated.timing(v.opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
          Animated.timing(v.scale, { toValue: 0.7, duration: 160, useNativeDriver: true }),
        ])
      ),
    ]).start(() => setOpen(false))
  }, [initialTranslateY])

  const toggle = () => (open ? closeDial() : openDial())

  const handleActionPress = (action: SpeedDialAction) => {
    if (action.disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    closeDial()
    setTimeout(() => action.onPress(), 200)
  }

  const rotationDeg = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })

  const posStyle = getPositionStyle(position, offset)
  const isRight = position.includes('right') || position === 'bottom-center'
  // isTop already defined above

  return (
    <>
      {/* Backdrop — tap-to-close */}
      {open && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: backdropOpacity, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 997 }]}
          pointerEvents='auto'
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDial} />
        </Animated.View>
      )}

      {/* Container */}
      <View
        style={[
          styles.wrapper,
          posStyle,
          position === 'bottom-center' && styles.centerWrapper,
          { alignItems: isRight ? 'flex-end' : 'flex-start' },
        ]}
        pointerEvents='box-none'
      >
        {/* ─── TOP position: FAB first, actions below ─── */}
        {isTop && (
          <MainFAB
            icon={icon}
            size={size}
            color={color}
            rotationDeg={rotationDeg}
            onPress={toggle}
          />
        )}

        {/* Actions list */}
        <View
          style={[
            styles.actionsContainer,
            { alignItems: isRight ? 'flex-end' : 'flex-start' },
            isTop ? { marginTop: 12 } : { marginBottom: 12 },
          ]}
          pointerEvents='box-none'
        >
          {actions.map((action, index) => {
            const anim = animValues[index]
            const btnColor = action.color ?? c.surfaceRaised ?? (theme === 'dark' ? '#2A2A2A' : '#1C1C1E')

            return (
              <Animated.View
                key={index}
                style={[
                  styles.actionRow,
                  { flexDirection: isRight ? 'row-reverse' : 'row' },
                  {
                    opacity: anim.opacity,
                    transform: [{ translateY: anim.translateY }, { scale: anim.scale }],
                  },
                ]}
                pointerEvents={open ? 'auto' : 'none'}
              >
                {/* Icon button */}
                <Pressable
                  onPress={() => handleActionPress(action)}
                  disabled={action.disabled}
                  style={({ pressed }) => [
                    styles.actionButton,
                    {
                      width: actionSize,
                      height: actionSize,
                      borderRadius: actionSize / 2,
                      backgroundColor: btnColor,
                      opacity: action.disabled ? 0.45 : 1,
                      transform: [{ scale: pressed ? 0.9 : 1 }],
                    },
                    Platform.select({
                      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 4 },
                      android: { elevation: 6 },
                    }),
                  ]}
                >
                  <MaterialIcons
                    name={action.icon}
                    size={actionSize * 0.46}
                    color='#FFF'
                  />
                </Pressable>

                {/* Optional label */}
                {action.label && (
                  <View
                    style={[
                      styles.actionLabel,
                      isRight ? { marginRight: 12 } : { marginLeft: 12 },
                      { backgroundColor: theme === 'dark' ? 'rgba(40,40,40,0.92)' : 'rgba(30,30,30,0.88)' },
                    ]}
                  >
                    <Text style={styles.actionLabelText}>{action.label}</Text>
                  </View>
                )}
              </Animated.View>
            )
          })}
        </View>

        {/* ─── BOTTOM position: actions above, FAB last ─── */}
        {!isTop && (
          <MainFAB
            icon={icon}
            size={size}
            color={color}
            rotationDeg={rotationDeg}
            onPress={toggle}
          />
        )}
      </View>
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPositionStyle(
  position: FloatButtonPosition,
  offset: { x: number; y: number }
): ViewStyle {
  switch (position) {
    case 'bottom-right': return { bottom: offset.y, right: offset.x }
    case 'bottom-left':  return { bottom: offset.y, left: offset.x }
    case 'top-right':    return { top: offset.y, right: offset.x }
    case 'top-left':     return { top: offset.y, left: offset.x }
    case 'bottom-center': return { bottom: offset.y }
    default:             return { bottom: offset.y, right: offset.x }
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 998,
  },
  centerWrapper: {
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  extendedPadding: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
  },
  label: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  // Speed Dial
  actionsContainer: {
    marginBottom: 12,
    gap: 12,
  },
  actionRow: {
    alignItems: 'center',
    gap: 0,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionLabelText: {
    color: '#FFF',
    fontSize: Typography.size.xs,
    fontWeight: '600',
  },
})
